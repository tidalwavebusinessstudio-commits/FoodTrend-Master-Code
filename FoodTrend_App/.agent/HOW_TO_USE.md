# How to Use the Prime Directive System (3rd Grade Edition)

**You don't need to be a genius. Just follow these 3 steps every single time.**

---

## 🚀 The 3-Step Rocket Launch

### Step 1: Copy the .agent folder to any new project
```powershell
# From Windows PowerShell
xcopy "C:\Users\Owner\OneDrive\Documents\GitHub\FoodTrend-Master-Code\FoodTrend_App\.agent" "C:\path\to\new\project\.agent" /E /I
```

**What this does:** Brings the entire Prime Directive brain to your new project.

---

### Step 2: Before ANY coding work, run this checklist

#### 2A. Starting Work on Something?
```
☐ Open .agent/troubleshooting.md
☐ Search Quick Reference table for your issue
☐ If found → apply the fix
☐ If not found → continue to 2B
```

#### 2B. Got an Error or Bug?
```
☐ Use /debug-issue workflow (it forces you to document)
☐ Create error log in .agent/errors/[category]/
☐ Add to troubleshooting.md
☐ If you fix it twice → create automation
```

#### 2C. Want AI Help? (Gemini/ChatGPT)
```
☐ Open .agent/GEMINI_REFINEMENT_PROMPT.md
☐ Copy the entire prompt
☐ Paste into Gemini
☐ Attach 2-4 files it asks for
☐ Get PATCH BLOCKS back

BEFORE APPLYING AI SUGGESTIONS:
☐ Does patch include TARGET CONTENT? (anti-hallucination check)
☐ Does TARGET CONTENT exist in your file? (verify yourself)
☐ Is patch <50 lines? (resource efficiency)
☐ Can you apply in <5 min? (sustainable)

IF ANY = NO → Request smaller/verified patch
THEN: Apply them
```

---

### Step 3: After every session, do this 30-second ritual

```
☐ git add .agent/
☐ git commit -m "Prime Directive update: [what you learned]"
☐ Update .agent/troubleshooting.md System Evolution section with new Fib score
```

**Why:** Your .agent folder becomes smarter every time. Future you will thank past you.

---

## 🎯 Quick Decision Tree (When You're Stuck)

```
Do I have an error/bug?
├─ YES → Use /debug-issue workflow
│         → Document in .agent/errors/
│         → Add to troubleshooting.md
│
└─ NO → Am I adding a feature?
        ├─ YES → Check .agent/troubleshooting.md first
        │         → Use GEMINI_REFINEMENT_PROMPT.md for help
        │         → Apply patch blocks
        │
        └─ NO → Just exploring/learning?
                 → Read .agent/PRIME_DIRECTIVE.md
                 → Read .agent/troubleshooting.md
                 → Enjoy!
```

---

## 🔥 Power Moves (Advanced but Still Simple)

### Daily Driver (Quick AI Tasks)
1. Open `.agent/GEMINI_DAILY_DRIVER.md`
2. Fill in CONTEXT, ISSUE, TASK
3. Paste to Gemini
4. Verify patch TARGET CONTENT exists in your file ⚠️
5. Apply (only if <50 lines and <5 min) ✅

### Crash Detective Mode
1. Something crashed/froze?
2. Run: `node .agent/scripts/collect-crash-data.js`
3. It auto-generates a crash report
4. Paste report into Gemini for analysis

### Anti-Hallucination Guard
**When AI suggests code:**
1. Does it show exact TARGET CONTENT? (Not generic)
2. Does that content exist in YOUR file? (Search for it)
3. Can you verify the expected outcome? (Test prediction)
4. If ANY doubt → Request proof with line numbers

### Resource Efficiency Check
**Every Fib(5) iterations (~5 sessions):**
```powershell
# Check system health
tasklist | findstr "Code.exe chrome.exe"
# If >80% memory → restart, take break
```

### Fibonacci Score Check
Every Friday:
```
☐ Read .agent/troubleshooting.md System Evolution
☐ Ask yourself: "Did I level up this week?"
☐ Update your Fib score (be honest)
☐ If stuck at same score for 2 weeks → use GEMINI_REFINEMENT_PROMPT.md
```

---

## 🎓 Philosophy (The Secret Sauce)

**You don't need a PhD. You need:**
1. **Consistency** - Use the checklist EVERY time
2. **Documentation** - Write it down (your .agent files do this)
3. **Automation** - Fix once = document, fix twice = automate
4. **AI Partnership** - Let Gemini do the hard thinking via the prompts

**The .agent folder is your external hard drive brain.** It remembers everything so you don't have to.

---

## 📋 One-Page Cheat Sheet (Print This Out)

```
┌─────────────────────────────────────────────────────────────┐
│                   PRIME DIRECTIVE CHEAT SHEET               │
├─────────────────────────────────────────────────────────────┤
│ BEFORE CODING:                                              │
│ ☐ Check .agent/troubleshooting.md Quick Reference          │
│                                                              │
│ GOT AN ERROR:                                               │
│ ☐ /debug-issue workflow                                     │
│ ☐ Log to .agent/errors/[category]/                         │
│ ☐ Document in troubleshooting.md                           │
│                                                              │
│ NEED AI HELP:                                               │
│ ☐ Use GEMINI_REFINEMENT_PROMPT.md (full)                   │
│ ☐ OR GEMINI_DAILY_DRIVER.md (quick)                        │
│ ☐ Get patch blocks                                          │
│ ☐ VERIFY: Target content exists in file ⚠️                 │
│ ☐ VERIFY: Patch <50 lines, <5 min to apply ⚡               │
│ ☐ Apply them                                                │
│                                                              │
│ AFTER SESSION:                                              │
│ ☐ git add .agent/                                           │
│ ☐ git commit -m "Update: [what I learned]"                 │
│ ☐ Update Fib score if you leveled up                       │
│                                                              │
│ CRASHED/FROZE:                                              │
│ ☐ node .agent/scripts/collect-crash-data.js                │
│ ☐ Paste report into Gemini                                  │
│                                                              │
│ RESOURCE CHECK (every Fib 5 sessions):                      │
│ ☐ System resources OK? (<80% CPU/memory)                   │
│ ☐ Sessions <10 min each? (sustainable)                     │
│ ☐ If NO → Take break, apply efficiency protocol            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 Level Progression (Fibonacci Style)

**Fib(1-2): Baby Steps** - You're learning the system  
→ Just use the checklist above religiously

**Fib(3-5): Getting Good** - System is becoming automatic  
→ Start creating workflows for repeated tasks

**Fib(8): Self-Healing** - Your code recovers from errors gracefully  
→ logger.js and dom-utils.js are integrated everywhere

**Fib(13): Near-Perfect** - You're basically a 10x developer now  
→ You teach others this system

---

## 💡 Remember

**You're not trying to be smart. You're trying to be SYSTEMATIC.**

Smart people forget stuff. Systems remember everything.

Your .agent folder + this checklist = Your unfair advantage.

**Every error is a gift. Every bug is a lesson. Every crash is data.**

Document it once, never struggle with it again.

---

## 🆘 Emergency Contacts

**Stuck and don't know what to do?**
1. Open `.agent/PRIME_DIRECTIVE.md` - Re-read the rules
2. Open `.agent/troubleshooting.md` - Search for similar issues
3. Use `GEMINI_REFINEMENT_PROMPT.md` - Let AI solve it
4. Update `.agent/troubleshooting.md` - So you never get stuck here again

**The system works if you work the system.** 🚀
