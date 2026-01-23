/**
 * FoodTrend Payment Processor
 * 
 * Handles Stripe subscription creation, webhook processing,
 * and triggering commission schedules
 */

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentProcessor {
    constructor(db, commissionEngine) {
        this.db = db;
        this.commissionEngine = commissionEngine;

        // Stripe Price IDs (from Stripe Dashboard)
        this.PRICE_IDS = {
            momentum: process.env.STRIPE_PRICE_MOMENTUM || 'price_momentum_799',
            velocity: process.env.STRIPE_PRICE_VELOCITY || 'price_velocity_1299',
            dominance: process.env.STRIPE_PRICE_DOMINANCE || 'price_dominance_2499'
        };

        this.TIER_PRICES = {
            momentum: 799.00,
            velocity: 1299.00,
            dominance: 2499.00
        };
    }

    /**
     * Create Stripe customer for new restaurant
     */
    async createCustomer(restaurantData) {
        try {
            const customer = await stripe.customers.create({
                email: restaurantData.email,
                name: restaurantData.name,
                phone: restaurantData.phone,
                metadata: {
                    restaurant_id: restaurantData.id,
                    referred_by: restaurantData.referred_by_influencer_id || 'direct'
                }
            });

            // Store Stripe customer ID
            await this.db.restaurants.update(
                { id: restaurantData.id },
                { stripe_customer_id: customer.id }
            );

            return customer;
        } catch (error) {
            console.error('Failed to create Stripe customer:', error);
            throw error;
        }
    }

    /**
     * Create subscription for restaurant
     */
    async createSubscription(restaurantId, tier) {
        try {
            const restaurant = await this.db.restaurants.findById(restaurantId);
            if (!restaurant) {
                throw new Error('Restaurant not found');
            }

            // Ensure customer exists
            let customerId = restaurant.stripe_customer_id;
            if (!customerId) {
                const customer = await this.createCustomer(restaurant);
                customerId = customer.id;
            }

            // Get price ID for tier
            const priceId = this.PRICE_IDS[tier];
            if (!priceId) {
                throw new Error(`Invalid tier: ${tier}`);
            }

            // Create subscription
            const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: {
                    save_default_payment_method: 'on_subscription'
                },
                expand: ['latest_invoice.payment_intent'],
                metadata: {
                    restaurant_id: restaurantId,
                    tier: tier,
                    referred_by: restaurant.referred_by_influencer_id || 'direct'
                }
            });

            // Update restaurant
            await this.db.restaurants.update(
                { id: restaurantId },
                {
                    stripe_subscription_id: subscription.id,
                    tier: tier,
                    monthly_price: this.TIER_PRICES[tier],
                    billing_cycle_day: new Date().getDate()
                }
            );

            return {
                subscriptionId: subscription.id,
                clientSecret: subscription.latest_invoice.payment_intent.client_secret,
                amount: this.TIER_PRICES[tier]
            };
        } catch (error) {
            console.error('Failed to create subscription:', error);
            throw error;
        }
    }

    /**
     * Handle Stripe webhook events
     */
    async handleWebhook(event) {
        console.log(`📥 Webhook received: ${event.type}`);

        try {
            switch (event.type) {
                case 'invoice.payment_succeeded':
                    await this.handlePaymentSucceeded(event.data.object);
                    break;

                case 'invoice.payment_failed':
                    await this.handlePaymentFailed(event.data.object);
                    break;

                case 'customer.subscription.deleted':
                    await this.handleSubscriptionCancelled(event.data.object);
                    break;

                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdated(event.data.object);
                    break;

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Webhook handler error:', error);
            throw error;
        }
    }

    /**
     * Handle successful payment
     */
    async handlePaymentSucceeded(invoice) {
        console.log(`✅ Payment succeeded: ${invoice.id}`);

        const restaurant = await this.db.restaurants.findOne({
            stripe_subscription_id: invoice.subscription
        });

        if (!restaurant) {
            console.warn('Restaurant not found for subscription:', invoice.subscription);
            return;
        }

        // Check if this is the first payment
        const isFirstPayment = !restaurant.first_payment_date;

        if (isFirstPayment) {
            console.log(`🎉 First payment for restaurant: ${restaurant.name}`);

            // Update restaurant status
            await this.db.restaurants.update(
                { id: restaurant.id },
                {
                    first_payment_date: new Date(),
                    last_payment_date: new Date(),
                    status: 'active',
                    payment_status: 'paid'
                }
            );

            // Create commission schedule
            if (restaurant.referred_by_influencer_id) {
                await this.commissionEngine.createSchedule(restaurant);
            }
        } else {
            // Update last payment date
            await this.db.restaurants.update(
                { id: restaurant.id },
                {
                    last_payment_date: new Date(),
                    payment_status: 'paid'
                }
            );

            // Process monthly commission
            if (restaurant.referred_by_influencer_id) {
                await this.commissionEngine.processMonthlyCommission(restaurant);
            }
        }
    }

    /**
     * Handle failed payment
     */
    async handlePaymentFailed(invoice) {
        console.warn(`❌ Payment failed: ${invoice.id}`);

        const restaurant = await this.db.restaurants.findOne({
            stripe_subscription_id: invoice.subscription
        });

        if (!restaurant) {
            return;
        }

        // Update payment status
        await this.db.restaurants.update(
            { id: restaurant.id },
            {
                payment_status: 'failed'
            }
        );

        // TODO: Send notification email
        // TODO: Pause commission accrual?
    }

    /**
     * Handle subscription cancelled
     */
    async handleSubscriptionCancelled(subscription) {
        console.log(`🚫 Subscription cancelled: ${subscription.id}`);

        const restaurant = await this.db.restaurants.findOne({
            stripe_subscription_id: subscription.id
        });

        if (!restaurant) {
            return;
        }

        // Update restaurant status
        await this.db.restaurants.update(
            { id: restaurant.id },
            {
                status: 'cancelled',
                cancellation_date: new Date()
            }
        );

        // Update influencer count
        if (restaurant.referred_by_influencer_id) {
            const influencer = await this.db.influencers.findById(
                restaurant.referred_by_influencer_id
            );

            await this.db.influencers.update(
                { id: influencer.id },
                {
                    active_referrals: Math.max(0, influencer.active_referrals - 1),
                    cancelled_referrals: influencer.cancelled_referrals + 1
                }
            );
        }

        // Cancel pending commissions
        await this.commissionEngine.cancelPendingCommissions(restaurant.id);
    }

    /**
     * Handle subscription updated (tier change, etc.)
     */
    async handleSubscriptionUpdated(subscription) {
        const restaurant = await this.db.restaurants.findOne({
            stripe_subscription_id: subscription.id
        });

        if (!restaurant) {
            return;
        }

        // Extract new tier from subscription items
        const newPriceId = subscription.items.data[0]?.price.id;
        const newTier = Object.keys(this.PRICE_IDS).find(
            tier => this.PRICE_IDS[tier] === newPriceId
        );

        if (newTier && newTier !== restaurant.tier) {
            console.log(`🔄 Tier changed: ${restaurant.tier} → ${newTier}`);

            await this.db.restaurants.update(
                { id: restaurant.id },
                {
                    tier: newTier,
                    monthly_price: this.TIER_PRICES[newTier]
                }
            );
        }
    }

    /**
     * Cancel subscription
     */
    async cancelSubscription(restaurantId) {
        const restaurant = await this.db.restaurants.findById(restaurantId);

        if (!restaurant || !restaurant.stripe_subscription_id) {
            throw new Error('No active subscription found');
        }

        try {
            await stripe.subscriptions.cancel(restaurant.stripe_subscription_id);

            await this.db.restaurants.update(
                { id: restaurantId },
                {
                    status: 'cancelled',
                    cancellation_date: new Date()
                }
            );

            return { success: true };
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
            throw error;
        }
    }

    /**
     * Update payment method
     */
    async updatePaymentMethod(restaurantId, paymentMethodId) {
        const restaurant = await this.db.restaurants.findById(restaurantId);

        if (!restaurant || !restaurant.stripe_customer_id) {
            throw new Error('Customer not found');
        }

        try {
            // Attach payment method to customer
            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: restaurant.stripe_customer_id
            });

            // Set as default
            await stripe.customers.update(restaurant.stripe_customer_id, {
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            });

            return { success: true };
        } catch (error) {
            console.error('Failed to update payment method:', error);
            throw error;
        }
    }
}

module.exports = PaymentProcessor;
