-- ============================================
-- ACCOUNTABILITY SYSTEM EXTENSIONS
-- Purpose: Influencer performance tracking and quality control
-- ============================================

-- ============================================
-- TABLE: influencer_qualifications
-- Purpose: Store onboarding qualifications and auto-scoring
-- ============================================
CREATE TABLE influencer_qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL UNIQUE,
  
  -- Follower counts from onboarding
  instagram_followers INT DEFAULT 0,
  tiktok_followers INT DEFAULT 0,
  total_followers INT GENERATED ALWAYS AS (instagram_followers + tiktok_followers) STORED,
  
  -- Experience ratings (1-5 scale)
  video_production_experience INT CHECK (video_production_experience BETWEEN 1 AND 5),
  food_review_experience INT CHECK (food_review_experience BETWEEN 1 AND 5),
  content_frequency VARCHAR(50), -- 'daily', '3-4_weekly', 'weekly', 'monthly'
  
  -- Portfolio/samples
  sample_video_urls TEXT, -- JSON array of sample video links
  niche_focus VARCHAR(100), -- 'food', 'lifestyle', 'travel', etc.
  
  -- Qualification score (auto-calculated: 0-110 scale)
  qualification_score INT GENERATED ALWAYS AS (
    CASE 
      WHEN (instagram_followers + tiktok_followers) >= 10000 THEN 40
      WHEN (instagram_followers + tiktok_followers) >= 5000 THEN 30
      WHEN (instagram_followers + tiktok_followers) >= 1000 THEN 20
      ELSE 10
    END +
    (video_production_experience * 6) +
    (food_review_experience * 6) +
    CASE content_frequency
      WHEN 'daily' THEN 10
      WHEN '3-4_weekly' THEN 7
      WHEN 'weekly' THEN 4
      ELSE 0
    END
  ) STORED,
  -- Score interpretation: 70+ = auto-approve, 50-69 = manual review, <50 = reject
  
  -- Approval status
  approved BOOLEAN DEFAULT FALSE,
  rejection_reason TEXT,
  reviewed_by VARCHAR(255), -- Admin who approved/rejected
  reviewed_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE,
  
  INDEX idx_qualification_score (qualification_score),
  INDEX idx_approved (approved)
);

-- ============================================
-- TABLE: creator_visits
-- Purpose: Track influencer visits to restaurants and posting compliance
-- ============================================
CREATE TABLE creator_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  influencer_id UUID NOT NULL,
  restaurant_id UUID NOT NULL,
  
  -- Visit details
  visit_date TIMESTAMP NOT NULL,
  scheduled_date TIMESTAMP, -- When visit was scheduled
  confirmed BOOLEAN DEFAULT FALSE,
  
  -- Posting deadline (48 hours after visit_date)
  posting_deadline TIMESTAMP GENERATED ALWAYS AS (
    TIMESTAMPADD(HOUR, 48, visit_date)
  ) STORED,
  
  -- Performance tracking
  tiktok_posted BOOLEAN DEFAULT FALSE,
  instagram_posted BOOLEAN DEFAULT FALSE,
  tiktok_submission_id UUID, -- Links to content_submissions
  instagram_submission_id UUID,
  
  -- Compliance status
  status VARCHAR(50) DEFAULT 'scheduled',
  -- Status values:
  -- 'scheduled' = visit planned
  -- 'completed' = visit happened, awaiting posts
  -- 'compliant' = both posts submitted on time
  -- 'flagged' = missed 48hr deadline
  -- 'warning_sent' = flagged + 24hr warning sent
  -- 'failed' = didn't submit within 24hr warning period
  -- 'cancelled' = visit cancelled
  
  flagged_at TIMESTAMP,
  warning_sent_at TIMESTAMP,
  compliance_resolved_at TIMESTAMP,
  
  -- Notes
  visit_notes TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  
  INDEX idx_influencer (influencer_id),
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_status (status),
  INDEX idx_posting_deadline (posting_deadline),
  INDEX idx_flagged (status, flagged_at),
  INDEX idx_visit_date (visit_date)
);

