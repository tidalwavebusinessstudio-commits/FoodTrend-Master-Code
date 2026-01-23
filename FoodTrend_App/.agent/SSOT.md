# FoodTrend Project Context & Business Logic

**Purpose:** This file serves as the Single Source of Truth (SSOT) for all business logic, pricing, and operational metrics.  
**Usage:** ALL AI agents must reference this file before generating copy or calculating pricing.

---

## 📊 Core Business Metrics (The "Truth")

### Restaurant Pricing Model
* **Cost Per Meal:** $12.00 (Standardized internal cost for calculation)
    * *Note:* Do not use generic "$25" estimates. Use $12.
* **Creator Compensation:** Complimentary meal only (Zero cash payment)
* **Restaurant Cost:** Food cost only ($12/meal) + Platform Fee (if applicable)

### Service Deliverables (The "Rush")
* **Monthly Volume:** 60-180 verified creator visits + posts per month
* **Standard Review Target:** 20-30 monthly reviews per location
* **Platform Split:** Content distributed across **TikTok** and **Instagram**
* **Reputation Retention Bonus:** 15-20 *new* positive reviews per month
    * *Function:* Drip-feed of positive sentiment to bury negative outliers.

### Value Proposition Math
* **Old Way:** 1 Influencer = $500+ fee + Meal
* **FoodTrend Way:**
    * $12 food cost × 30 creators = $360 total cost
    * Result: ~30,000 - 50,000+ local organic views
    * ROI: "Brand reach for the price of ingredients"

---

## 🎨 Design System "Para" (Quick Ref)
* **Theme:** Dark Mode, Glassmorphism, Diagonal Layouts
* **Key Colors:**
    * Primary Red: `var(--brand-primary)` (Avoid hardcoded hex)
    * Background: `var(--bg-dark)`
* **Critical Rules:**
    * ❌ NO `overflow: hidden` on diagonal parents (clips floating elements)
    * ❌ NO Red Borders (experimental only)
    * ✅ Use `backdrop-filter: blur(10px)` for glass effect

---

## 📝 Copywriting Guidelines
* **Tone:** "Start The Rush," "Turn the Lights On," "Drip-feed visibility."
* **Audience:** Restaurant Owners (Busy, skeptical of ads) & Food Creators (Hungry for content/status).
* **Keywords:** Organic, Drip-feed, Reputation Defense, Local-Famous.
