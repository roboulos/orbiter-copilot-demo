# URGENT MESSAGE FOR BACKEND TEAM

**Date:** Feb 19, 2026 @ 9:05 PM  
**From:** Robert (via Zora)  
**Priority:** CRITICAL - Demo broken

---

## The Problem

The /chat endpoint (#8064) is receiving network_data correctly but **NOT USING IT**.

**What's happening:**
1. ✅ Frontend sends 191 connections as JSON in `network_data` field
2. ✅ Backend receives it (confirmed)
3. ✅ Backend returns `scanning_card`
4. ❌ **scanning_card is MISSING the required props** (connections_analyzed, potential_matches)
5. ❌ **Backend never returns outcome_card** with actual suggestions
6. ❌ Chat just hangs - no response

**Result:** Scanning card shows "0 connections analyzed, 0 potential matches" - completely broken.

---

## What You Need to Fix

### Fix #1: scanning_card Must Include Numbers

**Currently you're returning:**
```json
{
  "name": "scanning_card",
  "templateProps": {
    "title": "Scanning for Costa Rica contacts"
  }
}
```

**You MUST return:**
```json
{
  "name": "scanning_card",
  "templateProps": {
    "title": "Scanning for Costa Rica contacts",
    "connections_analyzed": 191,
    "potential_matches": 12,
    "subtitle": "Finding real estate expertise..."
  }
}
```

**Where to get the numbers:**
- `connections_analyzed` = `network_data.total` (191 in our case)
- `potential_matches` = count of connections you actually found matching the criteria

### Fix #2: You MUST Return outcome_card After scanning_card

**Full expected flow:**

1. **First:** Return scanning_card (while you're searching)
```json
{
  "name": "scanning_card",
  "templateProps": {
    "title": "Scanning 191 connections for Costa Rica expertise",
    "connections_analyzed": 191,
    "potential_matches": 8,
    "subtitle": "Searching for real estate developers and expats..."
  }
}
```

2. **Then:** Return outcome_card with actual people
```json
{
  "name": "outcome_card",
  "templateProps": {
    "outcome": "Found 8 Costa Rica connections",
    "suggestions": [
      {
        "person": "David Park",
        "title": "Real Estate Developer",
        "company": "Costa Rica Coastal Properties",
        "why": "20+ years developing Pacific Coast properties for American expats",
        "master_person_id": 101
      },
      {
        "person": "Maria Santos",
        "title": "Expat Community Leader", 
        "company": "Tamarindo Expat Network",
        "why": "8 years living in Tamarindo, runs weekly meetups",
        "master_person_id": 205
      }
    ]
  }
}
```

**You're currently stopping after scanning_card and never sending outcome_card.**

---

## How to Test This Yourself

**1. Make a request:**
```bash
POST /chat
{
  "prompt": "I want to buy a house in Costa Rica for relocation",
  "network_data": "{\"total\":191,\"loaded\":191,\"connections\":[{\"id\":101,\"name\":\"David Park\",\"title\":\"Real Estate Developer\",\"company\":\"Costa Rica Properties\",\"bio\":\"20 years experience\"}]}"
}
```

**2. Expected response:**
```json
{
  "raw": "{\"response\":[{\"name\":\"scanning_card\",\"templateProps\":{\"title\":\"Scanning for Costa Rica contacts\",\"connections_analyzed\":191,\"potential_matches\":8}},{\"name\":\"outcome_card\",\"templateProps\":{\"outcome\":\"Found 8 connections\",\"suggestions\":[...]}}]}"
}
```

**3. Check:**
- ✅ scanning_card has `connections_analyzed: 191`
- ✅ scanning_card has `potential_matches: 8` (or however many you found)
- ✅ outcome_card comes after scanning_card
- ✅ outcome_card has actual people from network_data

---

## Where the Bug Is

**Your system prompt probably has:**
```
When user asks about connections, return scanning_card...
```

**But it's missing:**
```
When returning scanning_card:
1. Set connections_analyzed to network_data.total
2. Parse network_data.connections array
3. Search for matches by title/company/bio keywords
4. Count matches -> potential_matches
5. Include those numbers in templateProps

Then return outcome_card with:
1. Top 3-5 matches from network_data
2. Each match must include WHY they're relevant
3. Include master_person_id from connection.id
```

---

## Impact on Demo

**Current state:** Demo is completely broken. AI shows 0/0 and doesn't suggest anyone.

**After fix:** AI will show "Scanning 191 connections" → "Found 8 matches" → Shows actual people with context.

**Timeline:** Demo is Feb 27 (7 days). Need this fixed ASAP to have time for testing.

---

## Test Cases

### Test 1: Costa Rica
**Input:** "I want to buy a house in Costa Rica"
**Expected:** scanning_card with 191/X → outcome_card with real estate developers and expats

### Test 2: B2B SaaS Investors
**Input:** "Find me investors for my B2B SaaS startup"  
**Expected:** scanning_card with 191/X → outcome_card with VCs who focus on B2B/SaaS

### Test 3: Help Someone
**Input:** Select person → "Help them find investors"
**Expected:** Same flow but personalized to help that person

---

## Files with Full Details

1. **BACKEND-FIX-SCANNING-CARD.md** - scanning_card spec
2. **BACKEND-NETWORK-DATA.md** - How to parse and use network_data
3. **CURRENT-STATE-HONEST.md** - Current status

---

## Bottom Line

**The system prompt update didn't work.** It's receiving network_data but not actually parsing it or using it to make suggestions.

**You need to:**
1. Fix scanning_card to include the numbers
2. Actually search network_data.connections for matches
3. Return outcome_card with real people
4. Test with real 191-connection dataset

**This is blocking the entire demo.** Frontend is ready and waiting.

---

**Questions?** Check the 3 documentation files. Test locally first, then we'll verify frontend works.

**ETA?** How soon can you deploy this fix?
