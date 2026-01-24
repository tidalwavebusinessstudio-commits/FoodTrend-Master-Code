/**
 * GHL Integration Service
 * Handles GoHighLevel API interactions for contact sync
 */

const REQUIRED_ENV = ['GHL_CLIENT_ID', 'GHL_CLIENT_SECRET', 'GHL_REDIRECT_URI'];

// Validate required environment variables
function validateEnv() {
    const missing = REQUIRED_ENV.filter(key => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

/**
 * Get GHL access token (from encrypted storage)
 */
async function getAccessToken() {
    // TODO: Implement token retrieval from Secret Manager
    // For now, return from environment (dev only)
    return process.env.GHL_ACCESS_TOKEN;
}

/**
 * Make authenticated request to GHL API
 */
async function ghlRequest(method, endpoint, body = null) {
    const token = await getAccessToken();
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`https://services.leadconnectorhq.com${endpoint}`, options);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`GHL API Error ${response.status}: ${error}`);
    }

    return response.json();
}

/**
 * Find existing contact by email
 */
async function findContactByEmail(locationId, email) {
    const result = await ghlRequest('GET', `/contacts/?locationId=${locationId}&query=${encodeURIComponent(email)}`);
    return result.contacts?.find(c => c.email === email) || null;
}

/**
 * Upsert an influencer contact in GHL
 * NOTE: Influencer data comes from `profiles` table in Supabase
 */
async function upsertInfluencerContact(locationId, influencer) {
    const existing = await findContactByEmail(locationId, influencer.email);

    const payload = {
        locationId,
        email: influencer.email,
        // profiles table uses full_name column
        firstName: influencer.full_name?.split(' ')[0] || influencer.name?.split(' ')[0] || '',
        lastName: influencer.full_name?.split(' ').slice(1).join(' ') || influencer.name?.split(' ').slice(1).join(' ') || '',
        phone: influencer.phone || '',
        tags: ['Influencer'],
        customFields: [
            { key: 'ft_influencer_id', value: influencer.id },
            { key: 'tiktok_handle', value: influencer.tiktok_handle || '' },
            { key: 'instagram_handle', value: influencer.instagram_handle || '' },
            { key: 'youtube_handle', value: influencer.youtube_handle || '' },
            { key: 'followers_count', value: String(influencer.follower_count || 0) },
            { key: 'youtube_subscribers', value: String(influencer.youtube_subscribers || 0) },
            { key: 'engagement_rate', value: String(influencer.engagement_rate || 0) },
            { key: 'experience_level', value: influencer.experience_level || '' },
            { key: 'hourly_rate', value: String(influencer.hourly_rate || 0) },
            { key: 'total_earnings', value: String(influencer.total_earnings || 0) },
            { key: 'missed_reviews', value: String(influencer.missed_reviews || 0) },
            { key: 'rescheduled_reviews', value: String(influencer.rescheduled_reviews || 0) }
        ]
    };

    // Add tier tag based on follower count
    const followers = influencer.follower_count || 0;
    if (followers >= 100000) {
        payload.tags.push('Macro');
    } else if (followers >= 10000) {
        payload.tags.push('Mid-Tier');
    } else {
        payload.tags.push('Micro');
    }

    if (existing) {
        return await ghlRequest('PUT', `/contacts/${existing.id}`, payload);
    } else {
        return await ghlRequest('POST', '/contacts/', payload);
    }
}

/**
 * Upsert a restaurant contact in GHL
 */
async function upsertRestaurantContact(locationId, restaurant) {
    const existing = await findContactByEmail(locationId, restaurant.email);

    const payload = {
        locationId,
        email: restaurant.email,
        firstName: restaurant.name,
        lastName: '',
        phone: restaurant.phone || '',
        address1: restaurant.address_line1 || '',
        city: restaurant.city || '',
        state: restaurant.state || '',
        postalCode: restaurant.zip_code || '',
        tags: ['Restaurant', restaurant.tier || 'momentum'],
        customFields: [
            { key: 'ft_restaurant_id', value: restaurant.id },
            { key: 'ft_stripe_customer_id', value: restaurant.stripe_customer_id || '' },
            { key: 'tier', value: restaurant.tier || '' },
            { key: 'monthly_price', value: String(restaurant.monthly_price || 0) }
        ]
    };

    if (existing) {
        return await ghlRequest('PUT', `/contacts/${existing.id}`, payload);
    } else {
        return await ghlRequest('POST', '/contacts/', payload);
    }
}

/**
 * Trigger a GHL workflow
 */
async function triggerWorkflow(contactId, workflowId) {
    return await ghlRequest('POST', `/contacts/${contactId}/workflow/${workflowId}`);
}

module.exports = {
    validateEnv,
    getAccessToken,
    ghlRequest,
    findContactByEmail,
    upsertInfluencerContact,
    upsertRestaurantContact,
    triggerWorkflow
};
