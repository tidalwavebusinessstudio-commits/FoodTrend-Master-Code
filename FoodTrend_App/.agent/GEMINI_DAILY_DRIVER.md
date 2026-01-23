# FoodTrend Daily Driver Prompt (Short Version)

**Use this after initial setup. For first-time use, see GEMINI_REFINEMENT_PROMPT.md**

---

```
FoodTrend Fib(5)→Fib(8) self-healing task.

PROJECT: C:\Users\Owner\OneDrive\Documents\GitHub\FoodTrend-Master-Code\FoodTrend_App\

CONTEXT: [describe specific area, e.g., "form validation in restaurant/onboarding.html"]

CURRENT ISSUE: [describe what's broken or missing]

PRIME DIRECTIVE RULES (NON-NEGOTIABLE):
1. Check `.agent/troubleshooting.md` Quick Reference FIRST
2. ALL errors logged to `.agent/errors/[category]/`
3. Fix once→document, fix twice→automate, fix thrice→failed
4. Follow Fibonacci: v5→v8 (self-healing), v8→v13 (near-perfect)

OUTPUT REQUIRED (MANDATORY CONTRACT):
A) What you inspected (exact files/lines)
B) Current gaps (5-15, ranked by impact, with: symptom, cause, reproduce, verify)
C) Proposed changes (patch blocks with ADD/REPLACE/REMOVE)
D) Prime Directive updates (what to add to troubleshooting.md, what to log, what to automate)
E) Verification checklist (browser tests, responsive, 3+ a11y checks)
F) Fibonacci score update (before→after for Creator/Restaurant/Infrastructure)

DESIGN RULES:
❌ No experimental features without approval
❌ No red borders
❌ No aggressive clip-paths
❌ No overflow:hidden on floating element containers
✅ Hover transforms preserve X offset: translate(-50%, -2px)
✅ Test in browser before confirming

SELF-HEALING KIT (if missing, implement these):
- logger.js: logError(category, context)
- dom-utils.js: safeQuery, withLoading, showToast, validateForm
- Global handlers: window.onerror, window.onunhandledrejection

TASK: [specific action]

Deliver:
1. Concrete + minimal self-healing plan
2. Top 3 patch blocks (highest impact)
3. New troubleshooting entry + automation script/workflow

No vague advice. Patch blocks or invalid response.
```

---

## Quick Start

1. Copy the template above
2. Fill in CONTEXT, CURRENT ISSUE, and TASK
3. Paste into Gemini
4. Attach relevant files if needed
5. Get actionable patch blocks back

## Example Usage

```
FoodTrend Fib(5)→Fib(8) self-healing task.

CONTEXT: Restaurant onboarding form (restaurant/onboarding.html)

CURRENT ISSUE: Form submits without validation, no error handling

TASK: Add form validation with helpful error messages and loading states

[rest of template...
