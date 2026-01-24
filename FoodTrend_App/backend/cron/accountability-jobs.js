/**
 * Cron Jobs for Accountability System
 * Automated scheduling for performance monitoring and metrics updates
 */

const cron = require('node-cron');
const PerformanceMonitor = require('../services/performance-monitor');
const ContentSubmission = require('../services/content-submission');
const InfluencerEnrichment = require('../services/influencer-enrichment');

console.log('[Cron] Initializing accountability system scheduled jobs...');

// ============================================
// HOURLY: Check compliance deadlines
// Flags visits that have passed 48-hour deadline
// ============================================
cron.schedule('0 * * * *', async () => {
    console.log('\n[Cron] Running hourly compliance check...');
    try {
        const result = await PerformanceMonitor.checkComplianceDeadlines();
        console.log(`[Cron] Compliance check complete: ${result.flagged} visits flagged`);
    } catch (error) {
        console.error('[Cron Error] Compliance deadline check failed:', error);
    }
});

// ============================================
// HOURLY: Check warning period expirations
// Issues strikes for influencers who didn't submit after 24hr warning
// ============================================
cron.schedule('0 * * * *', async () => {
    console.log('\n[Cron] Checking warning compliance...');
    try {
        const result = await PerformanceMonitor.checkWarningCompliance();
        console.log(`[Cron] Warning compliance check complete: ${result.strikesIssued} strikes issued`);
    } catch (error) {
        console.error('[Cron Error] Warning compliance check failed:', error);
    }
});

// ============================================
// HOURLY: Influencer enrichment & GHL sync
// Pulls social metrics and syncs influencer data to GoHighLevel
// ============================================
cron.schedule('30 * * * *', async () => {
    console.log('\n[Cron] Running influencer enrichment batch...');
    try {
        const locationId = process.env.GHL_LOCATION_ID;
        if (!locationId) {
            console.log('[Cron] GHL_LOCATION_ID not set, skipping enrichment');
            return;
        }
        // Note: db connection should be injected or imported
        const result = await InfluencerEnrichment.runEnrichmentBatch(global.db, locationId);
        console.log(`[Cron] Enrichment complete: ${result.success}/${result.processed} synced to GHL`);
    } catch (error) {
        console.error('[Cron Error] Influencer enrichment failed:', error);
    }
});

// ============================================
// EVERY 6 HOURS: Update content metrics
// Fetches latest views/likes/comments from TikTok/Instagram APIs
// ============================================
cron.schedule('0 */6 * * *', async () => {
    console.log('\n[Cron] Updating content metrics...');
    try {
        const result = await ContentSubmission.updateAllMetrics();
        console.log(`[Cron] Metrics update complete: ${result.success}/${result.total} successful`);
    } catch (error) {
        console.error('[Cron Error] Metrics update failed:', error);
    }
});

// ============================================
// DAILY 9 AM: Send performance summaries
// Emails influencers with pending visits and performance stats
// ============================================
cron.schedule('0 9 * * *', async () => {
    console.log('\n[Cron] Sending daily performance summaries...');
    try {
        await PerformanceMonitor.sendDailySummaries();
        console.log('[Cron] Daily summaries sent successfully');
    } catch (error) {
        console.error('[Cron Error] Daily summaries failed:', error);
    }
});

// ============================================
// DAILY 6 AM: Check suspension expirations
// Reinstates influencers whose suspension period has ended
// ============================================
cron.schedule('0 6 * * *', async () => {
    console.log('\n[Cron] Checking suspension expirations...');
    try {
        const result = await PerformanceMonitor.checkSuspensionExpirations();
        console.log(`[Cron] Suspension check complete: ${result.reinstated} accounts reinstated`);
    } catch (error) {
        console.error('[Cron Error] Suspension expiration check failed:', error);
    }
});

// ============================================
// MANUAL TEST FUNCTION
// Run all jobs immediately for testing
// ============================================
async function runAllJobsNow() {
    console.log('\n[Manual Test] Running all jobs immediately...\n');

    try {
        console.log('1. Compliance deadlines...');
        await PerformanceMonitor.checkComplianceDeadlines();

        console.log('\n2. Warning compliance...');
        await PerformanceMonitor.checkWarningCompliance();

        console.log('\n3. Updating metrics...');
        await ContentSubmission.updateAllMetrics();

        console.log('\n4. Checking suspensions...');
        await PerformanceMonitor.checkSuspensionExpirations();

        console.log('\n[Manual Test] All jobs completed!');
    } catch (error) {
        console.error('[Manual Test Error]:', error);
    }
}

// Export for manual testing
module.exports = {
    runAllJobsNow
};

console.log('[Cron] All accountability system jobs scheduled successfully!\n');
console.log('Schedule:');
console.log('  - Hourly: Compliance checks + Warning checks');
console.log('  - Every 6 hours: Metrics updates');
console.log('  - Daily 6 AM: Suspension expirations');
console.log('  - Daily 9 AM: Performance summaries\n');
