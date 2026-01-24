/**
 * Performance Monitor Service
 * Enforces 48-hour posting requirement with automated flagging and strike system
 */

const db = require('../database/connection');
const emailService = require('./email-service');

class PerformanceMonitor {

    /**
     * Main compliance check - runs every hour via cron
     * Checks for visits that have passed the 48-hour posting deadline
     */
    async checkComplianceDeadlines() {
        const now = new Date();

        console.log(`[Performance Monitor] Running compliance check at ${now.toISOString()}`);

        // Find visits where posting deadline has passed
        // and posts have not been submitted on both platforms
        const overdueVisits = await db.query(`
      SELECT 
        cv.*,
        i.name as influencer_name,
        i.email as influencer_email,
        r.name as restaurant_name
      FROM creator_visits cv
      JOIN influencers i ON i.id = cv.influencer_id
      JOIN restaurants r ON r.id = cv.restaurant_id
      WHERE cv.posting_deadline < ?
      AND cv.status = 'completed'
      AND (cv.tiktok_posted = FALSE OR cv.instagram_posted = FALSE)
      AND i.suspended = FALSE
      AND i.removed = FALSE
    `, [now]);

        console.log(`[Performance Monitor] Found ${overdueVisits.length} overdue visits`);

        for (const visit of overdueVisits) {
            try {
                await this.flagVisit(visit);
            } catch (error) {
                console.error(`Error flagging visit ${visit.id}:`, error);
            }
        }

        return {
            checked: overdueVisits.length,
            flagged: overdueVisits.length
        };
    }

    /**
     * Flag a visit as non-compliant
     * Sends warning email and sets 24-hour grace period
     */
    async flagVisit(visit) {
        console.log(`[Flagging] Visit ${visit.id} for ${visit.influencer_name} at ${visit.restaurant_name}`);

        // Update visit status to flagged
        await db.query(`
      UPDATE creator_visits
      SET status = 'flagged',
          flagged_at = NOW()
      WHERE id = ?
    `, [visit.id]);

        // Update influencer flagged visits count
        await db.query(`
      UPDATE influencers
      SET flagged_visits = flagged_visits + 1
      WHERE id = ?
    `, [visit.influencer_id]);

        // Send urgent warning email
        await this.sendWarningEmail(visit);

        // Schedule removal check for 24 hours from now
        // (This will be handled by checkWarningCompliance)

        return {
            success: true,
            visitId: visit.id,
            flaggedAt: new Date()
        };
    }

    /**
     * Send warning email to influencer
     * Email includes urgency, deadline, and current strike count
     */
    async sendWarningEmail(visit) {
        const warningDeadline = new Date(visit.flagged_at || new Date());
        warningDeadline.setHours(warningDeadline.getHours() + 24);

        const strikeCount = await this.getActiveStrikeCount(visit.influencer_id);

        const emailData = {
            to: visit.influencer_email,
            subject: '⚠️ URGENT: Content Submission Deadline Missed - 24 Hour Warning',
            template: 'influencer-warning',
            data: {
                influencerName: visit.influencer_name,
                restaurantName: visit.restaurant_name,
                visitDate: new Date(visit.visit_date).toLocaleDateString(),
                originalDeadline: new Date(visit.posting_deadline).toLocaleString(),
                finalDeadline: warningDeadline.toLocaleString(),
                hoursRemaining: 24,
                strikeCount: strikeCount,
                nextStrikeConsequence: this.getStrikeConsequence(strikeCount + 1),
                dashboardUrl: `${process.env.BASE_URL}/creator/submit-content`,
                tiktokRequired: !visit.tiktok_posted,
                instagramRequired: !visit.instagram_posted
            }
        };

        try {
            await emailService.send(emailData);

            // Mark warning as sent
            await db.query(`
        UPDATE creator_visits
        SET warning_sent_at = NOW(),
            status = 'warning_sent'
        WHERE id = ?
      `, [visit.id]);

            console.log(`[Warning Email] Sent to ${visit.influencer_email} for visit ${visit.id}`);
        } catch (error) {
            console.error(`Error sending warning email for visit ${visit.id}:`, error);
        }
    }

