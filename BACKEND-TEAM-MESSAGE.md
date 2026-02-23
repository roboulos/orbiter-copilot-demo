# Message for Backend Team

**To:** Charles, Mark, Backend Team  
**From:** Robert + Zora  
**Date:** Feb 23, 2026  
**Subject:** Inline Interview Mode - Frontend Complete, Need Backend Support

---

## Quick Summary

We've built the **inline interview card system** (conversational, context-aware, no blocking modals). Frontend is 100% complete and ready.

**What we need:** Backend `/chat` endpoint to return `interview_card` responses instead of text when user has exploratory intent.

**Timeline:** 2-3 hours backend work. Can be done before Thursday demo.

---

## What We Built (Frontend)

✅ **InlineInterviewCard** component - appears IN the chat (not blocking overlay)  
✅ **Smart example generation** - adapts based on person's role and outcome  
✅ **4-stage flow** - identify person → clarify outcome → extract constraints → confirm  
✅ **Registered in template system** - ready to receive from backend

**Component name:** `interview_card`

**Files:**
- `app/components/InlineInterviewCard.tsx` (8.2KB)
- `app/lib/interview-templates.ts` (7KB)
- Registered in `app/page.tsx` templates array

**Commit:** 6b86051

---

## What Backend Needs to Do

### 1. Detect Exploratory Intent

When user says:
- "I want to help someone"
- "Can you help me connect someone?"
- "Looking to introduce two people"

→ Return `interview_card` instead of trying to execute

### 2. Return Structured Interview Card

Instead of text response, return:

```json
{
  "type": "interview_card",
  "stage": "identify_person",
  "question": "Who would you like to help?",
  "examples": [],
  "helpText": "Search across your 847 connections.",
  "context": {}
}
```

### 3. Track State Through 4 Stages

**Stage 1: identify_person**
- User selects person from PersonPicker
- Backend receives: `{ personId: 1, personName: "Mark Pederson" }`
- Backend looks up person's title from database

**Stage 2: clarify_outcome**
- Backend returns examples based on person's role:
  - CEO → "Connect with investors", "Find co-founder", "Intro to advisors"
  - Engineer → "Find senior roles", "Connect with OSS", "Intro to hiring managers"
- User clicks example OR types custom

**Stage 3: extract_context (optional)**
- Backend returns constraint examples based on outcome:
  - "Find investors" → "Seed stage", "SF Bay Area", "Lead investor"
  - "Find job" → "Remote only", "SF Bay Area", "Series A-C"
- User clicks example OR types custom OR skips

**Stage 4: confirm**
- Backend shows full summary
- User confirms → trigger actual dispatch

---

## Example Backend Response

### Stage 1: Identify Person

```json
{
  "type": "interview_card",
  "stage": "identify_person",
  "question": "Who would you like to help?",
  "examples": [],
  "helpText": "Search your network or browse recent contacts.",
  "context": {
    "networkSize": 847
  }
}
```

### Stage 2: Clarify Outcome (CEO)

```json
{
  "type": "interview_card",
  "stage": "clarify_outcome",
  "question": "What outcome are you looking for with Mark Pederson?",
  "examples": [
    "Connect with potential investors",
    "Find co-founder or CTO",
    "Intro to advisors in their space",
    "Find partnership opportunities"
  ],
  "helpText": "Mark Pederson is a CEO. What would help them most?",
  "context": {
    "personName": "Mark Pederson",
    "personId": 1,
    "personTitle": "CEO at Orbiter"
  }
}
```

### Stage 3: Extract Context (Investors)

```json
{
  "type": "interview_card",
  "stage": "extract_context",
  "question": "Any constraints for helping Mark Pederson connect with potential investors?",
  "examples": [
    "Seed stage ($500K-$2M)",
    "SF Bay Area investors only",
    "Looking for lead investor",
    "Open to angels or VCs"
  ],
  "helpText": "This is optional but helps me find better matches.",
  "context": {
    "personName": "Mark Pederson",
    "personId": 1,
    "outcome": "Connect with potential investors"
  }
}
```

### Stage 4: Confirm

