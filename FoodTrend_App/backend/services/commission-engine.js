/**
 * FoodTrend Commission Engine
 * 
 * Automatically creates and processes influencer commissions
 * $250/month for months 1-6, then $100/month ongoing
 */

const { v4: uuidv4 } = require('uuid');

class CommissionEngine {
    constructor(db) {
        this.db = db;

        // Commission structure
        this.EARLY_COMMISSION = 250.00; // Months 1-6
        this.ONGOING_COMMISSION = 100.00; // Month 7+
        this.EARLY_MONTHS = 6;
        this.SCHEDULE_MONTHS_AHEAD = 18; // Create 18 months of commissions upfront
    }

    /**
     * Create commission schedule when restaurant makes first payment
     */
    async createSchedule(restaurant) {
        if (!restaurant.referred_by_influencer_id) {
            console.log('No referrer - skipping commission schedule');
            return;
        }

        if (!restaurant.first_payment_date) {
            throw new Error('Cannot create schedule without first payment date');
        }

        console.log(`📅 Creating commission schedule for restaurant ${restaurant.id}`);

        const influencerId = restaurant.referred_by_influencer_id;
        const startDate = new Date(restaurant.first_payment_date);
        const commissions = [];

        // Create months 1-6 at $250
        for (let month = 1; month <= this.EARLY_MONTHS; month++) {
            const dueDate = this.addMonths(startDate, month);

            commissions.push({
                id: uuidv4(),
                influencer_id: influencerId,
                restaurant_id: restaurant.id,
                month_number: month,
                amount: this.EARLY_COMMISSION,
                due_date: dueDate,
                status: 'pending'
            });
        }

        // Create months 7-18 at $100
        for (let month = this.EARLY_MONTHS + 1; month <= this.SCHEDULE_MONTHS_AHEAD; month++) {
            const dueDate = this.addMonths(startDate, month);

            commissions.push({
                id: uuidv4(),
                influencer_id: influencerId,
                restaurant_id: restaurant.id,
                month_number: month,
                amount: this.ONGOING_COMMISSION,
                due_date: dueDate,
                status: 'pending'
            });
        }

        // Bulk insert
        await this.db.commissions.insertMany(commissions);

        console.log(`✅ Created ${commissions.length} commission records`);

        // Send notification to influencer
        await this.notifyInfluencerNewReferral(influencerId, restaurant);

        return commissions;
    }

    /**
     * Process monthly commission when restaurant pays
     */
    async processMonthlyCommission(restaurant) {
        if (!restaurant.referred_by_influencer_id) {
            return;
        }

        const today = new Date();

        // Find commissions due this month or earlier that are still pending
        const dueCommissions = await this.db.commissions.find({
            restaurant_id: restaurant.id,
            status: 'pending',
            due_date: { $lte: today }
        });

        if (dueCommissions.length === 0) {
            console.log('No due commissions to process');
            return;
        }

        console.log(`💰 Processing ${dueCommissions.length} commissions for restaurant ${restaurant.id}`);

        for (const commission of dueCommissions) {
            // Mark as ready for payout
            await this.db.commissions.update(
                { id: commission.id },
                {
                    status: 'ready_for_payout',
                    processed_date: new Date()
                }
            );

            // Update influencer pending earnings
            const influencer = await this.db.influencers.findById(commission.influencer_id);

            await this.db.influencers.update(
                { id: influencer.id },
                {
                    pending_earnings: influencer.pending_earnings + parseFloat(commission.amount),
                    total_earnings: influencer.total_earnings + parseFloat(commission.amount)
                }
            );

            console.log(`✅ Commission ${commission.id} ready for payout: $${commission.amount}`);
        }

        // Check if we need to create more future commissions
        await this.extendScheduleIfNeeded(restaurant);
    }

