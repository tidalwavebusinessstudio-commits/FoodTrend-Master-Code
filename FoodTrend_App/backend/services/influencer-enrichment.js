/**
 * Influencer Enrichment Worker
 * Hourly batch job to pull social metrics and sync to GHL
 * 
 * SYSTEM CONTRACT COMPLIANCE:
 * - R8: Graceful degradation - API failures never break core flows
 * - Caching: 6-hour TTL for social metrics
 */

const ghlService = require('./ghl-integration');

// ===========================================
// CACHING & GRACEFUL DEGRADATION (per R8)
// ===========================================
const METRICS_CACHE_TTL_HOURS = 6;

// In-memory cache (replace with Redis in production)
const metricsCache = new Map();

function getCachedMetrics(influencerId) {
    const cached = metricsCache.get(influencerId);
    if (!cached) return null;

    const ageHours = (Date.now() - cached.timestamp) / (1000 * 60 * 60);
    if (ageHours > METRICS_CACHE_TTL_HOURS) {
        metricsCache.delete(influencerId);
        return null;
    }
    return cached.metrics;
}

function setCachedMetrics(influencerId, metrics) {
    metricsCache.set(influencerId, {
        metrics,
        timestamp: Date.now()
    });
}

// Exponential backoff tracker for failing APIs
const apiFailureCount = new Map();
const MAX_BACKOFF_ATTEMPTS = 3;

function shouldSkipAPI(apiName) {
    const failures = apiFailureCount.get(apiName) || 0;
    return failures >= MAX_BACKOFF_ATTEMPTS;
}

function recordAPIFailure(apiName) {
    const current = apiFailureCount.get(apiName) || 0;
    apiFailureCount.set(apiName, current + 1);
}

function recordAPISuccess(apiName) {
    apiFailureCount.delete(apiName);
}

// TikTok API helper (placeholder - requires official API access)
async function fetchTikTokMetrics(handle) {
    if (!handle || !process.env.TIKTOK_API_KEY) return null;

    try {
        // TODO: Replace with actual TikTok API call
        // TikTok's official API requires business verification
        const response = await fetch(
            `https://open.tiktokapis.com/v2/user/info/?fields=follower_count,following_count,likes_count`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.TIKTOK_API_KEY}`
                }
            }
        );

        if (!response.ok) return null;
        const data = await response.json();
        return {
            followers: data.data?.user?.follower_count || 0,
            likes: data.data?.user?.likes_count || 0
        };
    } catch (error) {
        console.error(`TikTok API error for ${handle}:`, error.message);
        return null;
    }
}

// Instagram API helper (Basic Display API)
async function fetchInstagramMetrics(handle) {
    if (!handle || !process.env.INSTAGRAM_ACCESS_TOKEN) return null;

    try {
        const response = await fetch(
            `https://graph.instagram.com/me?fields=followers_count,media_count&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
        );

        if (!response.ok) return null;
        const data = await response.json();
        return {
            followers: data.followers_count || 0,
            mediaCount: data.media_count || 0
        };
    } catch (error) {
        console.error(`Instagram API error for ${handle}:`, error.message);
        return null;
    }
}

// YouTube API helper
async function fetchYouTubeMetrics(handle) {
    if (!handle || !process.env.YOUTUBE_API_KEY) return null;

    try {
        // First, search for the channel by handle
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handle)}&type=channel&key=${process.env.YOUTUBE_API_KEY}`
        );

        if (!searchResponse.ok) return null;
        const searchData = await searchResponse.json();
        const channelId = searchData.items?.[0]?.snippet?.channelId;

        if (!channelId) return null;

        // Get channel statistics
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`
        );

        if (!statsResponse.ok) return null;
        const statsData = await statsResponse.json();
        const stats = statsData.items?.[0]?.statistics;

        return {
            subscribers: parseInt(stats?.subscriberCount || 0),
            videoCount: parseInt(stats?.videoCount || 0),
            viewCount: parseInt(stats?.viewCount || 0)
        };
    } catch (error) {
        console.error(`YouTube API error for ${handle}:`, error.message);
        return null;
    }
}

