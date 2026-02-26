# 🚨 BACKEND TEAM - URGENT FOR THURSDAY DEMO

**From:** Robert  
**To:** Xano AI / Backend Team  
**Priority:** HIGH  
**Time needed:** 2 hours  
**Deadline:** Tonight (Wed Feb 26)

---

## TL;DR

**What's needed:** Add 1 template to /chat endpoint  
**When:** After showing match results  
**Impact:** Makes demo flow perfect  
**Fallback:** Frontend has workaround if you can't deliver

---

## THE ISSUE

When your /chat endpoint shows match results, it sends:

```json
{
  "response": [
    {"name": "quick_result_card", "templateProps": {...}},
    {"type": "text", "text": "Goal: Help Ray Deck find seed investors"}
  ]
}
```

But it MUST also send:

```json
{
  "response": [
    {"name": "quick_result_card", "templateProps": {...}},
    {
      "name": "dispatch_confirmation",
      "templateProps": {
        "person_name": "Ray Deck",
        "goal": "find seed investors for social graph product",
        "context": "Seed stage, web3 focus, strategic investors needed",
        "master_person_id": 123
      }
    }
  ]
}
```

---

## WHY THIS MATTERS

The frontend is listening for `dispatch_confirmation` to show the beautiful modal Mark wants. Without it:
- ❌ Modal doesn't trigger
- ❌ Can't show "compiled context" to user
- ❌ Demo flow breaks

With it:
- ✅ Modal appears automatically
- ✅ Shows compiled context from interview
- ✅ User clicks "Dispatch" → Waiting room
- ✅ Perfect demo!

---

## WHERE TO ADD THIS

**File:** `/chat` endpoint system prompt

**Add this logic at the end:**

```
AFTER showing match results (quick_result_card):

1. Compile context from the conversation:
   - Extract person name from user messages
   - Extract goal/outcome from user messages
   - Collect all constraints/details mentioned

2. Add dispatch_confirmation to response:
   {
     "name": "dispatch_confirmation",
     "templateProps": {
       "person_name": "{extracted person}",
       "goal": "{extracted goal}",
       "context": "{compiled from conversation}",
       "master_person_id": {from context if available}
     }
   }

3. This will trigger the frontend modal automatically
```

---

## EXAMPLE CONVERSATIONS

### Example 1: Interview Flow

**User:** "I want to help someone"  
**Bot:** `[interview_card]` "Who would you like to help?"  
**User:** "Ray Deck"  
**Bot:** `[interview_card]` "What outcome?"  
**User:** "Find seed investors for his social graph product"  
**Bot:** `[quick_result_card]` Shows Chris Dixon from a16z  
**Bot:** `[dispatch_confirmation]` ← ADD THIS!

### Example 2: Direct Dispatch

**User:** "Make leverage loop for Ray Deck"  
**Bot:** `[dispatch_confirmation]` ← IMMEDIATE, NO INTERVIEW

---

## TEMPLATE PROPS TO EXTRACT

From conversation, extract:

1. **person_name** - Look for:
   - "help [Name]"
   - "for [Name]"
   - "[Name] needs"
   - Person from network context

2. **goal** - Look for:
   - "find X"
   - "looking for X"
   - "help with X"
   - "hire X"
   - "raise X"

3. **context** - Compile:
   - All user answers during interview
   - Constraints mentioned
   - Details provided
   - Format: "Seed stage, web3 focus, strategic investors"

4. **master_person_id** - From:
   - Network lookup if person in network
   - null if not in network

---

## TEST CASES

After you add this, test:

### Test 1: Full Interview Flow
```bash
curl -X POST /chat \
  -d '{"prompt": "I want to help someone", "user_id": 18}'
# Continue conversation...
# Verify dispatch_confirmation appears at end
```

### Test 2: Direct Dispatch
```bash
curl -X POST /chat \
  -d '{"prompt": "Make leverage loop for Ray Deck", "user_id": 18}'
# Verify dispatch_confirmation appears immediately
```

### Test 3: With Person Context
```bash
curl -X POST /chat \
  -d '{"prompt": "Help Ray find investors", "user_id": 18, "master_person_id": 123}'
# Verify person_id included in template
```

---

## VALIDATION

After your change, the response should look like this:

```json
{
  "response": [
    {
      "name": "quick_result_card",
      "templateProps": {
        "name": "Chris Dixon",
        "title": "Partner at Andreessen Horowitz",
        "match_reason": "Deep web3 expertise...",
        "confidence": "high"
      }
    },
    {
      "type": "text",
      "text": "Found several strategic investors with web3 experience"
    },
    {
      "name": "dispatch_confirmation",
      "templateProps": {
        "person_name": "Ray Deck",
        "goal": "find seed investors for social graph product",
        "context": "Seed stage, web3 platform, looking for strategic investors with crypto/social experience",
        "master_person_id": 123
      }
    }
  ]
}
```

---

## BONUS: Meeting Prep Fix

**Lower priority, but nice to have:**

When user says "Meeting prep for [Name]", return:

```json
{
  "name": "meeting_prep_card",
  "templateProps": {
    "person": {
      "name": "Charles Njenga",
      "title": "Senior Developer",
      "company": "Orbiter"
    },
    "talking_points": [
      {
        "topic": "Copilot development",
        "your_opener": "How's the interview card work going?",
        "why_they_care": "He built it",
        "listen_for": "Technical challenges, timeline"
      }
    ],
    "openers": ["...", "..."],
    "landmines": ["Don't micromanage", "..."]
  }
}
```

---

## FRONTEND FALLBACK

**Good news:** Frontend has a fallback!

If you can't deliver in time, the frontend will auto-generate `dispatch_confirmation` from conversation history. Demo will still work!

But it's better if backend sends it properly because:
- ✅ More accurate extraction
- ✅ Better context compilation
- ✅ Cleaner code
- ✅ 100% vs 90% quality

---

## QUESTIONS?

**Slack:** #copilot-dev  
**Contact:** Robert (robert@snappy.ai)  
**Urgency:** High (demo tomorrow 9 AM)  
**Time estimate:** 2 hours max

---

## CHECKLIST

- [ ] Add dispatch_confirmation after quick_result_card
- [ ] Add dispatch_confirmation for direct dispatch intent
- [ ] Extract person_name from conversation
- [ ] Extract goal from conversation
- [ ] Compile context from interview answers
- [ ] Test: Interview flow triggers modal
- [ ] Test: Direct dispatch triggers modal
- [ ] Deploy to staging
- [ ] Notify Robert when done

---

**Thank you!** This is the last piece to make the demo perfect. 🚀
