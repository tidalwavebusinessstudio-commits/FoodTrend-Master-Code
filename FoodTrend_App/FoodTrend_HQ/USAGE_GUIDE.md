# FoodTrend HQ Usage Guide

> **How to Maximize Your Notion-Based Operating System**

---

## 🏢 Structure Pages (Your Command Center)

| Page | Purpose | How to Use It |
|------|---------|---------------|
| **SOP Library** | Standard Operating Procedures | Document repeatable processes: "How to onboard a restaurant", "How to verify creator content", "How to handle refunds" |
| **Team & Roles** | Who does what | Define roles, responsibilities, and contact info. As you hire, add team members here |
| **To-Do / Sprints** | Active work tracking | Break work into weekly sprints. Track what's in progress, blocked, or done |
| **Website Notes** | Design & feature decisions | Document why you made specific UI choices, what to fix, feature ideas |
| **Decisions Log** | Historical record | Every major business decision with context, so you never forget WHY you chose something |

---

## 📄 Document Pages (Your Source of Truth)

| Document | Purpose | Why It Matters |
|----------|---------|----------------|
| **BUSINESS_DNA** | Locked business identity | Prevents hallucination about pricing, brand, or strategy. AI reads this FIRST |
| **OPERATING_SYSTEM** | AI behavior rules | Forces AI to follow specific protocols, never guess, and verify everything |
| **SALES_CHART_SPEC** | Chart requirements | Ensures sales pages use real data and proper comparisons |
| **DESIGN_GUARDRAILS** | Visual constraints | Keeps design consistent (colors, fonts, layout rules) |
| **QUALIFICATION_LOGIC** | Who qualifies | Defines the questions and scoring for restaurants + creators |
| **PINECONE_REGISTRY** | Memory categories | Organizes what gets stored in long-term memory |

---

## 🚀 Daily Workflow

### Morning Routine
1. Open **To-Do / Sprints**
2. Pick today's tasks
3. Work in Antigravity (reference HQ docs as needed)
4. Log any decisions in **Decisions Log**

### When Starting AI Conversations
Say: *"Check FoodTrend HQ in Notion before responding"*
This forces AI to read BUSINESS_DNA and OPERATING_SYSTEM first.

---

## 📝 Documentation Rules

| When This Happens... | Add It Here |
|---------------------|-------------|
| Make a pricing change | Decisions Log |
| Create a new workflow | SOP Library |
| Fix a tricky bug | Website Notes (so you remember the solution) |
| Hire someone | Team & Roles |
| Change business strategy | BUSINESS_DNA (update & re-sync) |

---

## 🔄 Syncing Local Changes to Notion

When you update documents locally (in your codebase), re-sync to Notion:

```powershell
cd backend
node scripts/sync-to-notion.js --sync
```

---

## 🔗 Future Integration Ideas

| Integration | Benefit |
|-------------|---------|
| **Notion → GoHighLevel** | Auto-create tasks when deals move stages |
| **Supabase → Notion** | Sync weekly metrics to a "Stats" page |
| **GitHub → Notion** | Log deployments and releases |
| **Pinecone → Notion** | Surface relevant long-term memories |

---

## The M.A.P.S. Framework

| Component | Status | Location |
|-----------|--------|----------|
| **M**ission | ✅ Complete | `BUSINESS_DNA.md` |
| **A**ctions | ✅ Complete | `OPERATING_SYSTEM.md` |
| **P**ast | ✅ Ready | `PINECONE_REGISTRY.md` |
| **S**tats | 📋 Planned | Supabase dashboard (upcoming) |

---

> **Bottom Line:** The more you use this system, the smarter it gets. Document everything important, and you'll never lose context again.
