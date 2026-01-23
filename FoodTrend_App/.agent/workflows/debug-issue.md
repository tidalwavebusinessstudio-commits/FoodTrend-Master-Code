---
description: Systematic debugging workflow using the troubleshooting guide
---

# Debug Issue Workflow

This workflow **MUST** be followed when debugging ANY CSS, layout, design, or asset issue in the FoodTrend project.

## Step 1: Check Troubleshooting Guide First

**BEFORE attempting any independent debugging:**

```bash
# Read the Quick Reference table in the troubleshooting guide
```

1. Open `.agent/troubleshooting.md`
2. Read the **Quick Reference table** (search for your symptom)
3. If match found → Jump to detailed section → Apply the solution
4. If no match found → Proceed to Step 2

**Common symptoms to search for:**
- "clipped", "hidden", "cut off" → Check CSS #1 (overflow issues)
- "shift", "moves", "not centered" → Check CSS #2 (transform issues)
- "overlap", "weird", "fighting" → Check Design #1 (diagonal layout)
- "border", "red", "experimental" → Check Design #2 (design system)
- "tall", "viewport" → Check Design #3 (hero height)
- "background", "transparency", "black box" → Check Image #1 (PNG alpha)

## Step 2: Follow Systematic Debugging Process

If the issue is NOT in the troubleshooting guide:

1. **Reproduce** - Confirm the problem exists
2. **Inspect in browser** - Use browser_subagent to open page and inspect element
3. **Check computed styles** - Look at actual CSS being applied
4. **Identify cause** - Track up parent chain, check for overflow/z-index/transform issues
5. **Make the fix** - Apply solution
6. **Verify** - Use browser_subagent to confirm fix works
7. **Proceed to Step 3**

## Step 3: Document the Solution

**IMMEDIATELY after solving a new issue:**

1. Open `.agent/troubleshooting.md`
2. Add the new issue to the appropriate section:
   - CSS & Layout Issues
   - Design System Issues
   - Image & Asset Issues
3. Use the template format:
   ```markdown
   ### X. Issue Name
   
   **Encountered:** [Date]
   **Last Updated:** [Date]
   
   #### Problem Description
   [What went wrong]
   
   #### Symptoms
   - Bullet list
   
   #### Root Cause
   [Why it happened]
   
   #### Solution
   [Code examples]
   
   #### Verification Method
   [How to confirm]
   
   **Related Files:**
   - [file](path) - Description
   ```
4. Update the **Quick Reference table** with a new row
5. Save the updated guide

## Step 4: Verify Guide Entry

After adding to the guide:

1. Re-read your entry to ensure it's clear
2. Verify code examples are accurate
3. Check file links are correct
4. Confirm the Quick Reference row links to the right section

## Meta-Rule: Guide First, Then Debug

**CRITICAL:** Always check `.agent/troubleshooting.md` BEFORE starting any debugging. The guide exists to make you hyper-efficient by avoiding repetitive research.

**Pattern to follow:**
```
User reports issue → 
Check troubleshooting guide → 
Apply known solution OR debug new issue →
Document if new →
Done
```

## When to Use This Workflow

Use this workflow for:
- ✅ CSS layout issues
- ✅ Design system problems
- ✅ Image/asset issues
- ✅ Styling bugs
- ✅ Visual glitches
- ✅ Positioning problems

Do NOT use for:
- ❌ JavaScript logic bugs (unless related to DOM/CSS)
- ❌ Backend/API issues
- ❌ Feature requests (unless fixing broken features)
