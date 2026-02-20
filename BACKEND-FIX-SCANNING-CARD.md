# URGENT: ScanningCard Template Not Working

**Date:** Feb 19, 2026 @ 8:45 PM  
**Priority:** CRITICAL - Demo is broken

---

## The Problem

When backend returns `scanning_card`, it's showing **0 connections analyzed** and **0 potential matches**.

The animation is stuck at 0/0 because the backend isn't sending the actual numbers.

---

## What Backend MUST Send

When you return a `scanning_card` template, you MUST include:

```json
{
  "name": "scanning_card",
  "templateProps": {
    "title": "Scanning for Costa Rica contacts",
    "connections_analyzed": 191,
    "potential_matches": 12,
    "subtitle": "Ranking by relevance..."
  }
}
```

**Required fields:**
- `connections_analyzed` (number) - Total connections you scanned (should match network_data total)
- `potential_matches` (number) - How many matches you found
- `title` (string) - What you're scanning for
- `subtitle` (string, optional) - Status message

**Alternative prop names (we now support):**
- `total_connections` instead of `connections_analyzed`
- `matches_found` instead of `potential_matches`
- `count` instead of `connections_analyzed`
- `message` instead of `subtitle`

---

## Example Flow

**User:** "I want to buy a house in Costa Rica"

**You should:**
1. Parse network_data (has 191 connections)
2. Search for Costa Rica keywords
3. Find 12 matches
4. Return scanning_card with those numbers:

```json
{
  "name": "scanning_card",
  "templateProps": {
    "title": "Scanning 191 connections for Costa Rica expertise",
    "connections_analyzed": 191,
    "potential_matches": 12,
    "subtitle": "Found real estate developers and expats"
  }
}
```

**Then return outcome_card with the actual matches.**

---

## Current Behavior (BROKEN)

Right now you're returning:
```json
{
  "name": "scanning_card",
  "templateProps": {
    "title": "Scanning for Costa Rica contacts"
    // ❌ Missing connections_analyzed
    // ❌ Missing potential_matches
  }
}
```

This makes the card show 0/0 and looks completely broken.

---

## Fix Required

In your system prompt where it says to return scanning_card, add:
```
When returning scanning_card:
- Set connections_analyzed to the total from network_data.total
- Set potential_matches to how many matches you found
- Include a subtitle describing what you're finding
```

---

## Test Case

**Input:**
```json
{
  "prompt": "I want to buy a house in Costa Rica",
  "network_data": "{\"total\":191,\"loaded\":191,\"connections\":[...]}"
}
```

**Expected scanning_card:**
```json
{
  "name": "scanning_card",
  "templateProps": {
    "title": "Scanning your network for Costa Rica connections",
    "connections_analyzed": 191,
    "potential_matches": 8,
    "subtitle": "Looking for real estate expertise and expat connections"
  }
}
```

---

**STATUS:** Frontend is now flexible and will accept multiple prop names. But backend MUST send the actual numbers.

**URGENT:** Demo is in 7 days. This needs to work.
