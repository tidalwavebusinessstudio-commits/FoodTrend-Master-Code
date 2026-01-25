/**
 * FoodTrend Backend Server
 * Main entry point for the API server
 * Production-hardened with rate limiting and security headers
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');
const { createWebhookRouter } = require('./services/webhook-receiver');
const { createInfluencerRouter } = require('./api/influencer-metrics');
const { createRestaurantDashboardRouter } = require('./api/restaurant-dashboard');
const { createInfluencerSignupRouter } = require('./api/influencer-signup');
const { createReviewRouter } = require('./api/reviews');
const { apiLimiter, webhookLimiter } = require('./middleware/rate-limit');
const { notifyError } = require('./services/error-notifier');

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

// Security headers (Helmet)
app.use(helmet({
    contentSecurityPolicy: false, // Disable for API (no HTML served)
    crossOriginEmbedderPolicy: false
}));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} | ${req.method} ${req.path} | ${res.statusCode} | ${duration}ms`);
    });
    next();
});

// CORS configuration
app.use(cors({
    origin: [
        'https://yourfoodtrend.com',
        'http://localhost:3000',
        'http://127.0.0.1:5500' // VS Code Live Server
    ],
    credentials: true
}));

// Health check (must be before rate limiting and other routes)
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

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/influencers', createInfluencerRouter());
app.use('/api/influencer', createInfluencerSignupRouter(supabase));
app.use('/api/restaurant', createRestaurantDashboardRouter(supabase));
app.use('/api/reviews', createReviewRouter(supabase));

// Webhook routes (with raw body for signature verification + stricter rate limit)
const webhookRouter = createWebhookRouter({ query: (sql, params) => supabase.rpc('raw_sql', { sql, params }) }, queue);
app.use('/webhooks', webhookLimiter, webhookRouter);

// Global error handler with notification
app.use(async (err, req, res, next) => {
    console.error('Server error:', err);

    // Send error notification (async, don't block response)
    notifyError(err, {
        endpoint: req.path,
        method: req.method,
        ip: req.ip
    }).catch(console.error);

    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 FoodTrend API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔒 Security: Helmet + Rate Limiting enabled`);
});

module.exports = app;

