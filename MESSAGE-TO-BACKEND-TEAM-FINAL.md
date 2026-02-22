# Message to Backend Team - Integration Requirements
**From:** Robert (Frontend)  
**To:** Backend Team (Charles, Denis, Mark)  
**Date:** Feb 22, 2026  
**Re:** Orbiter Copilot Demo Integration - What Backend Needs to Return

---

## 🎯 TL;DR

**Frontend is 100% ready.** All components built and tested. We need backend to return 4 specific template types instead of plain text. Examples below.

**Priority:** High - Thursday integration deadline

---

## ✅ WHAT'S WORKING (Frontend)

All these components are built, registered, and tested:

1. ✅ **EnhancedQuestionCard** - With ? help icons and "I don't know" button
2. ✅ **QuickResultCard** - Jason's quick results during interview
3. ✅ **ConfirmationModal** - Shows summary before dispatch
4. ✅ **SubmitButton** - Triggers confirmation modal
5. ✅ **ScanningCard** - Shows during processing
6. ✅ **OutcomeCard** - Shows final results
7. ✅ **No Emojis** - Premium SVG icons throughout
8. ✅ **Success Flow** - Toast + confetti after dispatch

**Everything is wired and waiting for you to send the right JSON.**

---

## 🔴 CRITICAL: What Backend MUST Return

### 1. Enhanced Question Cards (Josh's Requirement)

**When:** During interview, for every multiple-choice question

**Current Problem:** Backend probably returns plain text

**What to Return Instead:**

```json
{
  "template": "question_card",
  "data": {
    "title": "🏖️ Costa Rica Region Focus",
    "description": "Different regions have very different vibes and markets. Which area interests you most?",
    "buttons": [
      {
        "label": "Pacific Coast",
        "emoji": "🏖️",
        "subtitle": "Guanacaste, Manuel Antonio, Dominical",
        "helpText": "Year-round sunshine, popular with tourists and expats. Higher property costs ($200k-$500k+) but strong rental income potential. Beach lifestyle, surf culture, established expat communities.",
        "value": "pacific_coast"
      },
      {
        "label": "Central Valley",
        "emoji": "🏔️",
        "subtitle": "San José, Escazú, Atenas",
        "helpText": "Spring-like climate year-round (60-75°F), close to capital and infrastructure. Lower costs ($100k-$300k). Better for full-time living, more local culture, easy access to services.",
        "value": "central_valley"
      },
      {
        "label": "Caribbean Coast",
        "emoji": "🌴",
        "subtitle": "Puerto Viejo, Cahuita",
        "helpText": "Tropical rainforest climate, laid-back Afro-Caribbean culture. More rain but lush and green. Most affordable option ($80k-$200k). Surfing, beaches, off-the-beaten-path vibe.",
        "value": "caribbean_coast"
      }
    ],
    "autoImage": true,
    "allowDontKnow": true
  }
}
```

**Key Points:**
- `helpText` is critical - this is what shows when user clicks ? icon
- `allowDontKnow: true` shows "I don't know - help me choose" button
- Frontend auto-converts `emoji` to premium SVG icons (no emojis display)
- If you don't provide `helpText`, frontend auto-generates generic text

---

### 2. Submit Button (Mark's Requirement - CRITICAL)

**When:** At END of interview, after all questions answered

**Current Problem:** Interview ends with no clear "dispatch" action

**What to Return:**

```json
{
  "template": "submit_button",
  "data": {
    "summary": "**Your Goal:**\nBuy a house in Costa Rica for relocation\n\n**Details Collected:**\n• **Region:** Pacific Coast (Guanacaste area)\n• **Budget:** $200k-$500k\n• **Timeline:** Within this year\n• **Purpose:** Full-time relocation + rental income\n\n**Quick Matches Found:**\n• David Park (Real Estate Developer, 20+ years Pacific Coast)\n• Ana Rodriguez (Expat community leader, Tamarindo)\n\nReady to activate your network?",
    "label": "Proceed to Dispatch"
  }
}
```

