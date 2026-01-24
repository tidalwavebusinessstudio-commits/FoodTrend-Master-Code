/**
 * Influencer API Endpoints
 * Provides data for the creator dashboard
 */

const db = require('../database/connection');
const ReferralService = require('./referral-service');

class InfluencerAPI {
    /**
     * Get complete dashboard data for an influencer
     * GET /api/influencer/:influencerId/dashboard
     */
    async getDashboard(influencerId) {
        try {
            // Get influencer profile
            const influencer = await db.query(
                `SELECT * FROM influencers WHERE id = $1`,
                [influencerId]
            );

            if (!influencer) {
                throw new Error('Influencer not found');
            }

            // Get 12-month income projection
            const incomeProjection = await db.query(`
                SELECT 
                    DATE_TRUNC('month', c.due_date) as month,
                    COUNT(DISTINCT c.restaurant_id) as active_restaurants,
                    SUM(c.amount) as projected_income,
                    COUNT(c.id) as commission_count
                FROM commissions c
                WHERE c.influencer_id = $1
                AND c.status IN ('scheduled', 'ready_for_payout', 'processing')
                AND c.due_date >= CURRENT_DATE
                GROUP BY DATE_TRUNC('month', c.due_date)
                ORDER BY month ASC
                LIMIT 12
            `, [influencerId]);

            // Get restaurant attribution report
            const restaurants = await db.query(`
                SELECT 
                    r.id,
                    r.restaurant_name,
                    r.tier,
                    r.monthly_price,
                    r.signup_date,
                    r.first_payment_date,
                    r.status,
                    COUNT(c.id) as total_commissions,
                    SUM(CASE WHEN c.status = 'paid' THEN c.amount ELSE 0 END) as paid_amount,
                    SUM(CASE WHEN c.status IN ('ready_for_payout', 'processing') THEN c.amount ELSE 0 END) as pending_amount,
                    SUM(CASE WHEN c.status IN ('scheduled', 'ready_for_payout', 'processing') THEN c.amount ELSE 0 END) as future_earnings
                FROM restaurants r
                LEFT JOIN commissions c ON c.restaurant_id = r.id
                WHERE r.influencer_id = $1
                GROUP BY r.id
                ORDER BY r.signup_date DESC
            `, [influencerId]);

            // Get payout history
            const payouts = await db.query(`
                SELECT 
                    p.id,
                    p.total_amount,
                    p.commission_count,
                    p.status,
                    p.stripe_transfer_id,
                    p.processed_date,
                    p.created_at
                FROM payouts p
                WHERE p.influencer_id = $1
                ORDER BY p.created_at DESC
                LIMIT 20
            `, [influencerId]);

            return {
                influencer: influencer,
                incomeProjection: incomeProjection,
                restaurants: restaurants,
                payouts: payouts,
                summary: {
                    totalPotentialIncome: incomeProjection.reduce((sum, item) => sum + parseFloat(item.projected_income), 0),
                    avgConversionRate: influencer.total_clicks > 0
                        ? ((influencer.total_referrals / influencer.total_clicks) * 100).toFixed(2)
                        : 0
                }
            };
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            throw error;
        }
    }

    /**
     * Influencer signup endpoint
     * POST /api/influencer/signup
     */
    async signup(data) {
        const { email, fullName, phone, socialProfiles, bio } = data;

        try {
            // Check if influencer already exists
            const existing = await db.query(
                `SELECT id FROM influencers WHERE email = $1`,
                [email]
            );

            if (existing) {
                throw new Error('An account with this email already exists');
            }

            // Use ReferralService to create influencer
            const influencer = await ReferralService.signupInfluencer({
                email,
                fullName,
                phone,
                socialProfiles
            });

            // Store additional metadata (bio, etc.)
            if (bio) {
                await db.query(
                    `UPDATE influencers SET metadata = $1 WHERE id = $2`,
                    [JSON.stringify({ bio, socialProfiles }), influencer.id]
                );
            }

            return {
                success: true,
                influencer: {
                    id: influencer.id,
                    email: influencer.email,
                    full_name: influencer.full_name,
                    referral_code: influencer.referral_code,
                    qr_code_url: influencer.qr_code_url
                }
            };
        } catch (error) {
            console.error('Error creating influencer:', error);
            throw error;
        }
    }

