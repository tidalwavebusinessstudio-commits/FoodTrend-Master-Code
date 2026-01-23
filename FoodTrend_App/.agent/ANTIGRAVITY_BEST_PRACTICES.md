# Best Practices for Programming Antigravity

**Source:** Extracted from system design, Google documentation, and Claude AI best practices  
**Purpose:** How to get the MOST out of your AI coding assistant (me!)

---

## 🎯 Core Principles (From My Design)

### 1. Task Boundaries = Your Project Management

**What I'm designed for:**
- Breaking complex work into granular tasks
- Showing you progress in real-time
- Accumulating work before showing results

**How to use this:**
```
❌ BAD: "Build the entire authentication system"
✅ GOOD: Let me break it down into tasks:
  - Task 1: Planning Authentication (research + design)
  - Task 2: Implementing Login Flow (execution)
  - Task 3: Verifying Security (testing)
```

**Why:** I work in PLANNING → EXECUTION → VERIFICATION cycles. Let me do this!

---

### 2. Artifacts = Your Documentation Hub

**I automatically create artifacts for:**
- Implementation plans (before I code)
- Walkthroughs (after I complete work)
- Task lists (tracking progress)

**Your role:**
- Review artifacts when I ask
- Approve plans before I execute
- Keep artifacts in `.agent/` folder

**Path:** All artifacts go to `<appDataDir>/brain/<conversation-id>/`

---

### 3. The Approval Pattern (Critical!)

**From Anthropic's Claude best practices:**

> Give AI autonomy for execution, but require approval for:
> - Architectural decisions
> - Breaking changes
> - New dependencies
> - Paid tool integration

**Applied to Antigravity:**
```
I will:
✅ Execute approved plans autonomously
✅ Make incremental code changes
✅ Run safe commands automatically

I will ASK first for:
⚠️ Architectural changes
⚠️ Database migrations
⚠️ Package installations
⚠️ Anything irreversible
```

**How I ask:** `notify_user` tool with `BlockedOnUser: true`

---

## 📋 Prompt Engineering Best Practices

### From Claude's Documentation:

#### 1. Be Specific About Output Format
```
❌ "Make this better"
✅ "Refactor this function to:
   - Use async/await instead of promises
   - Add error handling with try/catch
   - Return typed result object"
```

#### 2. Provide Context, Not Just Tasks
```
❌ "Fix the button"
✅ "The submit button on qualify.html (line 47) isn't triggering 
   the form validation. Expected: Call validateForm() before submit.
   Currently: Submits without validation."
```

#### 3. Use Examples When Possible
```
✅ "Create a modal like the one in dashboard.html (lines 120-150) 
   but for confirming deletions instead of showing info."
```

---

### From Google's Gemini Best Practices:

#### 1. Attach Relevant Files
When asking about code, attach the file(s) so I can:
- See exact line numbers
- Understand context
- Verify before editing

**I can see your open documents automatically!**

#### 2. Let Me Use Tools
I have tools for:
- Searching web
- Reading documentation  
- Browsing pages
- Running commands

Don't paste documentation - **let me fetch it!**

#### 3. Iterative Refinement
```
First request: "Create a pricing calculator"
My response: [basic implementation]
Your feedback: "Make it show monthly/annual toggle"
My update: [adds toggle]
Your feedback: "Add 10% discount for annual"
Final result: Exactly what you wanted!
```

---

## 🚀 Efficiency Tips

### 1. Use Workflows Instead of Repeating

**If you do something twice, create a workflow:**
```markdown
---
description: Deploy to staging
---
1. Run tests
2. Build production bundle
3. Deploy to Netlify staging
4. Run smoke tests
5. Notify in Slack
```

Then: `/deploy-staging` runs everything!

---

### 2. Let Me Research First

**I have access to:**
- Web search
- Documentation
- npm package details
- API references

**Don't:**
❌ Copy-paste Stack Overflow answers  
❌ Send me entire documentation pages

**Do:**
✅ "Research the best React routing library for our needs"  
✅ "Check if Stripe has a webhook for failed payments"

---

### 3. Batch Related Requests

**Efficient:**
```
"For the dashboard page:
1. Add loading spinner
2. Implement error boundary
3. Add retry logic for failed API calls"
```

**Inefficient:**
```
"Add loading spinner"
[wait for response]
"Now add error boundary"
[wait for response]
"Now add retry logic"
```

---

## 🛡️ Safety Best Practices

### From My Anti-Hallucination Protocol:

#### 1. I Will Never Guess
If I don't have access to a file/API/tool, I will:
- ❌ NOT pretend I can use it
- ✅ Tell you "I need X to proceed"
- ✅ Ask you to provide it OR give me access

#### 2. Verify My Suggestions
**You should:**
- Open files I edit to spot-check changes
- Run code I generate to verify it works
- Check git diffs before committing

**I'm very good, but not perfect!**

#### 3. I'll Document Uncertainty
When I'm unsure, I'll say:
- "Based on common patterns, this should work, but verify X"
- "I don't have access to Y, so I'm assuming Z"
- "Test this thoroughly before deploying"

---

## 📊 Progress Tracking

### I Show You Four Things:

