# Backend: Network Data Integration

**Date:** Feb 19, 2026 @ 8:10 PM
**Priority:** CRITICAL - Core Functionality

## The Problem

Frontend was sending only 20 connections as plain text summary:
```
My Network (50 connections):
- Sarah Chen (VP Engineering) at Stripe
- Marcus Williams (Seed Investor) at Sequoia
...
```

**Issues:**
- AI can't search/filter by industry, company, role
- Missing 180+ connections (only showing 20 of 200+)
- No structured metadata for intelligent matching
- Can't suggest "find me real estate developers in Costa Rica" effectively

## The Solution

Frontend NOW sends structured JSON with FULL network data (200+ connections).

### New Request Field: `network_data`

**Format:** JSON string

**Structure:**
```json
{
  "total": 200,
  "loaded": 200,
  "connections": [
    {
      "id": 123,
      "name": "Sarah Chen",
      "title": "VP Engineering",
      "company": "Stripe",
      "bio": "Leading payments infrastructure...",
      "avatar": "https://...",
      "status": "connected",
      "last_activity": 1708387200
    },
    // ... 199 more
  ],
  "industries": ["SaaS", "Real Estate", "VC", "Healthcare", ...],
  "top_companies": ["Stripe", "Notion", "Sequoia", "Y Combinator", ...]
}
```

### How to Use in System Prompt

**Parse the network_data field:**
```
If network_data is provided, parse it as JSON.
You now have access to ALL connections with full metadata.
```

**Intelligent Suggestions:**
```
When asked to find connections:
1. Parse network_data JSON
2. Filter by industry/company/title/bio keywords
3. Rank by relevance
4. Return top 3-5 matches with reasons WHY

Example:
User: "Find me investors for my B2B SaaS startup"

Parse network_data → Filter:
- title contains "investor", "VC", "partner"
- company contains "capital", "ventures", "fund"
- bio mentions "B2B", "SaaS", "early-stage"

Return:
- Marcus Williams (Seed Investor at Sequoia) - WHY: B2B focus
- Jessica Park (Partner at First Round) - WHY: SaaS expertise
- David Chen (Angel Investor) - WHY: Multiple SaaS exits
```

**Search Capabilities:**
- Industry filtering: `connections.filter(c => c.company.includes("Real Estate"))`
- Role filtering: `connections.filter(c => c.title.toLowerCase().includes("developer"))`
- Bio search: `connections.filter(c => c.bio?.includes("Costa Rica"))`
- Company matching: `connections.filter(c => top_companies.includes(c.company))`

### System Prompt Update Required

**Add to /chat endpoint system prompt:**

```
# NETWORK DATA USAGE

When network_data field is provided:
1. Parse as JSON (already structured)
2. You have access to user's FULL network (200+ connections)
3. Use it to make INTELLIGENT suggestions based on:
   - Industry/company match
   - Role/title relevance
   - Bio keyword matches
   - Expertise areas

When suggesting people:
- Search/filter the connections array
- Rank by relevance to user's goal
- Explain WHY each person is suggested
- Limit to top 3-5 matches (quality over quantity)

Example response format:
{
  "name": "scanning_card",
  "templateProps": {
    "title": "Searching your network...",
    "count": 200,
    "message": "Analyzing connections for real estate expertise"
  }
}

Then:
{
  "name": "outcome_card",
  "templateProps": {
    "outcome": "Found 3 real estate connections in Costa Rica",
    "suggestions": [
      {
        "person": "David Park",
        "title": "Real Estate Developer",
        "company": "Costa Rica Properties",
        "why": "20+ years developing properties in Pacific Coast region"
      },
      ...
    ]
  }
}
```

## Request Format (Full Example)

**POST /chat**
```json
{
  "prompt": "Help me find investors for my B2B SaaS startup",
  "person_context": "",
  "master_person_id": null,
  "history": [],
  "network_data": "{\"total\":200,\"loaded\":200,\"connections\":[{\"id\":123,\"name\":\"Sarah Chen\",\"title\":\"VP Engineering\",\"company\":\"Stripe\",\"bio\":\"...\",\"avatar\":\"...\",\"status\":\"connected\",\"last_activity\":1708387200},...],\"industries\":[\"SaaS\",\"Real Estate\",...],\"top_companies\":[\"Stripe\",\"Notion\",...]}"
}
```

**Key Fields:**
- `network_data` - Structured JSON string with ALL connections
- Parse it, search it, filter it, rank it
- Make intelligent suggestions

## Expected Behavior

**Before (broken):**
- AI sees 20 names in text
- Generic suggestions
- No filtering capability
- Misses relevant people

**After (working):**
- AI sees ALL 200 connections with metadata
- Intelligent filtering by industry/role/expertise
- Ranked suggestions with reasons
- Finds the RIGHT people

## Testing

**Test Case 1: Costa Rica Real Estate**
```
Prompt: "I want to buy a house in Costa Rica for relocation. Help me find connections to realtors and expats who know the area."

Expected:
1. Parse network_data
2. Filter: title/bio contains "real estate", "realtor", "developer", "Costa Rica", "expat"
3. Rank by relevance
4. Return top 3-5 with WHY explanations
```

**Test Case 2: B2B SaaS Investors**
```
Prompt: "Find me investors for my B2B SaaS startup"

Expected:
1. Parse network_data
2. Filter: title contains "investor", "VC", "partner"
3. Filter: company contains "capital", "ventures"
4. Filter: bio mentions "B2B", "SaaS"
5. Return top 3-5 with investment focus
```

## Implementation Checklist

**Backend Team:**
- [ ] Update /chat system prompt to parse network_data field
- [ ] Add JSON parsing logic for network_data
- [ ] Implement search/filter capabilities
- [ ] Add intelligent ranking algorithm
- [ ] Test with real data (200+ connections)
- [ ] Verify suggestions are relevant and explain WHY

**Frontend (DONE):**
- [x] Fetch all 200+ connections
- [x] Build structured JSON format
- [x] Send as network_data field
- [x] Update chat() function signature

## Expected Impact

**Demo Quality:**
- AI will make SMART suggestions from real network
- Mark Cuban will see intelligent filtering in action
- "Find me investors" → Shows actual VCs from network with WHY
- "Costa Rica real estate" → Shows actual developers/expats with context

**Timeline:**
- Frontend changes: DONE (Feb 19 @ 8:10 PM)
- Backend changes: 1-2 hours (system prompt update)
- Testing: 30 minutes
- Demo ready: Tonight

---

**Status:** Frontend ready. Backend team: Please update /chat system prompt to parse and use network_data field for intelligent suggestions.

**Questions?** Check FIXES-NEEDED.md for full context.
