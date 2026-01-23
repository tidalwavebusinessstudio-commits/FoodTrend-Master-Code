---
description: How to set up a new tool safely and document it
---

# Setup Tool Workflow

Use this when you need to install/configure a new tool.

---

## Before You Start

```
☐ Is this tool in TOOLS_REGISTRY.md?
   ├─ YES → Follow the setup steps listed there
   └─ NO → Is it really needed? Ask user if uncertain
   
☐ Is it FREE?
   ├─ NO → STOP! Ask user for approval first
   └─ YES → Continue
   
☐ Does it need < 15 minutes setup?
   ├─ NO → STOP! Ask user if worth the time
   └─ YES → Continue
```

---

## Setup Steps

### 1. Read the Instructions

```
☐ Open .agent/tools/TOOLS_REGISTRY.md
☐ Find the tool
☐ Read "Setup steps" section completely
☐ Check "Safety notes" - any warnings?
```

### 2. Prepare

```
☐ Close unnecessary apps (free up memory)
☐ Have the tool's official website ready
☐ Note the estimated time (don't rush)
```

### 3. Install/Configure

```
☐ Follow setup steps EXACTLY as written
☐ Download ONLY from official sources
☐ Don't skip steps (even if they seem optional)
☐ If asked for permissions, read what they need
```

**Common setup types:**

**VS Code Extension:**
1. Ctrl+Shift+X (Extensions)
2. Search exact name
3. Click Install
4. Reload if prompted
5. Configure settings (if needed)

**Web Account:**
1. Go to official website
2. Sign up with email
3. Verify email
4. Keep password safe
5. Note free tier limits

**Desktop App:**
1. Download from official site
2. Run installer
3. Follow wizard (default settings usually OK)
4. Restart if needed
5. Test that it opens

**Webhook/API:**
1. Create account
2. Navigate to settings/integrations
3. Create new webhook/API key
4. Copy key/URL (save securely!)
5. Add to your code (.env file, not main code!)

---

### 4. Verify It Works

```
☐ Test the tool with a simple task
☐ Check that it does what you expected
☐ If errors → Check troubleshooting.md
☐ If still broken → Check tool's documentation
```

**Test examples:**

| Tool | Test |
|------|------|
| Live Server | Right-click HTML → "Open with Live Server" |
| Prettier | Open JS file → Right-click → "Format Document" |
| Responsively | Open app → Enter localhost URL |
| GitHub Pages | Visit https://[user].github.io/[repo] |
| Make.com | Send test webhook with Postman/curl |

---

### 5. Document It

```
☐ Tool works? Good!
☐ Update .agent/tools/TOOLS_REGISTRY.md if you added notes
☐ If you hit issues → Add to .agent/troubleshooting.md
☐ Add quick reference to your personal notes
```

**Documentation template:**

```markdown
## Tool Setup Log

**Tool:** [Name]  
**Date:** 2026-01-23  
**Result:** ✅ Success / ⚠️ Had issues / ❌ Failed

**What I did:**
1. [Step by step what you actually did]
2. [Include any changes from official instructions]

**Issues hit:**
- [Any problems you encountered]
- [How you solved them]

**Time taken:** [Actual minutes]

**Notes for next time:**
- [Anything you'd do differently]
- [Tips for faster setup]
```

---

### 6. Clean Up

```
☐ Close any extra browser tabs
☐ Delete any downloaded installers (if app is installed)
☐ Organize bookmarks (if you added any)
☐ git commit your config changes (if any)
```

---

## Common Pitfalls

**❌ Don't:**
- Rush through setup (leads to mistakes)
- Skip reading safety notes
- Use unofficial download sites
- Share API keys publicly
- Forget to test before using in production

**✅ Do:**
- Read instructions completely first
- Verify official website URL
- Keep credentials secure (.env files, password manager)
- Test with dummy data first
- Document any custom steps you took

---

## Troubleshooting

**Tool won't install:**
```
1. Check system requirements (Windows version, etc.)
2. Try restarting computer
3. Check if antivirus is blocking it
4. Look for error messages in installer
5. Search "[tool name] won't install Windows" + error message
```

**Tool installed but won't work:**
```
1. Restart the app/editor
2. Check if it needs additional setup (API keys, etc.)
3. Look at tool's documentation/FAQ
4. Check .agent/troubleshooting.md for known issues
5. Try the fallback tool from TOOLS_REGISTRY.md
```

**Can't find the tool:**
```
1. Verify you're on the official website
2. Check if tool changed name
3. Look for "Download" or "Get Started" button
4. Check if it's region-locked (unlikely but possible)
5. Use fallback from TOOLS_REGISTRY.md
```

---

## Safety Checklist

**Before installing ANYTHING:**

```
☐ Is this the official website? (Check URL carefully)
☐ Does it have good reviews/ratings?
☐ Is it open source or from a known company?
☐ Does it ask for reasonable permissions?
☐ Is it listed in our TOOLS_REGISTRY.md? (If not, be extra careful)
```

**Red flags:**
- ❌ Asks for credit card for "free" tool
- ❌ Download from sketchy site (ads everywhere, pop-ups)
- ❌ Asks to disable antivirus
- ❌ Wants admin rights without clear reason
- ❌ Has very few users/reviews
- ❌ Promises "unlimited" paid features for free

**If you see red flags → STOP and ask user**

---

## Integration with Prime Directive

**After setting up a tool:**

```
☐ Fib(1): Tool is installed
☐ Fib(2): Tool is documented in registry
☐ Fib(3): Setup workflow is documented (if complex)
☐ Fib(5): Created shortcut/alias for common usage
☐ Fib(8): Integrated into daily workflow (automated)
```

**Example progression:**

- **Fib(1):** Installed Live Server extension
- **Fib(2):** Added notes to TOOLS_REGISTRY.md
- **Fib(3):** Created `.vscode/settings.json` for auto-config
- **Fib(5):** Added right-click shortcut to start server
- **Fib(8):** Server auto-starts when you open project

---

## Time Estimates (Reality Check)

**VS Code Extension:** 2-3 min  
**Web Account (simple):** 5-10 min  
**Desktop App:** 10-15 min  
**Webhook/API Integration:** 20-30 min  
**Complex Setup (OAuth, multi-step):** 30-60 min

**If taking longer:**
- ⚠️ Maybe the tool is too complex
- ⚠️ Maybe there's a simpler alternative
- ⚠️ Ask user: "Is this worth the time?"

---

## Success Criteria

**Tool is "ready" when:**

✅ It's installed and opens without errors  
✅ You tested it with a simple task  
✅ You know how to use it for your specific need  
✅ It's documented in TOOLS_REGISTRY.md  
✅ You have a fallback if it fails

**If missing any →** Not ready, keep working on it!

---

**Next:** Use the tool! And document any cool tricks you discover. 🚀
