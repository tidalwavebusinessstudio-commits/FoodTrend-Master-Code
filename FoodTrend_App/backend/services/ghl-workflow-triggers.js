/**
 * GHL Workflow Triggers Service
 * Automates GoHighLevel workflow triggering for key events
 * 
 * Workflows to configure in GHL:
 * 1. Restaurant Onboarding Sequence - Welcome emails for new restaurants
 * 2. 48-Hour Content Reminder - Deadline warning for influencers
 * 3. Review Request Flow - Post-visit review prompts
 * 4. Milestone Celebration - Achievement notifications
 */

const GHL_API_BASE = 'https://rest.gohighlevel.com/v1';
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// Tags that trigger GHL workflows (workflows are configured to trigger on tag addition)
const WORKFLOW_TAGS = {
    restaurantOnboarding: 'restaurant-new',
    influencerOnboarding: 'influencer-new',
    contentPending: 'content-pending',
    contentDelivered: 'content-delivered',
    urgentReminder: 'content-urgent'
};

/**
 * Add a tag to a GHL contact (triggers workflow if configured)
 * @param {string} contactId - GHL contact ID
 * @param {string} tag - Tag to add
 */
async function addTagToContact(contactId, tag) {
    if (!GHL_API_KEY) {
        console.warn('GHL API key not configured');
        return null;
    }

    try {
        const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tags: [tag]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GHL API error: ${response.status} - ${error}`);
        }

        console.log(`✅ Tag "${tag}" added to contact ${contactId}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to add tag to contact:', error);
        return null;
    }
}

/**
 * Add a contact to a GHL workflow by ID (legacy method)
 * @param {string} contactId - GHL contact ID
 * @param {string} workflowId - GHL workflow ID
 */
async function addToWorkflow(contactId, workflowId) {
    if (!GHL_API_KEY || !workflowId) {
        console.warn('GHL workflow not configured:', { contactId, workflowId });
        return null;
    }

    try {
        const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}/workflow/${workflowId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GHL API error: ${response.status} - ${error}`);
        }

        console.log(`✅ Contact ${contactId} added to workflow ${workflowId}`);
        return await response.json();
    } catch (error) {
        console.error('Failed to add contact to workflow:', error);
        return null;
    }
}

/**
 * Trigger restaurant onboarding sequence
 * Called when a new restaurant signs up
 */
async function triggerRestaurantOnboarding(ghlContactId, restaurantData) {
    console.log(`🍔 Triggering restaurant onboarding for: ${restaurantData.name}`);

    // Update contact with custom fields first
    await updateContactFields(ghlContactId, {
        'restaurant_name': restaurantData.name,
        'subscription_tier': restaurantData.tier || 'starter',
        'onboarding_started': new Date().toISOString()
    });

    return addTagToContact(ghlContactId, WORKFLOW_TAGS.restaurantOnboarding);
}

/**
 * Trigger 48-hour content reminder
 * Called when an influencer is approaching their content deadline
 */
async function trigger48HourReminder(ghlContactId, visitData) {
    console.log(`⏰ Triggering 48hr reminder for visit: ${visitData.id}`);

    await updateContactFields(ghlContactId, {
        'pending_restaurant': visitData.restaurantName,
        'content_deadline': visitData.deadline,
        'visit_date': visitData.visitDate
    });

    return addTagToContact(ghlContactId, WORKFLOW_TAGS.contentPending);
}

/**
 * Trigger urgent reminder (last 6 hours)
 */
async function triggerUrgentReminder(ghlContactId, visitData) {
    console.log(`🚨 Triggering URGENT reminder for visit: ${visitData.id}`);

    await updateContactFields(ghlContactId, {
        'urgent_deadline': visitData.deadline,
        'hours_remaining': visitData.hoursRemaining
    });

    return addTagToContact(ghlContactId, WORKFLOW_TAGS.urgentReminder);
}

/**
 * Trigger review request after content submission
 */
async function triggerReviewRequest(ghlContactId, contentData) {
    console.log(`⭐ Triggering review request for: ${contentData.restaurantName}`);

    await updateContactFields(ghlContactId, {
        'last_content_restaurant': contentData.restaurantName,
        'last_content_date': new Date().toISOString(),
        'content_tiktok_url': contentData.tiktokUrl,
        'content_instagram_url': contentData.instagramUrl
    });

    return addTagToContact(ghlContactId, WORKFLOW_TAGS.contentDelivered);
}

/**
 * Trigger milestone celebration
 * @param {string} milestone - e.g., 'first_content', '10_posts', '100k_views'
 */
async function triggerMilestone(ghlContactId, milestone, data = {}) {
    console.log(`🎉 Triggering milestone: ${milestone}`);

    await updateContactFields(ghlContactId, {
        'latest_milestone': milestone,
        'milestone_date': new Date().toISOString(),
        ...data
    });

    return addTagToContact(ghlContactId, `milestone-${milestone}`);
}

/**
 * Update contact custom fields in GHL
 */
async function updateContactFields(contactId, fields) {
    if (!GHL_API_KEY) return null;

    try {
        const response = await fetch(`${GHL_API_BASE}/contacts/${contactId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customField: fields })
        });

        if (!response.ok) {
            console.warn('Failed to update contact fields');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating contact fields:', error);
        return null;
    }
}

