---
description: How to automate GoHighLevel (GHL) tasks like creating custom fields
---

# GHL Automation Workflow

Use this workflow when you need to automate GoHighLevel tasks like creating custom fields, syncing contacts, or triggering workflows.

## Prerequisites
Ensure these environment variables are set in `backend/.env`:
```
GHL_API_KEY=your_api_key_or_access_token
GHL_LOCATION_ID=your_location_id
```

## Available Scripts

### 1. Create Custom Fields
**Script:** `backend/scripts/create-ghl-fields.js`
**Purpose:** Bulk-create all FoodTrend custom fields in GHL

// turbo
```powershell
cd backend
node scripts/create-ghl-fields.js
```

### 2. Sync Contacts (when needed)
Use the existing service in `backend/services/ghl-integration.js`:
- `upsertInfluencerContact()` - Sync influencer to GHL
- `upsertRestaurantContact()` - Sync restaurant to GHL

### 3. Trigger Workflows
Use `backend/services/ghl-workflow-triggers.js`:
- `triggerRestaurantOnboarding(contactId, data)` 
- `trigger48HourReminder(contactId, data)`
- `triggerReviewRequest(contactId, data)`
- `triggerMilestone(contactId, milestone)`

## Adding New Custom Fields
1. Add to `CUSTOM_FIELDS` array in `scripts/create-ghl-fields.js`
2. Run the script again - it will skip existing fields

## GHL API Reference
- Base URL: `https://services.leadconnectorhq.com`
- Docs: https://highlevel.stoplight.io/docs/integrations
