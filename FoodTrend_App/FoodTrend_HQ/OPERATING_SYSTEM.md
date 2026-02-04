# 🛡️ FoodTrend Operating System (Anti-Hallucination Rulebook)

> **Status:** MANDATORY COMPLIANCE  
> **Purpose:** Prevent AI drift, hallucination, and context loss  
> **Last Updated:** 2026-01-31

---

## 🚨 Non-Negotiable Rules

### Rule 1: Never Guess
If information is missing, **ask ONE clarifying question**.

Do not:
- Invent numbers
- Assume pricing
- Guess business logic
- Make up testimonials

### Rule 2: Read DNA First
Before ANY work, always read:
```
FoodTrend_HQ/BUSINESS_DNA.md
```
This is the authoritative source of truth.

### Rule 3: Show Exact Edits
Always show file changes as:
- Before/after comparison
- Diff format
- Explicit line references

Never say "I updated the file" without showing what changed.

### Rule 4: One Change at a Time
1. Make one edit
2. Verify it worked
3. Then proceed to next edit

Never batch 10 changes and hope they all work.

### Rule 5: Restate the Goal
Before any edit, restate:
> "Goal: [what we're trying to achieve]"

This prevents scope creep and drift.

### Rule 6: Check Steps When Unsure
When debugging or uncertain, run verification:
- Inspect computed CSS
- Check parent element wrappers
- Read actual file content
- Use browser tools to verify

### Rule 7: No Surprise Redesigns
Never redesign something unless explicitly asked.

If you think something should be redesigned:
1. State why
2. Ask permission
3. Wait for approval
4. Then proceed

---

## 🔧 Tool Usage Rules

### Firecrawl MCP (Website Inspection)
For ANY website or design issue:
1. Use Firecrawl to scrape the live site
2. Read the actual current state
3. Then suggest fixes based on reality

Never:
- Imagine what the site looks like
- Guess at current CSS
- Assume previous changes are still there

### Notion MCP (Documentation)
All working documents go to Notion:
- SOPs
- Decisions
- Sprint items
- Meeting notes

### Pinecone MCP (Long-Term Memory)
Store important information for later retrieval:
- Contracts
- Proposals
- Key decisions
- Bug fixes

Use categories from `PINECONE_REGISTRY.md`.

### Supabase MCP (Metrics & Stats)
For ANY question about numbers:
- Query the database
- Use real data
- Never invent statistics

---

## 📋 Workflow for Every Task

```
A) Restate the goal in one sentence
B) List what info you will use (files + MCPs)
C) If needed, ask ONE question
D) Execute in small steps
E) Show exact code diffs for any edits
F) Verify the result and summarize next steps
```

---

## 🎯 Session Start Protocol

At the start of every session, read:
1. `FoodTrend_HQ/BUSINESS_DNA.md`
2. `FoodTrend_HQ/OPERATING_SYSTEM.md` (this file)
3. `.agent/PRIME_DIRECTIVE.md`

Then summarize:
- What you understand the current state to be
- What the user's goal appears to be
- What you need clarification on (if anything)

---

## ⚠️ Red Flags (Stop & Ask)

If you find yourself:
- Making up a number → **STOP & ASK**
- Guessing at pricing → **STOP & READ DNA**
- Designing without being asked → **STOP & ASK**
- Removing sales copy to "simplify" → **STOP & ASK**
- Changing multiple files at once → **SLOW DOWN**

---

## 🔄 Error Recovery Protocol

When something breaks:

1. **Log it** → `.agent/errors/[category]/[date].md`
2. **Document root cause**
3. **Fix the immediate issue**
4. **Create automation** to prevent recurrence
5. **Update troubleshooting guide**

See `.agent/PRIME_DIRECTIVE.md` for full error handling flow.

---

## 📊 Quality Metrics

| Metric | Target |
|--------|--------|
| Hallucination rate | 0% |
| Context loss | 0% |
| Undocumented changes | 0% |
| Surprise redesigns | 0% |
| Questions before assumptions | 100% |

---

## 🔒 This Document is Locked

Changes require explicit user approval.

Any conflict between this document and other rules:
> **Operating System wins** (unless overridden by BUSINESS_DNA.md)
