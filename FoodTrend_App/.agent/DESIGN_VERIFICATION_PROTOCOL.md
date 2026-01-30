# Design Change Verification Protocol

## The Canary Pattern

Every CSS change MUST include a canary comment at line 1:
```css
/* CANARY-[DATE]-[CHANGE] */
```

**Verify in DevTools → Sources → Find CSS file → Line 1**

If canary is missing = browser isn't loading your file.

---

## Atomic Edits Only

1. Make ONE CSS property change
2. Verify in DevTools Computed styles
3. Confirm visually
4. THEN proceed to next change

---

## DevTools Verification

1. Right-click element → Inspect
2. Styles tab: Is rule present?
3. Computed tab: What's the actual value?
4. Toggle rule: Does anything change?

---

## When AI Makes Changes

Run: `git diff [filename]`

If diff shows changes but browser doesn't:
- Clear cache (Ctrl+Shift+R)
- Check build pipeline
- Verify served file path
