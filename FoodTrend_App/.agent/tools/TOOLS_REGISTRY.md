# Tools Registry (Complete List)

**Last Updated:** 2026-01-25  
**Total Tools:** 16  
**Free Tools:** 14  
**Paid Tools:** 2 (optional)

---

## 🖼️ IMAGES & GRAPHICS

### Squoosh

**Category:** Images  
**Cost:** FREE FOREVER  
**Setup Time:** 0 min  
**Status:** ✅ READY NOW

**What it does:**
Makes big pictures tiny without making them ugly.

**When to use it:**
- Before adding ANY image to your website
- Logo files are too big
- Page loads slowly because of images

**How to use:**
1. Go to https://squoosh.app
2. Drag your image in
3. Adjust quality slider (try 80%)
4. Download the smaller version

**Safety notes:**
✅ Made by Google, totally safe  
✅ Works in browser, nothing to install  
✅ Your images stay private (processed locally)

**Fallback:**
Use TinyPNG (tinypng.com) - also free, similar tool

---

### Remove.bg

**Category:** Images  
**Cost:** FREE (50 images per month)  
**Setup Time:** 0 min (or 2 min for account)  
**Status:** ✅ READY NOW (limited without account)

**What it does:**
Removes backgrounds from photos automatically (magic!).

**When to use it:**
- Cleaning up logo backgrounds
- Product photos need transparent background
- Profile pictures for team page

**How to use:**
1. Go to https://remove.bg
2. Upload your photo
3. Download PNG with transparent background
4. (Optional) Create free account for 50/month

