# Resource Efficiency Protocol

**Mission:** Never crash. Never overload. Always keep going.

---

## ⚡ The 3 Rules of Sustainable Execution

### Rule 1: INCREMENTAL OVER COMPLETE

**Bad:** "Implement entire authentication system"  
**Good:** "Add login form validation (Fib 1), then add submit handler (Fib 2), then add error display (Fib 3)"

**Pattern:**
```
Big Task → Break into Fibonacci steps → Execute smallest first → Verify → Next
```

**Why:** If step 1 fails, you didn't waste resources on steps 2-5.

---

### Rule 2: ONE THING AT A TIME

**Token Budget Per AI Request:**

| Task Type | Max Input | Max Output | Total Tokens |
|-----------|-----------|------------|--------------|
| Quick fix | 2000 | 1000 | 3000 |
| Medium task | 5000 | 2000 | 7000 |
| Large task | 10000 | 5000 | 15000 |
| NEVER | >15000 | >5000 | >20000 |

**If you hit limits → STOP and break into smaller requests.**

---

### Rule 3: FAST FEEDBACK LOOPS

**Execution Pattern:**
```
Code 5 min → Test 1 min → Adjust 2 min → Repeat

NOT: Code 3 hours → Test → Everything broken → Cry
```

**Fibonacci Time Boxes:**
- Fib(1): 5 minutes
- Fib(2): 10 minutes  
- Fib(3): 15 minutes
- Fib(5): 25 minutes
- Fib(8): 40 minutes
- **NEVER exceed Fib(8) without testing**

---

## 🔋 Resource Monitoring

### System Health Check (Every Hour)

```powershell
# Memory
tasklist | findstr "Code.exe|chrome.exe|node.exe"

# CPU
wmic cpu get loadpercentage

# Disk
wmic logicaldisk get size,freespace

# If ANY > 80% → Take a break, restart processes
```

---

### Agent Health Check (Every Gemini Request)

**Before sending to Gemini:**
```
☐ Is prompt under 15k tokens? (use token counter)
☐ Am I asking for ONE specific thing?
☐ Did I include only necessary context?
☐ Can I break this into smaller requests?
```

**After receiving response:**
```
☐ Did I get patch blocks (good) or essays (bad)?
☐ Can I apply this in <5 min?
☐ If NOT → too complex, re-request smaller chunks
```

---

## 🎯 Efficiency Patterns

### Pattern 1: Progressive Enhancement

**Instead of:** Build entire feature at once  
**Do this:**
```
Session 1: HTML structure only (Fib 1)
Session 2: Basic CSS styling (Fib 2)  
Session 3: Core JavaScript (Fib 3)
Session 4: Error handling (Fib 5)
Session 5: Polish + optimization (Fib 8)
```

**Each session = working state. Never broken.** ✅

---

### Pattern 2: Lazy Loading Everything

**Code:**
```javascript
// Bad: Load everything upfront
import { moduleA, moduleB, moduleC, moduleD } from 'huge-lib';

// Good: Load on demand
async function useModuleA() {
  const { moduleA } = await import('huge-lib');
  return moduleA();
}
```

**Files:**
- Images: Lazy load with `loading="lazy"`
- Scripts: Defer non-critical with `defer`
- CSS: Split critical/non-critical

**Why:** Faster initial load = less resource usage = more iterations possible.

---

### Pattern 3: Cached Decisions

**Create:** `.agent/decisions.md`

**Log every architectural decision:**
```markdown
# Decision Log

## 2026-01-23: Use localStorage for session management

**Context:** Need fast session state  
**Options:** Cookies, localStorage, sessionStorage  
**Chosen:** localStorage  
**Why:** Persistent, 10MB limit, simple API  
**Trade-offs:** Not secure for sensitive data (addressed with encryption)

**If this question comes up again → Use this decision. No re-analysis.**
```

**Why:** Don't waste tokens/time re-debating solved problems.

---

## 🛡️ Crash Prevention

### Before Every Code Change

```
☐ Git status (is everything committed?)
☐ Git branch (am I on a feature branch?)
☐ Backup .agent/ folder (xcopy .agent .agent_backup_YYYYMMDD)
```

**If anything goes wrong → instant rollback:**
```powershell
git reset --hard HEAD
xcopy .agent_backup_YYYYMMDD .agent /E /Y
```

---

### Graceful Degradation Rules

**Every feature must have a fallback:**

```javascript
// Feature: Auto-save
try {
  localStorage.setItem('draft', content);
} catch (e) {
  // Fallback: Manual save button
  window.Logger?.logError('javascript', { 
    error: e, 
    message: 'localStorage failed, manual save required' 
  });
  showManualSaveButton();
}
```

**Priority levels:**
1. **Critical** - App unusable without it (e.g., login)
2. **Important** - Major feature (e.g., form validation)
3. **Nice-to-have** - Enhancement (e.g., animations)

**If resources tight → Skip level 3, simplify level 2.**

---

## 🚀 Performance Budget

### Asset Budgets (Never Exceed)

