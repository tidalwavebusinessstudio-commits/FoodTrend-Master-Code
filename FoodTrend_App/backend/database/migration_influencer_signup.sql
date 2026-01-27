-- FoodTrend: Create Influencers Table
-- Date: 2026-01-25
-- Run this in Supabase SQL Editor

-- ============================================
-- CREATE TABLE: influencers
-- ============================================
CREATE TABLE IF NOT EXISTS influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic info
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    
    -- Social media handles
    instagram_handle VARCHAR(255),
    tiktok_handle VARCHAR(255),
    
    -- Follower counts
    instagram_followers INT DEFAULT 0,
    tiktok_followers INT DEFAULT 0,
    
    -- Qualification data
    video_production_experience INT,
    food_review_experience INT,
    content_frequency VARCHAR(50),
    sample_video_urls JSONB,
    niche_focus VARCHAR(100),
    qualification_score INT,
    
    -- Agreement
    agreement_accepted_at TIMESTAMP,
    
    -- Referral system
    referral_code VARCHAR(50) UNIQUE,
    
    -- Earnings tracking
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    pending_earnings DECIMAL(10,2) DEFAULT 0.00,
    
    -- External integrations
    ghl_contact_id VARCHAR(255),
    stripe_connect_account_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (recommended for Supabase)
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can do anything" ON influencers
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Verify table was created
-- ============================================
-- SELECT * FROM influencers LIMIT 1;
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'influencers' ORDER BY ordinal_position;
