# 🚨 URGENT: Backend Tasks for Thursday Demo

**To:** Backend Team  
**From:** Zora (Frontend)  
**Date:** February 19, 2026 @ 6:50 PM EST  
**Demo:** Thursday, February 27 @ 9 AM (7 days)

---

## ✅ WHAT'S WORKING (Thank You!)

**1. Visual Templates - PERFECT** ✅
- `/chat` endpoint returning `question_card` format
- `/chat` endpoint returning `scanning_card` format
- Button groups working perfectly
- Auto-send fixed and verified

**2. Dispatch Endpoint - CREATED** ✅
- `POST /dispatch` on port 8084
- Ready to receive requests
- Not tested yet (blocked by completing interview)

**Great work on getting these done so fast!**

---

## 🚨 WHAT'S BLOCKING THE DEMO

### Critical Issue: Interview Flow Incomplete

**Current behavior:**
1. User clicks "I want to buy a house in Costa Rica" ✅
2. Backend returns question_card: "Which region?" ✅
3. User clicks "Pacific Coast" ✅
4. Backend returns scanning_card: "Scanning network..." ✅
5. **THEN NOTHING** ⚠️

**What we need:**
- After scanning completes, return MORE questions
- Eventually return outcome/results
- Then user can click "Save to Orbiter" (triggers dispatch)

**Without this:** Demo stops at scanning screen, can't complete flow ❌

---

## 📋 WHAT YOU NEED TO BUILD

### Task 1: Add Follow-Up Questions After Scanning

**When:** After `scanning_card` completes  
**Return:** Another `question_card` with next question

**Example Response:**
```json
{
  "template": "question_card",
  "data": {
    "icon": "🏡",
    "title": "Property Type",
    "description": "What type of property are you looking for?",
    "buttons": [
      {
        "label": "Beach house",
        "value": "beach_house",
        "emoji": "🏖️",
        "subtitle": "Oceanfront or walking distance"
      },
      {
        "label": "Mountain retreat",
        "value": "mountain",
        "emoji": "⛰️",
        "subtitle": "Elevated with views"
      },
      {
        "label": "Condo/Apartment",
        "value": "condo",
        "emoji": "🏢",
        "subtitle": "Low maintenance"
      },
      {
        "label": "Land/Development",
        "value": "land",
        "emoji": "🌳",
        "subtitle": "Build from scratch"
      }
    ]
  }
}
```

**Suggested Questions (in order):**
1. ✅ Which region? (DONE)
2. ✅ Scanning... (DONE)
3. ⏳ Property type? (beach house, mountain, condo, land)
4. ⏳ Budget range? ($200-300K, $300-500K, $500K-1M, $1M+)
5. ⏳ Timeline? (Exploring, 6 months, ASAP, Investment)
6. ⏳ Primary use? (Vacation, Retirement, Investment, Full-time)

**You pick:** Don't need all 6, just 2-3 more questions is enough for demo

---

### Task 2: Return Outcome Summary

**When:** After all questions answered  
**Return:** Plain text response with summary + connections found

**Example Response:**
```json
{
  "template": "text",
  "data": {
    "text": "Great! I found **3 strong connections** who can help:\n\n**David Martinez** - Real estate agent in Tamarindo, specializes in beachfront properties\n\n**Sarah Chen** - Expat living in Manuel Antonio for 5 years, knows the area inside-out\n\n**Carlos Ramirez** - Property developer in Guanacaste, can help with land purchases\n\nI'll prepare warm introductions to all three. Ready to activate your network?"
  }
}
```

**OR use a custom card (fancier, optional):**
```json
{
  "template": "outcome_card",
  "data": {
    "title": "Costa Rica Relocation - Pacific Coast",
    "connections_found": 3,
    "people": [
      {
        "name": "David Martinez",
        "role": "Real Estate Agent",
        "location": "Tamarindo",
        "expertise": "Beachfront properties"
      },
      {
        "name": "Sarah Chen",
        "role": "Expat & Local Expert",
        "location": "Manuel Antonio",
        "expertise": "Living in Costa Rica"
      },
      {
        "name": "Carlos Ramirez",
        "role": "Property Developer",
        "location": "Guanacaste",
        "expertise": "Land development"
      }
    ],
    "action_button": {
      "label": "Save to Orbiter",
      "value": "save_outcome"
    }
  }
}
```

