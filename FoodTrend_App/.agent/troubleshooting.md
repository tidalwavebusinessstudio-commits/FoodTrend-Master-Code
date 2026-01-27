# FoodTrend App - Troubleshooting Guide

This document captures **ALL** issues, errors, design challenges, and their solutions encountered throughout the FoodTrend project development. Use this as a comprehensive reference to become hyper-efficient in future debugging and development.

**Last Major Update:** 2026-01-23

---

## Table of Contents
1. [CSS & Layout Issues](#css--layout-issues)
2. [Design System Issues](#design-system-issues)
3. [Image & Asset Issues](#image--asset-issues)
4. [Development Workflow Best Practices](#development-workflow-best-practices)
5. [Quick Reference](#quick-reference-common-css-gotchas)

---

## CSS & Layout Issues

### 1. Floating Elements Clipped by Parent Containers

**Last Updated:** 2026-01-23

#### Problem Description
Floating or absolutely positioned elements (like CTAs, buttons, or overlays) are being cut off or hidden when they should extend beyond their parent container boundaries.

#### Symptoms
- Element appears partially visible
- Element disappears when positioned at section boundaries
- Element is clipped at the top or bottom edge of a section
- Hover effects or animations trigger but element remains partially hidden

#### Root Cause
Parent containers have `overflow: hidden` set, which clips any child elements that extend beyond the container's bounds. This is commonly used for:
- Controlling diagonal backgrounds
- Preventing horizontal scroll
- Containing floating elements

However, it also clips intentionally overflowing elements like floating CTAs.

#### Solution

**Step 1: Identify the clipping parent**
Use browser DevTools to inspect the element:
```
1. Right-click the clipped element → Inspect
2. Check the Computed styles panel
3. Look up the DOM tree to find which parent has overflow: hidden
4. Common culprits: section containers, hero sections, content wrappers
```

**Step 2: Change overflow property**
Change `overflow: hidden` to `overflow: visible` on the parent container:

```css
/* Before */
.hero-section {
    overflow: hidden;
}

/* After */
.hero-section {
    overflow: visible; /* Allows floating elements to extend beyond bounds */
}
```

**Step 3: Handle multiple parents**
If the element is nested, you may need to fix overflow on MULTIPLE parent levels:

```css
/* All parents in the chain need overflow: visible */
.hero-section {
    overflow: visible;
}

.blade-section {
    overflow: visible;
}
```

#### Verification Method
1. Open the page in browser
2. Right-click clipped element → Inspect
3. Check Computed styles for overflow property
4. Verify element is fully visible
5. Test hover states and animations
6. Scroll the page to ensure element behaves correctly

#### Example Fix
In `restaurant/styles.css`, we fixed the "Start The Rush" floating button that was being clipped at the hero/blade section intersection:

```css
/* Lines 469-486: Fixed hero section overflow */
.hero-section {
    overflow: visible; /* Changed from hidden */
}

/* Lines 609-634: Fixed blade section overflow */
.blade-section {
    overflow: visible; /* Changed from hidden */
}
```

**Related Files:**
- [restaurant/styles.css](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/styles.css)
- [restaurant/index.html](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/index.html)

#### Prevention Tips
- When creating floating/overlapping elements, plan the parent overflow strategy upfront
- Consider using `overflow-x: hidden` and `overflow-y: visible` if you only need horizontal clipping
- Document overflow decisions in CSS comments
- Test at section boundaries during development

---

### 3. Content Hidden Behind Fixed Sidebar

**Encountered:** 2026-01-25
**Last Updated:** 2026-01-25

#### Problem Description
Main content on dashboard pages was cut off on the left side, hidden behind the fixed sidebar menu. The sidebar had `position: fixed` but the main content area had no left margin to account for it.

#### Symptoms
- Page titles appearing cut off (e.g., "uencer Updates" instead of "Influencer Updates")
- Left edges of content cards hidden behind sidebar
- Content appears to "slide under" the menu

#### Root Cause
1. Sidebar component has `position: fixed; width: Xpx` (inline style)
2. Main content area uses `.main-content` class but that class had NO CSS rule
3. Without `margin-left`, content starts at x=0 and goes under the fixed sidebar

#### Solution

**Add margin-left to match sidebar width:**
```css
/* In restaurant/styles.css */
.main-content {
    margin-left: 60px; /* Match actual sidebar width */
    padding: 32px 40px;
    min-height: 100vh;
}
```

**Key insight:** Check the ACTUAL rendered sidebar width, not what's in the inline style. The sidebar may be collapsed to icons (~60px) even if the inline style says 250px.

#### Verification Method
1. Refresh any dashboard page
2. Verify content titles are fully visible
3. Check that content starts right after sidebar (no large gap)

#### Prevention Tips
- Use CSS variables to sync sidebar and content margin:
  ```css
  :root { --sidebar-width: 60px; }
  .sidebar { width: var(--sidebar-width); }
  .main-content { margin-left: var(--sidebar-width); }
  ```
- When creating fixed sidebars, ALWAYS add corresponding margin rule for content

**Related Files:**
- [restaurant/styles.css](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/styles.css)
- [restaurant/components/sidebar.html](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/components/sidebar.html)
- [Error log](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/.agent/errors/css-layout/2026-01-25_sidebar-content-overlap.md)

---

### 2. Hover Transform Causing Horizontal Shift

**Last Updated:** 2026-01-23

#### Problem Description
Elements using `transform: translate()` on hover shift horizontally when they should only move vertically.

#### Symptoms
- Button or element shifts left/right when hovering
- Element is no longer horizontally centered after hover
- Transform animation appears jerky or misaligned

#### Root Cause
Centered elements using `left: 50%; transform: translateX(-50%)` need to maintain the X-translation during hover. If the hover state only specifies `transform: translateY()`, it overrides the X-translation.

#### Solution
Always include both X and Y transforms in hover states:

```css
/* Before - Causes horizontal shift */
.floating-cta {
    left: 50%;
    transform: translateX(-50%);
}

.floating-cta:hover {
    transform: translateY(-2px); /* Overrides translateX! */
}

/* After - Maintains centering */
.floating-cta {
    left: 50%;
    transform: translateX(-50%);
}

.floating-cta:hover {
    transform: translate(-50%, -2px); /* Maintains both transforms */
}
```

#### Verification Method
1. Hover over the element
2. Check if it remains horizontally centered
3. Verify no horizontal shift occurs during transition

---

## Design System Issues

### 1. Diagonal Layout "Weirdness" and Overlapping Sections

**Encountered:** Multiple times throughout project development
**Last Updated:** 2026-01-23

#### Problem Description
Diagonal split sections (`.diagonal-row`, `.diag-content`) were creating visual "weirdness" with:
- Sections overlapping in unintended ways
- Content fighting with the diagonal backgrounds
- Margins and clip-paths causing alignment issues
- User described as "weird sections" and "poor design"

#### Symptoms
- Sections don't align properly at diagonal boundaries
- Content appears cut off by clip-path
- Inconsistent spacing between diagonal sections
- Layout "fights" the content instead of enhancing it

#### Root Causes
1. **Aggressive clip-path usage** without accounting for content flow
2. **Competing margins** on diagonal sections causing overlaps
3. **Borders conflicting** with diagonal aesthetic (see Red Border issue)
4. **overflow: hidden** clipping content unintentionally

#### Solution

**Step 1: Simplify clip-path usage**
```css
/* Before - Too aggressive */
.diagonal-row {
    clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
    margin: -50px 0; /* Fighting with other sections */
}

/* After - More controlled */
.diagonal-row {
    clip-path: polygon(0 2%, 100% 0, 100% 98%, 0 100%);
    margin: 0; /* Let natural flow work */
}
```

**Step 2: Remove conflicting borders**
See "Red Border Problem" section below.

**Step 3: Ensure overflow doesn't clip content**
```css
.diagonal-row {
    overflow: visible; /* Don't clip floating elements */
}
```

#### Verification Method
1. Open page in browser
2. Scroll through all diagonal sections
3. Check for overlaps, gaps, or clipping
4. Verify content is readable and not fighting the design
5. Get user feedback on "weirdness"

**Related Files:**
- [styles.css](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/styles.css) - Main diagonal system
- [restaurant/styles.css](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/styles.css) - Restaurant variant

---

### 2. Red Border Problem (Experimental Design Failure)

**Encountered:** Early in project development
**Last Updated:** 2026-01-23

#### Problem Description
Aggressive red borders were added to `.diag-content` and `.rect-break` elements as an experimental design feature. The user found them visually jarring and requested removal, describing the design as having "red borders" that looked "poor".

#### Symptoms
- Bright red borders on diagonal content sections
- Red borders on rectangular break sections
- Overall design feels "broken" or overly experimental
- Detracts from premium aesthetic

#### Root Cause
Over-ambitious experimental styling without user approval. The borders were meant to be edgy but came across as unprofessional.

#### Solution

**Remove all red borders from design system:**

```css
/* Original problematic styles in styles.css */
.diag-content {
    border-right: 3px solid #ef4444; /* REMOVE THIS */
}

.rect-break {
    border: 2px solid #ef4444; /* REMOVE THIS */
}

/* Clean version - NO borders */
.diag-content {
    /* Border removed for cleaner look */
}

.rect-break {
    /* Border removed for premium aesthetic */
}
```

**Apply to both main and restaurant stylesheets:**
- Remove from `FoodTrend_App/styles.css`
- Remove from `FoodTrend_App/restaurant/styles.css`

#### Lessons Learned
- **Always get user approval** before implementing experimental design features
- **Start conservative** - it's easier to add than remove
- **"Premium" means clean** - excessive borders rarely enhance modern designs
- **User feedback is critical** - what seems creative to you may seem "weird" to users

**Related Files:**
- [styles.css](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/styles.css)
- [restaurant/styles.css](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/styles.css)

---

### 3. Hero Section Height and Spacing

**Encountered:** During hero section design iterations
**Last Updated:** 2026-01-23

#### Problem Description
Hero sections were too tall, taking up excessive viewport space and pushing important content below the fold. User requested reduced height for better content visibility.

#### Symptoms
- Hero section takes up entire viewport or more
- User has to scroll significantly to see any content
- First impression is just a large image, not the value proposition

#### Root Cause
Initial `min-height: 100vh` or `min-height: 80vh` settings were too aggressive for pages with important content immediately following the hero.

#### Solution

**Reduce hero section height:**
```css
/* Before */
.hero-section {
    min-height: 100vh; /* Too tall */
}

/* After */
.hero-section {
    min-height: 60vh; /* Reduced per user request */
}
```

**Benefits:**
- More content visible on initial load
- Better balance between hero impact and content accessibility
- Improved user experience on smaller screens

#### Prevention Tips
- Default to 50-60vh for content-heavy pages
- Use 80-100vh only for true landing pages with minimal content
- Always test on laptop screens (1366x768) not just large monitors
- Consider mobile viewports where hero shouldn't dominate

**Related Files:**
- [restaurant/styles.css](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/styles.css#L469-L486)

---

## Image & Asset Issues

### 1. PNG Logo Transparency Problems

**Encountered:** During restaurant page asset integration
**Last Updated:** 2026-01-23

#### Problem Description
Logo images (particularly white logos) were appearing with **black/dark backgrounds** instead of being transparent when placed on colored backgrounds. The issue was that the PNG files, while technically supporting transparency, had their alpha channels set incorrectly or were using opaque backgrounds.

#### Symptoms
- Logo appears with black rectangle background
- Logo doesn't blend with the page background
- "White" logo shows dark bounding box
- Problem visible especially on colored or gradient backgrounds

#### Root Cause
Source PNG files either:
1. Never had transparency in the first place (saved with white/black background)
2. Had transparency but the alpha channel was corrupted
3. Were created with incorrect export settings

#### Solution

**Use Python PIL (Pillow) to programmatically add transparency:**

Created a Python script to fix transparency by:
1. Converting the image to RGBA mode (supports transparency)
2. Detecting "background" pixels (near-white or near-black corners)
3. Making those pixels fully transparent
4. Saving as PNG with transparency preserved

```python
from PIL import Image

def fix_transparency(input_path, output_path, bg_threshold=240):
    """
    Fix PNG transparency by making white/light backgrounds transparent.
    
    Args:
        input_path: Path to input PNG
        output_path: Path to save fixed PNG
        bg_threshold: RGB threshold for background detection (0-255)
    """
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Make near-white pixels transparent
        if item[0] > bg_threshold and item[1] > bg_threshold and item[2] > bg_threshold:
            newData.append((255, 255, 255, 0))  # Transparent
        else:
            newData.append(item)  # Keep original
    
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Fixed transparency: {output_path}")

# Usage
fix_transparency("logo_white.png", "logo_white_fixed.png")
```

**Script Location:**
- [restaurant/fix_transparency.py](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/fix_transparency.py)

#### Usage Instructions
1. Save the script as `fix_transparency.py` in the assets directory
2. Run: `python fix_transparency.py`
3. Replace the original file with the fixed version
4. Refresh browser to verify transparency works

#### Prevention Tips
- **Always export PNGs with transparency** from design tools (Figma, Photoshop, etc.)
- **Verify transparency** by opening in image viewer with checkered background
- **Test on dark backgrounds** during development
- **Use SVG when possible** - easier to ensure transparency

#### Alternative Solutions
- Use online tools like remove.bg for complex images
- Re-export from original design files with correct alpha settings
- Use image editing software (GIMP, Photoshop) to manually fix alpha channel
- Convert to SVG for logos (best long-term solution)

**Related Files:**
- [restaurant/fix_transparency.py](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/restaurant/fix_transparency.py)

---

## Development Workflow Best Practices

### Browser-Based Verification

When fixing CSS issues, always verify in an actual browser rather than relying solely on code inspection:

1. **Open the page in a browser** (preferably using the browser_subagent tool)
2. **Use DevTools to inspect** actual computed styles
3. **Take screenshots** before and after fixes
4. **Test interactions** (hover, click, scroll)
5. **Verify on different viewport sizes** if responsive

### Systematic Debugging Process

Follow this proven workflow for CSS and layout issues:

1. **Reproduce the issue** - Confirm the problem exists
2. **Inspect in browser** - Right-click → Inspect element
3. **Check computed styles** - See what styles are actually applied
4. **Identify the cause** - Look for overriding styles, clipping parents, z-index issues
5. **Make the fix** - Edit CSS files
6. **Verify the fix** - Reload and re-test in browser
7. **Document the solution** - Add to this troubleshooting guide

---

## Quick Reference: Common CSS Gotchas

| Issue | Common Cause | Quick Fix | Section |
|-------|-------------|-----------|---------|
| Element clipped/hidden | Parent has `overflow: hidden` | Change to `overflow: visible` | [CSS #1](#1-floating-elements-clipped-by-parent-containers) |
| Element behind others | Missing or low `z-index` | Add `z-index: 1000` or higher | [CSS #1](#1-floating-elements-clipped-by-parent-containers) |
| Hover causing shift | Transform overriding previous transform | Use `transform: translate(x, y)` with both values | [CSS #2](#2-hover-transform-causing-horizontal-shift) |
| Element not centered | Missing `transform: translateX(-50%)` | Add full centering pattern | [CSS #2](#2-hover-transform-causing-horizontal-shift) |
| Transitions not smooth | Missing `transition` property | Add `transition: all 0.3s ease` | General |
| Backdrop blur not working | Missing webkit prefix | Add `-webkit-backdrop-filter` before `backdrop-filter` | General |
| Diagonal sections overlapping | Aggressive clip-path or margins | Simplify clip-path, remove negative margins | [Design #1](#1-diagonal-layout-weirdness-and-overlapping-sections) |
| Design looks "weird" | Experimental borders/effects | Remove experimental features, keep it clean | [Design #2](#2-red-border-problem-experimental-design-failure) |
| Hero too tall | `min-height: 100vh` | Reduce to `60vh` for content-heavy pages | [Design #3](#3-hero-section-height-and-spacing) |
| Logo has black background | PNG without transparency | Use Python script or re-export with alpha | [Image #1](#1-png-logo-transparency-problems) |
| Content hidden behind sidebar | Fixed sidebar, no content margin | Add `margin-left` matching sidebar width | [CSS #3](#3-content-hidden-behind-fixed-sidebar) |

---

## Meta-Lessons: Becoming Hyper-Efficient

These are the high-level patterns and philosophies discovered throughout the FoodTrend project development.

### Design Philosophy Lessons

1. **Start Conservative, Add Boldness Gradually**
   - Experimental features (like red borders) should be user-approved first
   - It's easier to add than to remove
   - "Premium" often means "clean," not "complex"

2. **User Feedback is Ground Truth**
   - If a user says something is "weird," it is—even if you think it's creative
   - Don't defend design choices; iterate based on feedback
   - User perception > designer intention

3. **Content First, Design Second**
   - Design should enhance content, not fight it
   - If diagonal layouts cause overlap issues, simplify them
   - Visibility of key content > visual flair

### Debugging Mindset

1. **Browser DevTools is Your Best Friend**
   - ALWAYS inspect in browser, don't assume from code
   - Computed styles show the actual truth
   - Screenshots document before/after state

2. **Follow the Parent Chain**
   - CSS issues often come from parent containers, not the element itself
   - Track up the DOM when debugging clipping, positioning, overflow issues
   - One bad `overflow: hidden` can affect multiple children

3. **Test Systematically**
   - Reproduce → Inspect → Identify → Fix → Verify → Document
   - Don't skip verification step
   - Document for future efficiency

### Efficiency Patterns

1. **Document as You Go**
   - Add issues to this troubleshooting guide immediately after solving
   - Include code examples, not just descriptions
   - Link to related files for quick access

2. **Build Reusable Solutions**
   - Python scripts for common tasks (like transparency fixing)
   - CSS patterns that work (centering, transforms, transitions)
   - Systematic debugging workflows

3. **Learn from Repetition**
   - If you solve the same issue twice, document it
   - If you make the same mistake twice, add prevention tips
   - If something works well, codify the pattern

### Communication Lessons

1. **Explanation Enhances Trust**
   - Don't just fix issues silently; explain the root cause
   - Show your debugging process
   - Use screenshots to prove fixes work

2. **Plan Before Executing (When Appropriate)**
   - User requested "plan first" after seeing unexpected changes
   - Major design changes should have implementation plans
   - But don't over-plan simple fixes

3. **Verify Everything**
   - Use browser subagent to verify fixes actually work
   - Take screenshots showing before/after
   - Test hover states, scroll behavior, different viewports

---

## How to Use This Guide

> [!IMPORTANT]
> **Automated Workflow:** The debugging process is now automated via the `/debug-issue` workflow. This workflow REQUIRES checking this troubleshooting guide BEFORE attempting any debugging. See [.agent/workflows/debug-issue.md](file:///c:/Users/Owner/OneDrive/Documents/GitHub/FoodTrend-Master-Code/FoodTrend_App/.agent/workflows/debug-issue.md) for the systematic process.

### When Debugging (Automated)
1. **Skim the Quick Reference table** - Find your issue quickly
2. **Read the detailed section** - Understand the root cause
3. **Apply the solution** - Use the code examples
4. **Verify with browser** - Follow verification steps
5. **Adapt if needed** - Your case might be slightly different

### When Developing New Features
1. **Review related sections** - Learn from past mistakes
2. **Follow prevention tips** - Avoid creating the same issues
3. **Test early and often** - Don't wait until the end

### After Solving a New Issue
1. **Add to this guide** - Document problem, cause, and solution
2. **Include code examples** - Make it actionable
3. **Link related files** - Help future you find the context
4. **Update Quick Reference** - Add a table entry if applicable

---

## Contributing to This Guide

**Format for new issues:**
```markdown
### X. Issue Name

**Encountered:** [When first seen]
**Last Updated:** [Current date]

#### Problem Description
[What went wrong]

#### Symptoms
- Bullet list of how to recognize the issue

#### Root Cause
[Why it happened]

#### Solution
[How to fix it, with code examples]

#### Verification Method
[How to confirm fix works]

#### Prevention Tips (optional)
[How to avoid in the future]

**Related Files:**
- [filename](file:///path) - Description
```

Keep this guide growing! Every issue documented makes the next one easier to solve.


When you encounter a new issue:

1. Document the problem, symptoms, and root cause
2. Describe the solution with code examples
3. Include verification steps
4. Add links to related files
5. Update the Quick Reference table if applicable



Keep descriptions concise but comprehensive enough for future reference.

---

## 🔄 System Evolution (Fibonacci Iterations)

**v1 (Fib=3):** Initial troubleshooting guide created with 7 documented issues  
**v2 (Fib=5):** Added /debug-issue workflow for automated checking  
**v3 (Fib=5):** ChatGPT collaboration - Enhanced Gemini prompt with OUTPUT CONTRACT  
- Added mandatory response structure (6-part contract)
- Created self-healing starter kit (logger.js, dom-utils.js)
- Hardened verification requirements
- Prevented vague responses through actionable-first approach

**v3.1 (Fib=5):** Self-Healing Rails Edition - Enforced hard rails
- Added STOP CONDITION to prevent file guessing
- Rigid PATCH BLOCK format (FILE/ACTION/TARGET/CODE)
- Explicit "no repo access" handling with minimal file request protocol
- Enforced 3-layer spanning rule for patches

**Next iteration (Fib=8):** Implement self-healing utilities across all pages, achieve zero uncaught errors

*The system grows stronger with each iteration, building on previous learnings.*


