-- FoodTrend Referral Commission System - Database Schema
-- PostgreSQL/MySQL compatible

-- ============================================
-- TABLE: influencers
-- Purpose: Store creator/influencer information and earnings
-- ============================================
CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  
  -- Social media info
  instagram_handle VARCHAR(255),
  tiktok_handle VARCHAR(255),
  follower_count INT DEFAULT 0,
  
  -- Referral system
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  qr_code_url TEXT,
  
  -- Payment info
  stripe_connect_account_id VARCHAR(255),
  payout_method VARCHAR(50) DEFAULT 'stripe_connect', -- 'stripe_connect', 'paypal', 'manual'
  
  -- Earnings tracking
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  pending_earnings DECIMAL(10,2) DEFAULT 0.00,
  paid_earnings DECIMAL(10,2) DEFAULT 0.00,
  
  -- Referral stats
  total_referrals INT DEFAULT 0,
  active_referrals INT DEFAULT 0,
  cancelled_referrals INT DEFAULT 0,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  onboarding_completed BOOLEAN DEFAULT FALSE,
  stripe_onboarding_completed BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_payout_date TIMESTAMP,
  
  -- Indexes
  INDEX idx_referral_code (referral_code),
  INDEX idx_email (email),
  INDEX idx_status (status)
);

-- ============================================
-- TABLE: restaurants
-- Purpose: Store restaurant customer information
-- ============================================
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  
  -- Location
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'US',
  
  -- Stripe integration
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  
  -- Subscription details
  tier VARCHAR(50), -- 'momentum', 'velocity', 'dominance'
  monthly_price DECIMAL(10,2),
  billing_cycle_day INT, -- Day of month for billing
  
  -- Referral attribution
  referred_by_influencer_id UUID,
  referral_code_used VARCHAR(50),
  
  -- Important dates
  signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  first_payment_date TIMESTAMP,
  last_payment_date TIMESTAMP,
  cancellation_date TIMESTAMP,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'active', 'paused', 'cancelled'
  payment_status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'paid', 'failed', 'overdue'
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (referred_by_influencer_id) REFERENCES influencers(id) ON DELETE SET NULL,
  
  -- Indexes
  INDEX idx_stripe_customer (stripe_customer_id),
  INDEX idx_stripe_subscription (stripe_subscription_id),
  INDEX idx_referral (referred_by_influencer_id),
  INDEX idx_status (status)
);

-- ============================================
-- TABLE: commissions
-- Purpose: Track individual monthly commission payments
-- ============================================
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  influencer_id UUID NOT NULL,
  restaurant_id UUID NOT NULL,
  
  -- Commission details
  month_number INT NOT NULL, -- 1-6 = $250, 7+ = $100
  amount DECIMAL(10,2) NOT NULL,
  
  -- Dates
  due_date DATE NOT NULL,
  paid_date TIMESTAMP,
  processed_date TIMESTAMP,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', 
  -- 'pending' = waiting for restaurant payment
  -- 'ready_for_payout' = restaurant paid, ready to pay influencer
  -- 'paid' = influencer has been paid
  -- 'failed' = payout attempt failed
  -- 'cancelled' = restaurant cancelled before payout
  
  -- Payment tracking
  stripe_transfer_id VARCHAR(255),
  payout_batch_id UUID, -- Links to payouts table
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  
  -- Constraints
  UNIQUE KEY unique_commission (influencer_id, restaurant_id, month_number),
  CHECK (amount > 0),
  CHECK (month_number > 0),
  
  -- Indexes
  INDEX idx_influencer (influencer_id),
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date),
  INDEX idx_month (month_number)
);

-- ============================================
-- TABLE: payouts
-- Purpose: Track batch payouts to influencers
-- ============================================
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  influencer_id UUID NOT NULL,
  
  -- Payout details
  amount DECIMAL(10,2) NOT NULL,
  commission_count INT NOT NULL,
  commission_ids TEXT, -- JSON array of commission IDs
  
  -- Payment method
  method VARCHAR(50), -- 'stripe_connect', 'paypal', 'manual', 'ach'
  
  -- Stripe tracking
  stripe_transfer_id VARCHAR(255),
  stripe_payout_id VARCHAR(255),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  -- 'pending' = queued
  -- 'processing' = in progress
  -- 'completed' = successfully paid
  -- 'failed' = payout failed
  -- 'cancelled' = cancelled before processing
  
  -- Dates
  scheduled_date DATE,
  processed_date TIMESTAMP,
  completed_date TIMESTAMP,
  
  -- Failure tracking
  failure_reason TEXT,
  retry_count INT DEFAULT 0,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_influencer (influencer_id),
  INDEX idx_status (status),
  INDEX idx_scheduled_date (scheduled_date)
);

-- ============================================
-- TABLE: referral_tracking
-- Purpose: Track referral link clicks and attribution
-- ============================================
CREATE TABLE referral_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Referral info
  influencer_id UUID,
  referral_code VARCHAR(50) NOT NULL,
  
  -- Visitor info
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Attribution
  restaurant_id UUID, -- Set when signup completes
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMP,
  
  -- Tracking
  click_source VARCHAR(100), -- 'link', 'qr_code'
  landing_page VARCHAR(255),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Timestamps
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE SET NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL,
  
  -- Indexes
  INDEX idx_referral_code (referral_code),
  INDEX idx_influencer (influencer_id),
  INDEX idx_clicked_at (clicked_at)
);

-- ============================================
-- VIEWS: Helpful queries
-- ============================================

-- View: Influencer Dashboard Summary
CREATE VIEW influencer_dashboard_summary AS
SELECT 
  i.id,
  i.name,
  i.email,
  i.referral_code,
  i.total_earnings,
  i.pending_earnings,
  i.paid_earnings,
  i.total_referrals,
  i.active_referrals,
  COUNT(DISTINCT r.id) as active_restaurant_count,
  SUM(CASE WHEN c.status = 'ready_for_payout' THEN c.amount ELSE 0 END) as ready_to_payout,
  SUM(CASE WHEN c.status = 'pending' THEN c.amount ELSE 0 END) as future_earnings
FROM influencers i
LEFT JOIN restaurants r ON r.referred_by_influencer_id = i.id AND r.status = 'active'
LEFT JOIN commissions c ON c.influencer_id = i.id
GROUP BY i.id;

-- View: Monthly Commission Report
CREATE VIEW monthly_commission_report AS
SELECT 
  DATE_FORMAT(c.due_date, '%Y-%m') as month,
  c.status,
  COUNT(*) as commission_count,
  SUM(c.amount) as total_amount,
  COUNT(DISTINCT c.influencer_id) as influencer_count,
  COUNT(DISTINCT c.restaurant_id) as restaurant_count
FROM commissions c
GROUP BY month, c.status
ORDER BY month DESC, c.status;

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================

-- Influencers update trigger
CREATE TRIGGER influencers_updated_at
BEFORE UPDATE ON influencers
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

-- Restaurants update trigger  
CREATE TRIGGER restaurants_updated_at
BEFORE UPDATE ON restaurants
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

-- Commissions update trigger
CREATE TRIGGER commissions_updated_at
BEFORE UPDATE ON commissions
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

-- Payouts update trigger
CREATE TRIGGER payouts_updated_at
BEFORE UPDATE ON payouts
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;
