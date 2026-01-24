/**
 * Webhook Receiver
 * Secure endpoints for Stripe and GHL webhooks
 */

const crypto = require('crypto');

// Stripe signature verification
function verifyStripeSignature(payload, signature, secret) {
    const timestamp = signature.split(',').find(p => p.startsWith('t='))?.split('=')[1];
    const sig = signature.split(',').find(p => p.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !sig) return false;

    // Check timestamp (reject if older than 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - parseInt(timestamp) > 300) return false;

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
}

// GHL signature verification
function verifyGHLSignature(headers, payload, secret) {
    const signature = headers['x-ghl-signature'] || headers['x-wh-signature'];
    if (!signature) return false;

    const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(payload))
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSig)
    );
}

// Check if event was already processed (idempotency)
async function alreadyProcessed(db, eventId) {
    const result = await db.query(
        'SELECT id FROM processed_events WHERE event_id = $1',
        [eventId]
    );
    return result.rows.length > 0;
}

// Mark event as processed
async function markProcessed(db, eventId, eventType, source) {
    await db.query(
        `INSERT INTO processed_events (event_id, event_type, source, processed_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (event_id) DO NOTHING`,
        [eventId, eventType, source]
    );
}

// Log to audit table
async function auditLog(db, action, entityType, entityId, service, request, response, error) {
    await db.query(
        `INSERT INTO audit_log (action, entity_type, entity_id, external_service, request_payload, response_status, response_body, error_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [action, entityType, entityId, service, JSON.stringify(request), response?.status, JSON.stringify(response?.body), error]
    );
}

/**
 * Express router for webhooks
 * Usage: app.use('/webhooks', webhookRouter(db, queue))
 */
function createWebhookRouter(db, queue) {
    const express = require('express');
    const router = express.Router();

    // Raw body parser for signature verification
    router.use(express.raw({ type: 'application/json' }));

    // Stripe webhook
    router.post('/stripe', async (req, res) => {
        try {
            const sig = req.headers['stripe-signature'];
            const secret = process.env.STRIPE_WEBHOOK_SECRET;

            if (!verifyStripeSignature(req.body.toString(), sig, secret)) {
                console.error('Invalid Stripe signature');
                return res.status(400).json({ error: 'Invalid signature' });
            }

            const event = JSON.parse(req.body.toString());

            // Idempotency check
            if (await alreadyProcessed(db, event.id)) {
                return res.json({ received: true, duplicate: true });
            }

            // Enqueue for processing
            await queue.add('stripe-event', {
                eventId: event.id,
                type: event.type,
                data: event.data.object
            });

            await markProcessed(db, event.id, event.type, 'stripe');
            res.json({ received: true });

        } catch (error) {
            console.error('Stripe webhook error:', error);
            res.status(500).json({ error: 'Internal error' });
        }
    });

    // GHL webhook
    router.post('/highlevel', async (req, res) => {
        try {
            const secret = process.env.GHL_WEBHOOK_SECRET;
            const payload = JSON.parse(req.body.toString());

            if (secret && !verifyGHLSignature(req.headers, payload, secret)) {
                console.error('Invalid GHL signature');
                return res.status(400).json({ error: 'Invalid signature' });
            }

            const eventId = payload.id || `ghl_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;

            // Idempotency check
            if (await alreadyProcessed(db, eventId)) {
                return res.json({ received: true, duplicate: true });
            }

            // Enqueue for processing
            await queue.add('ghl-event', {
                eventId,
                type: payload.type || payload.event,
                data: payload
            });

            await markProcessed(db, eventId, payload.type || 'unknown', 'ghl');
            res.json({ ok: true });

        } catch (error) {
            console.error('GHL webhook error:', error);
            res.status(500).json({ error: 'Internal error' });
        }
    });

    return router;
}

module.exports = {
    verifyStripeSignature,
    verifyGHLSignature,
    alreadyProcessed,
    markProcessed,
    auditLog,
    createWebhookRouter
};