    /**
     * Check if influencers submitted content after receiving warning
     * Runs every hour - looks for warnings sent 24+ hours ago
     */
    async checkWarningCompliance() {
        const cutoffTime = new Date();
        cutoffTime.setHours(cutoffTime.getHours() - 24);

        console.log(`[Warning Compliance] Checking warnings sent before ${cutoffTime.toISOString()}`);

        // Find visits in warning_sent status that haven't been resolved
        const failedVisits = await db.query(`
      SELECT 
        cv.*,
        i.name as influencer_name,
        i.email as influencer_email,
        r.name as restaurant_name
      FROM creator_visits cv
      JOIN influencers i ON i.id = cv.influencer_id
      JOIN restaurants r ON r.id = cv.restaurant_id
      WHERE cv.status = 'warning_sent'
      AND cv.warning_sent_at < ?
      AND (cv.tiktok_posted = FALSE OR cv.instagram_posted = FALSE)
    `, [cutoffTime]);

        console.log(`[Warning Compliance] Found ${failedVisits.length} failed compliance checks`);

        for (const visit of failedVisits) {
            try {
                await this.issueStrike(visit);
            } catch (error) {
                console.error(`Error issuing strike for visit ${visit.id}:`, error);
            }
        }

        return {
            checked: failedVisits.length,
            strikesIssued: failedVisits.length
        };
    }

    /**
     * Issue a performance strike
     * Creates strike record and applies consequences based on strike count
     */
    async issueStrike(visit) {
        console.log(`[Strike] Issuing strike for ${visit.influencer_name} - Visit ${visit.id}`);

        // Get current strike count
        const influencer = await db.query(
            `SELECT * FROM influencers WHERE id = ?`,
            [visit.influencer_id]
        );

        const currentStrikes = influencer.strike_count || 0;
        const newStrikeCount = currentStrikes + 1;

        // Create strike record
        const strike = await db.query(`
      INSERT INTO performance_strikes
      (influencer_id, creator_visit_id, restaurant_id, strike_type, severity, reason, issued_at)
      VALUES (?, ?, ?, 'missed_deadline', 'major', 
        'Failed to post content within 48 hours + 24 hour grace period', NOW())
    `, [visit.influencer_id, visit.id, visit.restaurant_id]);

        // Update visit status to failed
        await db.query(`
      UPDATE creator_visits
      SET status = 'failed'
      WHERE id = ?
    `, [visit.id]);

        // Update influencer stats
        await db.query(`
      UPDATE influencers
      SET strike_count = ?,
          failed_visits = failed_visits + 1
      WHERE id = ?
    `, [newStrikeCount, visit.influencer_id]);

        // Apply consequences based on strike count
        let consequence;

        if (newStrikeCount === 1) {
            // First strike: Warning only
            consequence = await this.sendStrikeWarning(influencer, strike, 1);
        } else if (newStrikeCount === 2) {
            // Second strike: 7-day suspension
            consequence = await this.suspendInfluencer(influencer, 7, 'Second strike - repeated non-compliance');
        } else if (newStrikeCount >= 3) {
            // Third strike: Permanent removal
            consequence = await this.removeInfluencer(influencer, 'Three strikes - consistent failure to meet posting requirements');
        }

        console.log(`[Strike] Strike #${newStrikeCount} issued. Consequence: ${consequence?.action || 'warning'}`);

        return {
            success: true,
            strikeId: strike.insertId,
            strikeCount: newStrikeCount,
            consequence: consequence
        };
    }