**Note:** Plain text is fine for demo! Custom card is optional polish.

---

### Task 3: Handle "Save to Orbiter" Button

**When:** User clicks final action button (e.g., "Save to Orbiter")  
**Action:** Frontend will call `POST /dispatch` with conversation data

**Frontend will send:**
```json
POST http://localhost:8084/dispatch
{
  "summary": "Buy beach house in Pacific Coast, Costa Rica. Budget $300-500K. Timeline: 6 months. Primary use: Vacation property.",
  "context": {
    "copilot_mode": "outcome",
    "person_context": null
  },
  "person_id": null,
  "conversation_history": [
    {
      "role": "user",
      "content": "I want to buy a house in Costa Rica"
    },
    {
      "role": "assistant",
      "content": "Which region interests you?"
    },
    {
      "role": "user",
      "content": "Pacific Coast"
    },
    // ... rest of conversation
  ]
}
```

**You need to:**
1. Accept this request
2. Create suggestion_request record
3. Return success response

**Expected response:**
```json
{
  "dispatch_id": "disp_abc123",
  "suggestion_request_id": 456,
  "status": "pending"
}
```

**Frontend will then:**
- Show confetti celebration 🎉
- Show success toast: "Network activated (disp_abc123)"

---

## 🎯 PRIORITY BREAKDOWN

### CRITICAL (Must Have for Demo)
1. ✅ Visual templates (question_card, scanning_card) - DONE
2. ✅ POST /dispatch endpoint - DONE
3. ⚠️ **2-3 follow-up questions after scanning** - NEEDED
4. ⚠️ **Outcome summary at end** - NEEDED

### NICE TO HAVE (Polish)
5. Custom outcome_card template (plain text is fine)
6. Real connection data (mock is fine for demo)
7. Multiple interview flows (Costa Rica is enough)

---

## 📅 TIMELINE

**What we need by when:**

### ASAP (Tonight/Weekend)
- [ ] Add 2-3 follow-up questions after scanning
- [ ] Add outcome summary response
- [ ] Test conversation flow end-to-end

### Monday Feb 24
- [ ] Verify dispatch endpoint works
- [ ] Test with frontend integration
- [ ] Handle edge cases (errors, timeouts)

### Tuesday-Wednesday Feb 25-26
- [ ] Final testing
- [ ] Demo rehearsal
- [ ] Backup plan if issues

### Thursday Feb 27 @ 9 AM
- ✅ **DEMO WITH CHARLES**

---

## 🧪 HOW TO TEST

### Manual Testing (Recommended)

**1. Test question flow:**
```bash
curl -X GET "http://localhost:8064/chat?message=I+want+to+buy+a+house+in+Costa+Rica"
# Should return question_card

curl -X GET "http://localhost:8064/chat?message=Pacific+Coast"
# Should return scanning_card

# Wait a few seconds...

curl -X GET "http://localhost:8064/chat?message=scanning_complete"
# Should return NEXT question_card (property type, budget, etc)

# Continue until outcome...

curl -X GET "http://localhost:8064/chat?message=beach_house"
# Eventually should return outcome summary
```

**2. Test dispatch:**
```bash
curl -X POST http://localhost:8084/dispatch \
  -H "Content-Type: application/json" \
  -d '{
    "summary": "Buy beach house in Pacific Coast Costa Rica",
    "context": {"copilot_mode": "outcome"},
    "person_id": null,
    "conversation_history": []
  }'

# Should return:
# {
#   "dispatch_id": "...",
#   "suggestion_request_id": ...,
#   "status": "pending"
# }
```

---

## 💬 EXAMPLE COMPLETE FLOW

Here's what the full conversation should look like:

**1. User:** "I want to buy a house in Costa Rica"

**Backend Response:**
```json
{
  "template": "question_card",
  "data": {
    "title": "Costa Rica Relocation",
    "description": "Which region interests you most?",
    "buttons": [
      {"label": "Pacific Coast", "value": "pacific_coast", "emoji": "🏖️"},
      {"label": "Central Valley", "value": "central_valley", "emoji": "🏔️"},
      {"label": "Caribbean Coast", "value": "caribbean", "emoji": "🌴"}
    ]
  }
}
```

---

**2. User:** "Pacific Coast" (clicks button)

