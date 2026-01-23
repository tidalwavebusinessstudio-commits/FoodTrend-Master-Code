---
description: Copy Prime Directive system to a new project and initialize it
---

# Start New Project (With Prime Directive)

This workflow ensures every new project starts with the full Prime Directive system from day 1.

---

## Steps

### 1. Copy the .agent brain to new project

```powershell
# Windows PowerShell
xcopy "C:\Users\Owner\OneDrive\Documents\GitHub\FoodTrend-Master-Code\FoodTrend_App\.agent" "C:\path\to\new\project\.agent" /E /I

# Verify it copied
dir "C:\path\to\new\project\.agent"
```

**What gets copied:**
- ✅ PRIME_DIRECTIVE.md (the rules)
- ✅ troubleshooting.md (all your learnings)
- ✅ workflows/ (automated processes)
- ✅ scripts/ (crash data collector, etc.)
- ✅ errors/ (error log templates)
- ✅ GEMINI_REFINEMENT_PROMPT.md (AI helper)
- ✅ GEMINI_DAILY_DRIVER.md (quick AI helper)
- ✅ HOW_TO_USE.md (this guide)

---

### 2. Customize for the new project

```powershell
# Open these files and update project name/path
code "C:\path\to\new\project\.agent\GEMINI_REFINEMENT_PROMPT.md"
# Change line 13: Path: C:\path\to\new\project\

code "C:\path\to\new\project\.agent\GEMINI_DAILY_DRIVER.md"
# Change line 11: PROJECT: C:\path\to\new\project\
```

**Find and replace:**
- `FoodTrend-Master-Code\FoodTrend_App` → Your new project path
- `FoodTrend` → Your new project name

---

### 3. Initialize version control

```powershell
cd "C:\path\to\new\project"

git add .agent/
git commit -m "Prime Directive initialized - Starting at Fib(1)"
```

---

### 4. Copy self-healing utilities (if applicable)

If your project uses JavaScript/HTML:

```powershell
# Copy the core utilities
xcopy "C:\Users\Owner\OneDrive\Documents\GitHub\FoodTrend-Master-Code\FoodTrend_App\js\logger.js" "C:\path\to\new\project\js\logger.js*" /Y
xcopy "C:\Users\Owner\OneDrive\Documents\GitHub\FoodTrend-Master-Code\FoodTrend_App\js\dom-utils.js" "C:\path\to\new\project\js\dom-utils.js*" /Y
```

Then add to your HTML files:
```html
<script src="js/logger.js"></script>
<script src="js/dom-utils.js"></script>
```

---

### 5. Reset iteration counter

Open `.agent/troubleshooting.md` and reset the System Evolution section:

```markdown
## 🔄 System Evolution (Fibonacci Iterations)

**v1 (Fib=1):** [Your new project name] initialized with Prime Directive system
- Copied from FoodTrend master template
- Ready for systematic growth

**Next iteration (Fib=2):** First feature implementation with error logging
```

---

### 6. Verify setup

```powershell
# Check all key files exist
dir .agent\PRIME_DIRECTIVE.md
dir .agent\troubleshooting.md
dir .agent\workflows\debug-issue.md
dir .agent\GEMINI_REFINEMENT_PROMPT.md
dir .agent\HOW_TO_USE.md
```

If all files show up, you're good! ✅

---

### 7. Read the manual (5 minutes)

```powershell
code .agent\HOW_TO_USE.md
```

Print out the cheat sheet and tape it to your monitor.

---

## Success Criteria

- ✅ `.agent/` folder exists in new project
- ✅ All core files are present
- ✅ Project paths are updated in prompts
- ✅ Git commit made
- ✅ You've read HOW_TO_USE.md

**You're now ready to build with the Prime Directive system!** 🚀

---

## Notes

- The .agent folder is **portable and project-agnostic**
- Your troubleshooting.md will grow unique to each project
- The GEMINI prompts work for any codebase
- Copy this folder to **every single project** you start
- Update it in one project? Copy improvements back to your "master" template

**Build once, reuse everywhere.** That's the power of systematic thinking.
