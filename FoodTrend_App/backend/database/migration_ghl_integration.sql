-- ============================================
-- MIGRATION: GHL Integration Fields
-- Purpose: Add columns needed for GoHighLevel sync
-- Run: 2026-01-23
-- ============================================

-- Add GHL sync fields to influencers
ALTER TABLE influencers ADD COLUMN ghl_contact_id VARCHAR(255);
ALTER TABLE influencers ADD COLUMN youtube_handle VARCHAR(255);
ALTER TABLE influencers ADD COLUMN youtube_subscribers INT DEFAULT 0;
ALTER TABLE influencers ADD COLUMN engagement_rate DECIMAL(5,2) DEFAULT 0.00;
ALTER TABLE influencers ADD COLUMN experience_level VARCHAR(50); -- 'beginner', 'intermediate', 'expert'
ALTER TABLE influencers ADD COLUMN hourly_rate DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE influencers ADD COLUMN missed_reviews INT DEFAULT 0;
ALTER TABLE influencers ADD COLUMN rescheduled_reviews INT DEFAULT 0;
ALTER TABLE influencers ADD COLUMN ghl_synced_at TIMESTAMP;

-- Add index for GHL lookup
CREATE INDEX idx_ghl_contact ON influencers (ghl_contact_id);

-- Add GHL sync fields to restaurants
ALTER TABLE restaurants ADD COLUMN ghl_contact_id VARCHAR(255);
ALTER TABLE restaurants ADD COLUMN ghl_location_id VARCHAR(255);
ALTER TABLE restaurants ADD COLUMN ghl_calendar_id VARCHAR(255);
ALTER TABLE restaurants ADD COLUMN ghl_synced_at TIMESTAMP;

-- Add index for GHL lookup
CREATE INDEX idx_restaurant_ghl_contact ON restaurants (ghl_contact_id);

-- ============================================
-- TABLE: processed_events
-- Purpose: Idempotency tracking for webhooks
-- ============================================
CREATE TABLE processed_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'stripe', 'ghl', 'internal'
  payload_hash VARCHAR(64),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_event_id (event_id),
  INDEX idx_source (source),
  INDEX idx_processed_at (processed_at)
);

-- ============================================
-- TABLE: audit_log
-- Purpose: Track all external API calls
-- ============================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50), -- 'influencer', 'restaurant', 'gig', etc.
  entity_id UUID,
  external_service VARCHAR(50), -- 'ghl', 'stripe', 'tiktok', 'instagram'
  request_payload TEXT,
  response_status INT,
  response_body TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_service (external_service),
  INDEX idx_created_at (created_at)
);

-- ============================================
-- Phase 3: Add GHL sync fields to gigs table
-- ============================================
ALTER TABLE gigs ADD COLUMN ghl_opportunity_id VARCHAR(255);
ALTER TABLE gigs ADD COLUMN ghl_synced_at TIMESTAMP;

-- Add index for GHL lookup
CREATE INDEX idx_gig_ghl_opportunity ON gigs (ghl_opportunity_id);