    /**
     * Get earnings breakdown by month
     * GET /api/influencer/:influencerId/earnings
     */
    async getEarningsBreakdown(influencerId) {
        try {
            const breakdown = await db.query(`
                SELECT 
                    DATE_TRUNC('month', c.paid_date) as month,
                    COUNT(c.id) as commission_count,
                    SUM(c.amount) as total_earned,
                    COUNT(DISTINCT c.restaurant_id) as restaurant_count
                FROM commissions c
                WHERE c.influencer_id = $1
                AND c.status = 'paid'
                GROUP BY DATE_TRUNC('month', c.paid_date)
                ORDER BY month DESC
            `, [influencerId]);

            return breakdown;
        } catch (error) {
            console.error('Error fetching earnings breakdown:', error);
            throw error;
        }
    }

    /**
     * Get referral analytics
     * GET /api/influencer/:influencerId/analytics
     */
    async getAnalytics(influencerId) {
        try {
            // Get click analytics by source
            const clicksBySource = await db.query(`
                SELECT 
                    click_source,
                    COUNT(*) as click_count,
                    COUNT(CASE WHEN converted = true THEN 1 END) as conversions,
                    ROUND(
                        (COUNT(CASE WHEN converted = true THEN 1 END)::numeric / COUNT(*)::numeric) * 100, 
                        2
                    ) as conversion_rate
                FROM referral_tracking
                WHERE influencer_id = $1
                GROUP BY click_source
                ORDER BY click_count DESC
            `, [influencerId]);

            // Get click trend (last 30 days)
            const clickTrend = await db.query(`
                SELECT 
                    DATE(clicked_at) as date,
                    COUNT(*) as clicks,
                    COUNT(CASE WHEN converted = true THEN 1 END) as conversions
                FROM referral_tracking
                WHERE influencer_id = $1
                AND clicked_at >= NOW() - INTERVAL '30 days'
                GROUP BY DATE(clicked_at)
                ORDER BY date ASC
            `, [influencerId]);

            // Get top performing restaurants
            const topRestaurants = await db.query(`
                SELECT 
                    r.restaurant_name,
                    r.tier,
                    COUNT(c.id) as commissions_paid,
                    SUM(CASE WHEN c.status = 'paid' THEN c.amount ELSE 0 END) as total_earned
                FROM restaurants r
                LEFT JOIN commissions c ON c.restaurant_id = r.id
                WHERE r.influencer_id = $1
                GROUP BY r.id
                ORDER BY total_earned DESC
                LIMIT 10
            `, [influencerId]);

            return {
                clicksBySource,
                clickTrend,
                topRestaurants
            };
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }

    /**
     * Update influencer profile
     * PUT /api/influencer/:influencerId/profile
     */
    async updateProfile(influencerId, updates) {
        try {
            const { email, phone, socialProfiles, bio } = updates;

            // Update basic fields
            await db.query(`
                UPDATE influencers 
                SET email = COALESCE($1, email),
                    phone = COALESCE($2, phone),
                    metadata = COALESCE($3, metadata),
                    updated_at = NOW()
                WHERE id = $4
            `, [
                email || null,
                phone || null,
                JSON.stringify({ bio, socialProfiles }) || null,
                influencerId
            ]);

            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    /**
     * Get influencer by email (for login)
     * POST /api/influencer/login
     */
    async login(email) {
        try {
            const influencer = await db.query(
                `SELECT id, email, full_name, referral_code FROM influencers WHERE email = $1`,
                [email]
            );

            if (!influencer) {
                throw new Error('No account found with this email');
            }

            return {
                success: true,
                influencer: influencer
            };
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }
}

module.exports = new InfluencerAPI();
