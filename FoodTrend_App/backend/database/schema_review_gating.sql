-- ============================================
-- Restaurant Feedback Table (Review Gating System)
-- Stores all influencer reviews with gating logic
-- 
-- IMPORTANT: Mixed data types to match existing schema:
--   - profiles.id = UUID
--   - restaurants.id = BIGINT
--   - creator_visits.id = BIGINT
-- ============================================

-- Drop existing table if schema is wrong
DROP TABLE IF EXISTS restaurant_feedback CASCADE;

CREATE TABLE restaurant_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships (MIXED types to match existing tables)
    influencer_id UUID NOT NULL REFERENCES profiles(id),
    restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
    creator_visit_id BIGINT REFERENCES creator_visits(id),
    
    -- Review Content
    star_rating INTEGER NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
    comment TEXT,
    
    -- Gating Logic
    feedback_type VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Values: 'internal', 'neutral', 'google_pending', 'google_posted'
    
    is_public BOOLEAN NOT NULL DEFAULT false,
    
    -- Google Review Tracking
    google_posted_at TIMESTAMPTZ,
    google_review_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_restaurant ON restaurant_feedback(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_feedback_influencer ON restaurant_feedback(influencer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON restaurant_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON restaurant_feedback(star_rating);

-- Add review fields to creator_visits if not exist
ALTER TABLE creator_visits 
ADD COLUMN IF NOT EXISTS review_collected BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS review_rating INTEGER,
ADD COLUMN IF NOT EXISTS review_type VARCHAR(20);

-- Add Google Place ID to restaurants if not exist
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS google_review_url TEXT;

-- ============================================
-- Helpful Views
-- ============================================

-- View: Restaurant feedback summary
CREATE OR REPLACE VIEW restaurant_feedback_summary AS
SELECT 
    r.id as restaurant_id,
    r.name as restaurant_name,
    COUNT(f.id) as total_reviews,
    ROUND(AVG(f.star_rating), 2) as average_rating,
    COUNT(CASE WHEN f.feedback_type = 'internal' THEN 1 END) as internal_feedback_count,
    COUNT(CASE WHEN f.feedback_type = 'google_posted' THEN 1 END) as google_reviews_count,
    COUNT(CASE WHEN f.feedback_type = 'google_pending' THEN 1 END) as pending_google_count
FROM restaurants r
LEFT JOIN restaurant_feedback f ON r.id = f.restaurant_id
GROUP BY r.id, r.name;

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE restaurant_feedback ENABLE ROW LEVEL SECURITY;

-- Restaurants can view their own feedback
CREATE POLICY "Restaurants can view own feedback"
ON restaurant_feedback FOR SELECT
USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
));

-- Influencers can view their own reviews
CREATE POLICY "Influencers can view own reviews"
ON restaurant_feedback FOR SELECT
USING (influencer_id = auth.uid());

-- Influencers can insert reviews
CREATE POLICY "Influencers can insert reviews"
ON restaurant_feedback FOR INSERT
WITH CHECK (influencer_id = auth.uid());

-- Service role can do anything
CREATE POLICY "Service role full access"
ON restaurant_feedback FOR ALL
USING (auth.role() = 'service_role');