    /**
     * Extend commission schedule if we're getting close to the end
     */
    async extendScheduleIfNeeded(restaurant) {
        if (!restaurant.referred_by_influencer_id) {
            return;
        }

        // Get last commission
        const lastCommission = await this.db.commissions.findOne({
            restaurant_id: restaurant.id
        }, {
            sort: { month_number: -1 }
        });

        if (!lastCommission) {
            return;
        }

        // If we're within 6 months of the last scheduled commission, create more
        const monthsUntilEnd = lastCommission.month_number - this.getCurrentMonth(restaurant);

        if (monthsUntilEnd < 6) {
            console.log('📅 Extending commission schedule');

            const newCommissions = [];
            const startMonth = lastCommission.month_number + 1;
            const startDate = new Date(restaurant.first_payment_date);

            for (let month = startMonth; month <= startMonth + 12; month++) {
                const dueDate = this.addMonths(startDate, month);

                newCommissions.push({
                    id: uuidv4(),
                    influencer_id: restaurant.referred_by_influencer_id,
                    restaurant_id: restaurant.id,
                    month_number: month,
                    amount: this.ONGOING_COMMISSION,
                    due_date: dueDate,
                    status: 'pending'
                });
            }

            await this.db.commissions.insertMany(newCommissions);
            console.log(`✅ Extended schedule by ${newCommissions.length} months`);
        }
    }

    /**
     * Cancel all pending commissions for a restaurant
     */
    async cancelPendingCommissions(restaurantId) {
        console.log(`🚫 Cancelling pending commissions for restaurant ${restaurantId}`);

        await this.db.commissions.updateMany(
            {
                restaurant_id: restaurantId,
                status: { $in: ['pending', 'ready_for_payout'] }
            },
            {
                status: 'cancelled'
            }
        );
    }

    /**
     * Get current month number for a restaurant
     */
    getCurrentMonth(restaurant) {
        if (!restaurant.first_payment_date) {
            return 0;
        }

        const now = new Date();
        const start = new Date(restaurant.first_payment_date);

        const months = (now.getFullYear() - start.getFullYear()) * 12 +
            (now.getMonth() - start.getMonth());

        return Math.max(1, months + 1);
    }

    /**
     * Add months to a date
     */
    addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }

    /**
     * Notify influencer of new referral
     */
    async notifyInfluencerNewReferral(influencerId, restaurant) {
        const influencer = await this.db.influencers.findById(influencerId);

        // TODO: Send email notification
        console.log(`📧 Notify ${influencer.email}: New referral from ${restaurant.name}`);

        // Email content:
        // Subject: "🎉 You just earned $250/month from a new restaurant!"
        // Body: 
        // - Restaurant name
        // - "You'll earn $250/month for the next 6 months, then $100/month ongoing"
        // - Total potential: "$1,500 in first 6 months, then $1,200/year after that"
        // - Link to dashboard to see earnings
    }

    /**
     * Get influencer commission summary
     */
    async getInfluencerSummary(influencerId) {
        const commissions = await this.db.commissions.find({
            influencer_id: influencerId
        });

        const summary = {
            total_pending: 0,
            total_ready: 0,
            total_paid: 0,
            monthly_recurring: 0,
            lifetime_value: 0
        };

        for (const commission of commissions) {
            const amount = parseFloat(commission.amount);

            if (commission.status === 'pending') {
                summary.total_pending += amount;
            } else if (commission.status === 'ready_for_payout') {
                summary.total_ready += amount;
            } else if (commission.status === 'paid') {
                summary.total_paid += amount;
            }
        }

        // Calculate monthly recurring (from active restaurants)
        const activeRestaurants = await this.db.restaurants.find({
            referred_by_influencer_id: influencerId,
            status: 'active'
        });

        for (const restaurant of activeRestaurants) {
            const monthNum = this.getCurrentMonth(restaurant);
            const amount = monthNum <= this.EARLY_MONTHS ?
                this.EARLY_COMMISSION : this.ONGOING_COMMISSION;
            summary.monthly_recurring += amount;
        }

        // Estimate lifetime value (conservative: 24 months average)
        summary.lifetime_value =
            (this.EARLY_COMMISSION * this.EARLY_MONTHS) +
            (this.ONGOING_COMMISSION * 18);

        return summary;
    }
}

module.exports = CommissionEngine;
