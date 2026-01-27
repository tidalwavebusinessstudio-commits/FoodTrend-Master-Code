# Schema Type Mismatch Error

**Date:** 2026-01-25  
**AI Used:** Claude/Antigravity  
**Context:** Creating restaurant_feedback table for Review Gating System

## What Happened

Attempted to create `restaurant_feedback` table with foreign key constraints. Failed twice due to incorrect data type assumptions.

## Error 1
```
ERROR: 42804: foreign key constraint "restaurant_feedback_restaurant_id_fkey" cannot be implemented
DETAIL: Key columns "restaurant_id" and "id" are of incompatible types: uuid and bigint.
```
**Cause:** Assumed `restaurants.id` was UUID, but it's actually BIGINT.

## Error 2
```
ERROR: 42804: foreign key constraint "restaurant_feedback_influencer_id_fkey" cannot be implemented
DETAIL: Key columns "influencer_id" and "id" are of incompatible types: bigint and uuid.
```
**Cause:** After fixing first error by changing all to BIGINT, discovered `profiles.id` is UUID.

## Root Cause
- AI assumed all tables used UUID for primary keys
- Did NOT verify actual schema before writing SQL
- Tables have MIXED data types:
  - `profiles.id` = UUID
  - `restaurants.id` = BIGINT
  - `creator_visits.id` = BIGINT (assumed)

## Prevention
Before writing SQL with foreign keys:
1. **ALWAYS** run: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'table_name';`
2. OR ask user to verify table schema
3. NEVER assume data types

## Corrected Schema
```sql
influencer_id UUID     -- matches profiles.id
restaurant_id BIGINT   -- matches restaurants.id
creator_visit_id BIGINT -- matches creator_visits.id
```

## Files Updated
- `backend/database/schema_review_gating.sql` - Corrected to use mixed types