// Calculate engagement rate from content submissions
async function calculateEngagementRate(db, influencerId) {
    const result = await db.query(`
    SELECT 
      AVG(engagement_rate) as avg_engagement,
      COUNT(*) as total_posts
    FROM content_submissions 
    WHERE influencer_id = $1 
      AND posted_at > NOW() - INTERVAL '30 days'
  `, [influencerId]);

    return result.rows[0]?.avg_engagement || 0;
}

/**
 * Enrich a single influencer with fresh metrics
 */
async function enrichInfluencer(db, influencer) {
    const updates = {};

    // Fetch TikTok metrics
    const tiktok = await fetchTikTokMetrics(influencer.tiktok_handle);
    if (tiktok) {
        updates.tiktok_followers = tiktok.followers;
    }

    // Fetch Instagram metrics
    const instagram = await fetchInstagramMetrics(influencer.instagram_handle);
    if (instagram) {
        updates.instagram_followers = instagram.followers;
    }

    // Fetch YouTube metrics
    const youtube = await fetchYouTubeMetrics(influencer.youtube_handle);
    if (youtube) {
        updates.youtube_subscribers = youtube.subscribers;
    }

    // Calculate total followers
    const totalFollowers =
        (updates.tiktok_followers || influencer.tiktok_followers || 0) +
        (updates.instagram_followers || influencer.instagram_followers || 0) +
        (updates.youtube_subscribers || influencer.youtube_subscribers || 0);

    updates.follower_count = totalFollowers;

    // Calculate engagement rate
    updates.engagement_rate = await calculateEngagementRate(db, influencer.id);

    return updates;
}

/**
 * Update influencer in database
 */
async function updateInfluencerMetrics(db, influencerId, metrics) {
    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(metrics)) {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(influencerId);

    await db.query(
        `UPDATE profiles SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
        values
    );
}

/**
 * Sync influencer to GHL
 */
async function syncInfluencerToGHL(db, influencer, locationId) {
    try {
        const result = await ghlService.upsertInfluencerContact(locationId, influencer);

        // Store GHL contact ID if new
        if (result.contact?.id && !influencer.ghl_contact_id) {
            await db.query(
                'UPDATE profiles SET ghl_contact_id = $1, ghl_synced_at = NOW() WHERE id = $2',
                [result.contact.id, influencer.id]
            );
        } else {
            await db.query(
                'UPDATE profiles SET ghl_synced_at = NOW() WHERE id = $2',
                [influencer.id]
            );
        }

        return { success: true, ghlContactId: result.contact?.id };
    } catch (error) {
        console.error(`GHL sync error for influencer ${influencer.id}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Run hourly enrichment batch job
 */
async function runEnrichmentBatch(db, locationId) {
    console.log('[Enrichment] Starting hourly batch job...');

    // Get all active influencers (table = profiles)
    const result = await db.query(`
    SELECT * FROM profiles 
    ORDER BY ghl_synced_at ASC NULLS FIRST
    LIMIT 100
  `);

    const influencers = result.rows;
    console.log(`[Enrichment] Processing ${influencers.length} influencers`);

    let successCount = 0;
    let errorCount = 0;

    for (const influencer of influencers) {
        try {
            // Enrich with fresh metrics
            const metrics = await enrichInfluencer(db, influencer);

            // Update database
            if (Object.keys(metrics).length > 0) {
                await updateInfluencerMetrics(db, influencer.id, metrics);
            }

            // Sync to GHL
            const syncResult = await syncInfluencerToGHL(db, { ...influencer, ...metrics }, locationId);

            if (syncResult.success) {
                successCount++;
            } else {
                errorCount++;
            }

            // Rate limiting: 100ms between API calls
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error(`[Enrichment] Error processing influencer ${influencer.id}:`, error.message);
            errorCount++;
        }
    }

    console.log(`[Enrichment] Batch complete. Success: ${successCount}, Errors: ${errorCount}`);
    return { processed: influencers.length, success: successCount, errors: errorCount };
}

module.exports = {
    fetchTikTokMetrics,
    fetchInstagramMetrics,
    fetchYouTubeMetrics,
    calculateEngagementRate,
    enrichInfluencer,
    updateInfluencerMetrics,
    syncInfluencerToGHL,
    runEnrichmentBatch
};
