/**
 * Influencer Signup API
 * Handles creator signup and qualification workflows
 */

const express = require('express');

function createInfluencerSignupRouter(supabase) {
    const router = express.Router();

    /**
     * POST /api/influencer/signup
     * Basic influencer signup (simple flow)
     */
    router.post('/signup', async (req, res) => {
        try {
            const { fullName, email, phone, socialProfiles, bio } = req.body;

            // Validate required fields
            if (!fullName || !email || !phone) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['fullName', 'email', 'phone']
                });
            }

            // Check if email already exists
            const { data: existing } = await supabase
                .from('influencers')
                .select('id')
                .eq('email', email)
                .single();

            if (existing) {
                return res.status(409).json({
                    error: 'Email already registered',
                    influencer: { id: existing.id }
                });
            }

            // Generate referral code
            const referralCode = generateReferralCode(fullName);

            // Create influencer record
            const { data: influencer, error } = await supabase
                .from('influencers')
                .insert({
                    full_name: fullName,
                    email,
                    phone,
                    instagram_handle: socialProfiles?.instagram || null,
                    tiktok_handle: socialProfiles?.tiktok || null,
                    bio,
                    referral_code: referralCode,
                    status: 'pending',
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            res.status(201).json({
                success: true,
                influencer: {
                    id: influencer.id,
                    referral_code: influencer.referral_code
                }
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ error: 'Failed to create account' });
        }
    });

    /**
     * POST /api/influencer/signup-qualified
     * Qualified influencer signup with scoring
     */
    router.post('/signup-qualified', async (req, res) => {
        try {
            const {
                fullName,
                email,
                phone,
                instagram,
                instagramFollowers,
                tiktok,
                tiktokFollowers,
                videoProductionExperience,
                foodReviewExperience,
                contentFrequency,
                sampleVideoUrls,
                nicheFocus,
                agreementAccepted
            } = req.body;

            // Validate required fields
            if (!fullName || !email || !phone || !agreementAccepted) {
                return res.status(400).json({
                    error: 'Missing required fields or agreement not accepted'
                });
            }

            // Check if email already exists
            const { data: existing } = await supabase
                .from('influencers')
                .select('id')
                .eq('email', email)
                .single();

            if (existing) {
                return res.status(409).json({
                    error: 'Email already registered',
                    influencer: { id: existing.id }
                });
            }

            // Calculate qualification score
            const score = calculateQualificationScore({
                instagramFollowers: instagramFollowers || 0,
                tiktokFollowers: tiktokFollowers || 0,
                videoProductionExperience: videoProductionExperience || 1,
                foodReviewExperience: foodReviewExperience || 1,
                contentFrequency: contentFrequency || 'monthly'
            });

            // Determine status based on score
            let status, approved;
            if (score >= 70) {
                status = 'approved';
                approved = true;
            } else if (score >= 50) {
                status = 'review';
                approved = false;
            } else {
                status = 'rejected';
                approved = false;
            }

            // Generate referral code
            const referralCode = generateReferralCode(fullName);

            // Create influencer record
            const { data: influencer, error } = await supabase
                .from('influencers')
                .insert({
                    full_name: fullName,
                    email,
                    phone,
                    instagram_handle: instagram,
                    instagram_followers: instagramFollowers || 0,
                    tiktok_handle: tiktok,
                    tiktok_followers: tiktokFollowers || 0,
                    video_production_experience: videoProductionExperience,
                    food_review_experience: foodReviewExperience,
                    content_frequency: contentFrequency,
                    sample_video_urls: sampleVideoUrls,
                    niche_focus: nicheFocus,
                    qualification_score: score,
                    referral_code: referralCode,
                    status,
                    agreement_accepted_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            res.status(201).json({
                success: true,
                approved,
                status,
                score,
                influencer: {
                    id: influencer.id,
                    referral_code: influencer.referral_code
                }
            });
        } catch (error) {
            console.error('Qualified signup error:', error);
            res.status(500).json({ error: 'Failed to create account' });
        }
    });

    /**
     * POST /api/influencer/submit-content
     * Submit content links after restaurant visit
     */
    router.post('/submit-content', async (req, res) => {
        try {
            const { influencerId, restaurantId, creatorVisitId, tiktokUrl, instagramUrl } = req.body;

            if (!influencerId || !restaurantId || !tiktokUrl || !instagramUrl) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['influencerId', 'restaurantId', 'tiktokUrl', 'instagramUrl']
                });
            }

            // Update creator visit with content links
            const { data: visit, error: visitError } = await supabase
                .from('creator_visits')
                .update({
                    tiktok_url: tiktokUrl,
                    instagram_url: instagramUrl,
                    tiktok_posted: true,
                    instagram_posted: true,
                    content_posted: true,
                    content_submitted_at: new Date().toISOString(),
                    status: 'content_submitted'
                })
                .eq('id', creatorVisitId)
                .select()
                .single();

            if (visitError) throw visitError;

            // Create content tracking records
            await Promise.all([
                supabase.from('creator_content').insert({
                    influencer_id: influencerId,
                    restaurant_id: restaurantId,
                    creator_visit_id: creatorVisitId,
                    platform: 'tiktok',
                    url: tiktokUrl,
                    posted_at: new Date().toISOString()
                }),
                supabase.from('creator_content').insert({
                    influencer_id: influencerId,
                    restaurant_id: restaurantId,
                    creator_visit_id: creatorVisitId,
                    platform: 'instagram',
                    url: instagramUrl,
                    posted_at: new Date().toISOString()
                })
            ]);

            res.json({
                success: true,
                message: 'Content submitted successfully'
            });
        } catch (error) {
            console.error('Content submission error:', error);
            res.status(500).json({ error: 'Failed to submit content' });
        }
    });

    /**
     * GET /api/influencer/:id/pending-visits
     * Get visits awaiting content submission
     */
    router.get('/:id/pending-visits', async (req, res) => {
        try {
            const { id } = req.params;

            const { data: visits, error } = await supabase
                .from('creator_visits')
                .select(`
                    id,
                    restaurant_id,
                    visit_date,
                    posting_deadline,
                    status,
                    tiktok_posted,
                    instagram_posted,
                    restaurant:restaurant_id (
                        name
                    )
                `)
                .eq('influencer_id', id)
                .eq('content_posted', false)
                .order('posting_deadline', { ascending: true });

            if (error) throw error;

            // Add restaurant name to each visit
            const formattedVisits = (visits || []).map(v => ({
                ...v,
                restaurant_name: v.restaurant?.name || 'Unknown Restaurant'
            }));

            res.json(formattedVisits);
        } catch (error) {
            console.error('Pending visits error:', error);
            res.status(500).json({ error: 'Failed to load pending visits' });
        }
    });

    return router;
}

// Helper functions
function generateReferralCode(name) {
    const prefix = name.split(' ')[0].toUpperCase().slice(0, 4);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
}

function calculateQualificationScore(data) {
    let score = 0;
    const totalFollowers = data.instagramFollowers + data.tiktokFollowers;

    // Follower count (max 40 points)
    if (totalFollowers >= 10000) score += 40;
    else if (totalFollowers >= 5000) score += 30;
    else if (totalFollowers >= 1000) score += 20;
    else score += 10;

    // Video production (max 30 points)
    score += (data.videoProductionExperience || 1) * 6;

    // Food review experience (max 30 points)
    score += (data.foodReviewExperience || 1) * 6;

    // Content frequency (max 10 points)
    const frequencyBonus = {
        'daily': 10,
        '3-4_weekly': 7,
        'weekly': 4,
        'monthly': 0
    };
    score += frequencyBonus[data.contentFrequency] || 0;

    return score;
}

module.exports = { createInfluencerSignupRouter };