**Backend Response:**
```json
{
  "template": "scanning_card",
  "data": {
    "title": "Scanning Your Network",
    "total_connections": 847,
    "matches_found": 12,
    "status": "Analyzing connections for Pacific Coast expertise..."
  }
}
```

---

**3. After 2-3 seconds, automatically:**

**Backend Response:**
```json
{
  "template": "question_card",
  "data": {
    "title": "Property Type",
    "description": "What are you looking for?",
    "buttons": [
      {"label": "Beach house", "value": "beach_house", "emoji": "🏖️"},
      {"label": "Mountain retreat", "value": "mountain", "emoji": "⛰️"},
      {"label": "Condo", "value": "condo", "emoji": "🏢"}
    ]
  }
}
```

---

**4. User:** "Beach house" (clicks button)

**Backend Response:**
```json
{
  "template": "question_card",
  "data": {
    "title": "Budget Range",
    "description": "What's your investment range?",
    "buttons": [
      {"label": "$200-300K", "value": "200_300k", "emoji": "💰"},
      {"label": "$300-500K", "value": "300_500k", "emoji": "💰💰"},
      {"label": "$500K-1M", "value": "500k_1m", "emoji": "💰💰💰"},
      {"label": "$1M+", "value": "1m_plus", "emoji": "💎"}
    ]
  }
}
```

---

**5. User:** "$300-500K" (clicks button)

**Backend Response (OUTCOME):**
```json
{
  "template": "text",
  "data": {
    "text": "Perfect! I found **3 strong connections** who can help with Pacific Coast beachfront properties in your budget:\n\n**David Martinez** - Real estate agent specializing in Tamarindo/Guanacaste beachfront\n\n**Sarah Chen** - Expat who bought in Manuel Antonio 2 years ago, knows the process\n\n**Carlos Ramirez** - Developer with beach land parcels available\n\n[Save to Orbiter Button]"
  }
}
```

---

**6. User:** Clicks "Save to Orbiter"

**Frontend sends:**
```json
POST /dispatch
{
  "summary": "Beach house in Pacific Coast Costa Rica, $300-500K budget",
  "context": {"copilot_mode": "outcome"},
  "conversation_history": [...]
}
```

**Backend returns:**
```json
{
  "dispatch_id": "disp_abc123",
  "suggestion_request_id": 456,
  "status": "pending"
}
```

**Frontend shows:**
- 🎉 Confetti animation
- ✅ Success toast: "Network activated (disp_abc123)"

---

## ❓ QUESTIONS?

**Q: How many questions should we add?**  
A: 2-3 is plenty for demo. More than that gets tedious.

**Q: Do we need real connection data?**  
A: No! Mock data is fine. Just make it realistic.

**Q: What if the flow is different (investors, help someone)?**  
A: Start with Costa Rica only. We can add others later.

**Q: Do we need to actually create suggestion_request?**  
A: Yes, the dispatch endpoint should work for real. We'll show Charles the created record.

**Q: What about error handling?**  
A: Frontend handles it. Just return 500 with error message if something breaks.

**Q: Timeline for completion?**  
A: ASAP! We have 7 days to demo. Need at least 2-3 days for testing.

---

## 📞 CONTACT

**Questions? Issues? Progress updates?**

Send message to Robert or Zora in Telegram.

**Testing help needed?**  
We can test together - just let us know when you're ready!

---

## 🎯 TL;DR (Too Long, Didn't Read)

**What you need to do:**

1. ✅ Visual templates - DONE (thank you!)
2. ✅ Dispatch endpoint - DONE (thank you!)
3. ⚠️ **Add 2-3 questions after scanning** - URGENT
4. ⚠️ **Add outcome summary at end** - URGENT
5. ⏳ Test dispatch works - NEEDED

**Timeline:** ASAP (we demo Thursday!)

**Copy/paste this if helpful:**
```json
// After scanning, return:
{
  "template": "question_card",
  "data": {
    "title": "Budget Range",
    "description": "What's your investment range?",
    "buttons": [
      {"label": "$200-300K", "value": "200_300k", "emoji": "💰"},
      {"label": "$300-500K", "value": "300_500k", "emoji": "💰💰"}
    ]
  }
}

// After questions, return:
{
  "template": "text",
  "data": {
    "text": "Found 3 connections who can help! [connection details]"
  }
}
```

---

**Thanks for the amazing work so far! Let's finish strong! 🚀**