```json
{
  "type": "interview_card",
  "stage": "confirm",
  "question": "I'll help Mark Pederson connect with potential investors with these constraints: Seed stage ($500K-$2M), SF Bay Area investors only.",
  "examples": [
    "Yes, dispatch now",
    "Let me refine this",
    "Start over"
  ],
  "helpText": "I'll analyze your network and find the best connections.",
  "context": {
    "personName": "Mark Pederson",
    "personId": 1,
    "outcome": "Connect with potential investors",
    "constraints": ["Seed stage ($500K-$2M)", "SF Bay Area investors only"]
  }
}
```

---

## Implementation Checklist

**Required changes to `/chat` endpoint:**

- [ ] Add intent detection (regex for exploratory patterns)
- [ ] Add interview state tracking (session or database)
- [ ] Return `interview_card` type instead of text for exploratory intents
- [ ] Handle `interview_response` message type
- [ ] Look up person details (title, company) from master_person table
- [ ] Generate context-aware examples based on:
  - Person's role (for outcome examples)
  - Chosen outcome (for constraint examples)
- [ ] Trigger dispatch when stage=confirm and confirmed=true

**Estimated time:** 2-3 hours

---

## Context-Aware Example Logic

### Outcome Examples by Role

```javascript
// CEO/Founder
["Connect with potential investors", "Find co-founder or CTO", "Intro to advisors"]

// Engineer/Developer  
["Find senior eng roles", "Connect with OSS maintainers", "Intro to hiring managers"]

// Designer
["Connect with product teams", "Intro to design leaders", "Find freelance opportunities"]

// Sales/BD
["Connect with potential clients", "Intro to sales leaders", "Find partnerships"]
```

### Constraint Examples by Outcome

```javascript
// "find investors"
["Seed stage ($500K-$2M)", "SF Bay Area only", "Lead investor", "Angels or VCs"]

// "find job"
["Remote only", "SF Bay Area", "Series A-C startups", "Open to relocation"]

// "find partnership"
["B2B SaaS only", "Enterprise customers", "Geographic proximity", "Co-marketing"]

// "find expert"
["10+ years exp", "Scaled to $10M+ ARR", "Monthly calls", "Technical background"]
```

---

## Testing Plan

### Test Case 1: Full Flow with CEO

1. User: "I want to help someone"
   - **Expect:** interview_card (stage: identify_person)

2. User selects: Mark Pederson (CEO)
   - **Expect:** interview_card (stage: clarify_outcome) with CEO examples

3. User clicks: "Connect with investors"
   - **Expect:** interview_card (stage: extract_context) with investor examples

4. User clicks: "Seed stage"
   - **Expect:** interview_card (stage: confirm) with full summary

5. User clicks: "Yes, dispatch now"
   - **Expect:** Dispatch triggered, WaitingRoom shown

### Test Case 2: Different Role (Engineer)

1. User selects: Person with title "Senior Engineer"
   - **Expect:** clarify_outcome returns engineer-specific examples:
     - "Find senior eng roles"
     - "Connect with open-source maintainers"
     - "Intro to hiring managers"

### Test Case 3: Skip Context

1. At extract_context stage, user clicks "Skip"
   - **Expect:** interview_card (stage: confirm) with no constraints shown

---

## Full Technical Documentation

See: `BACKEND-INTERVIEW-INTEGRATION.md` (14KB comprehensive guide)

Includes:
- Detailed flow diagrams
- Complete request/response examples
- State tracking implementation
- Context-aware example generation functions
- Edge cases and error handling

---

## Demo Thursday (Feb 27, 9 AM)

**Goal:** Show Mark the inline interview flow working end-to-end

**Must have:**
- ✅ Frontend (complete)
- ⏳ Backend integration (2-3h work)
- ✅ WaitingRoom flow (already working)
- ✅ Dispatch confirmation (already working)

**Status:** Frontend ready, need backend by Wednesday EOD for testing

---

## Questions / Support

Ping me in #copilot-dev or DM:
- Robert: @robert_gram (Telegram)
- Slack: #copilot-dev channel

**Frontend is 100% ready. Just need backend to return interview_card JSON.**

Let me know if you need anything clarified or want to pair on the implementation.

— Robert + Zora
