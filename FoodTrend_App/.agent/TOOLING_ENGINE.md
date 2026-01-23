# Tooling & Extensions Engine (3rd Grader Edition)

**Like a toolbox, but for coding! 🧰**

---

## 🎯 What Is This?

Think of tools like different toys:
- **Some toys work right away** (just pick them up and play!)
- **Some toys need batteries** (you have to set them up first)
- **Some toys cost money** (we try FREE toys first!)

This document helps you pick the RIGHT tool for the job.

---

## 📊 Tool Categories Map

### 1️⃣ Images & Graphics

| Tool | What It Does | Free? | Setup Needed? | When to Use |
|------|-------------|-------|---------------|-------------|
| **Squoosh** | Makes pictures smaller (compress) | ✅ FREE | ❌ NO (website) | Before adding images to website |
| **Remove.bg** | Removes backgrounds from photos | ✅ FREE (50/mo) | ❌ NO (website) | Logo cleanup, product photos |
| **Canva Free** | Make simple graphics/banners | ✅ FREE | ✅ YES (account) | Social media images, quick designs |

**READY NOW:** Squoosh, Remove.bg  
**NEEDS SETUP:** Canva (need to create free account)

---

### 2️⃣ Testing & Debugging

| Tool | What It Does | Free? | Setup Needed? | When to Use |
|------|-------------|-------|---------------|-------------|
| **Browser DevTools** | See errors, test code | ✅ FREE | ❌ NO (built-in) | Every time you code! |
| **Lighthouse** | Checks website speed/quality | ✅ FREE | ❌ NO (built-in Chrome) | Before launching features |
| **Responsively** | See site on many screen sizes | ✅ FREE | ✅ YES (download app) | Testing mobile/tablet views |

**READY NOW:** Browser DevTools, Lighthouse  
**NEEDS SETUP:** Responsively (download from responsively.app)

---

### 3️⃣ Code Helpers

| Tool | What It Does | Free? | Setup Needed? | When to Use |
|------|-------------|-------|---------------|-------------|
| **VS Code** | Where you write code | ✅ FREE | ✅ YES (installed) | You already have this! |
| **Prettier** | Auto-fixes messy code spacing | ✅ FREE | ✅ YES (VS Code extension) | Keep code neat automatically |
| **Live Server** | Shows website as you type | ✅ FREE | ✅ YES (VS Code extension) | Testing changes instantly |

**READY NOW:** VS Code (you have it!)  
**NEEDS SETUP:** Prettier, Live Server (install from VS Code extensions)

---

### 4️⃣ Storage & Backups

| Tool | What It Does | Free? | Setup Needed? | When to Use |
|------|-------------|-------|---------------|-------------|
| **Git/GitHub** | Saves code versions (time machine!) | ✅ FREE | ✅ YES (installed) | You already use this! |
| **OneDrive** | Cloud backup for files | ✅ FREE (5GB) | ✅ YES (you have it) | Automatic file backup |
| **Imgbb** | Store images online | ✅ FREE | ❌ NO (website) | Host images without server |

**READY NOW:** Git/GitHub, OneDrive (you have these!)  
**NEEDS SETUP:** None - all ready!

---

### 5️⃣ Automation & Workflows

| Tool | What It Does | Free? | Setup Needed? | When to Use |
|------|-------------|-------|---------------|-------------|
| **Node.js** | Runs JavaScript on computer | ✅ FREE | ✅ YES (installed) | Run automation scripts |
| **PowerShell** | Runs commands on Windows | ✅ FREE | ❌ NO (built-in) | Copy files, run tasks |
| **Make.com** | Connects apps together | ✅ FREE (1000/mo) | ✅ YES (account + setup) | Auto-send form data to email/sheets |

**READY NOW:** PowerShell  
**NEEDS SETUP:** Node.js (check if installed), Make.com (webhook integration)

---

### 6️⃣ Performance & Speed

| Tool | What It Does | Free? | Setup Needed? | When to Use |
|------|-------------|-------|---------------|-------------|
| **Lighthouse** | Measures website speed | ✅ FREE | ❌ NO (built-in Chrome) | Check if site is fast enough |
| **WebP Converter** | Makes images tiny but pretty | ✅ FREE | ❌ NO (website) | Before adding large images |

**READY NOW:** Both ready to use!

---

## 🚦 The Decision Flow (Tool Selector)

**When you need to do something, ask these questions:**

```
1. What am I trying to do?
   ├─ Make images smaller → Use Squoosh (READY NOW)
   ├─ Test on mobile → Use DevTools responsive mode (READY NOW)
   ├─ Check website speed → Use Lighthouse (READY NOW)
   ├─ Auto-format code → Install Prettier (5 min setup)
   ├─ Send form data somewhere → Use Make.com webhook (NEEDS SETUP)
   └─ Something else → Check TOOLS_REGISTRY.md

2. Is there a FREE tool for this?
   ✅ YES → Use that one first!
   ❌ NO → Ask: "Do we really need this or can we wait?"

3. Does it need setup?
   ❌ NO → Use it right now! (READY NOW)
   ✅ YES → Follow setup steps in TOOLS_REGISTRY.md
   
4. Is it paid?
   ⚠️ STOP → Ask user: "This costs $X. Should I suggest a free alternative?"
```

