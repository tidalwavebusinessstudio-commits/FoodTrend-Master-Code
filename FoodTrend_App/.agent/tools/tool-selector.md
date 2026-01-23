# Tool Selector Decision Flow

**When you need to do something, use this flowchart! 📊**

---

## 🎯 The 4-Question Method

```
┌─────────────────────────────────────────────┐
│  STEP 1: What am I trying to do?           │
└─────────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Pick ONE from below:  │
         └───────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    IMAGES?                 CODE/TESTING?
         │                       │
         ▼                       ▼
   [Go to A]               [Go to B]
         
         │                       │
    HOSTING?                AUTOMATION?
         │                       │
         ▼                       ▼
   [Go to C]               [Go to D]
```

---

## A) IMAGE TASKS

```
What do you need?
├─ Compress images (make smaller)
│  → Use: Squoosh (READY NOW, FREE)
│  → How: squoosh.app → drag image → download
│
├─ Remove background
│  → Use: Remove.bg (READY NOW, FREE 50/mo)
│  → How: remove.bg → upload → download PNG
│
├─ Make a banner/graphic
│  → Use: Canva Free (NEEDS 5 MIN SETUP)
│  → How: canva.com → sign up → create design
│
└─ Host image online
   → Use: Imgbb (READY NOW, FREE)
   → How: imgbb.com → upload → copy link
```

**Free? ✅ All FREE**  
**Setup? Only Canva (5 min signup)**

---

## B) CODE & TESTING TASKS

```
What do you need?
├─ Find errors / see console
│  → Use: Browser DevTools (READY NOW, FREE)
│  → How: Press F12
│
├─ Test mobile/responsive layout
│  → Option 1: DevTools Device Mode (READY NOW)
│  → Option 2: Responsively app (NEEDS 10 MIN SETUP)
│  → How: F12 → click device icon OR download responsively.app
│
├─ Check website speed/performance
│  → Use: Lighthouse (READY NOW, FREE)
│  → How: F12 → Lighthouse tab → Generate report
│
├─ Auto-refresh browser when coding
│  → Use: Live Server (NEEDS 2 MIN SETUP)
│  → How: VS Code → Extensions → Install "Live Server"
│
└─ Auto-format messy code
   → Use: Prettier (NEEDS 3 MIN SETUP)
   → How: VS Code → Extensions → Install "Prettier"
```

**Free? ✅ All FREE**  
**Setup? VS Code extensions (2-3 min each)**

---

## C) HOSTING & DEPLOYMENT TASKS

```
What do you need?
├─ Host a website (static HTML/CSS/JS)
│  → Option 1: GitHub Pages (NEEDS 5 MIN SETUP)
│  → Option 2: Netlify (NEEDS 10 MIN SETUP)
│  → How: GitHub repo → Settings → Pages → Enable
│
├─ Auto-deploy on git push
│  → Use: Netlify (NEEDS 10 MIN SETUP)
│  → How: netlify.com → New site → Connect repo
│
└─ Already using Git for version control
   → Use: GitHub (READY NOW - you have this!)
   → How: git add → git commit → git push
```

**Free? ✅ All FREE**  
**Setup? GitHub Pages (5 min) or Netlify (10 min)**

---

## D) AUTOMATION & WORKFLOW TASKS

```
What do you need?
├─ Send form data to email/sheet
│  → Use: Make.com webhook (NEEDS 30 MIN SETUP)
│  → How: make.com → Webhook → Add to form
│  → Limit: 1,000/month free (30/day)
│
├─ Run JavaScript automation scripts
│  → Use: Node.js (CHECK IF INSTALLED FIRST)
│  → How: Run `node --version` in terminal
│  → If error: Download from nodejs.org (10 min)
│
└─ Copy files, run commands
   → Use: PowerShell (READY NOW, FREE)
   → How: Open terminal, run commands
```

**Free? ✅ All FREE**  
**Setup? Make.com (30 min), Node.js if not installed (10 min)**

---

## 🚦 The Decision Tree (Detailed)

```
START
  │
  ▼
Is there a free tool? ────NO──→ Can we wait? ─YES─→ Add to wishlist
  │                               │
 YES                             NO
  │                               │
  ▼                               ▼
Does it need setup? ────NO──→ USE IT NOW! ✅    Ask user for approval
  │                                              (Only paid tools!)
 YES
  │
  ▼
How long? 
  ├─ < 5 minutes → WORTH IT, do setup
  ├─ 5-15 min → Is it essential? YES→ Do it | NO→ Later
  └─ > 15 min → STOP! Ask user if worth the time

After setup?
  │
  ▼
Document in TOOLS_REGISTRY.md ✅
Add to shortcuts if you'll use often ✅
```

