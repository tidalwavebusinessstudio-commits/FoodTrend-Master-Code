/**
 * Rate Limiting Middleware
 * Configures rate limits for different route types
 */

const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 100, // 100 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests',
        message: 'Please wait before making more requests',
        retryAfter: 60
    },
    handler: (req, res) => {
        console.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            error: 'Too many requests',
            retryAfter: 60
        });
    }
});

// Webhook rate limiter (more restrictive)
const webhookLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 20, // 20 webhook events per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many webhook events',
        retryAfter: 60
    }
});

// Auth rate limiter (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute window
    max: 10, // 10 attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many login attempts',
        message: 'Please try again in 15 minutes'
    }
});

module.exports = {
    apiLimiter,
    webhookLimiter,
    authLimiter
};
