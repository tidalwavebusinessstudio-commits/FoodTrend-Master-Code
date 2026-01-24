/**
 * Content Submission Service
 * Handles influencer content submissions and social media metrics fetching
 */

const db = require('../database/connection');
const axios = require('axios');

class ContentSubmissionService {

    /**
     * Submit content for a creator visit
     * Validates URLs, creates submission records, fetches initial metrics
     */
    async submitContent(data) {
        const {
            influencerId,
            restaurantId,
            creatorVisitId,
            tiktokUrl,
            instagramUrl
        } = data;

        // Validate both URLs
        if (!this.isValidTikTokUrl(tiktokUrl)) {
            throw new Error('Invalid TikTok URL format');
        }

        if (!this.isValidInstagramUrl(instagramUrl)) {
            throw new Error('Invalid Instagram URL format');
        }

        console.log(`[Content Submission] Processing submission for visit ${creatorVisitId}`);

        // Create TikTok submission
        const tiktokSubmission = await this.createSubmission({
            influencer Id,
            restaurantId,
            creatorVisitId,
            platform: 'tiktok',
            postUrl: tiktokUrl
        });

        // Create Instagram submission
        const instagramSubmission = await this.createSubmission({
            influencerId,
            restaurantId,
            creatorVisitId,
            platform: 'instagram',
            postUrl: instagramUrl
        });

        // Update creator_visit record
        const visit = await db.query(
            `SELECT * FROM creator_visits WHERE id = ?`,
            [creatorVisitId]
        );

        const isOnTime = new Date() <= new Date(visit[0].posting_deadline);
        const wasWarned = visit[0].status === 'warning_sent';

        await db.query(`
      UPDATE creator_visits
      SET tiktok_posted = TRUE,
          instagram_posted = TRUE,
          tiktok_submission_id = ?,
          instagram_submission_id = ?,
          status = ?,
          compliance_resolved_at = NOW()
      WHERE id = ?
    `, [
            tiktokSubmission.id,
            instagramSubmission.id,
            (isOnTime || wasWarned) ? 'compliant' : visit[0].status,
            creatorVisitId
        ]);

        // Update influencer stats
        const statsUpdate = isOnTime ? 'compliant_visits = compliant_visits + 1' : '';

        await db.query(`
      UPDATE influencers
      SET total_visits = total_visits + 1
          ${statsUpdate ? ', ' + statsUpdate : ''}
      WHERE id = ?
    `, [influencerId]);

        // Fetch initial metrics (async - don't wait)
        this.fetchMetrics(tiktokSubmission.id).catch(err =>
            console.error('Error fetching TikTok metrics:', err)
        );

        this.fetchMetrics(instagramSubmission.id).catch(err =>
            console.error('Error fetching Instagram metrics:', err)
        );

        console.log(`[Content Submission] Successfully processed - Visit ${creatorVisitId} marked compliant`);

        return {
            success: true,
            tiktokSubmission,
            instagramSubmission,
            message: 'Content submitted successfully! Metrics will be updated within a few minutes.'
        };
    }

    /**
     * Create a content submission record
     */
    async createSubmission(data) {
        const result = await db.query(`
      INSERT INTO content_submissions
      (influencer_id, restaurant_id, creator_visit_id, platform, post_url, submitted_at, verified)
      VALUES (?, ?, ?, ?, ?, NOW(), FALSE)
    `, [
            data.influencerId,
            data.restaurantId,
            data.creatorVisitId,
            data.platform,
            data.postUrl
        ]);

        return {
            id: result.insertId,
            ...data
        };
    }

    /**
     * Fetch metrics from social media platform APIs
     * Updates view count, likes, comments, shares, engagement rate
     */
    async fetchMetrics(submissionId) {
        const submission = await db.query(
            `SELECT * FROM content_submissions WHERE id = ?`,
            [submissionId]
        );

        if (!submission || submission.length === 0) {
            throw new Error(`Submission ${submissionId} not found`);
        }

        const sub = submission[0];

        try {
            let metrics;

            if (sub.platform === 'tiktok') {
                metrics = await this.fetchTikTokMetrics(sub.post_url);
            } else if (sub.platform === 'instagram') {
                metrics = await this.fetchInstagramMetrics(sub.post_url);
            } else {
                throw new Error(`Unsupported platform: ${sub.platform}`);
            }

            // Update submission with fetched metrics
            await db.query(`
        UPDATE content_submissions
        SET view_count = ?,
            like_count = ?,
            comment_count = ?,
            share_count = ?,
            engagement_rate = ?,
            posted_at = ?,
            last_metrics_fetch = NOW(),
            metrics_fetch_count = metrics_fetch_count + 1,
            verified = TRUE
        WHERE id = ?
      `, [
                metrics.views || 0,
                metrics.likes || 0,
                metrics.comments || 0,
                metrics.shares || 0,
                metrics.engagementRate || 0,
                metrics.postedAt || sub.submitted_at,
                submissionId
            ]);

            console.log(`[Metrics] Updated for ${sub.platform} submission ${submissionId}: ${metrics.views} views`);

            return metrics;
        } catch (error) {
            console.error(`[Metrics Error] Failed to fetch for submission ${submissionId}:`, error.message);

            // Mark as flagged for manual review
            await db.query(`
        UPDATE content_submissions
        SET flagged_for_review = TRUE,
            review_notes = ?
        WHERE id = ?
      `, [`Automatic metrics fetch failed: ${error.message}`, submissionId]);

            return null;
        }
    }

