# Inline Interview Mode - Visual Demo

**Built:** Feb 23, 2026 - 6:30 PM  
**Status:** Ready for backend integration  
**Approach:** Inline cards IN the chat (not blocking modals)

---

## The New Approach: Conversational & Inline

### Key Principles

1. **Inline Cards** - Appear IN the chat stream (not overlay)
2. **Context-Aware** - Examples change based on person/role/outcome
3. **Dynamic** - Adapts to what user has said
4. **Conversational** - Feels like natural back-and-forth
5. **Non-Blocking** - User can scroll, see history, continue chatting

---

## Visual Flow (Screenshots Coming)

### Step 1: User Types Exploratory Message

```
User: "I want to help someone"
```

**Backend detects:** Exploratory intent

**Backend returns:** interview_card with stage="identify_person"

**What user sees:**
```
┌────────────────────────────────────────────┐
│ 🎯 Who would you like to help?             │
│                                             │
│ [PersonPicker shows inline]                │
│ Search across your 847 connections.        │
│                                             │
│ 💡 Search your network or browse recent    │
│    contacts.                                │
│                                             │
│                          [Skip]             │
└────────────────────────────────────────────┘
```

**Card features:**
- PersonPicker embedded inline
- Network size shown dynamically (847 connections)
- Help text explains what to do
- Skip button available
- Subtle purple gradient background
- Lives IN the chat (can scroll up to see history)

---

### Step 2: User Selects Person

```
User: Clicks "Mark Pederson" from PersonPicker
```

**Backend receives:** { personId: 1, personName: "Mark Pederson" }

**Backend looks up:** Mark's title, company from database

**Backend returns:** interview_card with stage="clarify_outcome"

**What user sees:**
```
┌────────────────────────────────────────────┐
│ 🎯 What outcome are you looking for with   │
│    Mark Pederson?                           │
│                                             │
│ 👤 Mark Pederson • CEO at Orbiter          │
│                                             │
│ [Connect with potential investors]          │
│ [Find co-founder or CTO]                    │
│ [Intro to advisors in their space]          │
│ [Find partnership opportunities]            │
│                                             │
│ Or type your own answer...                  │
│ [                                         ] │
│                                             │
│ 💡 Mark Pederson is a CEO. What would help │
│    them most?                               │
│                                             │
│                   [Skip]      [Continue]    │
└────────────────────────────────────────────┘
```

**Context-aware features:**
- Examples change based on Mark being CEO
- Shows "Connect with investors", "Find co-founder" (not generic)
- Context bar shows who we're helping
- Text input for custom outcome
- Both Skip and Continue buttons

---

### Step 3: User Provides Outcome

```
User: Clicks "Connect with potential investors"
  OR
User: Types "Help him find seed investors in SF"
```

**Backend receives:** "Connect with potential investors" (or custom text)

**Backend returns:** interview_card with stage="extract_context"

**What user sees:**
```
┌────────────────────────────────────────────┐
│ 🎯 Any constraints for helping Mark        │
│    Pederson connect with potential          │
│    investors?                               │
│                                             │
│ 👤 Mark Pederson • 🎯 Connect with         │
│    investors                                │
│                                             │
│ [Seed stage ($500K-$2M)]                    │
│ [SF Bay Area investors only]                │
│ [Looking for lead investor]                 │
│ [Open to angels or VCs]                     │
│                                             │
│ Or type your own answer...                  │
│ [                                         ] │
│                                             │
│ 💡 This is optional but helps me find      │
│    better matches.                          │
│                                             │
│                   [Skip]      [Continue]    │
└────────────────────────────────────────────┘
```

**Smart features:**
- Examples change based on outcome ("investors" → seed stage, location, etc.)
- Context bar shows person + outcome
- Optional step (can skip)
- Custom input supported

---

### Step 4: User Adds Constraints (or Skips)

```
User: Clicks "Seed stage ($500K-$2M)"
  OR
User: Types "Must have social graph experience"
  OR
User: Clicks "Skip"
```

**Backend receives:** Constraint text (or skip signal)

**Backend returns:** interview_card with stage="confirm"

**What user sees:**
```
┌────────────────────────────────────────────┐
│ ✨ Ready to dispatch this request?         │
│                                             │
│ I'll help Mark Pederson connect with       │
│ potential investors with these constraints: │
│ Seed stage ($500K-$2M), SF Bay Area        │
│                                             │
│ [Yes, dispatch now]                         │
│ [Let me refine this]                        │
│ [Start over]                                │
│                                             │
│ 💡 I'll analyze your network and find the  │
│    best connections.                        │
└────────────────────────────────────────────┘
```

**Confirmation features:**
- Summary of full request
- Clear action buttons
- Can refine or start over
- Final check before dispatch

---

### Step 5: User Confirms Dispatch

```
User: Clicks "Yes, dispatch now"
```

**Backend receives:** Confirmation

**Backend shows:** DispatchConfirmationModal (the ONLY modal in the flow)

**What user sees:**
```
[Modal appears over everything]

┌─────────────────────────────────────────────┐
│                                              │
│   ✨ Dispatching Request                    │
│                                              │
│   I'll help Mark Pederson connect with      │
│   potential investors (Seed stage, SF Bay   │
│   Area).                                     │
│                                              │
│   Expected time: 2-5 minutes                │
│                                              │
│              [Confirm & Dispatch]            │
│                   [Cancel]                   │
│                                              │
└─────────────────────────────────────────────┘
```

**Then → WaitingRoom shows progress:**

```
[WaitingRoom component]

┌─────────────────────────────────────────────┐
│  🔍 Finding relevant investors...            │
│  ⏱️  Estimated: 3-4 minutes                 │
│                                              │
│  [Progress bar animation]                   │
│                                              │
│  Status: Analyzing 847 connections...       │
│                                              │
│              [Cancel Request]                │
└─────────────────────────────────────────────┘
```

