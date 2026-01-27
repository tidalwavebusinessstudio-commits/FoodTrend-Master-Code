-- ============================================
-- TABLE: gigs
-- Purpose: Restaurant gig offers for influencers
-- PostgreSQL / Supabase compatible
-- NOTE: restaurant_id is BIGINT to match restaurants.id
-- ============================================
CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  
  -- Gig details
  title VARCHAR(255) NOT NULL,
  description TEXT,
  daily_slots INT DEFAULT 2,
  
  -- Status: 'draft', 'published', 'paused', 'archived'
  status VARCHAR(50) DEFAULT 'draft',
  
  -- GHL sync fields
  ghl_opportunity_id VARCHAR(255),
  ghl_synced_at TIMESTAMPTZ,
  
  -- Stats
  total_bookings INT DEFAULT 0,
  views_this_week INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gigs_restaurant ON gigs(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_gigs_ghl_opportunity ON gigs(ghl_opportunity_id);

-- Enable Row Level Security
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view published gigs
CREATE POLICY "Anyone can view published gigs" ON gigs
  FOR SELECT
  USING (status = 'published');
