/**
 * FoodTrend Backend API - Referral System
 * 
 * Handles influencer signup, referral code generation,
 * and linking restaurants to influencers
 */

const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const crypto = require('crypto');

class ReferralService {
    constructor(db) {
        this.db = db;
        this.BASE_URL = process.env.BASE_URL || 'https://foodtrend.com';
    }

    /**
     * Generate unique referral code
     * Format: FIRSTNAME + 4 random chars (e.g., ALEX1B2C)
     */
    generateReferralCode(firstName) {
        const prefix = firstName.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 6);
        const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
        return `${prefix}${suffix}`;
    }

    /**
     * Ensure referral code is unique
     */
    async ensureUniqueCode(firstName) {
        let attempts = 0;
        let code;

        while (attempts < 10) {
            code = this.generateReferralCode(firstName);

            const existing = await this.db.influencers.findOne({ referral_code: code });
            if (!existing) return code;

            attempts++;
        }

        // Fallback: add timestamp
        return `${firstName.toUpperCase()}${Date.now().toString(36).toUpperCase()}`;
    }

    /**
     * Create new influencer account
     */
    async createInfluencer(data) {
        const { name, email, phone, instagram_handle, tiktok_handle, follower_count } = data;

        // Check if email already exists
        const existing = await this.db.influencers.findOne({ email });
        if (existing) {
            throw new Error('Email already registered');
        }

        // Generate unique referral code
        const firstName = name.split(' ')[0];
        const referral_code = await this.ensureUniqueCode(firstName);

        // Generate QR code
        const referralURL = `${this.BASE_URL}/qualify?ref=${referral_code}&source=qr`;
        const qr_code_url = await this.generateQRCode(referralURL, referral_code);

        // Create influencer record
        const influencer = await this.db.influencers.create({
            id: uuidv4(),
            name,
            email,
            phone,
            instagram_handle,
            tiktok_handle,
            follower_count: follower_count || 0,
            referral_code,
            qr_code_url,
            status: 'active',
            onboarding_completed: false
        });

        return {
            success: true,
            influencer: {
                id: influencer.id,
                name: influencer.name,
                email: influencer.email,
                referral_code: influencer.referral_code,
                referral_url: `${this.BASE_URL}/qualify?ref=${referral_code}`,
                qr_code_url: influencer.qr_code_url
            }
        };
    }

    /**
     * Generate QR code image
     */
    async generateQRCode(url, code) {
        try {
            // Generate QR code as data URL
            const qrDataURL = await QRCode.toDataURL(url, {
                errorCorrectionLevel: 'M',
                type: 'image/png',
                width: 400,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            // In production, upload to S3/Cloudinary and return URL
            // For now, return data URL
            return qrDataURL;

            // TODO: Upload to cloud storage
            // const s3URL = await uploadToS3(qrDataURL, `qr-codes/${code}.png`);
            // return s3URL;
        } catch (error) {
            console.error('Failed to generate QR code:', error);
            return null;
        }
    }

    /**
     * Track referral link click
     */
    async trackClick(data) {
        const {
            referral_code,
            landing_page,
            user_agent,
            click_source,
            utm_source,
            utm_medium,
            utm_campaign
        } = data;

        // Find influencer by referral code
        const influencer = await this.db.influencers.findOne({ referral_code });

        if (!influencer) {
            return { success: false, error: 'Invalid referral code' };
        }

        // Create tracking record
        await this.db.referral_tracking.create({
            id: uuidv4(),
            influencer_id: influencer.id,
            referral_code,
            landing_page,
            user_agent,
            click_source,
            utm_source,
            utm_medium,
            utm_campaign,
            clicked_at: new Date()
        });

        return { success: true };
    }

    /**
     * Attribute restaurant signup to influencer
     */
    async attributeSignup(data) {
        const { referral_code, restaurant_id, restaurant_email } = data;

        // Find influencer
        const influencer = await this.db.influencers.findOne({ referral_code });
        if (!influencer) {
            return { success: false, error: 'Invalid referral code' };
        }

        // Update restaurant record
        await this.db.restaurants.update(
            { id: restaurant_id },
            {
                referred_by_influencer_id: influencer.id,
                referral_code_used: referral_code
            }
        );

        // Increment influencer's referral count
        await this.db.influencers.update(
            { id: influencer.id },
            {
                total_referrals: influencer.total_referrals + 1,
                active_referrals: influencer.active_referrals + 1
            }
        );

        // Update referral tracking (mark as converted)
        await this.db.referral_tracking.updateMany(
            {
                referral_code,
                restaurant_id: null
            },
            {
                restaurant_id,
                converted: true,
                conversion_date: new Date()
            }
        );

        return {
            success: true,
            influencer_id: influencer.id,
            influencer_name: influencer.name
        };
    }

    /**
     * Get influencer dashboard data
     */
    async getDashboardData(influencerId) {
        // Get influencer
        const influencer = await this.db.influencers.findById(influencerId);
        if (!influencer) {
            throw new Error('Influencer not found');
        }

        // Get referred restaurants
        const restaurants = await this.db.restaurants.find({
            referred_by_influencer_id: influencerId
        });

        // Get commissions
        const commissions = await this.db.commissions.find({
            influencer_id: influencerId
        });

        // Calculate per-restaurant stats
        const referrals = restaurants.map(restaurant => {
            const restaurantCommissions = commissions.filter(
                c => c.restaurant_id === restaurant.id
            );

            const monthsSinceSignup = restaurant.first_payment_date
                ? this.getMonthsSince(restaurant.first_payment_date)
                : 0;

            const totalPaid = restaurantCommissions
                .filter(c => c.status === 'paid')
                .reduce((sum, c) => sum + parseFloat(c.amount), 0);

            const totalPending = restaurantCommissions
                .filter(c => c.status === 'pending' || c.status === 'ready_for_payout')
                .reduce((sum, c) => sum + parseFloat(c.amount), 0);

            return {
                restaurant_id: restaurant.id,
                restaurant_name: restaurant.name,
                signup_date: restaurant.signup_date,
                first_payment_date: restaurant.first_payment_date,
                current_month: monthsSinceSignup,
                total_paid: totalPaid,
                total_pending: totalPending,
                status: restaurant.status
            };
        });

        return {
            influencer: {
                id: influencer.id,
                name: influencer.name,
                email: influencer.email,
                referral_code: influencer.referral_code,
                total_earnings: influencer.total_earnings,
                pending_earnings: influencer.pending_earnings,
                paid_earnings: influencer.paid_earnings,
                active_referrals: influencer.active_referrals,
                total_referrals: influencer.total_referrals
            },
            referrals,
            stats: {
                total_potential_monthly: this.calculatePotentialMonthly(referrals),
                next_payout_date: this.getNextPayoutDate(),
                total_clicks: await this.getTotalClicks(influencerId)
            }
        };
    }

    /**
     * Calculate potential monthly earnings
     */
    calculatePotentialMonthly(referrals) {
        return referrals
            .filter(r => r.status === 'active')
            .reduce((sum, r) => {
                const amount = r.current_month <= 6 ? 250 : 100;
                return sum + amount;
            }, 0);
    }

    /**
     * Get months since date
     */
    getMonthsSince(date) {
        const now = new Date();
        const start = new Date(date);
        const months = (now.getFullYear() - start.getFullYear()) * 12 +
            (now.getMonth() - start.getMonth());
        return Math.max(1, months);
    }

    /**
     * Get next payout date (15th of next month)
     */
    getNextPayoutDate() {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
        return nextMonth.toISOString().split('T')[0];
    }

    /**
     * Get total clicks for influencer
     */
    async getTotalClicks(influencerId) {
        const result = await this.db.referral_tracking.count({
            influencer_id: influencerId
        });
        return result;
    }
}

module.exports = ReferralService;
