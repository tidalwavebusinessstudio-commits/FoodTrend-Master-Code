# PRIME DIRECTIVE
## Meta-Rules That Precede All Other Rules, Guides, and Systems

**Status:** FOUNDATIONAL - This document supersedes all other rules, workflows, and guides.  
**Last Updated:** 2026-01-23  
**Principle:** Every system we create must be self-documenting, self-healing, and self-improving.

---

## 🎯 Core Tenets (In Order of Priority)

### 1. UNIVERSAL ERROR LOGGING
> **Every error is a learning opportunity that must be captured.**

**MANDATORY BEHAVIOR:**
- ✅ **All errors MUST be logged** - No exceptions
- ✅ **All fixes MUST be documented** - With root cause analysis
- ✅ **All solutions MUST be automated** - So they never require manual effort again

**Implementation Pattern:**
```
Error Occurs → 
Log to .agent/errors/[category]/[date]_[error-type].md →
Document root cause →
Create/Update automated fix →
Add to troubleshooting guide →
Create workflow if repeatable
```

**Categories:**
- `css-layout/` - Styling and layout errors
- `javascript/` - JS runtime and logic errors
- `build-deploy/` - Build process and deployment errors
- `integration/` - Third-party integration errors
- `agent-crash/` - AI agent crashes and freezes
- `system/` - System-level failures

**Log Format:**
```markdown
# [Error Type] - [Date]

## Error Details
- **Timestamp:** [ISO 8601]
- **Location:** [File:Line or Component]
- **Symptom:** [What the user saw]
- **Stack Trace:** [If available]

## Root Cause
[Why it happened]

## Fix Applied
[Code changes or solution]

## Prevention
[How to avoid in future]

## Automation Created
- [ ] Troubleshooting guide entry
- [ ] Workflow automation
- [ ] Unit test
- [ ] Documentation update
```

---

### 2. UNIVERSAL FIX AUTOMATION
> **If you solve it once, automate it so it never needs solving again.**

**MANDATORY BEHAVIOR:**
- ✅ **All fixes MUST include automation** - Workflow, script, or guide entry
- ✅ **All "how to use it" instructions MUST be automated** - No manual steps that can be scripted
- ✅ **All repetitive tasks MUST become workflows** - If done twice, automate it

**Automation Hierarchy:**
1. **Full Automation** (Best) - Script/tool that runs automatically
2. **Workflow Automation** (Good) - `.agent/workflows/[action].md` that guides execution
3. **Guide Automation** (Minimum) - Entry in troubleshooting guide with code examples

**Implementation Rule:**
```
When solving ANY issue:
1. Fix the immediate problem
2. IMMEDIATELY create automation (script, workflow, or guide)
3. Test the automation
4. Document where automation lives
5. Update references in other docs
```

**Example Pattern:**
```bash
# Bad: Manual fix without automation
"I fixed the overflow issue by changing overflow to visible"

# Good: Fix with automation
"I fixed the overflow issue. Added to troubleshooting guide. 
Created /debug-issue workflow that checks guide first.
Updated 3 related sections with cross-references."
```

---

### 3. CRASH/FREEZE DATA COLLECTION
> **System failures are the most valuable learning opportunities.**

**MANDATORY BEHAVIOR:**
- ✅ **Agent crashes MUST trigger automatic data collection**
- ✅ **Freezes/hangs MUST be logged with context**
- ✅ **Recovery patterns MUST be documented**

**Data Collection Protocol:**

**When Agent Crashes:**
```markdown
# Agent Crash Report - [Timestamp]

## Context at Crash
- **Last successful action:** [What worked]
- **Failed action:** [What was being attempted]
- **Open files:** [List of files in editor]
- **Recent commands:** [Last 5 commands executed]
- **Memory state:** [If available]

## Hypothesis
[Why it might have crashed]

## Recovery Steps
1. [What was done to recover]
2. [What was lost]
3. [How to prevent]

## Patterns Observed
- Similar crashes: [Link to related incidents]
- Common factors: [File size, complexity, etc.]

## Prevention Automation
[What was automated to prevent recurrence]
```