-- ============================================
-- TABLE: content_submissions
-- Purpose: Track influencer-submitted TikTok/Instagram content with metrics
-- ============================================
CREATE TABLE content_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  influencer_id UUID NOT NULL,
  restaurant_id UUID NOT NULL,
  creator_visit_id UUID, -- Links to the visit this content is for
  
  -- Content details
  platform VARCHAR(20) NOT NULL, -- 'tiktok', 'instagram', 'youtube'
  post_url TEXT NOT NULL,
  post_type VARCHAR(50), -- 'reel', 'post', 'story', 'video', 'short'
  
  -- Metrics (auto-fetched via API)
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Content metadata
  posted_at TIMESTAMP,
  caption TEXT,
  hashtags TEXT, -- JSON array
  thumbnail_url TEXT,
  video_duration INT, -- seconds
  
  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_by VARCHAR(255), -- Admin who verified
  verified_at TIMESTAMP,
  flagged_for_review BOOLEAN DEFAULT FALSE,
  review_notes TEXT,
  
  -- Metrics update tracking
  last_metrics_fetch TIMESTAMP,
  metrics_fetch_count INT DEFAULT 0,
  
  -- Timestamps
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_visit_id) REFERENCES creator_visits(id) ON DELETE SET NULL,
  
  INDEX idx_influencer (influencer_id),
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_platform (platform),
  INDEX idx_posted_at (posted_at),
  INDEX idx_visit (creator_visit_id),
  INDEX idx_verified (verified)
);

-- ============================================
-- TABLE: performance_strikes
-- Purpose: Track performance violations and strikes against influencers
-- ============================================
CREATE TABLE performance_strikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Target
  influencer_id UUID NOT NULL,
  
  -- Strike details
  strike_type VARCHAR(50) NOT NULL,
  -- 'missed_deadline' = didn't post within 48 hours
  -- 'incomplete_submission' = only posted on one platform
  -- 'low_quality' = content flagged for poor quality
  -- 'fake_metrics' = submitted fake post URLs
  -- 'inappropriate_content' = violated content guidelines
  
  severity VARCHAR(20) DEFAULT 'minor', -- 'minor', 'major', 'critical'
  
  -- Related entities
  creator_visit_id UUID,
  restaurant_id UUID,
  
  -- Description
  reason TEXT NOT NULL,
  evidence TEXT, -- Screenshots, links, etc.
  
  -- Resolution
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by VARCHAR(255),
  resolution_notes TEXT,
  
  -- Impact
  suspension_applied BOOLEAN DEFAULT FALSE,
  suspension_days INT,
  suspension_end_date TIMESTAMP,
  removed_from_platform BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_visit_id) REFERENCES creator_visits(id) ON DELETE SET NULL,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE SET NULL,
  
  INDEX idx_influencer (influencer_id),
  INDEX idx_strike_type (strike_type),
  INDEX idx_severity (severity),
  INDEX idx_resolved (resolved),
  INDEX idx_issued_at (issued_at)
);

-- ============================================
-- TABLE: restaurant_social_content
-- Purpose: Content posted by FoodTrend or uploaded by restaurants
-- ============================================
CREATE TABLE restaurant_social_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  restaurant_id UUID NOT NULL,
  uploaded_by VARCHAR(50) NOT NULL, -- 'foodtrend', 'restaurant'
  influencer_id UUID, -- If content features an influencer
  
  -- Content details
  platform VARCHAR(20) NOT NULL, -- 'tiktok', 'instagram', 'youtube', 'facebook'
  post_url TEXT NOT NULL,
  post_type VARCHAR(50), -- 'reel', 'post', 'story', 'video'
  
  -- Metrics (fetched via API or manually entered)
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  
  -- Content metadata
  posted_at TIMESTAMP,
  caption TEXT,
  thumbnail_url TEXT,
  
  -- Tracking
  last_metrics_fetch TIMESTAMP,
  metrics_fetch_count INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (influencer_id) REFERENCES influencers(id) ON DELETE SET NULL,
  
  INDEX idx_restaurant (restaurant_id),
  INDEX idx_platform (platform),
  INDEX idx_uploaded_by (uploaded_by),
  INDEX idx_influencer (influencer_id),
  INDEX idx_posted_at (posted_at)
);

-- ============================================
-- EXTENSIONS: Add accountability columns to influencers table
-- ============================================
ALTER TABLE influencers ADD COLUMN total_visits INT DEFAULT 0;
ALTER TABLE influencers ADD COLUMN compliant_visits INT DEFAULT 0;
ALTER TABLE influencers ADD COLUMN flagged_visits INT DEFAULT 0;
ALTER TABLE influencers ADD COLUMN failed_visits INT DEFAULT 0;

ALTER TABLE influencers ADD COLUMN compliance_rate DECIMAL(5,2) 
  GENERATED ALWAYS AS (
    CASE WHEN total_visits > 0 
    THEN (compliant_visits * 100.0 / total_visits) 
    ELSE 100.00 END
  ) STORED;

ALTER TABLE influencers ADD COLUMN strike_count INT DEFAULT 0;
ALTER TABLE influencers ADD COLUMN suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE influencers ADD COLUMN suspension_end_date TIMESTAMP;
ALTER TABLE influencers ADD COLUMN removed BOOLEAN DEFAULT FALSE;
ALTER TABLE influencers ADD COLUMN removed_reason TEXT;
ALTER TABLE influencers ADD COLUMN removed_at TIMESTAMP;

