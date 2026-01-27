# AI Hallucination

**Date:** 2026-01-24  
**AI Used:** Claude/Antigravity  
**Context:** Stating production webhook URL

## What AI Claimed
```
Your public webhook URLs should be:
- Health: https://api.foodtrend.app/health
```

## Reality
Actual deployed URL: `https://api.yourfoodtrend.com/health`

## Root Cause
- [x] AI didn't have file access
- [ ] AI assumed standard library
- [ ] AI confused similar functions
- [ ] AI invented solution
- [x] Other: AI trusted .env config value as source of truth instead of verifying actual deployment

## Prevention
When stating production URLs, API endpoints, or deployed resources:
1. NEVER trust config files as source of truth for live deployments
2. Ask user to verify or test the actual URL
3. Say "Your config says X, but please confirm the actual deployed URL"

## Verification Added
Add to Gate 4 checks: "Does config match production reality?"
