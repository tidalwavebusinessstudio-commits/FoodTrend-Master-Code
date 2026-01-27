# Error Log: Supabase Migration Type Mismatch

**Date:** 2026-01-26
**Error:** Foreign key constraint type mismatch
**Affected:** `schema_gigs.sql` migration

## Error Message
```
ERROR: 42804: foreign key constraint "gigs_restaurant_id_fkey" cannot be implemented 
DETAIL: Key columns "restaurant_id" and "id" are of incompatible types: uuid and bigint.
```

## Root Cause
The `gigs` table was created with `restaurant_id UUID` but the existing `restaurants` table uses `id BIGINT` (not UUID). PostgreSQL requires foreign key reference columns to have the exact same data type.

## Resolution
Changed `restaurant_id UUID` → `restaurant_id BIGINT` in `schema_gigs.sql`:

```diff
- restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
+ restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
```

## Lesson Learned
Before creating foreign key references, always verify the target table's primary key data type:
```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'restaurants' AND column_name = 'id';
```

## Prevention
Add a pre-flight check to migration scripts or document expected schema types in schema files.