**What Happens:**
1. User sees summary of everything they answered
2. User clicks "Proceed to Dispatch"
3. ConfirmationModal appears
4. User confirms
5. Frontend calls your `/dispatch` endpoint
6. Success toast + confetti!

**This is THE most important one** - without this, users can't actually dispatch.

---

### 3. Quick Results Card (Jason's Requirement)

**When:** AFTER each interview question is answered (optional but high-impact)

**Current Problem:** Users see nothing while answering questions

**What to Return:**

```json
{
  "template": "quick_result_card",
  "data": {
    "matches": [
      {
        "name": "David Park",
        "title": "Real Estate Developer",
        "company": "Costa Rica Properties",
        "avatar": "https://...",
        "reason": "20+ years developing Pacific Coast properties",
        "confidence": "high"
      },
      {
        "name": "Ana Rodriguez",
        "title": "Community Manager",
        "company": "Tamarindo Expats",
        "reason": "Runs largest expat community in Guanacaste",
        "confidence": "medium"
      }
    ],
    "stillSearching": true
  }
}
```

**How It Works:**
- Do a QUICK keyword search (title, company, bio) after each answer
- Return top 1-3 matches immediately (< 200ms)
- Set `stillSearching: true` to show "Deep research continues..." message
- This gives instant feedback while agents work in background

**Performance:**
- Must be FAST - simple keyword matching only
- NO full agent analysis (that happens after dispatch)
- Just names/titles/why they might help

---

### 4. Scanning Card (During Processing)

**When:** After dispatch, while agents are working

**What to Return:**

```json
{
  "template": "scanning_card",
  "data": {
    "status": "Analyzing your network...",
    "progress": 45,
    "details": "Scanned 847 connections • Found 15 potential matches"
  }
}
```

**Optional but nice** - shows progress while agents work.

---

### 5. Outcome Card (Final Results)

**When:** After dispatch completes

**What to Return:**

```json
{
  "template": "outcome_card",
  "data": {
    "outcome": "Buy a house in Costa Rica (Pacific Coast)",
    "ideal_connections": [
      {
        "name": "David Park",
        "score": 95,
        "connection_path": "2nd degree via Maria Santos",
        "why": "20+ years Pacific Coast real estate, sold 100+ properties to expats",
        "next_step": "Ask Maria Santos for warm intro",
        "draft_message": "Hi Maria! Hope you're doing well..."
      }
    ],
    "suggested_actions": [
      "Schedule intro call with David Park",
      "Join Tamarindo Expats Facebook group",
      "Research property lawyers in Guanacaste"
    ]
  }
}
```

---

## 🚨 CRITICAL: Form Builder Mode (Mark's #1 Requirement)

**THE RULE:** NO searching network during interview

**What This Means:**

### ❌ DON'T DO THIS:
```python
# After each question
user_answer = get_user_input()
results = search_entire_network(user_answer)  # ❌ WRONG!
return format_results(results)
```

### ✅ DO THIS INSTEAD:
```python
# During interview
user_answer = get_user_input()
save_answer(user_answer)  # Just store it
return next_question()  # Ask next question immediately

# ONLY after dispatch button clicked
def handle_dispatch():
    all_answers = get_all_saved_answers()
    results = deep_agent_search(all_answers)  # ✅ NOW search
    return results
```

**Why:** Mark explicitly said "100% form builder priority - no exploring in parallel."

