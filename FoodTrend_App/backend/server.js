/**
 * FoodTrend Backend Server
 * Main entry point for the API server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { createWebhookRouter } = require('./services/webhook-receiver');
const { createInfluencerRouter } = require('./api/influencer-metrics');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Simple in-memory queue (replace with Redis/BullMQ in production)
const queue = {
    jobs: [],
    add: async (type, data) => {
        queue.jobs.push({ type, data, timestamp: Date.now() });
        console.log(`Job queued: ${type}`);
        return { id: queue.jobs.length };
    }
};

// Middleware
app.use(cors({
    origin: [
        'https://yourfoodtrend.com',
        'http://localhost:3000',
        'http://127.0.0.1:5500' // VS Code Live Server
    ],
    credentials: true
}));

// Health check (must be before other routes)
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        service: 'FoodTrend API',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// JSON parser for non-webhook routes
app.use(express.json());

// API Routes
app.use('/api/influencers', createInfluencerRouter());

// Webhook routes (with raw body for signature verification)
const webhookRouter = createWebhookRouter({ query: (sql, params) => supabase.rpc('raw_sql', { sql, params }) }, queue);
app.use('/webhooks', webhookRouter);

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FoodTrend API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