1. **TaskName** - What I'm working on now
2. **TaskSummary** - What I've accomplished so far  
3. **TaskStatus** - What I'm about to do next
4. **Mode** - PLANNING / EXECUTION / VERIFICATION

**Use this to:**
- Know where we are in the process
- Jump back in if interrupted
- Share progress with teammates

---

## 🎓 Advanced Patterns

### 1. The "Rubber Duck" Pattern
**Use me to think through problems:**
```
You: "I'm trying to decide between WebSockets and Server-Sent Events for 
     real-time updates. What are the tradeoffs?"

Me: [Researches both, compares for your use case, recommends with reasoning]
```

### 2. The "Living Documentation" Pattern
**Keep me updated, I'll maintain docs:**
```
You: "We just added rate limiting to the API"
Me: [Updates API documentation, adds to CHANGELOG, notes in architecture docs]
```

### 3. The "Systematic Refactor" Pattern
**For large changes:**
```
You: "We need to migrate from JavaScript to TypeScript"
Me: Creates plan with phases:
  Phase 1: Add tsconfig.json
  Phase 2: Convert utility files (10 files)
  Phase 3: Convert components (30 files)
  Phase 4: Remove .js files
  
  [We approve each phase before proceeding]
```

---

## ⚙️ Configuration Best Practices

### Your `.agent/` Folder Should Have:

**Minimum:**
- `README.md` - Project overview
- `troubleshooting.md` - Known issues & fixes
- `workflows/` - Repeated processes

**Ideal:**
- `SSOT.md` - Single source of truth (like you just created!)
- `PRIME_DIRECTIVE.md` - Your rules & principles
- `scripts/` - Automation helpers
- `tools/` - Tool registry

**Why:** I reference these automatically to work within YOUR system

---

## 🔄 Workflow Integration

### Morning Startup
```
1. Check Prime Directive daily ritual
2. Review any overnight errors (troubleshooting.md)
3. Ask me: "What should I focus on today based on task.md?"
```

### During Development
```
1. Open relevant files in editor
2. Ask me questions or request changes
3. I see your open files and provide contextual help
```

### End of Day
```
1. Ask me: "Summarize what we accomplished today"
2. I create/update walkthrough.md
3. Commit .agent folder to git
```

---

## 💡 Pro Tips

### 1. I Learn From Your Feedback
```
If I do something wrong:
→ Tell me specifically what was wrong
→ I'll adjust approach
→ I'll remember for this conversation
```

### 2. I Can Suggest Improvements
```
You: "How would you improve this function?"
Me: [Suggests refactoring with specific reasons]
```

### 3. Use Me for Code Review
```
You: "Review qualify.js for security issues"
Me: [Analyzes, finds potential XSS vulnerability, suggests fix]
```

### 4. I Can Generate Tests
```
You: "Write tests for the validateEmail function"
Me: [Creates comprehensive test suite with edge cases]
```

---

## 🚨 Common Mistakes to Avoid

### 1. ❌ Asking Me to "Figure It All Out"
**Problem:** Too vague, I'll make assumptions

**Better:** 
```
"Design the user authentication flow. Requirements:
- Email/password login
- Remember me checkbox
- Password reset via email
- Session expires after 24 hours"
```

### 2. ❌ Not Reviewing Implementation Plans
**Problem:** I might misunderstand your intent

**Better:**
Always review my plan artifact before I execute

### 3. ❌ Asking Me to Edit Large Files Blindly
**Problem:** Context window limits, easy to miss things

**Better:**
```
"In dashboard.html, lines 200-250 contain the metrics cards.
Update the sales card (line 220) to show percentage change."
```

### 4. ❌ Not Using Git Commits
**Problem:** Can't roll back if something breaks

**Better:**
I commit automatically, but you should too:
```
git add .agent/
git commit -m "Updated after AI session"
```

---

## 📈 Measuring Effectiveness

### You're Using Me Well When:

✅ I complete tasks in 1-2 attempts (not 5+ retries)  
✅ You approve most implementation plans  
✅ Your `.agent/` folder grows systematically  
✅ You reference old conversations via logs  
✅ You create workflows for repeated tasks  

### You Need to Adjust When:

⚠️ I'm frequently misunderstanding requirements  
⚠️ You're rewriting most of my code  
⚠️ You're asking the same questions repeatedly  
⚠️ You're not using artifacts/documentation  

**Fix:** Be more specific, provide more context, review plans earlier

---

## 🎯 Summary: The Golden Rules

1. **Be Specific** - Provide context, examples, constraints
2. **Review Plans** - Approve before I execute major changes
3. **Use Artifacts** - They're your documentation system
4. **Verify Output** - I'm good but not perfect
5. **Iterate** - Refine through feedback, don't expect perfection first try
6. **Commit Often** - Git is your safety net
7. **Document Patterns** - If you do it twice, make a workflow
8. **Use My Tools** - Let me research, browse, search
9. **Trust But Verify** - Especially for security-critical code
10. **Keep .agent/ Updated** - It's my memory across conversations

---

**Remember:** I'm designed to be your systematic coding partner. The more you use these patterns, the more effective we become together! 🚀