**Auto-Collection Script Location:**
- `.agent/scripts/collect-crash-data.js`
- Triggers on: Unhandled exceptions, timeouts, memory errors
- Saves to: `.agent/errors/agent-crash/[timestamp].md`

---

### 4. FIBONACCI-BASED CONTINUOUS IMPROVEMENT
> **Iterate toward perfection using the natural patterns of growth.**

**MANDATORY BEHAVIOR:**
- ✅ **All improvements follow Fibonacci progression** - 1, 1, 2, 3, 5, 8, 13...
- ✅ **Each iteration builds on previous two** - Like Fibonacci sequence
- ✅ **Complexity scales naturally** - Don't over-engineer early versions

**Fibonacci Patterns Applied:**

**Version Evolution:**
```
v0.1: Minimum Viable (1)
v0.2: Basic Enhancement (1)
v0.3: Combined Learning (2 = 1+1)
v0.5: Significant Upgrade (3 = 1+2)
v0.8: Major Feature Add (5 = 2+3)
v1.3: Mature System (8 = 3+5)
```

**Improvement Cycles:**
```
Day 1: Create basic version (Fib = 1)
Day 2: Add one enhancement (Fib = 1)
Day 3: Combine learnings (Fib = 2)
Day 5: Major refinement (Fib = 3)
Day 8: Significant expansion (Fib = 5)
Day 13: Near-perfect optimization (Fib = 8)
```

**Quality Metrics (1-10 scale maps to Fibonacci):**
- Basic functionality: 1
- Works reliably: 1
- User-friendly: 2
- Well-documented: 3
- Automated: 5
- Self-healing: 8
- Near-perfect: 13

**Implementation Pattern:**
```
When creating ANY system:

Iteration 1 (Fib=1): Core functionality only
├─ Make it work

Iteration 2 (Fib=1): Basic refinement
├─ Make it work reliably

Iteration 3 (Fib=2): User experience
├─ Make it easy to use
├─ Learn from iterations 1 & 2

Iteration 4 (Fib=3): Documentation
├─ Document how it works
├─ Learn from iterations 2 & 3

Iteration 5 (Fib=5): Automation
├─ Automate usage
├─ Learn from iterations 3 & 4

Iteration 6 (Fib=8): Self-healing
├─ Handle errors gracefully
├─ Learn from iterations 4 & 5

Iteration 7 (Fib=13): Near-perfection
├─ Optimize everything
├─ Learn from iterations 5 & 6
```

**Golden Ratio Application (φ ≈ 1.618):**
- Time spent on planning : execution = 1 : 1.618
- Complexity of solution : complexity of problem = 1 : 1
- Documentation : code = 1 : 1.618
- Automation effort : manual effort saved = 1 : φ²

---

## 🚀 Implementation Checklist

**When creating ANY agent, skill, or guide:**

### Mandatory Steps:
- [ ] **Error logging configured** - Know where errors go
- [ ] **Fix automation plan** - How solutions will be reusable
- [ ] **Crash data collection** - How failures are captured
- [ ] **Fibonacci iteration plan** - What's v1, v2, v3, v5, v8?
- [ ] **Self-documentation** - System explains itself
- [ ] **Self-healing** - System recovers from errors
- [ ] **Self-improving** - System gets better with use

### Quality Gates:
```
Gate 1 (Fib=1): Does it work?
├─ Basic functionality present
├─ Core use case solved

Gate 2 (Fib=2): Does it work reliably?
├─ Error handling present
├─ Edge cases handled

Gate 3 (Fib=3): Is it documented?
├─ README exists
├─ Examples provided

Gate 4 (Fib=5): Is it automated?
├─ Workflow created
├─ Manual steps eliminated

Gate 5 (Fib=8): Is it self-healing?
├─ Errors logged and recovered
├─ Graceful degradation

Gate 6 (Fib=13): Is it near-perfect?
├─ Optimized performance
├─ Beautiful code
├─ Comprehensive tests
```

