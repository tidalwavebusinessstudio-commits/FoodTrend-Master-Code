/**
 * Influencer Metrics API
 * Serves influencer stats for restaurant dashboard
 * 
 * Endpoints:
 * - GET /api/influencers/stats - Aggregate influencer stats for restaurant
 * - GET /api/influencers       - List influencers working with restaurant
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    return createClient(supabaseUrl, supabaseKey);
}

/**
 * Get aggregate influencer stats for a restaurant
 * Returns counts, averages, and top performers
 */
async function getInfluencerStats(restaurantId) {
    const supabase = getSupabaseClient();

    // Get all influencers who have bookings with this restaurant
    const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
      influencer_id,
      profiles:influencer_id (
        id,
        full_name,
        tiktok_handle,
        instagram_handle,
        youtube_handle,
        followers_count,
        engagement_rate,
        total_earnings,
        ghl_contact_id
      )
    `)
        .eq('restaurant_id', restaurantId);

    if (bookingsError) {
        console.error('[InfluencerAPI] Error fetching bookings:', bookingsError);
        throw bookingsError;
    }

    // Dedupe influencers
    const influencerMap = new Map();
    bookings?.forEach(b => {
        if (b.profiles && !influencerMap.has(b.profiles.id)) {
            influencerMap.set(b.profiles.id, b.profiles);
        }
    });

    const influencers = Array.from(influencerMap.values());

    // Calculate aggregates
    const totalInfluencers = influencers.length;
    const totalFollowers = influencers.reduce((sum, i) => sum + (i.followers_count || 0), 0);
    const avgEngagement = influencers.length > 0
        ? influencers.reduce((sum, i) => sum + (parseFloat(i.engagement_rate) || 0), 0) / influencers.length
        : 0;

    // Get top performers by followers
    const topPerformers = [...influencers]
        .sort((a, b) => (b.followers_count || 0) - (a.followers_count || 0))
        .slice(0, 5)
        .map(i => ({
            id: i.id,
            name: i.full_name,
            handle: i.tiktok_handle || i.instagram_handle || 'N/A',
            followers: i.followers_count || 0,
            engagement: i.engagement_rate || 0
        }));

    // Tier breakdown
    const tierBreakdown = {
        macro: influencers.filter(i => (i.followers_count || 0) >= 100000).length,
        midTier: influencers.filter(i => (i.followers_count || 0) >= 10000 && (i.followers_count || 0) < 100000).length,
        micro: influencers.filter(i => (i.followers_count || 0) < 10000).length
    };

    return {
        totalInfluencers,
        totalFollowers,
        avgEngagement: avgEngagement.toFixed(2),
        tierBreakdown,
        topPerformers
    };
}

/**
 * Get influencer list for restaurant
 */
async function getInfluencerList(restaurantId, options = {}) {
    const supabase = getSupabaseClient();
    const { limit = 20, offset = 0 } = options;

    const { data, error, count } = await supabase
        .from('bookings')
        .select(`
      influencer_id,
      profiles:influencer_id (
        id,
        full_name,
        email,
        phone,
        tiktok_handle,
        instagram_handle,
        youtube_handle,
        followers_count,
        engagement_rate,
        experience_level,
        total_earnings,
        missed_reviews,
        rescheduled_reviews,
        ghl_contact_id
      )
    `, { count: 'exact' })
        .eq('restaurant_id', restaurantId)
        .range(offset, offset + limit - 1);

    if (error) {
        throw error;
    }

    // Dedupe
    const seen = new Set();
    const influencers = data
        ?.filter(b => {
            if (!b.profiles || seen.has(b.profiles.id)) return false;
            seen.add(b.profiles.id);
            return true;
        })
        .map(b => b.profiles) || [];

    return {
        influencers,
        total: count || 0,
        limit,
        offset
    };
}

/**
 * Express router for influencer API
 */
function createInfluencerRouter() {
    const express = require('express');
    const router = express.Router();

    // GET /api/influencers/stats
    router.get('/stats', async (req, res) => {
        try {
            const restaurantId = req.query.restaurantId || req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(400).json({ error: 'Missing restaurantId' });
            }

            const stats = await getInfluencerStats(restaurantId);
            res.json(stats);
        } catch (error) {
            console.error('[InfluencerAPI] Stats error:', error);
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    });

    // GET /api/influencers
    router.get('/', async (req, res) => {
        try {
            const restaurantId = req.query.restaurantId || req.user?.restaurantId;
            if (!restaurantId) {
                return res.status(400).json({ error: 'Missing restaurantId' });
            }

            const limit = parseInt(req.query.limit) || 20;
            const offset = parseInt(req.query.offset) || 0;

            const result = await getInfluencerList(restaurantId, { limit, offset });
            res.json(result);
        } catch (error) {
            console.error('[InfluencerAPI] List error:', error);
            res.status(500).json({ error: 'Failed to fetch influencers' });
        }
    });

    return router;
}

module.exports = {
    getSupabaseClient,
    getInfluencerStats,
    getInfluencerList,
    createInfluencerRouter
};