---

## Technical Implementation

### Frontend Components

**InlineInterviewCard.tsx** (8.2KB)
- Single reusable component
- Takes stage prop (identify_person, clarify_outcome, extract_context, confirm)
- Dynamic styling based on stage (different colors)
- Embedded PersonPicker for stage 1
- Example buttons for stages 2-3
- Text input for custom answers
- Skip + Continue buttons

**interview-templates.ts** (7KB)
- Smart example generation
- Context-aware based on:
  - Person's title (CEO → investors, Engineer → roles)
  - Outcome chosen (job → location/remote, funding → stage/location)
  - Network size (1000+ → different help text)
- Dynamic question generation
- Constraint matching logic

### Backend Integration (TODO)

**Xano /chat endpoint needs:**

1. **Intent Detection**
   ```javascript
   if (prompt matches /i want to help|looking to connect|can you help/i) {
     return interview_card with stage="identify_person"
   }
   ```

2. **State Tracking**
   ```javascript
   // Store in session or database
   interview_state = {
     active: true,
     stage: "clarify_outcome",
     personId: 1,
     personName: "Mark Pederson",
     personTitle: "CEO",
     outcome: null,
     constraints: []
   }
   ```

3. **Response Format**
   ```json
   {
     "type": "interview_card",
     "stage": "clarify_outcome",
     "question": "What outcome for Mark?",
     "examples": ["Find investors", "Find CTO", "Intro advisors"],
     "helpText": "Mark is a CEO. What would help most?",
     "context": {
       "personName": "Mark Pederson",
       "personId": 1,
       "personTitle": "CEO at Orbiter"
     }
   }
   ```

4. **Flow Control**
   - Stage 1 (identify_person) → extract personId
   - Stage 2 (clarify_outcome) → extract outcome
   - Stage 3 (extract_context) → extract constraints (optional)
   - Stage 4 (confirm) → show summary, trigger dispatch

---

## Context-Awareness Examples

### For CEO/Founder

**Examples change to:**
- "Connect with potential investors"
- "Find co-founder or CTO"
- "Intro to advisors in their space"
- "Find partnership opportunities"

### For Engineer

**Examples change to:**
- "Help them find senior eng roles"
- "Connect with open-source maintainers"
- "Intro to hiring managers"
- "Find tech leadership opportunities"

### For Designer

**Examples change to:**
- "Connect with product teams hiring designers"
- "Intro to design leaders"
- "Find freelance opportunities"
- "Connect with design agencies"

### Constraint Examples Based on Outcome

**If outcome = "find job":**
- "Only remote positions"
- "SF Bay Area only"
- "Series A-C startups"
- "Open to relocation"

**If outcome = "find investors":**
- "Seed stage ($500K-$2M)"
- "SF Bay Area investors only"
- "Looking for lead investor"
- "Open to angels or VCs"

---

## Comparison: Old vs New

### OLD (What We Removed)

❌ Full-screen overlay  
❌ Blocks entire interface  
❌ Can't see chat history  
❌ Feels like separate app  
❌ Rigid form-like flow  
❌ Not conversational  

### NEW (What We Built)

✅ Inline cards in chat  
✅ Never blocks interface  
✅ Can scroll to see history  
✅ Feels like conversation  
✅ Dynamic and flexible  
✅ Context-aware examples  
✅ Natural back-and-forth  

---

## Testing Plan

### Manual Testing

1. **Test Stage 1** - Person selection
   - Click person from picker
   - Type name manually
   - Skip button works

2. **Test Stage 2** - Outcome selection
   - Click example button
   - Type custom outcome
   - Examples change based on person title
   - Continue button appears when text entered

3. **Test Stage 3** - Constraints (optional)
   - Click example button
   - Type custom constraint
   - Skip button works
   - Examples change based on outcome

4. **Test Stage 4** - Confirmation
   - Shows correct summary
   - All buttons work
   - Leads to dispatch modal

5. **Test Context-Awareness**
   - CEO → shows investor examples
   - Engineer → shows job examples
   - Designer → shows design examples
   - Network size updates help text

### Automated Testing (Optional)

```python
# Test script with desktop-control
import subprocess
import time

def test_inline_interview():
    # Open copilot modal
    click_copilot_button()
    
    # Type exploratory message
    type_text("I want to help someone")
    send_message()
    time.sleep(2)
    
    # Screenshot stage 1
    screenshot("stage-1-person-picker.png")
    
    # Select person
    click_person_picker_result(0)
    time.sleep(2)
    
    # Screenshot stage 2
    screenshot("stage-2-outcome.png")
    
    # Click example button
    click_example_button(0)
    time.sleep(2)
    
    # Screenshot stage 3
    screenshot("stage-3-constraints.png")
    
    # Click skip
    click_skip_button()
    time.sleep(2)
    
    # Screenshot stage 4
    screenshot("stage-4-confirm.png")
    
    # Click dispatch
    click_dispatch_button()
    time.sleep(2)
    
    # Screenshot dispatch modal
    screenshot("stage-5-dispatch-modal.png")
```

---

## Next Steps

### Immediate (Tonight - 1h)

1. ✅ Create InlineInterviewCard component
2. ✅ Create interview-templates.ts (context-aware logic)
3. ✅ Add to page.tsx templates array
4. ⏳ Test in dev environment
5. ⏳ Screenshot each stage
6. ⏳ Fix any visual issues

### Tomorrow (2-3h)

1. Backend system prompt integration
2. State management in Xano
3. Response formatting
4. Full flow testing
5. Deploy to production

---

**Status:** Components built ✅  
**Next:** Test with backend integration  
**Demo:** Ready for visual proof with screenshots

