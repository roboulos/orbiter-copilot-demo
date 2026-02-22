# Requirements Mapping - Mark/Jason/Josh (Transcript #423)
**Testing Date:** Feb 22, 2026 @ 7:30 PM EST

---

## 📋 MARK'S REQUIREMENTS

### ✅ Requirement 1: "100% Form Builder - NO Searching Until Dispatch"
**Mark said:** "Priority = 100% form builder. Don't care about exploring in parallel. Goal: gather context for dispatch."

**FRONTEND STATUS:** ✅ Ready  
**BACKEND STATUS:** ⏳ Need to verify

**Test:**
- Interview asks questions ONE AT A TIME ✅
- User answers with buttons ✅
- NO network results shown during interview ⏳ (need to check backend)
- ONLY after dispatch: agents search/analyze ⏳ (need to check backend)

**Screenshots Needed:**
1. Question 1 (no results visible)
2. Question 2 (no results visible)
3. Dispatch confirmation (summary only)
4. AFTER dispatch: results appear

---

### ✅ Requirement 2: "Leverage Loops vs Outcomes - Different Workflows"
**Mark said:** "Leverage loops = help someone else (workshop with less info). Outcomes = your own goal (you have more context). Different workflows."

**FRONTEND STATUS:** ✅ Ready (dynamic starters based on person selection)  
**BACKEND STATUS:** ⏳ Same interview for both (can be same for MVP)

**Test:**
- **NO person selected:** Shows "Costa Rica", "Find investors", "Help someone" ✅
- **Person IS selected:** Shows "Leverage Network for X", "Help X with...", "Meeting Prep" ✅
- Different conversation starters ✅
- Different interview depth ⏳ (MVP: can be same)

**Screenshots Needed:**
1. Copilot with NO person selected (3 starters)
2. Copilot WITH person selected (3 different starters)

---

### ✅ Requirement 3: "Confirmation Modal Before Dispatch"
**Mark said:** "Build conversation that ends with 'this is the exact leverage loop/outcome I want to dispatch'"

**FRONTEND STATUS:** ⏳ Component exists but not wired up  
**BACKEND STATUS:** ⏳ Not integrated

**Test:**
- Interview completes ⏳
- Shows confirmation modal with summary ⏳
- User sees exactly what will be dispatched ⏳
- "Proceed" button ⏳
- Dispatch happens AFTER confirmation ⏳

**Screenshots Needed:**
1. Last question answered
2. Confirmation modal appears
3. Summary of all answers visible
4. "Proceed" button
5. Success state after dispatch

---

## 📋 JOSH'S REQUIREMENTS

### ✅ Requirement 4: "Help Text for Choices Users Don't Understand"
**Josh said:** "Users won't know what 'Central Valley' means. Is there a way to do hover or 'I don't know' branch?"

**FRONTEND STATUS:** ✅ COMPLETE (QuestionCardEnhanced)  
**BACKEND STATUS:** ❌ Not using enhanced version yet

**What's Built:**
- QuestionCardEnhanced component ✅
- "I don't know - help me choose" button ✅
- Help (?) icons on each button ✅
- Expandable help text ✅

**Backend Needs to Do:**
```json
{
  "template": "question_card_enhanced",
  "data": {
    "title": "Costa Rica Region Focus",
    "buttons": [
      {
        "label": "Pacific Coast",
        "emoji": "🏖️",
        "subtitle": "Guanacaste, Manuel Antonio",
        "helpText": "Year-round sunshine, popular with tourists. Higher property costs but strong rental income potential."
      }
    ],
    "allowDontKnow": true
  }
}
```

**Screenshots Needed:**
1. QuestionCard with ? icons visible
2. Help text expanded
3. "I don't know" button at bottom
4. After clicking "I don't know" - AI explains options

---

### ✅ Requirement 5: "Context for Choices - Explain Differences"
**Josh asked:** "How do we give research information? Almost like on a hover?"

**FRONTEND STATUS:** ✅ COMPLETE  
**BACKEND STATUS:** ❌ Needs to include helpText in responses

**Test:**
- User hovers over ? icon ✅ (or clicks on mobile)
- Help text appears ✅
- Explains what this option means ✅
- User can make informed choice ✅

**Screenshots Needed:**
1. Button with ? icon
2. Click ? → help text expands
3. Help text readable and useful

---

## 📋 JASON'S REQUIREMENTS

### ✅ Requirement 6: "Two-Layer Results (Quick + Deep)"
**Jason asked:** "Can we kick off low-level agent (quick look) AND deep research agent in parallel?"

**FRONTEND STATUS:** ⏳ ScanningCard exists  
**BACKEND STATUS:** ⏳ Not implemented (defer to v2)

**Mark's Response:** "Search is different from agentic suggestions. Until we dispatch, we're not doing real lifting."

**Decision:** NOT for MVP. Pure form builder first.

**Screenshots:** N/A (future feature)

---

## 🎯 TEST MATRIX - What Screenshots to Send

### Flow 1: Your Own Outcome (NO Person Selected)

| # | Screen | Requirement | Status |
|---|--------|-------------|--------|
| 1 | Welcome screen - 3 starters | Mark Req #2 | ✅ Works |
| 2 | Type "Buy house Costa Rica" | Mark Req #1 | ✅ Works |
| 3 | Question 1 with buttons | Mark Req #1 | ✅ Works |
| 4 | ? icon on button | Josh Req #4 | ⏳ Need backend |
| 5 | Help text expanded | Josh Req #5 | ⏳ Need backend |
| 6 | "I don't know" button | Josh Req #4 | ⏳ Need backend |
| 7 | Question 2 (after answer) | Mark Req #1 | ✅ Works |
| 8 | Confirmation modal | Mark Req #3 | ⏳ Need to wire |
| 9 | Success after dispatch | Mark Req #3 | ⏳ Need to wire |

### Flow 2: Help Someone (Person IS Selected)

| # | Screen | Requirement | Status |
|---|--------|-------------|--------|
| 1 | Search for person | Mark Req #2 | ✅ Works |
| 2 | Select person | Mark Req #2 | ✅ Works |
| 3 | 3 different starters appear | Mark Req #2 | ✅ Works |
| 4 | Click "Leverage Network for X" | Mark Req #2 | ✅ Works |
| 5 | Interview begins | Mark Req #1 | ✅ Works |
| 6 | Enhanced questions | Josh Req #4 | ⏳ Need backend |
| 7 | Confirmation | Mark Req #3 | ⏳ Need to wire |

---

## 🚦 CURRENT STATUS BY PERSON

### Mark's Priorities:
- ✅ Form builder architecture (frontend ready)
- ⏳ Confirmation modal (need to wire up)
- ⏳ Verify no searching during interview (backend check)
- ✅ Two entry points (person vs goal)

### Josh's Priorities:
- ✅ QuestionCardEnhanced built
- ⏳ Backend using enhanced version (needs update)
- ✅ Help text component ready
- ✅ "I don't know" button built

### Jason's Priorities:
- 📋 Deferred to v2 (focus on form builder first per Mark)

---

## ✅ WHAT I'LL SCREENSHOT & SEND

1. **Welcome Screen - No Person** (Mark Req #2)
2. **Welcome Screen - Person Selected** (Mark Req #2)
3. **Question 1 - Current State** (shows what backend sends now)
4. **Question 1 - What It SHOULD Look Like** (with ? and "I don't know")
5. **Mock-up of Confirmation Modal** (Mark Req #3)

Plus written documentation of:
- What's ready ✅
- What needs backend changes ⏳
- What needs frontend wiring ⏳
