# MANDATORY CONTEXT - READ FIRST

> **AI AGENTS: You MUST read this file before answering any question in this project.**

---

## ✅ Verified Production URLs (Last Verified: 2026-01-24)

| Resource | URL | Status |
|----------|-----|--------|
| **API** | `https://api.yourfoodtrend.com` | ✅ Live |
| **Health** | `https://api.yourfoodtrend.com/health` | ✅ Returns `{"status":"healthy"}` |
| **Frontend** | `https://yourfoodtrend.com` | ✅ Live |
| **Webhooks - Stripe** | `https://api.yourfoodtrend.com/webhooks/stripe` | Configured |
| **Webhooks - GHL** | `https://api.yourfoodtrend.com/webhooks/ghl` | Configured |

> ⚠️ **NEVER use .env values as source of truth for production URLs. These verified URLs override any config file.**

---

## 🛡️ Critical Rules (Non-Negotiable)

1. **VERIFY before stating facts** - Never assume config = reality
2. **ASK if uncertain** - Say "Your config says X, please confirm the actual URL"
3. **Read ANTI_HALLUCINATION_PROTOCOL.md** before major decisions
4. **Small changes only** - Fibonacci-sized edits (max Fib(8))
5. **No schema changes** - Database schema is locked
6. **Character-perfect edits** - Exact matches only

---

## 🎨 Project SSoT (Source of Truth)

| Aspect | Value |
|--------|-------|
| Design System | Midnight Executive / PARA |
| Logo Size | 60px (nav/footer), 40px (sidebar) |
| Theme | Dark glassmorphic + DoorDash Red (#EB1700) |
| Backend | Express on Railway |
| Database | Supabase |
| CRM | GoHighLevel (Private Integration Token) |
| Self-Healing | logger.js + dom-utils.js on all pages |

## 📊 Business Metrics (VERIFIED)

| Metric | Value |
|--------|-------|
| **Creator Visits/Month** | 10-30 (by tier) |
| Momentum Tier | $799/mo = 10 visits |
| Velocity Tier | $1,299/mo = 20 visits |
| Dominance Tier | $2,499/mo = 30 visits |
| **Content Multiplier (TikTok)** | 3x (Influencer + Restaurant + FoodTrend) |
| **Content Multiplier (IG, Premium)** | 2x (Influencer + Restaurant) |
| **Referral Commission (Mo 1-6)** | $250/mo per restaurant |
| **Referral Commission (Mo 7+)** | $100/mo ongoing |

## ⭐ Review Gating Logic

| Rating | Action |
|--------|--------|
| < 4 Stars | Internal feedback to restaurant portal |
| 5 Stars | Auto-prompt to post Google Review |

---

## ❌ What NOT to Assume

- [ ] Config file values = production reality
- [ ] File exists without `view_file` verification
- [ ] Deployment is live without health check
- [ ] API works without actual test
- [ ] User wants big changes (ask first)

---

## 📋 Before Any Major Answer

```
☐ Did I verify the file/URL exists?
☐ Am I stating something as fact that needs confirmation?
☐ Did I re-read ANTI_HALLUCINATION_PROTOCOL?
☐ Is my change Fibonacci-sized?
☐ Am I following the project's design system?
```

---

## 🔄 How to Update This File

When you verify something new (e.g., a new production URL):
1. Update the relevant section
2. Update the "Last Verified" date
3. Commit with message: "context: update verified [item]"

---

## 🧬 Design Evolution Summary

### Current State: v3.6 (Fib 8 - Self-Healing Active)

| Version | Date | Milestone |
|---------|------|-----------|
| **v3.6** | Jan 25, 2026 | Frontend functional wiring (dashboards → API) |
| v3.5 | Jan 24, 2026 | 100% Self-Healing coverage, Railway deployment |
| v3.4 | Jan 23, 2026 | Component Architecture (sidebar SSOT) |
| v3.3 | Jan 22, 2026 | Design regression resolution |
| v3.2 | | Navigation pivot (RETAIN sidebars) |
| v3.1 | | AI rails (PATCH BLOCK format) |
| v3.0 | | Mandatory Output Contract |
| v2.0 | | Workflow optimization |
| v1.0 | | Genesis / baseline documentation |

### Design Philosophy Origin
- **"Midnight Executive"**: High-Octane Persuasion + Premium B2B aesthetic
- **Parallelogram Geometry**: 15° standard, -20° for high-impact
- **Sharp Edge UI**: `border-radius: 0` everywhere (no curves)
- **Fibonacci Maturity**: Small changes compound → self-healing code

### Deep Context (Knowledge Items)
For full design reasoning, read these KI artifacts:
- `foodtrend_para_design_system/artifacts/design/core_principles.md`
- `foodtrend_refinement_infrastructure/artifacts/governance_and_maturity.md`
- `foodtrend_business_growth_strategy/artifacts/ssot.md`

---

**Last Updated:** 2026-01-25 by Antigravity
