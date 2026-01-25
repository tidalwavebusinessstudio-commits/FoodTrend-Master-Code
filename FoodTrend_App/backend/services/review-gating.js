/**
 * Review Gating System
 * Routes influencer reviews based on star rating
 * 
 * Logic:
 * - < 4 stars: Store as internal feedback (restaurant portal only)
 * - 5 stars: Prompt user to post to Google, trigger GHL workflow
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GHL Workflow trigger (imported from existing service)
const { triggerReviewRequest } = require('./ghl-workflow-triggers');

/**
 * Process a review submission from an influencer
 * @param {Object} reviewData - The review data
 * @param {string} reviewData.influencerId - The influencer's ID
 * @param {string} reviewData.restaurantId - The restaurant's ID
 * @param {string} reviewData.creatorVisitId - The visit ID
 * @param {number} reviewData.starRating - 1-5 star rating
 * @param {string} reviewData.comment - The review text
 * @param {string} reviewData.ghlContactId - GHL contact ID for workflow triggers
 */
async function processReview(reviewData) {
    const { influencerId, restaurantId, creatorVisitId, starRating, comment, ghlContactId } = reviewData;

    // Validate star rating
    if (!starRating || starRating < 1 || starRating > 5) {
        throw new Error('Invalid star rating. Must be between 1 and 5.');
    }

    console.log(`[ReviewGating] Processing review: ${starRating} stars for restaurant ${restaurantId}`);

    // Determine routing based on star rating
    if (starRating < 4) {
        // Route to internal feedback
        return await routeToInternalFeedback({
            influencerId,
            restaurantId,
            creatorVisitId,
            starRating,
            comment
        });
    } else if (starRating === 5) {
        // Route to Google Review conversion
        return await routeToGoogleReview({
            influencerId,
            restaurantId,
            creatorVisitId,
            starRating,
            comment,
            ghlContactId
        });
    } else {
        // 4 stars - store but don't actively promote
        return await storeNeutralReview({
            influencerId,
            restaurantId,
            creatorVisitId,
            starRating,
            comment
        });
    }
}

/**
 * Route low-star reviews to internal feedback (restaurant portal only)
 */