**Exception:** Quick results (template #3) are OK if FAST (<200ms keyword search only)

---

## 📋 INTEGRATION CHECKLIST

### Phase 1: Minimum Viable (Must Have for Thursday)
- [ ] Return `question_card` with helpText for all multi-choice questions
- [ ] Return `submit_button` at end of interview with summary
- [ ] Wire submit button to show confirmation modal
- [ ] Call `/dispatch` endpoint when user confirms
- [ ] Return success response with dispatch_id

### Phase 2: Enhanced (Should Have)
- [ ] Return `quick_result_card` after each answer (quick keyword search)
- [ ] Return `scanning_card` while processing
- [ ] Return `outcome_card` with full results
- [ ] Enforce form builder mode (no searching during interview)

### Phase 3: Polish (Nice to Have)
- [ ] Better helpText content (not auto-generated)
- [ ] Workflow distinction (leverage loops vs outcomes)
- [ ] Progress indicators

---

## 🧪 HOW TO TEST

### Test 1: Enhanced Question Card
1. User types: "I want to buy a house in Costa Rica"
2. Backend returns `question_card` with 3 region options + helpText
3. User should see ? icons on each button
4. Clicking ? should expand help text
5. "I don't know" button should appear at bottom

### Test 2: Submit Button
1. After answering all questions
2. Backend returns `submit_button` with summary
3. User should see purple "Proceed to Dispatch" button
4. Clicking triggers confirmation modal
5. Modal shows summary of all answers

### Test 3: Quick Results (Optional)
1. User answers "Which region? → Pacific Coast"
2. Backend does quick keyword search
3. Returns `quick_result_card` with 1-3 matches
4. Card appears during interview (doesn't block next question)

### Test 4: Dispatch Flow
1. User clicks "Proceed" in confirmation modal
2. Frontend calls `POST /dispatch` with conversation history
3. Backend returns `{ dispatch_id: "123" }`
4. Frontend shows "✓ Dispatched!" + confetti
5. Backend runs deep agents in background

---

## 🎯 PRIORITY ORDER

**P0 (Must Ship Thursday):**
1. `question_card` with helpText
2. `submit_button` at end
3. Confirmation modal trigger
4. `/dispatch` endpoint

**P1 (High Impact):**
5. `quick_result_card` after answers
6. Form builder mode (no search during)

**P2 (Nice to Have):**
7. `scanning_card` during processing
8. `outcome_card` final results

---

## 📞 QUESTIONS?

**If helpText is hard to generate:**
→ Frontend auto-generates generic text. You can send empty `helpText: ""` and it still works.

**If quick results are slow:**
→ Skip them for now. Focus on submit button + confirmation flow.

**If dispatch endpoint doesn't exist yet:**
→ Let me know - I can mock it on frontend for demo.

**If timeline is tight:**
→ Just do P0 items (#1-4). That's enough for Thursday.

---

## 🔗 EXAMPLE FULL FLOW

### 1. User Opens Copilot
**Backend:** No change needed

### 2. User Types "Buy house in Costa Rica"
**Backend Returns:**
```json
{
  "role": "assistant",
  "message": {
    "template": "question_card",
    "data": { /* region question */ }
  }
}
```

### 3. User Clicks "Pacific Coast"
**Backend Receives:** `{"role": "user", "message": "Pacific Coast"}`

**Backend Returns (Option A - Just next question):**
```json
{
  "role": "assistant",
  "message": {
    "template": "question_card",
    "data": { /* budget question */ }
  }
}
```

**Backend Returns (Option B - With quick results):**
```json
{
  "role": "assistant",
  "messages": [
    {
      "template": "quick_result_card",
      "data": { /* David Park match */ }
    },
    {
      "template": "question_card",
      "data": { /* budget question */ }
    }
  ]
}
```

### 4. After All Questions
**Backend Returns:**
```json
{
  "role": "assistant",
  "message": {
    "template": "submit_button",
    "data": {
      "summary": "• Region: Pacific Coast\n• Budget: $200k-$500k...",
      "label": "Proceed to Dispatch"
    }
  }
}
```

### 5. User Clicks "Proceed"
**Frontend Calls:**
```
POST /dispatch
{
  "summary": "...",
  "context": { "copilot_mode": "outcome", ... },
  "conversation_history": [...]
}
```

**Backend Returns:**
```json
{
  "dispatch_id": "abc123",
  "message": "Your network has been activated!"
}
```

---

## ✅ READY TO INTEGRATE

**Frontend is waiting.** All components tested and working.

Just send the right JSON templates and we're done.

Let me know if you need any clarification or have questions!

— Robert
