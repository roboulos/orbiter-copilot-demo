# Message for Backend Team - Network Data Integration

**Date:** Feb 19, 2026 @ 8:20 PM  
**Priority:** HIGH - Core Demo Functionality  
**Timeline:** Need for Feb 27 demo

---

## What Changed (Frontend)

The frontend is now sending **full network data** to the `/chat` endpoint, not just a text summary.

### New Request Field: `network_data`

**Type:** JSON string  
**Contains:** ALL 200+ connections with full metadata

**Example:**
```json
{
  "prompt": "Find me real estate connections in Costa Rica",
  "person_context": "",
  "history": [],
  "network_data": "{\"total\":200,\"loaded\":200,\"connections\":[{\"id\":123,\"name\":\"David Park\",\"title\":\"Real Estate Developer\",\"company\":\"Costa Rica Properties\",\"bio\":\"20+ years developing Pacific Coast properties\",\"avatar\":\"https://...\",\"status\":\"connected\",\"last_activity\":1708387200},...],\"industries\":[\"Real Estate\",\"SaaS\",\"VC\",...],\"top_companies\":[\"Stripe\",\"Notion\",\"Sequoia\",...]}"
}
```

---

## What You Need to Do (Backend)

### Step 1: Update `/chat` System Prompt

Add network data parsing to the system prompt:

```
# NETWORK DATA USAGE

When the network_data field is provided:
1. Parse it as JSON (already structured, not raw text)
2. You now have access to user's FULL network (200+ connections)
3. Use it to make INTELLIGENT suggestions based on:
   - Industry/company matches
   - Role/title relevance  
   - Bio keyword matches
   - Expertise areas

When suggesting people:
- Search/filter the connections array
- Rank by relevance to user's goal
- Explain WHY each person is suggested
- Limit to top 3-5 matches (quality over quantity)
```

### Step 2: Implement Search Logic

Enable filtering like:

```javascript
// Example: Find real estate connections
const matches = networkData.connections.filter(c => 
  c.title?.toLowerCase().includes('real estate') ||
  c.company?.toLowerCase().includes('real estate') ||
  c.bio?.toLowerCase().includes('real estate')
);

// Example: Find investors for B2B SaaS
const matches = networkData.connections.filter(c =>
  (c.title?.includes('investor') || c.title?.includes('VC')) &&
  (c.bio?.includes('B2B') || c.bio?.includes('SaaS'))
);
```

### Step 3: Return Intelligent Suggestions

Format suggestions with WHY explanations:

```json
{
  "name": "outcome_card",
  "templateProps": {
    "outcome": "Found 3 real estate experts in Costa Rica",
    "suggestions": [
      {
        "person": "David Park",
        "title": "Real Estate Developer",
        "company": "Costa Rica Coastal Properties",
        "why": "20+ years developing Pacific Coast properties for American expats"
      },
      {
        "person": "Maria Santos", 
        "title": "Expat Community Leader",
        "company": "Tamarindo Network",
        "why": "8 years living in Tamarindo, runs weekly expat meetups"
      }
    ]
  }
}
```

---

## Why This Matters for Demo

**Before (broken):**
- AI only saw 20 names in plain text
- Generic suggestions like "You should talk to David"
- No context, no filtering, no intelligence

**After (working):**
- AI sees ALL 200+ connections with full metadata
- "David Park is a real estate developer with 20 years in Costa Rica's Pacific Coast"
- Intelligent ranking by relevance
- Explains WHY each person matters

**Mark Cuban will see:**
- AI making SMART suggestions from real network
- "Find me investors" → Shows actual VCs with investment focus
- "Costa Rica real estate" → Shows developers/expats with context
- This is THE core value prop of Orbiter

---

## Testing Checklist

After updating the system prompt:

- [ ] Parse `network_data` JSON when provided
- [ ] Search by industry: "Find real estate connections"
- [ ] Search by role: "Find investors"
- [ ] Search by keywords: "Costa Rica" in bio
- [ ] Return top 3-5 ranked matches
- [ ] Include WHY explanation for each
- [ ] Test with all 3 demo flows (Costa Rica, Investors, Help Someone)

---

## Documentation

Full details: `BACKEND-NETWORK-DATA.md` in the repo

Questions? The frontend changes are already deployed and sending data. Just need the backend to parse and use it.

---

**TL;DR:**
- Frontend now sends full network as JSON (`network_data` field)
- Backend needs to parse it and use for intelligent suggestions
- Critical for Feb 27 demo
- Makes AI actually smart (not just generic responses)

Let me know when it's deployed so we can test! 🚀