    /**
     * Send strike warning email (1st strike)
     */
    async sendStrikeWarning(influencer, strike, strikeNumber) {
        await emailService.send({
            to: influencer.email,
            subject: `⚠️ Strike #${strikeNumber} Issued - Performance Warning`,
            template: 'strike-warning',
            data: {
                influencerName: influencer.name,
                strikeNumber: strikeNumber,
                totalStrikes: 3,
                nextConsequence: 'Second strike will result in a 7-day account suspension',
                improvementUrl: `${process.env.BASE_URL}/creator/dashboard`,
                supportUrl: `${process.env.BASE_URL}/support`
            }
        });

        return {
            action: 'warning_sent',
            email: influencer.email
        };
    }

    /**
     * Suspend influencer account for X days
     */
    async suspendInfluencer(influencer, days, reason) {
        const suspensionEnd = new Date();
        suspensionEnd.setDate(suspensionEnd.getDate() + days);

        console.log(`[Suspension] Suspending ${influencer.name} for ${days} days until ${suspensionEnd.toISOString()}`);

        await db.query(`
      UPDATE influencers
      SET suspended = TRUE,
          suspension_end_date = ?,
          status = 'suspended'
      WHERE id = ?
    `, [suspensionEnd, influencer.id]);

        // Update the strike record
        await db.query(`
      UPDATE performance_strikes
      SET suspension_applied = TRUE,
          suspension_days = ?,
          suspension_end_date = ?
      WHERE influencer_id = ?
      AND resolved = FALSE
      ORDER BY issued_at DESC
      LIMIT 1
    `, [days, suspensionEnd, influencer.id]);

        // Send suspension notification email
        await emailService.send({
            to: influencer.email,
            subject: '🚫 Account Suspended - Action Required',
            template: 'suspension-notice',
            data: {
                influencerName: influencer.name,
                reason: reason,
                suspensionDays: days,
                suspensionEnd: suspensionEnd.toLocaleDateString(),
                strikeCount: influencer.strike_count + 1,
                reinstatementUrl: `${process.env.BASE_URL}/creator/reinstatement`,
                appealUrl: `${process.env.BASE_URL}/creator/appeal`
            }
        });

        return {
            action: 'suspended',
            days: days,
            until: suspensionEnd
        };
    }

    /**
     * Permanently remove influencer from platform
     */
    async removeInfluencer(influencer, reason) {
        console.log(`[Removal] Permanently removing ${influencer.name} - Reason: ${reason}`);

        await db.query(`
      UPDATE influencers
      SET removed = TRUE,
          removed_reason = ?,
          removed_at = NOW(),
          status = 'removed',
          suspended = TRUE
      WHERE id = ?
    `, [reason, influencer.id]);

        // Cancel all pending commissions
        await db.query(`
      UPDATE commissions
      SET status = 'cancelled',
          notes = 'Influencer removed from platform for performance violations'
      WHERE influencer_id = ?
      AND status IN ('scheduled', 'ready_for_payout')
    `, [influencer.id]);

        // Update the strike record
        await db.query(`
      UPDATE performance_strikes
      SET removed_from_platform = TRUE
      WHERE influencer_id = ?
      AND resolved = FALSE
      ORDER BY issued_at DESC
      LIMIT 1
    `, [influencer.id]);

        // Send removal notification email
        await emailService.send({
            to: influencer.email,
            subject: 'Account Removed from FoodTrend',
            template: 'account-removal',
            data: {
                influencerName: influencer.name,
                reason: reason,
                strikeCount: 3,
                appealDeadline: this.getAppealDeadline(),
                appealUrl: `${process.env.BASE_URL}/appeal`,
                supportEmail: 'support@foodtrend.com'
            }
        });

        return {
            action: 'removed',
            reason: reason,
            commissionsCancel led: true
        };
    }