-- ============================================
-- VIEWS: Helpful accountability queries
-- ============================================

-- View: Influencer Performance Summary
CREATE VIEW influencer_performance_summary AS
SELECT 
  i.id,
  i.name,
  i.email,
  i.referral_code,
  i.total_visits,
  i.compliant_visits,
  i.flagged_visits,
  i.failed_visits,
  i.compliance_rate,
  i.strike_count,
  i.suspended,
  i.removed,
  COUNT(DISTINCT cs.id) as total_content_pieces,
  SUM(cs.view_count) as total_views,
  SUM(cs.like_count) as total_likes,
  AVG(cs.engagement_rate) as avg_engagement_rate,
  COUNT(DISTINCT CASE WHEN cv.status = 'flagged' OR cv.status = 'warning_sent' THEN cv.id END) as active_flags
FROM influencers i
LEFT JOIN content_submissions cs ON cs.influencer_id = i.id
LEFT JOIN creator_visits cv ON cv.influencer_id = i.id
GROUP BY i.id;

-- View: Restaurant Content Analytics
CREATE VIEW restaurant_content_analytics AS
SELECT 
  r.id as restaurant_id,
  r.name as restaurant_name,
  
  -- Influencer content
  COUNT(DISTINCT cs.id) as influencer_content_count,
  SUM(CASE WHEN cs.platform = 'tiktok' THEN cs.view_count ELSE 0 END) as influencer_tiktok_views,
  SUM(CASE WHEN cs.platform = 'instagram' THEN cs.view_count ELSE 0 END) as influencer_instagram_views,
  
  -- FoodTrend content
  COUNT(DISTINCT CASE WHEN rsc.uploaded_by = 'foodtrend' THEN rsc.id END) as foodtrend_content_count,
  SUM(CASE WHEN rsc.uploaded_by = 'foodtrend' THEN rsc.view_count ELSE 0 END) as foodtrend_total_views,
  
  -- Restaurant uploaded content
  COUNT(DISTINCT CASE WHEN rsc.uploaded_by = 'restaurant' THEN rsc.id END) as restaurant_content_count,
  SUM(CASE WHEN rsc.uploaded_by = 'restaurant' THEN rsc.view_count ELSE 0 END) as restaurant_total_views,
  
  -- Combined totals
  (
    COALESCE(SUM(cs.view_count), 0) + 
    COALESCE(SUM(rsc.view_count), 0)
  ) as total_views_all_sources,
  
  (
    COUNT(DISTINCT cs.id) + 
    COUNT(DISTINCT rsc.id)
  ) as total_content_pieces

FROM restaurants r
LEFT JOIN content_submissions cs ON cs.restaurant_id = r.id
LEFT JOIN restaurant_social_content rsc ON rsc.restaurant_id = r.id
GROUP BY r.id;

-- View: Visit Compliance Report
CREATE VIEW visit_compliance_report AS
SELECT 
  cv.id as visit_id,
  cv.visit_date,
  cv.posting_deadline,
  cv.status,
  i.name as influencer_name,
  i.email as influencer_email,
  r.name as restaurant_name,
  cv.tiktok_posted,
  cv.instagram_posted,
  CASE 
    WHEN cv.status = 'compliant' THEN 'On Time'
    WHEN cv.status = 'flagged' THEN 'Overdue - Flagged'
    WHEN cv.status = 'warning_sent' THEN 'URGENT - 24hr Warning'
    WHEN cv.status = 'failed' THEN 'Failed - Strike Issued'
    ELSE cv.status
  END as compliance_status,
  TIMESTAMPDIFF(HOUR, cv.visit_date, COALESCE(cv.compliance_resolved_at, NOW())) as hours_to_submission
FROM creator_visits cv
JOIN influencers i ON i.id = cv.influencer_id
JOIN restaurants r ON r.id = cv.restaurant_id
WHERE cv.status IN ('scheduled', 'completed', 'flagged', 'warning_sent', 'failed', 'compliant')
ORDER BY cv.visit_date DESC;

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================

CREATE TRIGGER influencer_qualifications_updated_at
BEFORE UPDATE ON influencer_qualifications
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER creator_visits_updated_at
BEFORE UPDATE ON creator_visits
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER content_submissions_updated_at
BEFORE UPDATE ON content_submissions
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;

CREATE TRIGGER restaurant_social_content_updated_at
BEFORE UPDATE ON restaurant_social_content
FOR EACH ROW
SET NEW.updated_at = CURRENT_TIMESTAMP;
