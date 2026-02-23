# Backend Integration: Inline Interview Mode

**Date:** Feb 23, 2026  
**For:** Charles / Backend Team  
**Status:** Frontend complete, needs backend support

---

## What We Built (Frontend)

✅ **InlineInterviewCard** component - renders inline in chat (not blocking)  
✅ **Context-aware templates** - dynamic examples based on person/role/outcome  
✅ **Smart question generation** - adapts to context  
✅ **Integrated into template system** - ready to receive from backend

**Component registered as:** `interview_card`

---

## What Backend Needs to Do

### 1. Detect Exploratory Intent

When user sends a message like:
- "I want to help someone"
- "Can you help me connect someone?"
- "Looking to introduce two people"
- "Who can help Mark with X?"

**Backend should:**
- Detect this is exploratory (not a complete request)
- Return `interview_card` instead of trying to execute
- Start interview flow

---

### 2. Return Interview Card Response

Instead of returning text, return a structured interview card:

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

---

## The 4 Interview Stages

### Stage 1: `identify_person`

**When:** User has exploratory intent but no person selected

**Backend returns:**
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

**Frontend shows:** PersonPicker inline in chat

**User action:** Selects person OR types name

**User sends:** 
```json
{
  "type": "interview_response",
  "stage": "identify_person",
  "answer": {
    "personId": 1,
    "personName": "Mark Pederson"
  }
}
```

---

### Stage 2: `clarify_outcome`

**When:** Person is known, need to clarify what outcome

**Backend receives:** personId + personName

**Backend looks up:** person.title, person.company from database

**Backend returns:**
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

**Note:** Examples should be DYNAMIC based on person's role:
- CEO/Founder → investors, co-founder, advisors
- Engineer → senior roles, open-source, hiring managers
- Designer → design teams, leaders, freelance

**User action:** Clicks example OR types custom outcome

**User sends:**
```json
{
  "type": "interview_response",
  "stage": "clarify_outcome",
  "personId": 1,
  "answer": "Connect with potential investors"
}
```

---

### Stage 3: `extract_context` (OPTIONAL)

**When:** Have person + outcome, asking for constraints

**Backend receives:** personId, personName, outcome

**Backend returns:**
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

**Note:** Examples should be DYNAMIC based on outcome:
- "find job" → remote, location, stage, relocation
- "find investors" → stage, location, lead vs angels
- "find partnership" → B2B, enterprise, geography
- "find expert" → experience level, availability

**User action:** Clicks example OR types custom constraint OR clicks Skip

**User sends:**
```json
{
  "type": "interview_response",
  "stage": "extract_context",
  "personId": 1,
  "answer": "Seed stage ($500K-$2M)"
}
```

OR if skipped:
```json
{
  "type": "interview_response",
  "stage": "extract_context",
  "personId": 1,
  "skipped": true
}
```

---

### Stage 4: `confirm`

**When:** Have all info, show summary before dispatch

**Backend receives:** personId, outcome, constraints (optional)

**Backend returns:**
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

**User action:** Clicks "Yes, dispatch now"

**User sends:**
```json
{
  "type": "interview_response",
  "stage": "confirm",
  "personId": 1,
  "confirmed": true
}
```

**Backend:** Trigger actual dispatch (leverage_loop creation)

---

## Backend Implementation Checklist

### Required Changes to `/chat` Endpoint

- [ ] **Add intent detection**
  ```python
  def detect_intent(prompt):
      exploratory_patterns = [
          r"i want to help",
          r"can you help.*connect",
          r"looking to introduce",
          r"who can help",
          r"find someone who"
      ]
      if any(re.search(p, prompt.lower()) for p in exploratory_patterns):
          return "exploratory"
      return "complete"
  ```

- [ ] **Add interview state tracking**
  ```python
  # Store in session or database
  interview_state = {
      "active": True,
      "stage": "identify_person",  # or clarify_outcome, extract_context, confirm
      "person_id": None,
      "person_name": None,
      "outcome": None,
      "constraints": []
  }
  ```

- [ ] **Return interview_card instead of text response**
  ```python
  if intent == "exploratory" and not interview_state["active"]:
      return {
          "type": "interview_card",
          "stage": "identify_person",
          "question": "Who would you like to help?",
          "examples": [],
          "helpText": f"Search across your {network_size} connections.",
          "context": {"networkSize": network_size}
      }
  ```

- [ ] **Handle interview responses**
  ```python
  if message_type == "interview_response":
      stage = data["stage"]
      
      if stage == "identify_person":
          # Store person info
          interview_state["person_id"] = data["answer"]["personId"]
          interview_state["person_name"] = data["answer"]["personName"]
          interview_state["stage"] = "clarify_outcome"
          
          # Look up person details
          person = get_person_context(interview_state["person_id"])
          
          # Return next stage
          return {
              "type": "interview_card",
              "stage": "clarify_outcome",
              "question": f"What outcome for {person.name}?",
              "examples": generate_outcome_examples(person.title),
              "helpText": f"{person.name} is a {person.title}. What would help most?",
              "context": {
                  "personName": person.name,
                  "personId": person.id,
                  "personTitle": person.title
              }
          }
  ```

---

## Context-Aware Example Generation

### Outcome Examples by Role