| Asset Type | Budget | Enforcement |
|------------|--------|-------------|
| JavaScript | 200KB | Minify + defer |
| CSS | 50KB | Critical inline, rest defer |
| Images | 100KB each | Compress + lazy load |
| Fonts | 50KB | Subset + preload |
| Total Page | 500KB | Lighthouse budget |

**Check with:**
```powershell
# File size
dir [filename] | findstr "bytes"

# If > budget → compress or lazy load
```

---

## 🔄 The Sustainable Development Loop

```
┌─────────────────────────────────────────┐
│  1. Plan (2 min)                        │
│     → What's the smallest next step?    │
│                                          │
│  2. Code (5 min max)                    │
│     → Implement ONE thing               │
│                                          │
│  3. Test (1 min)                        │
│     → Does it work? Errors?             │
│                                          │
│  4. Commit (30 sec)                     │
│     → git add + commit                  │
│                                          │
│  5. Repeat ──────────────────────────┐  │
│     ↑                                 │  │
│     └─────────────────────────────────┘  │
└─────────────────────────────────────────┘

Every 5 iterations (Fib 5):
  → Take 5-min break
  → Check system resources
  → Review progress

Every 8 iterations (Fib 8):
  → Update troubleshooting.md
  → Push to git
  → Celebrate win 🎉
```

---

## 📊 Metrics to Track

**Create:** `.agent/metrics.md`

```markdown
# Development Metrics

| Date | Sessions | Lines Changed | Errors Hit | Avg Session Time | Fib Score |
|------|----------|---------------|------------|------------------|-----------|
| 2026-01-23 | 5 | 150 | 2 | 8 min | 5 |
| 2026-01-24 | 6 | 200 | 1 | 7 min | 5 |

## Targets
- Avg session time: <10 min (sustainable)
- Errors per session: <3 (learning)
- Lines per session: 50-300 (efficient)
```

**If metrics worsen → you're overloading. Scale back.**

---

## 🎯 AI Request Optimization

### BEFORE Sending to Gemini:

**Compress your context:**
```
Bad (5000 tokens):
[Paste entire 500-line file]

Good (500 tokens):
File: utils.js
Relevant function (lines 47-82):
[Paste only the 35 relevant lines]

Context: This function handles user validation
Issue: Returns undefined when email invalid
Expected: Should return error object
```

**10x token savings = 10x more iterations possible.**

---

### Template for Efficient AI Requests:

```
CONTEXT (1 sentence):
[What you're working on]

CURRENT STATE (3-5 lines):
[Paste only relevant code]

ISSUE (1 sentence):
[What's wrong]

EXPECTED (1 sentence):
[What should happen]

CONSTRAINTS:
- Must work with existing [X]
- Cannot add dependencies
- Must be < 20 lines

DELIVERABLE:
Patch block for lines [X-Y] only
```

**Result:** Clear request + small response + fast iteration.

---

## 🆘 Emergency Protocols

### If System Feels Slow:

```powershell
# Close unnecessary apps
taskkill /F /IM chrome.exe  # (if not needed)
taskkill /F /IM Teams.exe

# Clear temp files
del %TEMP%\* /Q

# Restart editor
# (saves state, fresh memory)
```

---

### If AI Feels Confused:

**Reset context with minimal prompt:**
```
Ignore previous. Fresh start.

Project: FoodTrend
File: [specific file]
Task: [one specific thing]

Show me patch block for just this one thing.
```

---

### If You Feel Overwhelmed:

**STOP. Breathe. Use Fibonacci reset:**
```
Fib(0): Close everything. Take 5-min break.
Fib(1): Open just ONE file. Fix ONE thing.
Fib(1): Test it. Commit it.
Fib(2): Open second file. Fix related thing.
Fib(3): Integrate. Test together.

Momentum restored ✨
```

---

## 💡 The Philosophy

> **"Slow is smooth. Smooth is fast. Fast is sustainable."**

**Rushing = crashes, errors, burnout**  
**Incremental = steady, reliable, unstoppable**

**The tortoise beats the hare. Every time.**

Fibonacci isn't just about quality. It's about **sustainability**.

---

## 🔗 Integration

**Add to DAILY_RITUAL.md:**
```
Resource check (2 min/day):
☐ System resources OK? (<80% CPU/memory)
☐ Session times reasonable? (<10 min avg)
☐ Making progress without burnout?

If NO → Apply Resource Efficiency Protocol
```

**Add to HOW_TO_USE.md:**
```
Every session:
☐ Plan smallest next step (Fibonacci-sized)
☐ Code max 5-10 minutes
☐ Test immediately
☐ Commit working state
☐ Repeat

Never exceed 40-min (Fib 8) without break ✅
```

---

## 🏆 Success Metrics

**You're doing it right when:**
- ✅ Sessions feel easy, not exhausting
- ✅ You commit every 10-15 minutes
- ✅ Errors are rare and quickly fixed
- ✅ You can stop anytime and resume later
- ✅ Progress is steady, not sporadic

**You're overloading when:**
- ❌ Sessions drag beyond 30 minutes
- ❌ You haven't committed in over an hour
- ❌ You're fixing bugs from 3 steps ago
- ❌ You dread opening the editor
- ❌ Resources spike (CPU, memory, tabs)

**Adjust accordingly. The system adapts to you.** 🎯
