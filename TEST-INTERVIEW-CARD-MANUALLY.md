# Manual Test: Interview Card Integration

**Status:** Backend is LIVE and returning interview_card correctly!  
**Date:** Feb 23, 2026 - 6:55 PM

---

## Backend Confirmed Working

I tested the `/chat` endpoint directly:

```bash
curl -X POST https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I want to help someone", "context": {}, "history": []}'
```

**Response:**
```json
{
  "response": [
    {
      "type": "text",
      "text": "I'll help you leverage your network to support someone. Let's start by identifying who you'd like to help."
    },
    {
      "name": "interview_card",
      "templateProps": {
        "stage": "identify_person",
        "question": "Who would you like to help?",
        "examples": [],
        "helpText": "Search your network or browse recent contacts",
        "context": {}
      }
    }
  ]
}
```

✅ **Backend is returning interview_card correctly!**

---

## Manual Testing Steps

### Step 1: Open Copilot Modal

1. Navigate to http://localhost:3000
2. Click **"Open Copilot"** button (center purple button)
   OR click **"Copilot"** in top-right nav

**Expected:** Copilot modal opens

**Screenshot:** Take one here

---

### Step 2: Type Exploratory Message

1. In the chat input, type: `I want to help someone`
2. Press Enter

**Expected:** 
- Backend responds with text: "I'll help you leverage your network..."
- Interview card appears below with:
  - Question: "Who would you like to help?"
  - PersonPicker embedded
  - Help text: "Search your network or browse recent contacts"

**Screenshot:** Take one here

---

### Step 3: Select a Person

1. In the PersonPicker, search for "Mark" or click a person
2. Select them

**Expected:**
- Backend responds with stage 2: clarify_outcome
- New interview card appears with:
  - Question: "What outcome are you looking for with [Person]?"
  - Context bar showing: "👤 [Person Name]"
  - Examples change based on their role:
    - CEO → "Connect with investors", "Find co-founder", etc.
    - Engineer → "Find senior roles", "Connect with OSS", etc.

**Screenshot:** Take one here

---

### Step 4: Choose Outcome

1. Click an example button OR type custom outcome
2. Submit

**Expected:**
- Backend responds with stage 3: extract_context
- New interview card appears with:
  - Question: "Any constraints for helping [Person] [outcome]?"
  - Context bar showing: "👤 [Person] • 🎯 [Outcome]"
  - Examples change based on outcome:
    - "find investors" → "Seed stage", "SF Bay Area", etc.
    - "find job" → "Remote only", "SF Bay Area", etc.
  - Skip button available

**Screenshot:** Take one here

---

### Step 5: Add Constraints (or Skip)

1. Click an example OR type custom constraint OR click Skip
2. Submit

**Expected:**
- Backend responds with stage 4: confirm
- Final interview card appears with:
  - Full summary of request
  - Buttons: "Yes, dispatch now", "Let me refine this", "Start over"

**Screenshot:** Take one here

---

### Step 6: Confirm Dispatch

1. Click "Yes, dispatch now"

**Expected:**
- DispatchConfirmationModal appears (the ONLY modal in flow)
- Shows summary
- Click "Confirm & Dispatch"
- WaitingRoom appears with progress

**Screenshot:** Take one here

---

## What to Look For

### ✅ Good Signs

- Interview card appears INLINE in chat (not blocking overlay)
- Can scroll up to see chat history
- Context bar updates as you progress (shows person + outcome)
- Examples change based on role and outcome
- Skip button works on stage 3
- Smooth, conversational flow

### ❌ Bad Signs

- No interview card appears (just text response)
- Card appears but PersonPicker doesn't work
- Examples don't change based on context
- Can't see chat history
- Modal blocks everything

---

## If It Doesn't Work

### Check 1: Template Registration

Frontend should have in `app/page.tsx`:
```typescript
const templates = [
  // ... other templates
  { name: "interview_card", Component: InlineInterviewCard },
];
```

### Check 2: Component Import

Frontend should have:
```typescript
import { InlineInterviewCard } from "./components/InlineInterviewCard";
```

### Check 3: Backend Response Format

Should be returning:
```json
{
  "name": "interview_card",
  "templateProps": { ... }
}
```

NOT:
```json
{
  "type": "interview_card",  // Wrong property name!
  "props": { ... }
}
```

### Check 4: Console Errors

Open Chrome DevTools (Cmd+Option+I) → Console tab
Look for:
- Template not found errors
- Component render errors
- Network errors

---

## Success Criteria

- [ ] Interview card appears inline in chat
- [ ] PersonPicker works in stage 1
- [ ] Examples change based on person's role
- [ ] Context bar shows person + outcome as you progress
- [ ] Constraint examples change based on outcome
- [ ] Skip button works on stage 3
- [ ] Confirmation shows full summary
- [ ] Dispatch modal appears at the end
- [ ] Full flow completes successfully

---

**When you test, take screenshots at each stage and send them!**

This will confirm the integration is working end-to-end. 🚀