async function routeToInternalFeedback(data) {
    const { influencerId, restaurantId, creatorVisitId, starRating, comment } = data;

    console.log(`[ReviewGating] Routing to INTERNAL feedback (${starRating} stars)`);

    // Store in restaurant_feedback table
    const { data: feedback, error } = await supabase
        .from('restaurant_feedback')
        .insert({
            influencer_id: influencerId,
            restaurant_id: restaurantId,
            creator_visit_id: creatorVisitId,
            star_rating: starRating,
            comment,
            feedback_type: 'internal',
            is_public: false,
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error('[ReviewGating] Error storing internal feedback:', error);
        throw error;
    }

    // Update the visit record to mark review as collected
    await supabase
        .from('creator_visits')
        .update({
            review_collected: true,
            review_rating: starRating,
            review_type: 'internal'
        })
        .eq('id', creatorVisitId);

    return {
        success: true,
        type: 'internal_feedback',
        feedbackId: feedback.id,
        message: 'Thank you for your feedback. This has been shared privately with the restaurant.'
    };
}

/**
 * Route 5-star reviews to Google Review conversion flow
 */
async function routeToGoogleReview(data) {
    const { influencerId, restaurantId, creatorVisitId, starRating, comment, ghlContactId } = data;

    console.log(`[ReviewGating] Routing to GOOGLE REVIEW conversion (5 stars)`);

    // Get restaurant details for Google Places link
    const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('name, google_place_id, google_review_url')
        .eq('id', restaurantId)
        .single();

    if (restaurantError) {
        console.error('[ReviewGating] Error fetching restaurant:', restaurantError);
    }

    // Store the review
    const { data: review, error } = await supabase
        .from('restaurant_feedback')
        .insert({
            influencer_id: influencerId,
            restaurant_id: restaurantId,
            creator_visit_id: creatorVisitId,
            star_rating: starRating,
            comment,
            feedback_type: 'google_pending',
            is_public: false, // Will become true once posted to Google
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error('[ReviewGating] Error storing review:', error);
        throw error;
    }

    // Update visit record
    await supabase
        .from('creator_visits')
        .update({
            review_collected: true,
            review_rating: starRating,
            review_type: 'google_pending'
        })
        .eq('id', creatorVisitId);

    // Trigger GHL workflow for Google Review follow-up
    if (ghlContactId) {
        await triggerReviewRequest(ghlContactId, {
            restaurantName: restaurant?.name || 'the restaurant',
            googleReviewUrl: restaurant?.google_review_url || generateGoogleReviewUrl(restaurant?.google_place_id),
            prefilledText: comment
        });
    }

    return {
        success: true,
        type: 'google_review',
        reviewId: review.id,
        googleReviewUrl: restaurant?.google_review_url || null,
        message: 'Amazing! Would you mind sharing this 5-star experience on Google? It really helps!',
        prefilledText: comment
    };
}

/**
 * Store 4-star reviews (good but not promotion-worthy)
 */
async function storeNeutralReview(data) {
    const { influencerId, restaurantId, creatorVisitId, starRating, comment } = data;

    console.log(`[ReviewGating] Storing neutral review (4 stars)`);

    const { data: review, error } = await supabase
        .from('restaurant_feedback')
        .insert({
            influencer_id: influencerId,
            restaurant_id: restaurantId,
            creator_visit_id: creatorVisitId,
            star_rating: starRating,
            comment,
            feedback_type: 'neutral',
            is_public: false,
            created_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error('[ReviewGating] Error storing neutral review:', error);
        throw error;
    }

    await supabase
        .from('creator_visits')
        .update({
            review_collected: true,
            review_rating: starRating,
            review_type: 'neutral'
        })
        .eq('id', creatorVisitId);

    return {
        success: true,
        type: 'neutral',
        reviewId: review.id,
        message: 'Thanks for your feedback!'
    };
}

/**
 * Generate Google Review URL from Place ID
 */
function generateGoogleReviewUrl(placeId) {
    if (!placeId) return null;
    return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

/**
 * Get feedback summary for restaurant dashboard
 */
async function getRestaurantFeedbackSummary(restaurantId) {
    // Get all feedback
    const { data: feedback, error } = await supabase
        .from('restaurant_feedback')
        .select(`
            id,
            star_rating,
            comment,
            feedback_type,
            created_at,
            influencer:influencer_id (
                full_name,
                instagram_handle
            )
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[ReviewGating] Error fetching feedback:', error);
        throw error;
    }

    // Calculate statistics
    const stats = {
        total: feedback.length,
        averageRating: feedback.length > 0
            ? feedback.reduce((sum, f) => sum + f.star_rating, 0) / feedback.length
            : 0,
        internalCount: feedback.filter(f => f.feedback_type === 'internal').length,
        googlePendingCount: feedback.filter(f => f.feedback_type === 'google_pending').length,
        googlePostedCount: feedback.filter(f => f.feedback_type === 'google_posted').length,
        byRating: {
            1: feedback.filter(f => f.star_rating === 1).length,
            2: feedback.filter(f => f.star_rating === 2).length,
            3: feedback.filter(f => f.star_rating === 3).length,
            4: feedback.filter(f => f.star_rating === 4).length,
            5: feedback.filter(f => f.star_rating === 5).length
        }
    };

    return {
        stats,
        recentFeedback: feedback.slice(0, 10),
        internalFeedback: feedback.filter(f => f.feedback_type === 'internal')
    };
}

/**
 * Mark a Google review as posted (callback from GHL or manual)
 */
async function markGoogleReviewPosted(feedbackId) {
    const { data, error } = await supabase
        .from('restaurant_feedback')
        .update({
            feedback_type: 'google_posted',
            is_public: true,
            google_posted_at: new Date().toISOString()
        })
        .eq('id', feedbackId)
        .select()
        .single();

    if (error) {
        console.error('[ReviewGating] Error marking review as posted:', error);
        throw error;
    }

    return data;
}

module.exports = {
    processReview,
    routeToInternalFeedback,
    routeToGoogleReview,
    getRestaurantFeedbackSummary,
    markGoogleReviewPosted,
    generateGoogleReviewUrl
};
