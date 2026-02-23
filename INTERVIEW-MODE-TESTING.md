# Interview Mode - Testing & Verification Guide

**Goal:** Verify all interview flows work correctly before Thursday demo

---

## ✅ Pre-Test Checklist

- [x] Dev server running (localhost:3000)
- [x] No compile errors
- [x] All components imported
- [x] Intent classifier built
- [x] Interview hook built
- [x] InterviewPanel component built
- [x] Integration wired in page.tsx

---

## 🧪 Test 1: Exploratory Flow (Vague → Guided)

**User Intent:** Vague, needs full guidance

**Steps:**
1. Open copilot (Cmd+K or click Copilot button)
2. Type: "I want to help someone"
3. **Expected:** InterviewPanel appears with PersonPicker
4. Select a person (e.g., "Ray Deck")
5. **Expected:** Question "What specific outcome for Ray Deck?"
6. Type or click example: "Find seed investors"
7. **Expected:** Question "Any constraints?"
8. Type: "AI/ML focus" OR click Skip
9. **Expected:** DispatchConfirmationModal appears with summary
10. Click "Dispatch"
11. **Expected:** WaitingRoom appears with polling

**Success Criteria:**
- ✅ PersonPicker shows up
- ✅ Questions progress through stages
- ✅ Examples are clickable
- ✅ Skip button works
- ✅ Confirmation modal shows correct summary
- ✅ Dispatch executes

---

## 🧪 Test 2: Partial Flow (Person OR Outcome)

**User Intent:** Has person, needs outcome clarification

**Steps:**
1. Open copilot
2. Click person selector → choose "Ray Deck"
3. Click Dispatch button in header
4. **Expected:** InterviewPanel appears (skip person picker stage)
5. **Expected:** Question "What specific outcome for Ray Deck?"
6. Type: "Find CTO role at graph database companies"
7. **Expected:** Question "Any constraints?" OR go straight to confirm
8. Click Skip or provide constraint
9. **Expected:** DispatchConfirmationModal
10. Dispatch

**Success Criteria:**
- ✅ Skips PersonPicker stage (person already selected)
- ✅ Goes straight to outcome question
- ✅ Confirmation shows correct person + outcome

---

## 🧪 Test 3: Complete Flow (Fast-Track)

**User Intent:** Specific, should need minimal questions

**Steps:**
1. Open copilot
2. Type: "Help Ray Deck find graph database experts for Orbiter's backend migration"
3. **Expected:** InterviewPanel appears OR goes straight to confirmation
4. If question appears: Answer and move to confirm
5. **Expected:** DispatchConfirmationModal with detailed summary
6. Dispatch

**Success Criteria:**
- ✅ Minimal questions (0-1)
- ✅ Fast-track to confirmation
- ✅ Correct intent classification

---

## 🧪 Test 4: Skip/Power User Flow

**User Intent:** Power user wants to bypass questions

**Steps:**
1. Open copilot
2. Type: "I want to help Ray with something"
3. **Expected:** InterviewPanel asks for outcome
4. Type: "just do it" OR "skip questions"
5. **Expected:** If enough info, go to confirmation; otherwise continue
6. Alternative: Provide outcome, then when asked for constraints, type "just do it"
7. **Expected:** Skip to confirmation with current data

**Success Criteria:**
- ✅ detectSkipIntent() recognizes "just do it"
- ✅ Skips remaining stages
- ✅ Goes to confirmation with collected data

---

## 🧪 Test 5: Dispatch Button Trigger

**User Intent:** Click dispatch button directly

**Steps:**
1. Open copilot
2. Select person: Ray Deck
3. Click "Dispatch" button in header
4. **Expected:** InterviewPanel appears
5. **Expected:** Question "What specific outcome for Ray Deck?"
6. Complete interview
7. Dispatch

**Success Criteria:**
- ✅ Dispatch button triggers interview
- ✅ Person pre-selected
- ✅ Smooth flow

---

## 🧪 Test 6: Cancel/Reset Mid-Interview

**User Intent:** User changes mind

**Steps:**
1. Start interview (any flow)
2. Progress to stage 2 or 3
3. Click close button (×) on InterviewPanel
4. **Expected:** Interview resets, panel closes
5. Start new interview
6. **Expected:** Fresh state, starts from beginning

**Success Criteria:**
- ✅ Reset button works
- ✅ State clears completely
- ✅ Can start new interview

---

## 🧪 Test 7: Keyboard Shortcuts

**User Intent:** Efficient power user

**Steps:**
1. Start interview
2. Type answer in textarea
3. Press Cmd+Enter (Mac) or Ctrl+Enter (Windows)
4. **Expected:** Advances to next stage
5. Test Escape key
6. **Expected:** Closes interview

**Success Criteria:**
- ✅ Cmd+Enter submits
- ✅ Escape closes (if implemented)

---

## 🧪 Test 8: Example Buttons

**User Intent:** User clicks examples instead of typing

**Steps:**
1. Start interview
2. At outcome stage, click example: "Connect them with potential investors"
3. **Expected:** Input field populates with example text
4. Click Continue
5. **Expected:** Advances to next stage with example as answer

**Success Criteria:**
- ✅ Examples are clickable
- ✅ Text populates in input
- ✅ Can be edited before submitting

---

## 🧪 Test 9: Empty/Invalid Input

**User Intent:** Edge cases

**Steps:**
1. Start interview
2. At outcome stage, leave input empty
3. Try to click Continue
4. **Expected:** Button disabled OR validation message
5. Type single character "a"
6. **Expected:** Button enabled but may re-ask for clarity