    /**
     * Fetch TikTok video metrics
     * Uses TikTok Research API or third-party service
     */
    async fetchTikTokMetrics(url) {
        const videoId = this.extractTikTokVideoId(url);

        if (!videoId) {
            throw new Error('Could not extract TikTok video ID from URL');
        }

        try {
            // Option 1: TikTok Research API (requires approval)
            // https://developers.tiktok.com/doc/research-api-specs-query-videos

            const apiUrl = 'https://open.tiktokapis.com/v2/research/video/query/';
            const response = await axios.post(apiUrl, {
                query: {
                    and: [{ field_name: 'video_id', operation: 'EQ', field_values: [videoId] }]
                },
                max_count: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            const video = response.data.data.videos[0];

            return {
                views: video.video_view_count || 0,
                likes: video.like_count || 0,
                comments: video.comment_count || 0,
                shares: video.share_count || 0,
                engagementRate: this.calculateEngagementRate(
                    video.like_count + video.comment_count + video.share_count,
                    video.video_view_count
                ),
                postedAt: new Date(video.create_time * 1000)
            };

        } catch (error) {
            console.error('TikTok API error:', error.response?.data || error.message);

            // Option 2: Fallback to third-party scraping service (e.g., RapidAPI)
            // https://rapidapi.com/hub/tiktok

            try {
                const fallbackResponse = await axios.get('https://tiktok-video-no-watermark2.p.rapidapi.com/video/data', {
                    params: { url: url },
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                        'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
                    }
                });

                const data = fallbackResponse.data.data;

                return {
                    views: data.play_count || 0,
                    likes: data.digg_count || 0,
                    comments: data.comment_count || 0,
                    shares: data.share_count || 0,
                    engagementRate: this.calculateEngagementRate(
                        (data.digg_count || 0) + (data.comment_count || 0) + (data.share_count || 0),
                        data.play_count || 1
                    ),
                    postedAt: data.create_time ? new Date(data.create_time * 1000) : null
                };
            } catch (fallbackError) {
                throw new Error('Both TikTok API and fallback service failed');
            }
        }
    }

    /**
     * Fetch Instagram metrics
     * Uses Instagram Graph API
     */
    async fetchInstagramMetrics(url) {
        const mediaId = await this.extractInstagramMediaId(url);

        if (!mediaId) {
            throw new Error('Could not extract Instagram media ID from URL');
        }

        try {
            // Instagram Graph API
            // Requires Business/Creator account and access token
            const apiUrl = `https://graph.instagram.com/${mediaId}`;
            const response = await axios.get(apiUrl, {
                params: {
                    fields: 'like_count,comments_count,media_type,timestamp,media_url,permalink,caption',
                    access_token: process.env.INSTAGRAM_ACCESS_TOKEN
                }
            });

            const data = response.data;

            // For Reels, we can get additional metrics
            let videoViews = 0;
            if (data.media_type === 'VIDEO' || data.media_type === 'REEL') {
                try {
                    const insightsResponse = await axios.get(`https://graph.instagram.com/${mediaId}/insights`, {
                        params: {
                            metric: data.media_type === 'REEL' ? 'plays,reach' : 'video_views,reach',
                            access_token: process.env.INSTAGRAM_ACCESS_TOKEN
                        }
                    });

                    const playsMetric = insightsResponse.data.data.find(m => m.name === 'plays' || m.name === 'video_views');
                    videoViews = playsMetric?.values[0]?.value || 0;
                } catch (insightsError) {
                    console.log('Instagram Insights unavailable (may require Business account)');
                }
            }

            return {
                views: videoViews,
                likes: data.like_count || 0,
                comments: data.comments_count || 0,
                shares: 0, // Not available via API
                engagementRate: this.calculateEngagementRate(
                    (data.like_count || 0) + (data.comments_count || 0),
                    videoViews || 1
                ),
                postedAt: data.timestamp ? new Date(data.timestamp) : null
            };

        } catch (error) {
            console.error('Instagram API error:', error.response?.data || error.message);

            // Instagram API is more restrictive, may need manual entry fallback
            throw new Error(`Instagram API failed: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    /**
     * Calculate engagement rate
     */
    calculateEngagementRate(totalEngagements, totalViews) {
        if (totalViews === 0) return 0;
        return parseFloat(((totalEngagements / totalViews) * 100).toFixed(2));
    }

    /**
     * Validate TikTok URL format
     */
    isValidTikTokUrl(url) {
        const patterns = [
            /tiktok\.com\/@[\w.-]+\/video\/\d+/,  // Standard format
            /vm\.tiktok\.com\/[\w]+/,             // Short link
            /vt\.tiktok\.com\/[\w]+/              // Short link variant
        ];

        return patterns.some(pattern => pattern.test(url));
    }

    /**
     * Validate Instagram URL format
     */
    isValidInstagramUrl(url) {
        const patterns = [
            /instagram\.com\/(p|reel|tv)\/[\w-]+/,  // Standard format
            /instagr\.am\/(p|reel)\/[\w-]+/         // Short link
        ];

        return patterns.some(pattern => pattern.test(url));
    }

    /**
     * Extract TikTok video ID from URL
     */
    extractTikTokVideoId(url) {
        // Standard URL format
        const standardMatch = url.match(/video\/(\d+)/);
        if (standardMatch) return standardMatch[1];

        // Short URL - would need to follow redirect to get actual video ID
        // This would require an additional HTTP request
        if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
            // Implementation needed: follow redirect and extract ID
            console.warn('Short TikTok URLs require redirect following');
            return null;
        }

        return null;
    }

    /**
     * Extract Instagram media ID from URL
     * Instagram uses shortcodes, not numeric IDs
     */
    async extractInstagramMediaId(url) {
        // Extract shortcode from URL
        const match = url.match(/\/(p|reel|tv)\/([\w-]+)/);
        if (!match) return null;

        const shortcode = match[2];

        // For Instagram Graph API, we need the numeric media_id
        // If using Business account, we can query it
        // Otherwise, we use the shortcode in oembed endpoint

        try {
            // Option 1: Use oEmbed to get media ID
            const oembedResponse = await axios.get('https://graph.facebook.com/v18.0/instagram_oembed', {
                params: {
                    url: url,
                    access_token: process.env.INSTAGRAM_ACCESS_TOKEN
                }
            });

            return oembedResponse.data.media_id;
        } catch (error) {
            // Option 2: Use shortcode directly if we have Business API access
            // Some endpoints accept shortcodes
            return shortcode;
        }
    }

    /**
     * Bulk update metrics for all verified submissions
     * Called by cron job
     */
    async updateAllMetrics() {
        const submissions = await db.query(`
      SELECT id, platform, post_url
      FROM content_submissions
      WHERE verified = TRUE
      AND (
        last_metrics_fetch IS NULL
        OR last_metrics_fetch < DATE_SUB(NOW(), INTERVAL 6 HOUR)
      )
      LIMIT 100
    `);

        console.log(`[Bulk Metrics Update] Processing ${submissions.length} submissions`);

        let successCount = 0;
        let errorCount = 0;

        for (const submission of submissions) {
            try {
                await this.fetchMetrics(submission.id);
                successCount++;

                // Rate limiting - wait 1 second between API calls
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                errorCount++;
                console.error(`Failed to update metrics for submission ${submission.id}:`, error.message);
            }
        }

        return {
            total: submissions.length,
            success: successCount,
            errors: errorCount
        };
    }

    /**
     * Get total views for a restaurant across all sources
     */
    async getRestaurantTotalViews(restaurantId) {
        const result = await db.query(`
      SELECT 
        COALESCE(SUM(cs.view_count), 0) as influencer_views,
        COALESCE(
          (SELECT SUM(view_count) FROM restaurant_social_content WHERE restaurant_id = ?),
          0
        ) as social_content_views
      FROM content_submissions cs
      WHERE cs.restaurant_id = ?
    `, [restaurantId, restaurantId]);

        const influencerViews = parseInt(result[0].influencer_views) || 0;
        const socialContentViews = parseInt(result[0].social_content_views) || 0;

        return {
            influencerViews,
            socialContentViews,
            totalViews: influencerViews + socialContentViews
        };
    }

    /**
     * Get content breakdown for restaurant
     */
    async getRestaurantContentBreakdown(restaurantId) {
        // Influencer content
        const influencerContent = await db.query(`
      SELECT 
        cs.*,
        i.name as influencer_name,
        i.instagram_handle,
        i.tiktok_handle
      FROM content_submissions cs
      JOIN influencers i ON i.id = cs.influencer_id
      WHERE cs.restaurant_id = ?
      AND cs.verified = TRUE
      ORDER BY cs.posted_at DESC
    `, [restaurantId]);

        // FoodTrend + Restaurant content
        const socialContent = await db.query(`
      SELECT *
      FROM restaurant_social_content
      WHERE restaurant_id = ?
      ORDER BY posted_at DESC
    `, [restaurantId]);

        return {
            influencerContent,
            socialContent,
            totalPieces: influencerContent.length + socialContent.length
        };
    }
}

module.exports = new ContentSubmissionService();
