/**
 * GHL Custom Field Auto-Creator
 * Run this script ONCE to create all FoodTrend custom fields in GoHighLevel
 * 
 * Usage:
 *   1. Set GHL_API_KEY and GHL_LOCATION_ID in .env
 *   2. Run: node scripts/create-ghl-fields.js
 */

require('dotenv').config();

const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const API_KEY = process.env.GHL_API_KEY || process.env.GHL_ACCESS_TOKEN;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!API_KEY || !LOCATION_ID) {
    console.error('❌ Missing GHL_API_KEY or GHL_LOCATION_ID in .env');
    process.exit(1);
}

// All custom fields to create
const CUSTOM_FIELDS = [
    // Influencer fields
    { name: 'FoodTrend ID', key: 'ft_influencer_id', dataType: 'TEXT', group: 'FoodTrend Influencer' },
    { name: 'TikTok Handle', key: 'tiktok_handle', dataType: 'TEXT', group: 'FoodTrend Influencer' },
    { name: 'Instagram Handle', key: 'instagram_handle', dataType: 'TEXT', group: 'FoodTrend Influencer' },
    { name: 'YouTube Handle', key: 'youtube_handle', dataType: 'TEXT', group: 'FoodTrend Influencer' },
    { name: 'Followers Count', key: 'followers_count', dataType: 'NUMERICAL', group: 'FoodTrend Influencer' },
    { name: 'Engagement Rate', key: 'engagement_rate', dataType: 'NUMERICAL', group: 'FoodTrend Influencer' },
    { name: 'Experience Level', key: 'experience_level', dataType: 'TEXT', group: 'FoodTrend Influencer' },
    { name: 'Total Earnings', key: 'total_earnings', dataType: 'NUMERICAL', group: 'FoodTrend Influencer' },
    { name: 'Pending Restaurant', key: 'pending_restaurant', dataType: 'TEXT', group: 'FoodTrend Influencer' },
    { name: 'Content Deadline', key: 'content_deadline', dataType: 'DATE', group: 'FoodTrend Influencer' },
    { name: 'Hours Remaining', key: 'hours_remaining', dataType: 'NUMERICAL', group: 'FoodTrend Influencer' },

    // Restaurant fields
    { name: 'Restaurant ID', key: 'ft_restaurant_id', dataType: 'TEXT', group: 'FoodTrend Restaurant' },
    { name: 'Stripe Customer ID', key: 'ft_stripe_customer_id', dataType: 'TEXT', group: 'FoodTrend Restaurant' },
    { name: 'Subscription Tier', key: 'tier', dataType: 'TEXT', group: 'FoodTrend Restaurant' },
    { name: 'Monthly Price', key: 'monthly_price', dataType: 'NUMERICAL', group: 'FoodTrend Restaurant' }
];

async function createCustomField(field) {
    try {
        const response = await fetch(`${GHL_API_BASE}/locations/${LOCATION_ID}/customFields`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify({
                name: field.name,
                fieldKey: field.key,
                dataType: field.dataType,
                model: 'contact',
                placeholder: field.name
            })
        });

        if (response.status === 201 || response.status === 200) {
            console.log(`✅ Created: ${field.name}`);
            return true;
        } else if (response.status === 422) {
            console.log(`⚠️  Already exists: ${field.name}`);
            return true;
        } else {
            const error = await response.text();
            console.error(`❌ Failed: ${field.name} - ${response.status}: ${error}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error creating ${field.name}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 Creating GHL Custom Fields...\n');
    console.log(`📍 Location ID: ${LOCATION_ID}`);
    console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);
    console.log('─'.repeat(50));

    let created = 0;
    let failed = 0;

    for (const field of CUSTOM_FIELDS) {
        const success = await createCustomField(field);
        if (success) created++;
        else failed++;

        // Rate limiting - wait 200ms between requests
        await new Promise(r => setTimeout(r, 200));
    }

    console.log('─'.repeat(50));
    console.log(`\n✅ Created: ${created}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed === 0) {
        console.log('\n🎉 All custom fields created successfully!');
    }
}

main();
