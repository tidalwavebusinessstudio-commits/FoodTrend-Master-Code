/**
 * Review Gating API Routes
 * Handles review submissions and feedback retrieval
 */

const express = require('express');
const {
    processReview,
    getRestaurantFeedbackSummary,
    markGoogleReviewPosted
} = require('../services/review-gating');

function createReviewRouter(supabase) {
    const router = express.Router();

    /**
     * POST /api/reviews/submit
     * Submit a review after a gig visit
     * 
     * Body:
     * - influencerId: string
     * - restaurantId: string
     * - creatorVisitId: string
     * - starRating: number (1-5)
     * - comment: string
     * - ghlContactId: string (optional)
     */
    router.post('/submit', async (req, res) => {
        try {
            const { influencerId, restaurantId, creatorVisitId, starRating, comment, ghlContactId } = req.body;

            // Validation
            if (!influencerId || !restaurantId || !creatorVisitId) {
                return res.status(400).json({
                    error: 'Missing required fields: influencerId, restaurantId, creatorVisitId'
                });
            }

            if (!starRating || starRating < 1 || starRating > 5) {
                return res.status(400).json({
                    error: 'starRating must be between 1 and 5'
                });
            }

            const result = await processReview({
                influencerId,
                restaurantId,
                creatorVisitId,
                starRating,
                comment: comment || '',
                ghlContactId
            });

            res.json(result);

        } catch (error) {
            console.error('[ReviewAPI] Error submitting review:', error);
            res.status(500).json({ error: 'Failed to submit review' });
        }
    });

    /**
     * GET /api/reviews/restaurant/:restaurantId/feedback
     * Get feedback summary for restaurant dashboard
     */
    router.get('/restaurant/:restaurantId/feedback', async (req, res) => {
        try {
            const { restaurantId } = req.params;
            const summary = await getRestaurantFeedbackSummary(restaurantId);
            res.json(summary);
        } catch (error) {
            console.error('[ReviewAPI] Error fetching feedback:', error);
            res.status(500).json({ error: 'Failed to fetch feedback' });
        }
    });

    /**
     * POST /api/reviews/:feedbackId/mark-posted
     * Mark a review as posted to Google (callback or manual)
     */
    router.post('/:feedbackId/mark-posted', async (req, res) => {
        try {
            const { feedbackId } = req.params;
            const result = await markGoogleReviewPosted(feedbackId);
            res.json({ success: true, feedback: result });
        } catch (error) {
            console.error('[ReviewAPI] Error marking review as posted:', error);
            res.status(500).json({ error: 'Failed to update review status' });
        }
    });

    /**
     * GET /api/reviews/restaurant/:restaurantId/stats
     * Get review statistics only (lightweight)
     */
    router.get('/restaurant/:restaurantId/stats', async (req, res) => {
        try {
            const { restaurantId } = req.params;
            const summary = await getRestaurantFeedbackSummary(restaurantId);
            res.json(summary.stats);
        } catch (error) {
            console.error('[ReviewAPI] Error fetching stats:', error);
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    });

    return router;
}

module.exports = { createReviewRouter };
