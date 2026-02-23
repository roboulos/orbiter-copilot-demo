# Interview Mode Testing Guide

## Quick Start
1. Open http://localhost:3000
2. Click "Copilot" to open the modal
3. Try the test scenarios below

## Test Scenarios

### Scenario 1: Exploratory Intent (Should Trigger Interview)
**Input:** "I want to help someone"
**Expected:**
- Interview mode activates
- InterviewPanel appears
- Shows "Who would you like to help?" question
- PersonPicker appears with network list
- Can select a person → moves to "clarify_outcome" stage

### Scenario 2: Partial Intent (Should Trigger Interview)
**Input:** "Help Mark find investors"
**Expected:**
- Interview mode activates
- Shows "Who would you like to help?" first
- After person selection → shows "What specific outcome are you looking for with Mark?"
- User answers → moves to "extract_context" stage
- Shows "Any specific constraints or preferences?"

### Scenario 3: Complete Intent (Should Skip Interview)
**Input:** "Help Mark Pederson find Series A investors in SF who focus on SaaS, I need intros by end of month"
**Expected:**
- Interview mode DOES NOT activate (already has all details)
- Goes straight to backend chat API
- Backend returns dispatch card or regular response

### Scenario 4: Skip Flow
**Input:** Start with "help someone" → select person → type "just do it"
**Expected:**
- Recognizes skip intent
- Generates dispatch summary with current data
- Opens DispatchConfirmationModal
- Interview panel closes

### Scenario 5: Message Routing When Interview Active
**Input:**
1. Start interview with "help someone"
2. Interview panel shows
3. Type any answer (e.g., "Help them find a job")

**Expected:**
- Message does NOT go to backend
- Message goes to interview.processInput()
- Interview advances to next stage
- New question appears

## Key Components to Verify

### 1. Interview Activation
- Check `interview.state.active` becomes `true`
- InterviewPanel appears when active
- CrayonChat input still works (doesn't disable)

### 2. Message Interception
- When interview active: messages route to interview flow (not backend)
- processMessageWithInterview wrapper catches messages
- Returns empty response (doesn't hit backend)

### 3. Stage Transitions
- identify_person → clarify_outcome → extract_context → confirm
- Each stage shows appropriate question
- Examples and help text update per stage

### 4. Dispatch Confirmation
- At end of interview flow: DispatchConfirmationModal opens
- Shows formatted summary with person name, outcome, constraints
- Has "Confirm" and "Cancel" buttons
- On confirm → calls dispatch API

### 5. Reset Flow
- After dispatch: interview.reset() called
- interview.state.active becomes false
- Can start new interview

## Testing Console Logs
Open browser console and look for:
- `[Interview] Stage: identify_person` → interview started
- `[Interview] Action: show_person_picker` → picker should appear
- `[Interview] Stage: clarify_outcome` → moved to outcome stage
- `[Interview] Action: show_confirmation` → should open modal

## Known Issues / Edge Cases to Test
1. **Rapid messages:** Type very fast, does interview keep up?
2. **Back button:** Can user go back a stage? (not implemented yet)
3. **Cancel interview:** How to exit mid-flow? (reset button needed?)
4. **Person not selected:** What if user types outcome without selecting person?
5. **Empty answers:** What if user submits blank text?

## Manual Test Checklist
- [ ] Interview activates on "help someone"
- [ ] PersonPicker appears and is functional
- [ ] Can select a person from picker
- [ ] Stage transitions work (identify → clarify → extract)
- [ ] Skip button works ("just do it" or click skip)
- [ ] Examples are clickable
- [ ] Help text shows correctly
- [ ] DispatchConfirmationModal opens at end
- [ ] Dispatch button actually calls API
- [ ] After dispatch, interview resets
- [ ] Complete intent bypasses interview
- [ ] Console shows no errors
- [ ] UI is responsive and looks premium

## Automated Testing (Future)
```typescript
// Example test
test('Interview activates on exploratory intent', () => {
  const { result } = renderHook(() => useInterviewFlow());
  const action = result.current.processInput("help someone");
  expect(action.type).toBe("show_person_picker");
  expect(result.current.state.active).toBe(true);
  expect(result.current.state.stage).toBe("identify_person");
});
```

## Success Criteria
✅ All 3 intent types work correctly
✅ Message routing never sends to backend when interview active
✅ Stage transitions are smooth and logical
✅ Dispatch confirmation contains accurate summary
✅ Interview resets after completion
✅ No TypeScript errors
✅ No console errors during normal flow
✅ UI matches premium quality standard