```python
def generate_outcome_examples(title):
    title_lower = title.lower()
    
    if "ceo" in title_lower or "founder" in title_lower:
        return [
            "Connect with potential investors",
            "Find co-founder or CTO",
            "Intro to advisors in their space",
            "Find partnership opportunities"
        ]
    elif "engineer" in title_lower or "developer" in title_lower:
        return [
            "Help them find senior eng roles",
            "Connect with open-source maintainers",
            "Intro to hiring managers",
            "Find tech leadership opportunities"
        ]
    elif "designer" in title_lower:
        return [
            "Connect with product teams hiring designers",
            "Intro to design leaders",
            "Find freelance opportunities",
            "Connect with design agencies"
        ]
    else:
        # Default
        return [
            "Find job opportunities",
            "Connect with investors",
            "Introduce to experts",
            "Find partnership opportunities"
        ]
```

### Constraint Examples by Outcome

```python
def generate_constraint_examples(outcome):
    outcome_lower = outcome.lower()
    
    if "job" in outcome_lower or "role" in outcome_lower:
        return [
            "Only remote positions",
            "SF Bay Area only",
            "Series A-C startups",
            "Open to relocation"
        ]
    elif "investor" in outcome_lower or "funding" in outcome_lower:
        return [
            "Seed stage ($500K-$2M)",
            "SF Bay Area investors only",
            "Looking for lead investor",
            "Open to angels or VCs"
        ]
    elif "partnership" in outcome_lower:
        return [
            "B2B SaaS companies only",
            "Must have enterprise customers",
            "Geographic proximity preferred",
            "Looking for co-marketing"
        ]
    elif "expert" in outcome_lower or "advisor" in outcome_lower:
        return [
            "10+ years experience",
            "Has scaled to $10M+ ARR",
            "Available for monthly calls",
            "Technical background required"
        ]
    else:
        return [
            "Geographic location preference",
            "Industry or sector focus",
            "Company size or stage",
            "Specific expertise required"
        ]
```

---

## Flow Diagram

```
User: "I want to help someone"
  ↓
Backend: Detect exploratory intent
  ↓
Backend: Return interview_card (stage: identify_person)
  ↓
Frontend: Show PersonPicker inline
  ↓
User: Selects "Mark Pederson"
  ↓
Backend: Receive { personId: 1, personName: "Mark Pederson" }
  ↓
Backend: Look up Mark's title (CEO)
  ↓
Backend: Return interview_card (stage: clarify_outcome)
         with CEO-specific examples
  ↓
Frontend: Show outcome question with buttons
  ↓
User: Clicks "Connect with investors" OR types custom
  ↓
Backend: Receive { outcome: "Connect with investors" }
  ↓
Backend: Return interview_card (stage: extract_context)
         with investor-specific constraint examples
  ↓
Frontend: Show constraint question with buttons
  ↓
User: Clicks "Seed stage" OR types custom OR skips
  ↓
Backend: Receive { answer: "Seed stage" } OR { skipped: true }
  ↓
Backend: Return interview_card (stage: confirm)
         with full summary
  ↓
Frontend: Show confirmation with summary
  ↓
User: Clicks "Yes, dispatch now"
  ↓
Backend: Receive { confirmed: true }
  ↓
Backend: Create leverage_loop, start processing
  ↓
Frontend: Show DispatchConfirmationModal → WaitingRoom
```

---

## Testing the Integration

### Test Case 1: Full Flow

**Input:**
```
User: "I want to help someone"
```

**Expected:** interview_card (stage: identify_person)

**Input:**
```json
{ "type": "interview_response", "stage": "identify_person", "answer": { "personId": 1, "personName": "Mark Pederson" } }
```

**Expected:** interview_card (stage: clarify_outcome) with CEO examples

**Input:**
```json
{ "type": "interview_response", "stage": "clarify_outcome", "personId": 1, "answer": "Connect with investors" }
```

**Expected:** interview_card (stage: extract_context) with investor examples

**Input:**
```json
{ "type": "interview_response", "stage": "extract_context", "personId": 1, "answer": "Seed stage" }
```

**Expected:** interview_card (stage: confirm) with summary

**Input:**
```json
{ "type": "interview_response", "stage": "confirm", "personId": 1, "confirmed": true }
```

**Expected:** Dispatch triggered, return success message

---

### Test Case 2: Skip Context

Same as Test Case 1, but at extract_context stage:

**Input:**
```json
{ "type": "interview_response", "stage": "extract_context", "personId": 1, "skipped": true }
```

**Expected:** interview_card (stage: confirm) with summary (no constraints)

---

### Test Case 3: Different Role (Engineer)

**Input:** Person with title "Senior Engineer"

**Expected:** clarify_outcome returns:
- "Help them find senior eng roles"
- "Connect with open-source maintainers"
- "Intro to hiring managers"

---

## What Frontend Handles Automatically

✅ Rendering the card inline in chat  
✅ PersonPicker integration  
✅ Example button styling and interactions  
✅ Text input for custom answers  
✅ Skip button functionality  
✅ Continue button logic  
✅ Dynamic colors per stage  
✅ Context display (shows person + outcome as user progresses)

**You ONLY need to:**
- Detect intent
- Track state
- Return interview_card JSON
- Generate smart examples

---

## Timeline

**Estimated backend work:** 2-3 hours

**Breakdown:**
- Intent detection: 30 min
- State tracking: 30 min
- Response formatting: 30 min
- Example generation functions: 45 min
- Testing: 45 min

**Can be done before Thursday demo.**

---

## Questions?

Ping Robert (@robert_gram) or reply in #copilot-dev

**Frontend is ready.** Just need backend to return the interview_card structure.

---

**Commit:** 6b86051  
**Files:** 
- `app/components/InlineInterviewCard.tsx`
- `app/lib/interview-templates.ts`
- `app/page.tsx` (template registered)