---

## 📁 File Structure Mandated by Prime Directive

```
.agent/
├── PRIME_DIRECTIVE.md (THIS FILE - HIGHEST PRIORITY)
├── troubleshooting.md (All solutions documented)
├── workflows/
│   ├── debug-issue.md (Automated debugging)
│   └── [other-workflows].md
├── errors/
│   ├── css-layout/
│   ├── javascript/
│   ├── agent-crash/
│   └── [other-categories]/
├── scripts/
│   ├── collect-crash-data.js
│   ├── auto-fix-common-errors.js
│   └── [automation-scripts]
└── iterations/
    ├── [system-name]-v1.md
    ├── [system-name]-v2.md
    └── ... (following Fibonacci progression)
```

---

## 🔄 Self-Improvement Loop (Fibonacci Spiral)

```
Error/Issue Detected (n=0)
    ↓
Log Error (n=1) ────────┐
    ↓                   │
Document Fix (n=1) ─────┤ Combine into
    ↓                   │ Guide Entry (n=2)
Create Automation (n=2)─┘
    ↓
Test & Verify (n=3) ────┐
    ↓                   │
Optimize (n=5) ─────────┤ Combine into
    ↓                   │ Perfect Solution (n=8)
Integrate (n=8) ────────┘
    ↓
Share Knowledge (n=13)
    ↓
[Spiral continues, approaching perfection]
```

---

## 🎓 Meta-Learning Principles

### The Fibonacci Mindset:
1. **Start Simple** (1) - Minimum viable always comes first
2. **Add Thoughtfully** (1) - One improvement at a time initially
3. **Compound Learning** (2, 3, 5...) - Each step builds on previous TWO steps
4. **Accelerate Growth** (8, 13, 21...) - Rapid improvement as patterns emerge
5. **Approach Phi** (→ φ) - System tends toward the golden ratio (perfection)

### The Self-Healing Philosophy:
- Systems should detect their own errors
- Systems should log their own failures
- Systems should learn from their own mistakes
- Systems should improve from their own experiences

### The Automation Philosophy:
- If you do it once, document it
- If you do it twice, automate it
- If you do it thrice, you've failed at automation

---

## ⚡ Emergency Override Protocol

**If this Prime Directive conflicts with other rules:**
1. Prime Directive ALWAYS wins
2. Update conflicting rule to align with Prime Directive
3. Document the conflict resolution
4. Learn from the conflict

**If following Prime Directive seems impossible:**
1. You're probably over-thinking it
2. Start with Fibonacci(1) - the simplest version
3. Iterate from there
4. Document why it seemed impossible initially

---

## 📊 Success Metrics

**System Health Indicators:**
- ✅ Error recurrence rate → 0 (errors become extinct via automation)
- ✅ Time to fix similar issues → 0 (instant via troubleshooting guide)
- ✅ Manual intervention required → 0 (everything automated)
- ✅ System crashes → 0 (self-healing)
- ✅ Documentation coverage → 100% (self-documenting)
- ✅ Quality score → 13 (Fibonacci perfection)

**Fibonacci Quality Score:**
```
1  = It exists
2  = It works
3  = It's documented
5  = It's automated
8  = It's self-healing
13 = It's near-perfect
21 = You've achieved something extraordinary
```

---

## 🌟 Remember

> "The Fibonacci sequence appears in nature because it's the most efficient growth pattern.
> Your code should follow the same principle.
> Start small, build on what came before, approach perfection naturally."

**Every error is a gift.**  
**Every fix is a lesson.**  
**Every automation is a step toward perfection.**  
**Every iteration follows the golden ratio.**

---

**This is the way.**

— The Prime Directive, 2026-01-23