/**
 * Check for pending content deadlines and trigger reminders
 * Run this as a scheduled cron job
 */
async function checkContentDeadlines(supabase) {
    console.log('🔄 Checking content deadlines...');

    // Get visits approaching deadline (within 48 hours)
    const { data: pendingVisits, error } = await supabase
        .from('creator_visits')
        .select(`
            id,
            influencer_id,
            restaurant_id,
            posting_deadline,
            visit_date,
            reminder_sent,
            urgent_reminder_sent,
            influencer:influencer_id (ghl_contact_id, full_name),
            restaurant:restaurant_id (name)
        `)
        .eq('content_posted', false)
        .gt('posting_deadline', new Date().toISOString())
        .order('posting_deadline', { ascending: true });

    if (error) {
        console.error('Error fetching pending visits:', error);
        return;
    }

    const now = Date.now();

    for (const visit of pendingVisits || []) {
        const deadline = new Date(visit.posting_deadline).getTime();
        const hoursRemaining = (deadline - now) / (1000 * 60 * 60);

        const ghlContactId = visit.influencer?.ghl_contact_id;
        if (!ghlContactId) continue;

        const visitData = {
            id: visit.id,
            restaurantName: visit.restaurant?.name,
            deadline: visit.posting_deadline,
            visitDate: visit.visit_date,
            hoursRemaining: Math.round(hoursRemaining)
        };

        // Send urgent reminder (< 6 hours remaining)
        if (hoursRemaining <= 6 && !visit.urgent_reminder_sent) {
            await triggerUrgentReminder(ghlContactId, visitData);
            await supabase
                .from('creator_visits')
                .update({ urgent_reminder_sent: true })
                .eq('id', visit.id);
        }
        // Send 48hr reminder (< 48 hours remaining)
        else if (hoursRemaining <= 48 && !visit.reminder_sent) {
            await trigger48HourReminder(ghlContactId, visitData);
            await supabase
                .from('creator_visits')
                .update({ reminder_sent: true })
                .eq('id', visit.id);
        }
    }

    console.log(`✅ Deadline check complete. Processed ${pendingVisits?.length || 0} visits.`);
}

/**
 * Trigger influencer onboarding sequence
 * Called when a new influencer signs up
 */
async function triggerInfluencerOnboarding(ghlContactId, influencerData) {
    console.log(`🎥 Triggering influencer onboarding for: ${influencerData.full_name || influencerData.name}`);

    // Update contact with custom fields first
    await updateContactFields(ghlContactId, {
        'influencer_name': influencerData.full_name || influencerData.name,
        'tiktok_handle': influencerData.tiktok_handle || '',
        'instagram_handle': influencerData.instagram_handle || '',
        'onboarding_started': new Date().toISOString()
    });

    return addTagToContact(ghlContactId, WORKFLOW_TAGS.influencerOnboarding);
}

module.exports = {
    triggerRestaurantOnboarding,
    triggerInfluencerOnboarding,
    trigger48HourReminder,
    triggerUrgentReminder,
    triggerReviewRequest,
    triggerMilestone,
    updateContactFields,
    checkContentDeadlines,
    addTagToContact,
    addToWorkflow,
    WORKFLOW_TAGS
};
