# 📊 Sales Chart Specification (With Real Industry Data)

> **Purpose:** Define the required charts for restaurant-facing pages  
> **Rule:** Charts must educate, not scare. NO raw cost-per-visit math.  
> **Last Updated:** 2026-01-31

---

## Core Philosophy

Restaurants do **not** emotionally buy "cost per visit + food cost math."

They buy:
- ✅ Certainty
- ✅ Momentum
- ✅ Social proof
- ✅ Relief

**Therefore:**
- Keep real data internally for accuracy
- Frame visually for psychology
- Never lead with spreadsheet math
- Anchor on outcomes, volume, and inevitability

---

## Required Charts (Minimum 4)

### Chart A — "Where Diners Actually Decide" (Behavior Shift)

**Purpose:** Show that restaurant choice has moved from search → social discovery.

**Chart Type:** Split flow funnel (left = old, right = new)

**Content:**

| Old Discovery Path | New Discovery Path |
|-------------------|-------------------|
| Search Google | TikTok / Reels |
| Review sites | Friends/creators |
| Website/Menu | Organic engagement |
| Visit | Visit |

**Message:**  
> "Discovery moved. Most restaurants didn't."

**Footnote (tiny text):**
```
Data sources: Deloitte Global Consumer Behavior Report (2025), 
TikTok internal insights (2024), Snap/Google Consumer Path Study (2024)
```

---

### Chart B — "What You Get Every Month" (Output Certainty Grid)

**Purpose:** Show what each approach actually delivers on metrics that matter.

**Chart Type:** Icon grid (columns = approaches, rows = deliverables)

| Deliverable | Traditional Ads | Marketing Agencies | One-Off Influencers | FoodTrend |
|-------------|----------------|-------------------|---------------------|-----------|
| Guaranteed visits | ❌ | ❌ | ❌ | ✅ |
| Guaranteed content | ❌ | ❌ | ⚠️ | ✅ |
| Multi-platform posts | ❌ | ⚠️ | ❌ | ✅ |
| Social proof signals | ⚠️ | ⚠️ | ⚠️ | ✅ |
| Compounding visibility | ❌ | ❌ | ❌ | ✅ |

**Message:**  
> "Same spend. Completely different certainty."

**Footnote:**
```
Ads benchmarks: WordStream Google & Meta (2025)
Agency retainer survey: Databox (Jun 2025)
Influencer pricing: Collabstr (2025)
```

---

### Chart C — "Momentum Over Time" (Compounding Visibility)

**Purpose:** Show why content doesn't stop having value after spend ends.

**Chart Type:** Line chart (conceptual)

**Lines:**
- **Ads:** Spike → flat drop when spend stops
- **FoodTrend:** Steady climb → compounding value

**Visual Description:**
```
Value
  │
  │         FoodTrend ───────────────→ (compounds)
  │        /
  │       /
  │  Ads ─┘ (drops to zero)
  │
  └──────────────────────────────────→ Time
```

**Message:**  
> "Ads rent attention. FoodTrend builds presence."

**Footnote:**
```
Conceptual model backed by industry behavior.
See Lebesgue Ad Benchmarks (2024), HubSpot Content Longevity Study (2024)
```

---

### Chart D — "Traditional Marketing vs FoodTrend" (Friction Map)

**Purpose:** Compare friction in traditional methods vs FoodTrend without showing dollar amounts.

**Chart Type:** Horizontal friction bars (low to high)

| Factor | Traditional | FoodTrend |
|--------|-------------|-----------|
| Trackability | Low | High |
| Certainty of outcome | Low | High |
| Time to effect | Slow | Fast |
| Predictability | Low | High |
| Learning curve | Steep | Simple |

**Message:**  
> "Less friction. More results."

**Footnote:**
```
See Search Engine Journal Marketing ROI Studies (2024),
WordStream CPC Benchmarks (2025)
```

---

## Industry Benchmark Data (For Internal Reference Only)

These numbers should inform chart design but **NOT appear on customer-facing pages**:

### Google Ads Benchmarks
- **Average CPC (Restaurants & Food):** ~$2.05
- **Source:** WordStream (Sep 2025)

### Meta/Facebook Benchmarks
- **Food & Drink CPM (prospecting):** ~$7.54
- **Source:** Lebesgue (2024)

### Agency Retainers
- **Common range:** $1,001–$2,500/mo
- **Higher tier:** $2,501–$5,000+
- **Source:** Databox Survey (Jun 2025)

### Influencer Pricing
- **Micro-influencer avg:** ~$198 per collaboration
- **Source:** Collabstr (2025)

---

## Chart Design Rules (Non-Negotiable)

| Rule | Requirement |
|------|-------------|
| **Understandability** | Must be grasped in 5-10 seconds |
| **Labels** | Simple, no jargon |
| **Numbers** | Round when displayed |
| **Colors** | From FoodTrend palette |
| **Mobile** | Tables must collapse cleanly |
| **Footnotes** | Font size ≤ 11px, opacity ~70% |

---

## Footnote CSS Template

```css
.chart-footnote {
  font-size: 11px;
  line-height: 1.35;
  opacity: 0.7;
  margin-top: 10px;
}

.chart-footnote a {
  color: inherit;
  text-decoration: underline;
}
```

---

## What NOT to Show

❌ Raw "cost per visit" calculations  
❌ "Food cost + visit cost" combinations  
❌ Spreadsheet-style ROI math  
❌ Anything that feels like accounting  
❌ Made-up statistics or benchmarks  

---

## AI Guardrails

When generating charts, AI must:

1. Base claims on FoodTrend's **actual pricing and promises**
2. Use **conservative assumptions**
3. **Avoid invented statistics**
4. Prefer **comparisons over superlatives**
5. If data is unknown, **ask before generating**
