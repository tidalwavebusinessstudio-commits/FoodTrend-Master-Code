# CSS Layout - Sidebar Content Overlap - 2026-01-25

## Error Details
- **Timestamp:** 2026-01-25T23:19:00-05:00
- **Location:** `restaurant/styles.css`, `restaurant/components/sidebar.html`
- **Symptom:** Content on restaurant pages was cut off on the left, hidden behind the fixed sidebar menu
- **Affected Pages:** All pages in `/restaurant/` using `main-content` class

## Root Cause
1. **Fixed sidebar** has `position: fixed; width: 250px` (inline in sidebar.html)
2. **Main content** had no `margin-left` to account for the sidebar width
3. **CSS class `.main-content`** was used in HTML but had no corresponding CSS rule
4. **Visual mismatch:** Sidebar appeared collapsed to ~60px (icons only) but inline style said 250px

## Fix Applied
Added to `restaurant/styles.css`:
```css
.main-content {
    margin-left: 60px; /* Match collapsed sidebar icon width */
    padding: 32px 40px;
    min-height: 100vh;
}
```

## Prevention
1. When creating fixed sidebars, always add corresponding margin to content area
2. Use CSS variables for sidebar width to keep values in sync:
   ```css
   :root { --sidebar-width: 60px; }
   .sidebar { width: var(--sidebar-width); }
   .main-content { margin-left: var(--sidebar-width); }
   ```

## Automation Created
- [x] Troubleshooting guide entry (pending)
- [ ] CSS variable for sidebar width sync
- [ ] Layout validation script
