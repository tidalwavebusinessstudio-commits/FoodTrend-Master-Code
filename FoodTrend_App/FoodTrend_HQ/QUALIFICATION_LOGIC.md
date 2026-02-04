# 🎯 Qualification Logic Specification

> **Purpose:** Define qualification questions and logic for Restaurants and Creators  
> **Philosophy:** Selective, not desperate. Premium, not desperate.  
> **Last Updated:** 2026-01-31

---

## Core Philosophy

FoodTrend must **never appear desperate**.

Qualification serves multiple purposes:
1. **Filter** for quality fit
2. **Frame** expectations upfront
3. **Signal** exclusivity
4. **Gather** data for better matching

---

## 🍽️ Restaurant Qualification

### Purpose
Ensure restaurants can receive, support, and benefit from FoodTrend's service.

### Question Categories

#### 1. Reputation Metrics
| Question | Type | Purpose |
|----------|------|---------|
| What is your average Google rating? | Range selector (1-5 stars) | Quality baseline |
| How many Google reviews do you have? | Range selector | Social proof level |

#### 2. Business Size & Goals
| Question | Type | Purpose |
|----------|------|---------|
| What is your current monthly revenue? | Range selector ($) | Capacity/tier matching |
| What revenue level do you want to achieve? | Range selector ($) | Goal alignment |
| How many locations do you have? | Number input | Multi-location tier |

#### 3. Product Fit
| Question | Type | Purpose |
|----------|------|---------|
| What type of cuisine do you serve? | Multi-select | Content strategy |
| What is your average order value? | Range selector ($) | ROI calculation |
| What is your best-selling dish? | Text input | Feature content |
| Which items could you offer for creator visits? (20-30 slots) | Text/multi-select | Feasibility check |

#### 4. Self-Assessment
| Question | Type | Purpose |
|----------|------|---------|
| What areas do you feel need improvement? | Multi-select | Pain point alignment |
| What marketing have you tried before? | Multi-select | Competitor comparison |
| Why are you interested in FoodTrend? | Text input | Motivation check |

### Scoring Logic (Internal)

| Score | Rating | Action |
|-------|--------|--------|
| A | High fit | Progress to pricing |
| B | Good fit | Progress with notes |
| C | Low fit | Nurture sequence |
| D | No fit | Polite decline |

**Scoring Factors:**
- Google rating 4+ stars: +10 points
- 50+ reviews: +5 points
- Revenue > $50k/mo: +10 points
- Clear growth goal: +5 points
- 3+ suitable menu items: +10 points

---

## 👤 Creator Qualification

### Purpose
Assess quality potential and tier placement, **not** to reject based on follower count.

### Question Categories

#### 1. Platform Experience
| Question | Type | Purpose |
|----------|------|---------|
| How many TikTok videos have you posted? | Range selector | Activity level |
| How many Instagram Reels have you posted? | Range selector | Cross-platform |
| Have you created food content before? | Yes/No + examples | Niche fit |

#### 2. Technical Skills
| Question | Type | Purpose |
|----------|------|---------|
| Rate your videography experience (1-5) | Slider | Skill baseline |
| Do you edit your own videos? | Yes/No | Production capability |
| What equipment do you use? | Multi-select | Quality potential |

#### 3. Audience Metrics
| Question | Type | Purpose |
|----------|------|---------|
| Total followers (TikTok + Instagram) | Range selector | Reach tier |
| Average views per video | Range selector | Engagement quality |

#### 4. Capacity & Commitment
| Question | Type | Purpose |
|----------|------|---------|
| How many gigs could you do per month? | Range selector | Availability |
| Are you available for gigs in Maryland? | Yes/No | Geographic fit |

### Important Notes

> ❌ **Low follower count ≠ rejection**
>
> Followers are informational only. We care about:
> - Quality potential
> - Commitment level
> - Geographic availability

### Tier Placement Logic

| Tier | Criteria | Benefits |
|------|----------|----------|
| **Entry** | New creators, building portfolio | Standard gig rate, training access |
| **Pro** | Consistent posting, good production | Higher gig rate, priority assignments |
| **Elite** | High followers, premium quality | Premium rates, exclusive restaurants |

---

## 📋 Qualification Page UX

### Design Principles

1. **Progress indicators** - Show how far along they are
2. **Question justification** - Explain why each question matters
3. **Smart defaults** - Pre-fill obvious answers
4. **Mobile-first** - Most submissions will be mobile

### Copy Patterns

Use contextual explanations:

> "We ask about your reviews because reputation affects visit conversion."

> "We ask about AOV because it affects ROI projections."

> "We ask about menu items because they power creator participation."

### Completion Experience

After qualification:
- **A/B tier:** Immediate booking CTA
- **C tier:** "We'll be in touch" + nurture email
- **D tier:** Polite redirect to resources

---

## 🔗 Integration Points

### Data Storage
All qualification responses stored in:
- Supabase: `restaurant_qualifications`, `creator_qualifications` tables
- GHL: Contact custom fields for CRM segmentation

### Automation Triggers
- A-tier restaurant → Instant sales follow-up
- C-tier restaurant → 7-day nurture sequence
- New creator → Welcome email + training access
- Pro-tier creator → Priority gig notifications

---

## 🚫 What NOT to Do

❌ Make it feel like a job application (intimidating)  
❌ Ask irrelevant personal questions  
❌ Reject based on follower count alone  
❌ Skip questions that seem obvious  
❌ Make the form too long (max 2-3 minutes)  
