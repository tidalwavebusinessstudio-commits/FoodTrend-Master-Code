# 🧠 Pinecone Memory Registry

> **Purpose:** Define categories for long-term memory storage in Pinecone  
> **Usage:** Tag all stored documents with appropriate categories  
> **Last Updated:** 2026-01-31

---

## Memory Categories

### 📄 Contracts
Legal agreements, terms of service, partnership agreements.

**Examples:**
- Restaurant service agreements
- Creator participation terms
- NDA templates
- Referral commission agreements

**Metadata tags:** `type:contract`, `party:[name]`, `date:[ISO]`, `status:[active|expired]`

---

### 📝 Proposals
Business proposals, partnership pitches, investor decks.

**Examples:**
- Restaurant pitch decks
- Creator recruitment materials
- Partnership proposals
- Investment summaries

**Metadata tags:** `type:proposal`, `target:[name]`, `date:[ISO]`, `status:[sent|accepted|rejected]`

---

### 📋 SOPs
Standard operating procedures, playbooks, process documentation.

**Examples:**
- Creator onboarding checklist
- Restaurant qualification process
- Content review workflow
- Payout processing steps

**Metadata tags:** `type:sop`, `process:[name]`, `version:[number]`, `owner:[role]`

---

### 🗓️ Meetings
Meeting notes, decision records, action items.

**Examples:**
- Weekly team standups
- Strategy sessions
- Client calls
- Partnership discussions

**Metadata tags:** `type:meeting`, `participants:[list]`, `date:[ISO]`, `decisions:[summary]`

---

### 🔬 Research
Market research, competitor analysis, user feedback.

**Examples:**
- Restaurant market analysis
- Influencer platform comparisons
- Customer survey results
- Industry trend reports

**Metadata tags:** `type:research`, `topic:[name]`, `date:[ISO]`, `source:[origin]`

---

### 🌐 Website Decisions
Design choices, copy decisions, UX changes.

**Examples:**
- Homepage redesign rationale
- Qualification flow updates
- Color palette decisions
- Section layout changes

**Metadata tags:** `type:website`, `page:[path]`, `date:[ISO]`, `reason:[summary]`

---

### 🐛 Bugs & Fixes
Technical issues, debugging sessions, solutions.

**Examples:**
- CSS gap issue resolution
- API integration fixes
- Performance optimizations
- Browser compatibility patches

**Metadata tags:** `type:bug`, `severity:[low|medium|high|critical]`, `date:[ISO]`, `fixed:[boolean]`

---

## Storage Rules

### Versioning
- Newer versions **UPSERT** (update) existing entries
- Keep version history in metadata
- Mark superseded documents as `status:archived`

### Required Metadata
Every document must include:
```json
{
  "id": "unique-identifier",
  "type": "category-from-above",
  "title": "Human-readable title",
  "date_created": "ISO-8601",
  "date_modified": "ISO-8601",
  "summary": "Brief description",
  "tags": ["relevant", "keywords"]
}
```

### Retrieval Patterns
Common queries to support:
- "What did we decide about [topic]?"
- "What's our SOP for [process]?"
- "Show me all bugs related to [feature]"
- "What contracts are currently active?"

---

## Storage Workflow

### When to Store
1. After any significant decision
2. After resolving a complex bug
3. After creating/updating an SOP
4. After important meetings
5. After completing research

### How to Store
1. Create markdown file in `FoodTrend_HQ/LongTermMemory/`
2. Include proper frontmatter with metadata
3. Run Pinecone upsert command
4. Verify successful indexing

### Example Document Format
```markdown
---
id: website-decision-2026-01-31-hero
type: website
title: Hero Section Redesign Decision
date_created: 2026-01-31
date_modified: 2026-01-31
tags: [hero, homepage, design, conversion]
---

# Hero Section Redesign Decision

## Context
[Why this decision was needed]

## Options Considered
[What alternatives were evaluated]

## Decision
[What was decided and why]

## Impact
[Expected outcomes]
```

---

## Query Examples

### Find all active contracts
```
type:contract AND status:active
```

### Find website decisions for homepage
```
type:website AND page:index
```

### Find all high-severity bugs
```
type:bug AND severity:high
```

### Find recent meeting decisions
```
type:meeting AND date_created:>2026-01-01
```