**Success Criteria:**
- ✅ Empty input handled gracefully
- ✅ Continue button disabled when no input
- ✅ No crashes

---

## 🧪 Test 10: Multiple Interviews in Sequence

**User Intent:** Use interview multiple times

**Steps:**
1. Complete full interview → dispatch
2. Immediately start new interview
3. Complete with different person/outcome
4. **Expected:** State cleanly resets between interviews
5. **Expected:** No data bleed from previous interview

**Success Criteria:**
- ✅ Clean state management
- ✅ No stale data
- ✅ Each interview independent

---

## 🧪 Test 11: Message Interception

**User Intent:** Test backend vs interview routing

**Complete Intent (should go to backend):**
- Type: "Help Ray find investors for his AI startup"
- **Expected:** Normal chat response (not interview)

**Partial Intent (should go to interview):**
- Type: "I want to help someone with something"
- **Expected:** InterviewPanel appears

**Exploratory (should go to interview):**
- Type: "Explore ways to help my network"
- **Expected:** InterviewPanel appears

**Success Criteria:**
- ✅ Complete intents bypass interview
- ✅ Partial/exploratory trigger interview
- ✅ Intent classifier working correctly

---

## 🐛 Common Issues to Check

### Issue 1: InterviewPanel Not Showing
**Symptoms:** Click dispatch, nothing happens
**Check:**
- interview.state.active === true?
- InterviewPanel conditional rendering correct?
- Any console errors?

### Issue 2: Stage Not Advancing
**Symptoms:** Stuck on same question
**Check:**
- processInput() returning correct action?
- setState() being called?
- State updates causing re-render?

### Issue 3: Confirmation Not Showing
**Symptoms:** Interview completes but no dispatch modal
**Check:**
- setShowDispatchModal(true) called?
- dispatchDescription set?
- DispatchConfirmationModal rendering?

### Issue 4: Person Not Carrying Through
**Symptoms:** Person selected but lost in later stages
**Check:**
- interview.setPerson() called correctly?
- State persisting between stages?
- PersonId passed to dispatch?

### Issue 5: Examples Not Working
**Symptoms:** Click example, nothing happens
**Check:**
- setInputValue() called?
- Button onClick handler correct?
- Input field updating?

---

## 📸 Screenshots Needed

### Core Flow Screenshots (8 total)

1. **Empty State** - Copilot closed
2. **Copilot Open** - Ready for input
3. **Stage 1** - PersonPicker showing
4. **Stage 2** - Outcome question with examples
5. **Stage 3** - Context question (optional)
6. **Stage 4** - Confirmation modal
7. **WaitingRoom** - After dispatch
8. **Results** - Outcomes tab

### Flow-Specific Screenshots (3 total)

9. **Exploratory** - Full PersonPicker
10. **Partial** - Skipped to outcome
11. **Complete** - Fast-track to confirm

### Edge Cases (2 total)

12. **Progress Bar** - Mid-interview (step 2 of 4)
13. **Skip Mode** - "just do it" behavior

---

## ✅ Completion Checklist

### Functionality
- [ ] All 11 tests pass
- [ ] No console errors
- [ ] Smooth transitions
- [ ] Loading states work
- [ ] Error messages clear
- [ ] Keyboard shortcuts work

### Visual
- [ ] Progress bar accurate
- [ ] Stage labels correct
- [ ] Examples formatted well
- [ ] Help text readable
- [ ] Buttons properly styled
- [ ] Responsive layout works

### Integration
- [ ] Wire to DispatchConfirmationModal works
- [ ] Wire to WaitingRoom works
- [ ] Person selection carries through
- [ ] Dispatch executes correctly
- [ ] Results show in Outcomes tab

### Polish
- [ ] Animations smooth
- [ ] No UI flicker
- [ ] Consistent colors
- [ ] Proper spacing
- [ ] Professional feel

---

## 🚀 Demo Readiness Criteria

**Thursday demo is ready when:**

1. ✅ Can show exploratory flow (PersonPicker → outcome → confirm)
2. ✅ Can show partial flow (person selected → outcome)
3. ✅ Can show skip mode ("just do it")
4. ✅ Progress bar works
5. ✅ Examples are helpful
6. ✅ Dispatch actually executes
7. ✅ No crashes or errors
8. ✅ Looks professional
9. ✅ Feels smooth
10. ✅ Screenshots prove quality

---

## 🎯 Priority Testing Order

**Critical (Must work for demo):**
1. Test 1 (Exploratory) - Primary demo flow
2. Test 5 (Dispatch button) - Main entry point
3. Test 2 (Partial) - Common use case
4. Test 11 (Message interception) - Core logic

**Important (Should work):**
5. Test 4 (Skip mode) - Power user feature
6. Test 6 (Reset) - Error recovery
7. Test 8 (Examples) - UX nicety

**Nice-to-have (Polish):**
8. Test 7 (Keyboard) - Power user
9. Test 9 (Validation) - Edge case
10. Test 10 (Multiple) - Stress test

---

## 🔧 Quick Fix Guide

### If stage not advancing:
```typescript
// Check: Is setState being called?
console.log("Current stage:", interview.state.stage);
console.log("Action returned:", action);
```

### If PersonPicker not showing:
```typescript
// Check: Is stage === "identify_person"?
console.log("Interview active:", interview.state.active);
console.log("Current stage:", interview.state.stage);
```

### If dispatch not executing:
```typescript
// Check: Is modal showing?
console.log("Show dispatch modal:", showDispatchModal);
console.log("Dispatch description:", dispatchDescription);
```

---

**Status:** Ready to test. Follow tests in priority order.