    /**
     * Check for expired suspensions and reinstate influencers
     * Runs daily
     */
    async checkSuspensionExpirations() {
        const now = new Date();

        const expiredSuspensions = await db.query(`
      SELECT * FROM influencers
      WHERE suspended = TRUE
      AND suspension_end_date <= ?
      AND removed = FALSE
    `, [now]);

        console.log(`[Suspension Check] Found ${expiredSuspensions.length} expired suspensions`);

        for (const influencer of expiredSuspensions) {
            await db.query(`
        UPDATE influencers
        SET suspended = FALSE,
            suspension_end_date = NULL,
            status = 'active'
        WHERE id = ?
      `, [influencer.id]);

            // Send reinstatement email
            await emailService.send({
                to: influencer.email,
                subject: '✅ Account Reinstated - Welcome Back!',
                template: 'reinstatement-notice',
                data: {
                    influencerName: influencer.name,
                    dashboardUrl: `${process.env.BASE_URL}/creator/dashboard`,
                    guidelinesUrl: `${process.env.BASE_URL}/creator/guidelines`,
                    currentStrikes: influencer.strike_count
                }
            });

            console.log(`[Reinstatement] ${influencer.name} reinstated after suspension expiration`);
        }

        return {
            reinstated: expiredSuspensions.length
        };
    }

    /**
     * Get active (unresolved) strike count for influencer
     */
    async getActiveStrikeCount(influencerId) {
        const result = await db.query(`
      SELECT COUNT(*) as count
      FROM performance_strikes
      WHERE influencer_id = ?
      AND resolved = FALSE
    `, [influencerId]);

        return result[0]?.count || 0;
    }

    /**
     * Determine consequence for next strike
     */
    getStrikeConsequence(strikeNumber) {
        switch (strikeNumber) {
            case 1:
                return 'Official warning';
            case 2:
                return '7-day account suspension';
            case 3:
                return 'PERMANENT removal from platform';
            default:
                return 'Account termination';
        }
    }

    /**
     * Get appeal deadline (30 days from removal)
     */
    getAppealDeadline() {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);
        return deadline.toLocaleDateString();
    }

    /**
     * Generate daily performance summary for all influencers
     */
    async sendDailySummaries() {
        const activeInfluencers = await db.query(`
      SELECT * FROM influencers
      WHERE status = 'active'
      AND removed = FALSE
    `);

        console.log(`[Daily Summary] Sending summaries to ${activeInfluencers.length} influencers`);

        for (const influencer of activeInfluencers) {
            try {
                const summary = await this.generateInfluencerSummary(influencer.id);

                // Only send if there are pending visits or important updates
                if (summary.pendingVisits > 0 || summary.flaggedVisits > 0) {
                    await emailService.send({
                        to: influencer.email,
                        subject: `📊 Your FoodTrend Performance Summary`,
                        template: 'daily-summary',
                        data: {
                            influencerName: influencer.name,
                            ...summary,
                            dashboardUrl: `${process.env.BASE_URL}/creator/dashboard`
                        }
                    });
                }
            } catch (error) {
                console.error(`Error sending summary to ${influencer.email}:`, error);
            }
        }
    }

    /**
     * Generate performance summary for an influencer
     */
    async generateInfluencerSummary(influencerId) {
        const visits = await db.query(`
      SELECT * FROM creator_visits
      WHERE influencer_id = ?
      AND status IN ('completed', 'flagged', 'warning_sent')
    `, [influencerId]);

        const submissions = await db.query(`
      SELECT SUM(view_count) as total_views
      FROM content_submissions
      WHERE influencer_id = ?
    `, [influencerId]);

        const pendingVisits = visits.filter(v => v.status === 'completed').length;
        const flaggedVisits = visits.filter(v => v.status === 'flagged' || v.status === 'warning_sent').length;

        return {
            pendingVisits: pendingVisits,
            flaggedVisits: flaggedVisits,
            totalViews: submissions[0]?.total_views || 0,
            complianceRate: await this.getComplianceRate(influencerId)
        };
    }

    /**
     * Get compliance rate for influencer
     */
    async getComplianceRate(influencerId) {
        const result = await db.query(`
      SELECT compliance_rate FROM influencers WHERE id = ?
    `, [influencerId]);

        return result[0]?.compliance_rate || 100;
    }
}

module.exports = new PerformanceMonitor();