**Safety notes:**
✅ Popular tool, very safe  
⚠️ Free tier = 50 images/month (don't waste them!)  
⚠️ Low resolution on free (good enough for web)

**Fallback:**
Do it manually in Photoshop/GIMP, or use Canva's background remover

---

### Canva Free

**Category:** Graphics & Design  
**Cost:** FREE (Canva Pro = $12.99/mo optional)  
**Setup Time:** 5 min  
**Status:** ⚠️ NEEDS SETUP (free account)

**What it does:**
Make pretty graphics, social media posts, simple designs.

**When to use it:**
- Social media images for FoodTrend
- Quick banners or hero images
- Simple icon creation

**Setup steps:**
1. Go to https://canva.com
2. Sign up with email (FREE account)
3. Pick a template or start blank
4. Design and download

**Safety notes:**
✅ Very popular, totally safe  
⚠️ Pro version costs money (don't upgrade unless necessary)  
ℹ️ Free fonts/images are fine, skip "Pro" marked items

**Fallback:**
Use Figma (free), Photopea (free Photoshop alternative)

---

## 🔍 TESTING & DEBUGGING

### Browser DevTools

**Category:** Testing  
**Cost:** FREE FOREVER  
**Setup Time:** 0 min  
**Status:** ✅ READY NOW

**What it does:**
Shows errors, lets you test code, inspect website parts.

**When to use it:**
- EVERY SINGLE TIME you code
- Something's broken and you don't know why
- Want to see network requests or console errors

**How to use:**
1. Press F12 (or Ctrl+Shift+I on Windows)
2. Look at Console tab for errors
3. Use Elements tab to inspect HTML/CSS
4. Use Network tab to see loading issues

**Safety notes:**
✅ Built into browser, can't be safer  
✅ Chrome, Edge, Firefox all have it

**Fallback:**
None needed - this IS the standard tool

---

### Lighthouse

**Category:** Performance Testing  
**Cost:** FREE FOREVER  
**Setup Time:** 0 min  
**Status:** ✅ READY NOW

**What it does:**
Grades your website (like a report card for speed & quality).

**When to use it:**
- Before launching new features
- Website feels slow
- Want to check accessibility/SEO scores

**How to use:**
1. Open Chrome/Edge DevTools (F12)
2. Click "Lighthouse" tab
3. Click "Generate report"
4. Get scores (aim for 90+ on Performance)

**Safety notes:**
✅ Made by Google, built into Chrome  
✅ Runs locally, totally safe

**Fallback:**
Use PageSpeed Insights (web.dev/measure) - same thing, web version

---

### Responsively

**Category:** Responsive Testing  
**Cost:** FREE FOREVER  
**Setup Time:** 10 min  
**Status:** ⚠️ NEEDS SETUP (download app)

**What it does:**
See your website on phone, tablet, desktop all at once.

**When to use it:**
- Testing mobile/tablet layouts
- Ensuring responsive design works
- Before launching restaurant dashboard

**Setup steps:**
1. Go to https://responsively.app
2. Download for Windows
3. Install and open
4. Enter your localhost URL

**Safety notes:**
✅ Open source, safe to use  
⚠️ Download ONLY from responsively.app (official site)

**Fallback:**
Use Chrome DevTools responsive mode (F12 → Device Toolbar icon)

---

## 💻 CODE HELPERS

### Prettier

**Category:** Code Formatting  
**Cost:** FREE FOREVER  
**Setup Time:** 3 min  
**Status:** ⚠️ NEEDS SETUP (VS Code extension)

**What it does:**
Auto-fixes messy code spacing and formatting.

**When to use it:**
- Keep code clean automatically
- Before committing to Git
- Working with teammates (consistent style)

**Setup steps:**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "Prettier"
4. Install "Prettier - Code formatter"
5. (Optional) Set as default formatter in settings

**Safety notes:**
✅ Most popular formatter, very safe  
✅ 30+ million downloads

**Fallback:**
Format manually (but that's tedious!)

---

### Live Server

**Category:** Development Server  
**Cost:** FREE FOREVER  
**Setup Time:** 2 min  
**Status:** ⚠️ NEEDS SETUP (VS Code extension)

**What it does:**
Auto-refreshes browser when you save code changes.

**When to use it:**
- Testing HTML/CSS/JS changes instantly
- Don't want to manually refresh browser
- Working on UI/design

**Setup steps:**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "Live Server"
4. Install by Ritwick Dey
5. Right-click index.html → "Open with Live Server"

**Safety notes:**
✅ Very popular, 40+ million downloads  
✅ Runs locally, no security issues

**Fallback:**
Use Python's built-in server: `python -m http.server` (if Python installed)

---

### OpenCode

**Category:** AI Coding Assistant  
**Cost:** FREE (with own API keys) / Zen subscription optional  
**Setup Time:** 5 min  
**Status:** ⚠️ NEEDS SETUP (CLI + VS Code extension)

**What it does:**
Open source AI agent for coding in terminal, IDE, or desktop. Supports 75+ LLM providers including Claude, GPT, Gemini, and local models.

**When to use it:**
- AI-assisted coding directly in terminal
- Multi-session parallel agents on same project
- Need alternative to Antigravity for specific tasks

**Setup steps:**
1. Install CLI: `npm i -g opencode-ai`
2. Install VS Code extension (search "opencode" → sst-dev.opencode)
3. Configure your preferred model/API keys

**VS Code Shortcuts (Windows):**
| Action | Shortcut |
|--------|----------|
| Quick Launch | `Ctrl+Esc` |
| New Session | `Ctrl+Shift+Esc` |
| File Reference | `Alt+Ctrl+K` |

**Safety notes:**
✅ Open source (87K+ GitHub stars, 600+ contributors)  
✅ Privacy-first: does not store code or context data  
ℹ️ Can use existing GitHub Copilot or ChatGPT Plus/Pro accounts

**Fallback:**
Use Antigravity (Gemini), GitHub Copilot, or Cursor

---

## 💾 STORAGE & HOSTING

### Git/GitHub

**Category:** Version Control & Hosting  
**Cost:** FREE FOREVER  
**Setup Time:** 0 min  
**Status:** ✅ READY NOW (you're using it!)

**What it does:**
Saves code versions (time machine) and stores it online.

**When to use it:**
- Every time you make changes (daily commits!)
- Share code with others
- Deploy to GitHub Pages (free hosting)

**How to use:**
You already know this! Keep using it.

**Safety notes:**
✅ Industry standard, totally safe  
✅ You're already using it correctly

**Fallback:**
None - Git IS the industry standard

---

### Imgbb

**Category:** Image Hosting  
**Cost:** FREE (16MB per image limit)  
**Setup Time:** 0 min  
**Status:** ✅ READY NOW (optional account for management)

**What it does:**
Stores images online and gives you a link.

**When to use it:**
- Need to host images without a server
- Testing image URLs quickly
- Sharing screenshots/mockups

**How to use:**
1. Go to https://imgbb.com
2. Upload image (drag & drop)
3. Copy "Direct link" URL
4. Use in <img src="...">

**Safety notes:**
✅ Popular service, safe  
⚠️ Images are PUBLIC (don't upload private stuff)  
ℹ️ For production, use Cloudinary or your own hosting

**Fallback:**
Use GitHub to host images (commit to repo, use raw.githubusercontent.com link)

---

## ⚙️ AUTOMATION & INTEGRATION

### Make.com (formerly Integromat)

**Category:** Workflow Automation  
**Cost:** FREE (1,000 operations/month)  
**Setup Time:** 30 min  
**Status:** ⚠️ NEEDS SETUP (account + webhook config)

**What it does:**
Connects apps together (like: form submit → send email → save to sheet).

**When to use it:**
- Restaurant onboarding form → email notification
- Contact form → save to Google Sheets
- Automated workflows between services

**Setup steps:**
1. Go to https://make.com
2. Create FREE account
3. Create new "Scenario"
4. Add "Webhooks" → "Custom webhook"
5. Copy webhook URL
6. Add to your form's fetch() POST request

**Safety notes:**
✅ Legitimate service, safe  
⚠️ Don't exceed 1,000 ops/month (track usage)  
ℹ️ Alternative: Zapier (similar, also has free tier)

**Fallback:**
Use simple email service like Formspree (free tier: 50 forms/month)

---

### Node.js

**Category:** JavaScript Runtime  
**Cost:** FREE FOREVER  
**Setup Time:** 10 min (if not installed)  
**Status:** ❓ CHECK IF READY (run `node --version`)

**What it does:**
Runs JavaScript outside the browser (for scripts, automation).

**When to use it:**
- Running automation scripts
- Building tools (like tool-suggester.js)
- npm package management

**Check if installed:**
```powershell
node --version
# If you see v16+ → READY NOW!
# If error → NEEDS SETUP
```

**Setup steps (if needed):**
1. Go to https://nodejs.org
2. Download LTS version (free)
3. Install (click next, next, finish)
4. Restart terminal
5. Run `node --version` to confirm

**Safety notes:**
✅ Official tool, totally safe  
✅ Download ONLY from nodejs.org

**Fallback:**
None - Node IS the standard for JavaScript tooling

---

## 🚀 DEPLOYMENT & HOSTING

### GitHub Pages

**Category:** Free Web Hosting  
**Cost:** FREE FOREVER  
**Setup Time:** 5 min  
**Status:** ⚠️ NEEDS SETUP (enable in GitHub settings)

**What it does:**
Hosts your website for free (like Vercel/Netlify).

**When to use it:**
- Deploy FoodTrend for testing
- Share live demo with others
- Free production hosting for static sites

**Setup steps:**
1. Go to your GitHub repo
2. Settings → Pages
3. Source → main branch
4. Save
5. Visit https://[username].github.io/[repo-name]

**Safety notes:**
✅ Official GitHub feature, totally safe  
⚠️ Site is PUBLIC (everyone can see it)  
ℹ️ Custom domains supported (free)

**Fallback:**
Use Netlify (drag & drop deploy, also free) or Vercel

---

### Netlify

**Category:** Deployment & Hosting  
**Cost:** FREE (100GB bandwidth/mo)  
**Setup Time:** 10 min  
**Status:** ⚠️ NEEDS SETUP (account + connect repo)

**What it does:**
Auto-deploys your site when you push to GitHub.

**When to use it:**
- Continuous deployment (auto-updates on git push)
- Need form handling (Netlify Forms free)
- Want HTTPS automatically

**Setup steps:**
1. Go to https://netlify.com
2. Sign up with GitHub
3. "New site from Git"
4. Choose FoodTrend repo
5. Deploy!

**Safety notes:**
✅ Very popular, totally safe  
✅ Generous free tier  
ℹ️ Forms: 100 submissions/month free

**Fallback:**
GitHub Pages or Vercel (similar services)

---

## 📊 ANALYTICS (Optional - Use Later)

### Google Analytics

**Category:** Website Analytics  
**Cost:** FREE  
**Setup Time:** 15 min  
**Status:** ℹ️ OPTIONAL (only add if you need stats)

**What it does:**
Tracks visitors, page views, where users come from.

**When to use it:**
- Need to know how many users visit
- Want to see which pages are popular
- Making data-driven decisions

**Setup steps:**
1. Go to https://analytics.google.com
2. Create account (free)
3. Get tracking code
4. Add to every HTML page (before </head>)

**Safety notes:**
✅ Standard industry tool  
⚠️ Requires cookie consent (GDPR compliance)  
ℹ️ Alternative: Plausible (privacy-focused, paid)

**Fallback:**
Start without analytics, add later when you have users

---

## 💰 OPTIONAL PAID TOOLS (Only If Needed)

### Canva Pro

**Category:** Graphics  
**Cost:** $12.99/month  
**Status:** ⛔ OPTIONAL (free version is enough!)

**What it adds over free:**
- More templates
- Background remover (unlimited)
- Brand kit
- Resize magic

**Should you get it?**
NO, not yet. Free version works great.  
Only upgrade if you're making 50+ graphics/month.

---

### Make.com Pro

**Category:** Automation  
**Cost:** $9/month (10,000 operations)  
**Status:** ⛔ OPTIONAL (1,000 free is enough!)

**What it adds over free:**
- More operations (10k vs 1k)
- Faster execution
- More integrations

**Should you get it?**
NO, not yet. 1,000 operations/month = ~30/day = plenty!  
Only upgrade if you hit the limit.

---

## 🤖 GHL AUTOMATION (Internal Scripts)

### Create GHL Custom Fields

**Category:** Automation  
**Cost:** FREE  
**Setup Time:** 0 min (keys already configured)  
**Status:** ✅ READY NOW

**What it does:**
Bulk-creates all FoodTrend custom fields in GoHighLevel via API.

**When to use it:**
- Setting up a new GHL location
- Adding new custom fields to an existing setup
- Rebuilding fields after a GHL account reset

**How to use:**
```powershell
cd backend
node scripts/create-ghl-fields.js
```

**Prerequisites:**
- `GHL_API_KEY` in `.env`
- `GHL_LOCATION_ID` in `.env`

**Fallback:**
Create fields manually in GHL → Settings → Custom Fields

**Related workflow:** `/ghl-automation`

---

## 📋 Summary Stats

**READY NOW (no setup):** 8 tools
- Squoosh, Remove.bg, DevTools, Lighthouse, Imgbb, PowerShell, GitHub, GHL Scripts

**NEEDS SETUP (free, 5-15 min):** 7 tools
- Canva, Responsively, Prettier, Live Server, OpenCode, GitHub Pages, Netlify

**OPTIONAL (use later):** 2 tools
- Google Analytics, Node.js (check if you have it first)

**PAID (avoid for now):** 2 tools
- Canva Pro, Make.com Pro

---

**Total cost to get started: $0.00** ✅

**Next:** Check out `.agent/tools/tool-selector.md` for the decision workflow!
