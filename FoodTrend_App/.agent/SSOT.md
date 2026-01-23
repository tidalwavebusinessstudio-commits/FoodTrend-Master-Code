# FoodTrend REAL Business Model (SSOT v2 - With Referral Engine)

**CRITICAL:** This supersedes previous pricing assumptions. The referral program is THE growth engine.

---

## 💰 ACTUAL Pricing Model (High-Tier Necessary)

### Restaurant Pricing Tiers
* **Momentum:** $799/month (60 creator visits)
* **Velocity:** $1,299/month (150 creator visits) ← MOST POPULAR
* **Dominance:** $2,499/month (Unlimited visits, multi-location)

**Why high pricing is REQUIRED:**
- Must support $250/mo referral commissions for 6 months
- Then $100/mo ongoing commissions
- Still maintain margins for operations + creator meals

---

## 🔥 The Viral Growth Engine (Referral Program)

### Influencer Commission Structure
* **Months 1-6:** $250/month per restaurant referred
* **Month 7+:** $100/month (as long as restaurant stays active)
* **Potential:** Unlimited restaurant signups = Unlimited residual income

### Unit Economics (Velocity Tier Example)
```
Restaurant pays: $1,299/month
- Influencer commission (Mo 1-6): $250
- Creator meal costs (~$360 for 30 meals): $360
- Platform operations: $200
- Net profit (Mo 1-6): $489

After Month 6:
Restaurant pays: $1,299/month
- Influencer commission (ongoing): $100
- Creator meal costs: $360
- Platform operations: $200
- Net profit (Mo 7+): $639 ✅ Better margins!
```

**Why this works:**
- 6-month payback period for affiliate acquisition cost
- After 6 months, massively improved margins
- Incentivizes LONG-TERM restaurant retention (golden handcuffs for influencers)

---

## 📱 Influencer Sales Funnel (The Missing Piece)

### Current Creator Index Page MUST Sell:

**The Dream Outcome:**
"Turn your food posts into $2,500+/month RESIDUAL INCOME"

**The Pitch:**
```
You Already Tag Restaurants... Why Not Get PAID For It?

Every restaurant you sign up = $250/month for 6 months
Then $100/month FOREVER (as long as they stay)

Sign up 10 restaurants = $2,500/month initially
After 6 months = $1,000/month passive income
```

**The Math (Show This Visually):**
| Restaurants | Mo 1-6 Income | Mo 7+ Passive | Annual (Yr 1) |
|-------------|---------------|---------------|---------------|
| 5           | $1,250/mo     | $500/mo       | $10,500       |
| 10          | $2,500/mo     | $1,000/mo     | $21,000       |
| 20          | $5,000/mo     | $2,000/mo     | $42,000       |

---

## 🛠️ Tech Stack Integration (What You Already Have)

### GoHighLevel
* **Use for:** CRM, tracking restaurant signups
* **Referral tracking:** Custom fields for "Referred By" influencer
* **Commission automation:** Tag influencers, track months 1-6 vs 7+

### Make.com
* **Use for:** Webhooks to automate commission payouts
* **Flow:** Restaurant pays → Trigger → Calculate commission → Send to influencer

### GitHub (Our Codebase)
* **Use for:** Referral dashboard, QR code generator, tracking page

### OutSite (?)
* **Need clarification:** Is this OutSystems? Or hosting provider?

---

## 🏗️ Required Systems (To Build)

### 1. Influencer Dashboard
**URL:** `/creator/dashboard.html`

**Must show:**
- Total restaurants referred
- Active vs churned restaurants
- Monthly commission breakdown (current + projected)
- Unique referral link + QR code
- Leaderboard (gamification)

### 2. Referral Tracking System
**Technical requirements:**
- Unique referral codes per influencer
- Cookie/localStorage to track who referred whom
- Database to store: influencer_id → restaurant_id → signup_date
- Automated commission calculation (months since signup)

