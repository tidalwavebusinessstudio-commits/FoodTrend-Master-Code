/**
 * Restaurant Dashboard API
 * Provides real-time dashboard data for restaurant owners
 */

const express = require('express');

function createRestaurantDashboardRouter(supabase) {
    const router = express.Router();

    /**
     * GET /api/restaurant/:id/dashboard
     * Returns comprehensive dashboard stats for a restaurant
     */
    router.get('/:id/dashboard', async (req, res) => {
        try {
            const { id } = req.params;

            // Parallel data fetching for performance
            const [
                restaurantData,
                influencerStats,
                recentGigs,
                contentMetrics
            ] = await Promise.all([
                getRestaurantInfo(supabase, id),
                getInfluencerNetworkStats(supabase, id),
                getRecentGigs(supabase, id),
                getContentMetrics(supabase, id)
            ]);

            res.json({
                restaurant: restaurantData,
                influencerNetwork: influencerStats,
                recentGigs,
                contentMetrics,
                generatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Dashboard API error:', error);
            res.status(500).json({ error: 'Failed to load dashboard data' });
        }
    });

    /**
     * GET /api/restaurant/:id/gigs
     * Returns all gigs for a restaurant
     */
    router.get('/:id/gigs', async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.query;

            let query = supabase
                .from('gigs')
                .select('*')
                .eq('restaurant_id', id)
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) throw error;

            res.json({ gigs: data || [] });
        } catch (error) {
            console.error('Gigs API error:', error);
            res.status(500).json({ error: 'Failed to load gigs' });
        }
    });

    return router;
}

// Helper functions
async function getRestaurantInfo(supabase, restaurantId) {
    const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

    if (error) {
        console.error('Error fetching restaurant:', error);
        return null;
    }
    return data;
}

async function getInfluencerNetworkStats(supabase, restaurantId) {
    // Get count of influencers who have visited this restaurant
    const { data: visits, error: visitError } = await supabase
        .from('creator_visits')
        .select('influencer_id, content_posted, views_total')
        .eq('restaurant_id', restaurantId);

    if (visitError) {
        console.error('Error fetching visits:', visitError);
        return { total: 0, active: 0, totalViews: 0 };
    }

    const uniqueInfluencers = new Set(visits?.map(v => v.influencer_id) || []);
    const totalViews = visits?.reduce((sum, v) => sum + (v.views_total || 0), 0) || 0;
    const activeCount = visits?.filter(v => v.content_posted).length || 0;

    return {
        total: uniqueInfluencers.size,
        active: activeCount,
        totalViews,
        averageViewsPerVisit: visits?.length ? Math.round(totalViews / visits.length) : 0
    };
}

async function getRecentGigs(supabase, restaurantId) {
    const { data, error } = await supabase
        .from('gigs')
        .select(`
            id,
            title,
            status,
            created_at,
            payout_amount,
            influencer:influencer_id (
                id,
                full_name,
                instagram_handle
            )
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching recent gigs:', error);
        return [];
    }
    return data || [];
}

async function getContentMetrics(supabase, restaurantId) {
    const { data, error } = await supabase
        .from('creator_content')
        .select('views, likes, shares, platform, posted_at')
        .eq('restaurant_id', restaurantId)
        .order('posted_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('Error fetching content metrics:', error);
        return { totalContent: 0, totalViews: 0, totalLikes: 0, platformBreakdown: {} };
    }

    const content = data || [];
    const platformBreakdown = content.reduce((acc, item) => {
        acc[item.platform] = (acc[item.platform] || 0) + 1;
        return acc;
    }, {});

    return {
        totalContent: content.length,
        totalViews: content.reduce((sum, c) => sum + (c.views || 0), 0),
        totalLikes: content.reduce((sum, c) => sum + (c.likes || 0), 0),
        totalShares: content.reduce((sum, c) => sum + (c.shares || 0), 0),
        platformBreakdown
    };
}

module.exports = { createRestaurantDashboardRouter };