---

## 💰 Cost Tiers (Our Rules)

**Tier 0: FREE FOREVER** ✅  
*Examples: Browser DevTools, Lighthouse, Git, PowerShell*  
**Rule:** Always try these FIRST

**Tier 1: FREE WITH LIMITS** ⚡  
*Examples: Remove.bg (50/mo), Canva Free, Make.com (1000/mo)*  
**Rule:** Use carefully, don't waste the free quota

**Tier 2: LOW COST (<$10/month)** 💵  
*Examples: Canva Pro ($12.99), Netlify Pro ($19)*  
**Rule:** Only if Tier 0-1 can't do the job AND you approve

**Tier 3: EXPENSIVE (>$10/month)** 🚫  
**Rule:** STOP. Always ask user first. Find free alternative.

---

## 🛡️ Safety Rules (No Bad Tools!)

**GREEN LIGHT (Safe):**
- Official websites (google.com, github.com, canva.com)
- Open source tools with many users
- Tools we already installed (VS Code, Git)
- Browser built-ins (DevTools, Lighthouse)

**YELLOW LIGHT (Check First):**
- New tools you haven't heard of
- Tools asking for credit card (even for "free trial")
- Browser extensions with few reviews

**RED LIGHT (Never Use):**
- Cracked software
- Tools promising "unlimited" paid features for free
- Sketchy download sites
- Tools asking for unnecessary permissions

---

## 📝 Tool Registry Format

**Each tool gets one entry like this:**

```markdown
### Tool Name

**Category:** Images / Testing / Code / Storage / Automation / Performance  
**Cost:** FREE / FREE (limits) / $X per month  
**Setup Time:** 0 min (ready now) / 5 min / 30 min  
**Status:** READY NOW / NEEDS SETUP / OPTIONAL

**What it does (3rd grader):**
[One simple sentence]

**When to use it:**
- Specific use case 1
- Specific use case 2

**Setup steps (if needed):**
1. Go to [website]
2. Do [thing]
3. Done!

**Safety notes:**
- ✅ Safe? YES / Use carefully / Only with permission

**Fallback if it fails:**
If this doesn't work, use [alternative tool] instead.
```

---

## 🤖 Automation Script Example

**What we'll build:** `tool-suggester.js`

**What it does:**
You type: "I need to make images smaller"  
It says: "Use Squoosh (FREE, READY NOW)"

**How it works:**
1. You run: `node .agent/scripts/tool-suggester.js "compress images"`
2. Script reads TOOLS_REGISTRY.md
3. Finds tools tagged with "images" + "compress"
4. Shows you the FREE options first
5. Tells you if setup is needed

**Simple version (we can build this!):**
- Node.js script
- Reads markdown file
- Searches for keywords
- Returns matching tools sorted by: FREE first, then READY NOW first

---

## 🔗 Integration with Prime Directive

**This tooling system follows our rules:**

1. **Fix Once → Document** (Tier 1)  
   Found a tool that works? Add it to TOOLS_REGISTRY.md

2. **Fix Twice → Automate** (Tier 2)  
   Keep choosing the same tool? Add shortcut to tool-suggester.js

3. **Fix Thrice → You Failed** (Tier 3)  
   Still doing it manually? Build a workflow automation

4. **Fibonacci Growth:**
   - Fib(1): Use what's READY NOW
   - Fib(2): Install simple tools (5 min setup)
   - Fib(3): Set up automations (Make.com webhooks)
   - Fib(5): Create custom scripts (tool-suggester)
   - Fib(8): Full integration (all tools working together)

---

## ✅ Quick Start Checklist

**To start using this system:**

```
☐ Read this file (you're doing it!)
☐ Check TOOLS_REGISTRY.md for the full list
☐ Install "must-have" tools (marked NEEDS SETUP, if you want them)
☐ When you need a tool → use the Decision Flow above
☐ Document any NEW tool you discover in TOOLS_REGISTRY.md
☐ Update troubleshooting.md if a tool doesn't work
```

---

## 🎓 Remember

**AI (like me) can't automatically use tools unless:**
- You installed them (like VS Code)
- You gave me access (like API keys)
- They're websites you visit yourself

**So I will ALWAYS tell you:**
- ✅ "This is READY NOW" (you can use it immediately)
- ⚠️ "This NEEDS SETUP" (you need to install/configure first)
- ℹ️ "This is OPTIONAL" (nice to have, not required)

**I will NEVER:**
- ❌ Claim I can use a tool you didn't set up
- ❌ Assume you have API keys
- ❌ Recommend paid tools without asking
- ❌ Suggest shady/illegal tools

---

## 📁 File Structure

```
.agent/
├── TOOLING_ENGINE.md (this file)
├── tools/
│   ├── TOOLS_REGISTRY.md (full tool list)
│   └── tool-selector.md (decision workflow)
├── scripts/
│   └── tool-suggester.js (automation helper)
└── workflows/
    └── setup-tool.md (how to install tools)
```

---

**Next step:** Check out `.agent/tools/TOOLS_REGISTRY.md` for the complete tool list! 🚀