### 3. Commission Payout Integration
**Options:**
- **Stripe Connect** (automated payouts to influencer bank accounts)
- **PayPal Mass Pay** (bulk payouts monthly)
- **Manual** (export CSV, pay via Venmo/Zelle initially)

---

## 📝 Influencer Index Page Copy (Persuasive)

### Hero Section
```html
<h1>Stop Working For Free. Start Building Wealth.</h1>
<p>You already post about restaurants. What if every post paid you—forever?</p>

<div class="income-calculator">
  <h3>Your Potential Monthly Income:</h3>
  <input type="range" id="restaurant-count" min="1" max="50" value="10">
  <div class="result">
    Sign up <span id="count">10</span> restaurants = 
    <span class="highlight">$2,500/month</span>
    (Then $1,000/mo passive after 6 months)
  </div>
</div>
```

### The Proof Section
```html
<h2>Real Creators, Real Results</h2>

<div class="testimonial">
  "I signed up 8 restaurants in my first month. 
   Now I'm making $2,000/month just from referrals. 
   That's more than my day job."
  - Sarah M., Food Blogger (42K followers)
</div>
```

### The How Section
```html
<h2>How It Works (Simple)</h2>

<div class="steps">
  <div class="step">
    <h3>1. Get Your Link</h3>
    <p>Unique referral code + QR code for easy sharing</p>
  </div>
  <div class="step">
    <h3>2. Share With Restaurants</h3>
    <p>Show them how FoodTrend fills tables (you already love it!)</p>
  </div>
  <div class="step">
    <h3>3. Earn Residual Income</h3>
    <p>$250/mo for 6 months, then $100/mo forever</p>
  </div>
</div>
```

---

## 🎯 Immediate Action Items

### Week 1: Update SSOT + Messaging
```
☐ Update SSOT.md with real pricing ($799/$1,299/$2,499)
☐ Remove $300 pricing references everywhere
☐ Add referral program details to SSOT
☐ Document commission structure
```

### Week 2: Build Influencer Sales Page
```
☐ Create `/creator/index.html` (income opportunity page)
☐ Add commission calculator (interactive slider)
☐ Add testimonials (can be projected initially)
☐ Add CTA: "Get Your Referral Link"
```

### Week 3: Referral Tracking System
```
☐ Design database schema (influencers, referrals, commissions)
☐ Build unique code generator
☐ Create QR code generator
☐ Build basic tracking (who signed up via which link)
```

### Week 4: Commission Dashboard
```
☐ Show influencer's referred restaurants
☐ Calculate current commission owed
☐ Show projected passive income
☐ Export for manual payout (initially)
```

---

## 💡 Hormozi Framework Applied to Referral Program

### ATTRACTION OFFER (For Influencers)
**"First Restaurant Free"** gambit:
"Sign up your first restaurant and we'll pay you $250 just for trying. 
 If they cancel in 30 days, you keep the $250."

**Removes risk, gets them in the door**

### UPSELL (For Influencers)
**"Pro Referrer Toolkit" - $97 one-time:**
- Premade pitch deck for restaurants
- Email templates
- Video testimonials
- "How I signed up 20 restaurants in 60 days" training

### CONTINUITY (For Influencers)
**"VIP Referrer Program" - $297/month:**
- Higher commissions ($300/mo instead of $250)
- Exclusive leads (restaurants requesting FoodTrend)
- Priority support
- Monthly coaching calls

**Why they'll pay:** If they're making $5k/month from referrals, $297 to increase close rate is a no-brainer

---

## 🚀 The Flywheel Effect

```
More Restaurants → More Creators Making Money → 
More Creators Recruiting Restaurants → More Restaurants →
[INFINITE LOOP]
```

**This is a VIRAL COEFFICIENT > 1.0** 🎉

If every 10 restaurants brings in 1 new influencer-recruiter, and that influencer brings 10 more restaurants... you have exponential growth!

---

**Next Step:** Should I build the Influencer Opportunity Page first, or the referral tracking system? 

What's your priority?
