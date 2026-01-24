/**
 * Gig Sync Service
 * Mirrors FoodTrend gigs to GoHighLevel Opportunities (pipeline: "Gigs")
 * Triggers influencer notification workflow on publish
 * 
 * SYSTEM CONTRACT COMPLIANCE:
 * - D2: Gig Publish → Influencer Alert
 * - R5: ID Glue required (ft_gig_id)
 * - R7: Upsert pattern (order tolerance)
 */

const ghlService = require('./ghl-integration');

// ===========================================
// GHL OPPORTUNITIES API HELPERS
// ===========================================

/**
 * Find existing opportunity by ft_gig_id custom field
 */
async function findOpportunityByGigId(locationId, gigId) {
    try {
        // Search opportunities with custom field filter
        const result = await ghlService.ghlRequest(
            'GET',
            `/opportunities/search?locationId=${locationId}&customFields.ft_gig_id=${gigId}`
        );
        return result.opportunities?.[0] || null;
    } catch (error) {
        console.error(`[GigSync] Find opportunity error:`, error.message);
        return null;
    }
}

/**
 * Upsert a gig as an Opportunity in GHL "Gigs" pipeline
 * Per contract §4.1: Default to Opportunities in pipeline "Gigs"
 */
async function upsertGigOpportunity(locationId, pipelineId, gig) {
    const existing = await findOpportunityByGigId(locationId, gig.id);

    const payload = {
        locationId,
        pipelineId,
        name: gig.title || `Gig: ${gig.id}`,
        status: gig.status === 'published' ? 'open' : 'paused',
        monetaryValue: gig.budget || 0,
        customFields: [
            { key: 'ft_gig_id', value: gig.id },
            { key: 'ft_restaurant_id', value: gig.restaurant_id || '' },
            { key: 'gig_type', value: gig.gig_type || '' },
            { key: 'visit_date', value: gig.visit_date || '' },
            { key: 'posting_deadline', value: gig.posting_deadline || '' },
            { key: 'requirements', value: gig.requirements || '' },
            { key: 'media_url', value: gig.media_url || '' }
        ]
    };

    try {
        if (existing) {
            // Update existing opportunity
            const result = await ghlService.ghlRequest(
                'PUT',
                `/opportunities/${existing.id}`,
                payload
            );
            console.log(`[GigSync] Updated opportunity ${existing.id} for gig ${gig.id}`);
            return { success: true, opportunityId: existing.id, action: 'updated' };
        } else {
            // Create new opportunity
            const result = await ghlService.ghlRequest(
                'POST',
                '/opportunities/',
                payload
            );
            console.log(`[GigSync] Created opportunity ${result.opportunity?.id} for gig ${gig.id}`);
            return { success: true, opportunityId: result.opportunity?.id, action: 'created' };
        }
    } catch (error) {
        console.error(`[GigSync] Upsert opportunity error for gig ${gig.id}:`, error.message);
        return { success: false, error: error.message };
    }
}

// ===========================================
// INFLUENCER NOTIFICATION WORKFLOW
// ===========================================

/**
 * Trigger GHL workflow to notify influencers about a new gig
 * Per contract D2: Fire workflow that notifies influencers (segmented by tags)
 */
async function triggerInfluencerNotification(locationId, workflowId, gig) {
    if (!workflowId) {
        console.log('[GigSync] No workflow ID configured, skipping notification');
        return { success: false, error: 'No workflow ID configured' };
    }

    try {
        // Trigger workflow with gig context
        const result = await ghlService.ghlRequest(
            'POST',
            `/workflows/${workflowId}/trigger`,
            {
                locationId,
                // Pass gig data as workflow context
                customData: {
                    gig_id: gig.id,
                    gig_title: gig.title,
                    restaurant_name: gig.restaurant_name,
                    budget: gig.budget,
                    visit_date: gig.visit_date,
                    gig_type: gig.gig_type
                },
                // Target contacts with Influencer tag
                contactFilters: {
                    tags: ['Influencer']
                }
            }
        );

        console.log(`[GigSync] Triggered influencer notification workflow for gig ${gig.id}`);
        return { success: true, workflowExecutionId: result.executionId };
    } catch (error) {
        console.error(`[GigSync] Notification workflow error:`, error.message);
        return { success: false, error: error.message };
    }
}

// ===========================================
// MAIN SYNC FUNCTIONS
// ===========================================

/**
 * Sync a single gig to GHL (upsert + optional notification)
 */
async function syncGigToGHL(db, gig, options = {}) {
    const locationId = process.env.GHL_LOCATION_ID;
    const pipelineId = process.env.GHL_GIGS_PIPELINE_ID;
    const workflowId = process.env.GHL_INFLUENCER_NOTIFICATION_WORKFLOW_ID;

    if (!locationId || !pipelineId) {
        console.error('[GigSync] Missing GHL_LOCATION_ID or GHL_GIGS_PIPELINE_ID');
        return { success: false, error: 'Missing configuration' };
    }

    // 1. Upsert opportunity
    const upsertResult = await upsertGigOpportunity(locationId, pipelineId, gig);

    if (!upsertResult.success) {
        return upsertResult;
    }

    // 2. Store GHL opportunity ID in FoodTrend DB
    if (upsertResult.opportunityId) {
        try {
            await db.query(
                'UPDATE gigs SET ghl_opportunity_id = $1, ghl_synced_at = NOW() WHERE id = $2',
                [upsertResult.opportunityId, gig.id]
            );
        } catch (dbError) {
            console.error('[GigSync] DB update error:', dbError.message);
        }
    }

    // 3. Trigger notification if gig is being published
    let notificationResult = null;
    if (options.triggerNotification && gig.status === 'published') {
        notificationResult = await triggerInfluencerNotification(locationId, workflowId, gig);
    }

    return {
        success: true,
        opportunityId: upsertResult.opportunityId,
        action: upsertResult.action,
        notification: notificationResult
    };
}

/**
 * Handle gig publish event (called from webhook or frontend action)
 */
async function handleGigPublish(db, gigId) {
    // Fetch full gig data
    const result = await db.query(`
    SELECT g.*, r.name as restaurant_name
    FROM gigs g
    LEFT JOIN restaurants r ON r.id = g.restaurant_id
    WHERE g.id = $1
  `, [gigId]);

    const gig = result.rows[0];
    if (!gig) {
        return { success: false, error: 'Gig not found' };
    }

    // Sync to GHL with notification trigger
    return await syncGigToGHL(db, gig, { triggerNotification: true });
}

/**
 * Handle gig update event (no notification)
 */
async function handleGigUpdate(db, gigId) {
    const result = await db.query(`
    SELECT g.*, r.name as restaurant_name
    FROM gigs g
    LEFT JOIN restaurants r ON r.id = g.restaurant_id
    WHERE g.id = $1
  `, [gigId]);

    const gig = result.rows[0];
    if (!gig) {
        return { success: false, error: 'Gig not found' };
    }

    // Sync to GHL without notification
    return await syncGigToGHL(db, gig, { triggerNotification: false });
}

module.exports = {
    findOpportunityByGigId,
    upsertGigOpportunity,
    triggerInfluencerNotification,
    syncGigToGHL,
    handleGigPublish,
    handleGigUpdate
};