---

## 💰 The Cost Decision (Critical!)

```
Tool costs money?
  │
  ▼
How much?
  │
  ├─ FREE → ✅ USE IT
  │
  ├─ FREE with limits (like 50/month) → ✅ USE CAREFULLY
  │   └─ Track usage, don't waste quota
  │
  ├─ < $10/month 
  │   └─ Is there a free alternative? 
  │       ├─ YES → Use free one
  │       └─ NO → STOP ⛔ Ask user for approval first
  │
  └─ > $10/month → STOP ⛔ ALWAYS ask user
      └─ Find free alternative OR explain why essential
```

**YOU (AI) MUST:**
- ⛔ NEVER suggest paid tools without asking user first
- ✅ ALWAYS show free alternative if it exists
- ⚠️ WARN about free tier limits (don't blow quotas)

---

## 📋 Quick Reference (Cheat Sheet)

| I need to... | Use this | Cost | Setup | Time |
|--------------|----------|------|-------|------|
| Compress images | Squoosh | FREE | NO | 0 min |
| Remove background | Remove.bg | FREE* | NO | 0 min |
| Make graphics | Canva | FREE | YES | 5 min |
| See errors | DevTools | FREE | NO | 0 min |
| Check speed | Lighthouse | FREE | NO | 0 min |
| Test responsive | DevTools | FREE | NO | 0 min |
| Auto-refresh | Live Server | FREE | YES | 2 min |
| Format code | Prettier | FREE | YES | 3 min |
| Deploy site | GitHub Pages | FREE | YES | 5 min |
| Form→Email | Make.com | FREE* | YES | 30 min |

**FREE\* = Free with limits (check TOOLS_REGISTRY.md for details)**

---

## 🎯 Example Scenarios

### Scenario 1: "Images are too big"
```
Step 1: Check flowchart → IMAGES section
Step 2: See "Compress images"
Step 3: Use Squoosh (READY NOW)
Step 4: Done in 2 minutes ✅
```

### Scenario 2: "Need to test on mobile"
```
Step 1: Check flowchart → CODE/TESTING section
Step 2: See "Test responsive layout"
Step 3: Try DevTools first (READY NOW)
Step 4: If not enough → Install Responsively (10 min)
Step 5: Done ✅
```

### Scenario 3: "Want form submissions sent to email"
```
Step 1: Check flowchart → AUTOMATION section
Step 2: See "Form → Email"
Step 3: Make.com needs 30 min setup
Step 4: Ask user: "Is 30 min setup worth it? Alternative: Formspree (5 min)"
Step 5: User approves → Follow setup in TOOLS_REGISTRY.md
Step 6: Done ✅
```

### Scenario 4: "User wants to add analytics"
```
Step 1: Check TOOLS_REGISTRY → Google Analytics
Step 2: It's OPTIONAL (not required now)
Step 3: Ask user: "Do you need this now or can we add later?"
Step 4: User says later → Add to wishlist, continue coding
Step 5: Done ✅
```

---

## 🔄 Integration with Daily Ritual

**Add to morning check (30 seconds):**
```
☐ Do I need a new tool today?
☐ Check tool-selector.md
☐ Choose FREE option first
☐ If needs setup < 5 min → Do it now
☐ If needs setup > 5 min → Add to session plan
```

**Add to Friday review (2 minutes):**
```
☐ Did I use any new tools this week?
☐ Document them in TOOLS_REGISTRY.md
☐ Any tool I used 3+ times? → Create shortcut/alias
☐ Any paid tool I'm tempted by? → Find free alternative first
```

---

## ⚠️ Red Flags (Stop and Ask User)

**STOP if:**
- Tool costs > $5/month
- Setup takes > 30 minutes
- Tool asks for credit card ("free trial")
- Tool has bad reviews or seems sketchy
- Tool asks for unnecessary permissions
- There's NO free alternative listed

**ASK USER:**
"This tool costs $X/month. Should I suggest a free alternative instead?"

---

**Next step:** When you need a tool, start here → Follow the flow → Get work done! 🚀

**Still stuck?** Check `.agent/tools/TOOLS_REGISTRY.md` for full details on each tool.
