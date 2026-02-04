# 🛑 RESPONSE REJECTION CRITERIA

This document is for the USER to instantly evaluate AI responses.

---

## ❌ AUTO-REJECT IF:

- It talks about Railway without first echoing ground truth
- It proposes redeployment or setup steps
- It says "memory updated" without proof
- It narrates actions instead of showing verification
- It assumes something was not done when you know it was
- It references local file paths or screenshots it cannot access
- It says "ready to proceed" without proving current state

---

## ✅ ACCEPT ONLY IF:

- Ground truth is echoed in the first lines
- Scope is explicitly stated
- Files touched are named
- Actions are incremental and verifiable
- Unknowns are admitted instead of guessed

---

## 🛑 INSTANT STOP PHRASE

Use this verbatim when a response fails:

> **"Stop. You did not verify ground truth before acting. Re-read the constitution and retry."**

---

## 📋 QUICK CHECK (First 3 Lines Test)

A valid response about infrastructure MUST have this pattern in the first 3 lines:

```
GROUND TRUTH VERIFIED:
- Backend URL: https://api.yourfoodtrend.com
- Railway Project: respectful-solace
- Deployment Status: LIVE & RUNNING 24/7
- Health Endpoint: https://api.yourfoodtrend.com/health
```

**If this is missing → REJECT IMMEDIATELY.**

---

*This is governance, not debugging.*
