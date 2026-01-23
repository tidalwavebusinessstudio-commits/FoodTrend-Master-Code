# Daily Ritual (2 Minutes Every Day)

**Do this BEFORE you write any code. Every. Single. Day.**

---

## ☀️ Morning Startup (60 seconds)

```
☐ Open .agent/troubleshooting.md
☐ Skim the Quick Reference table
☐ Read the last System Evolution entry
☐ Ask yourself: "What am I building today?"
```

**That's it.** Your brain now has context.

---

## 💻 While Coding (Reactive)

### If you see an error:
```
1. Don't panic
2. Copy error message
3. Search .agent/troubleshooting.md for it
4. If found → apply fix
5. If NOT found → use /debug-issue workflow
```

### If something breaks:
```
1. Run: node .agent/scripts/collect-crash-data.js
2. Get crash report
3. Paste into .agent/errors/[category]/YYYY-MM-DD_description.md
4. Use GEMINI_REFINEMENT_PROMPT.md if you can't figure it out
```

### If you're stuck for >15 minutes:
```
1. Open .agent/GEMINI_DAILY_DRIVER.md
2. Fill in CONTEXT, ISSUE, TASK
3. Paste to Gemini
4. Get patch blocks
5. Apply them
6. Document the solution in .agent/troubleshooting.md
```

---

## 🌙 Evening Shutdown (60 seconds)

```
☐ git add .agent/
☐ git commit -m "Session update: [brief description]"
☐ If you leveled up today, update Fib score in troubleshooting.md
```

**Example commit messages:**
- "Session update: Fixed form validation bug, added to troubleshooting"
- "Session update: Implemented logger.js on dashboard page"
- "Session update: Leveled up to Fib(5) - self-healing now active"

---

## 📅 Friday Review (5 minutes)

**Every Friday afternoon:**

```
☐ Open .agent/troubleshooting.md
☐ Read System Evolution section
☐ Count how many new entries you added this week
☐ Update your Fib score honestly:
   - Fib(1-2): Learning the system
   - Fib(3-5): System is working, you're documenting
   - Fib(8): Code self-heals from errors
   - Fib(13): You're teaching others

☐ If stuck at same score for 2 weeks:
   → Use GEMINI_REFINEMENT_PROMPT.md for a comprehensive upgrade
```

---

## 🎯 Monthly Deep Clean (15 minutes)

**First Monday of every month:**

```
☐ Review all .agent/errors/ logs
☐ Identify top 3 repeated errors
☐ For each repeated error:
   → Create automation (script or workflow)
   → Add to troubleshooting.md
   → Delete old error logs (they're documented now)

☐ Update .agent/README.md with new learnings
☐ Copy improvements back to your master template
```

---

## 🔥 The Non-Negotiables

**These are MANDATORY. No exceptions.**

1. **Check troubleshooting.md BEFORE coding** (60 sec)
2. **Log every error to .agent/errors/** (2 min per error)
3. **Commit .agent/ changes daily** (60 sec)
4. **Friday Fib score check** (5 min)

**Total time investment: ~10 minutes per day**

**ROI: You become 10x faster within 3 months**

---

## 💡 Why This Works

**Your brain is terrible at remembering details.**  
→ The .agent folder remembers for you.

**You'll make the same mistakes repeatedly.**  
→ troubleshooting.md prevents this.

**You'll forget what worked.**  
→ Git commits preserve your wins.

**You'll plateau without reflection.**  
→ Friday reviews force growth.

---

## 🎮 Habit Stacking (Make it Automatic)

**Trigger → Action → Reward**

| Trigger | Action | Reward |
|---------|--------|--------|
| Open code editor | Read Quick Reference | Feel prepared |
| See an error | Use /debug-issue | Feel organized |
| End coding session | Git commit .agent/ | Feel accomplished |
| Friday afternoon | Fib score check | Feel progress |

**After 21 days, this becomes muscle memory.**

You won't even think about it. It'll just be how you code.

---

## 🆘 Emergency Mode (When Life Gets Crazy)

**Minimum viable ritual (if you only have 30 seconds):**

```
1. Check .agent/troubleshooting.md Quick Reference
2. Code
3. git commit .agent/ at end of day
```

**That's it. You're still in the system.**

---

## 📊 Track Your Streak

Create a file: `.agent/streak.md`

```
# Consistency Streak

| Date | Morning Check | Evening Commit | Notes |
|------|--------------|----------------|-------|
| 2026-01-23 | ✅ | ✅ | Started Prime Directive |
| 2026-01-24 | ✅ | ✅ | Fixed form bug |
| 2026-01-25 | ⬜ | ✅ | Forgot morning (weekend) |
```

**Goal: Don't break the chain.**

---

## 🏆 Milestones

**10-day streak:** You're building the habit  
**30-day streak:** This is now your default  
**90-day streak:** You're a Prime Directive master  
**180-day streak:** You should teach this to others  

---

## Remember

> **"We don't rise to the level of our goals. We fall to the level of our systems."**  
> — James Clear

The Prime Directive **is** your system.

Use it daily. Trust the process. Level up systematically.

**It's not about being smart. It's about being consistent.** 🚀
