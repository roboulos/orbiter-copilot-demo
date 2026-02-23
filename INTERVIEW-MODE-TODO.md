# Interview Mode - Complete Implementation Checklist

**Goal:** Implement Mark's "super interviewer" vision from Transcript #430

---

## ✅ COMPLETED (Infrastructure - 40%)

- [x] 1. Intent classifier built (`app/lib/intent-classifier.ts`)
- [x] 2. Interview flow hook built (`app/hooks/useInterviewFlow.ts`)
- [x] 3. InterviewPanel component built (`app/components/InterviewPanel.tsx`)
- [x] 4. Updated conversation starters to interview-friendly
- [x] 5. Import statements added to page.tsx

---

## 🔨 TO DO NOW (Integration - 60%, ~4 hours)

### Phase 1: Wire InterviewPanel to CopilotModal (1 hour)

- [ ] 6. Add InterviewPanel to CopilotModal JSX
- [ ] 7. Show InterviewPanel when interview.state.active === true
- [ ] 8. Pass all required props to InterviewPanel
- [ ] 9. Add backdrop/overlay handling

### Phase 2: Message Interception (1 hour)

- [ ] 10. Intercept user messages before sending to chat endpoint
- [ ] 11. Check if interview mode should activate
- [ ] 12. Route through interview.processInput() first
- [ ] 13. Handle InterviewAction responses:
  - show_person_picker → show InterviewPanel with PersonPicker
  - show_question → show InterviewPanel with question
  - show_confirmation → show DispatchConfirmationModal
  - dispatch → trigger actual dispatch
  - reset → clear interview state

### Phase 3: Stage Handlers (1 hour)

- [ ] 14. Handle identify_person stage:
  - Show InterviewPanel with PersonPicker
  - On person select → call interview.setPerson()
  - Move to clarify_outcome stage

- [ ] 15. Handle clarify_outcome stage:
  - Show question from getNextQuestion()
  - Show examples as clickable buttons
  - On answer → process through interview.processInput()
  - Move to extract_context or confirm stage

- [ ] 16. Handle extract_context stage:
  - Show optional constraints question
  - Allow skip
  - On answer → move to confirm stage

- [ ] 17. Handle confirm stage:
  - Generate dispatch summary
  - Show DispatchConfirmationModal
  - On confirm → dispatch
  - Wire to existing dispatch flow

### Phase 4: Skip & Power User Flows (30 minutes)

- [ ] 18. Detect "just do it" / skip intent
- [ ] 19. Fast-track complete intents to confirmation
- [ ] 20. Allow escape key to exit interview
- [ ] 21. Add "Start over" button

### Phase 5: Integration with Existing Features (30 minutes)

- [ ] 22. Wire interview state to existing dispatch flow
- [ ] 23. Pass collected data to DispatchConfirmationModal
- [ ] 24. Preserve selected person through interview
- [ ] 25. Reset interview after dispatch completes

### Phase 6: Testing (45 minutes)

- [ ] 26. Test exploratory flow: "I want to help someone"
  - Should show person picker
  - Then ask for outcome
  - Then optional context
  - Then confirm

- [ ] 27. Test partial flow: "Help Ray with something"
  - Should ask for outcome
  - Then optional context
  - Then confirm

- [ ] 28. Test complete flow: "Help Ray find investors for his startup"
  - Should ask 0-1 clarifying questions
  - Then confirm
  - Then dispatch

- [ ] 29. Test skip flow: User says "just do it"
  - Should fast-track to confirmation

- [ ] 30. Test edge cases:
  - Empty input
  - Person not found
  - Cancel mid-interview
  - Multiple interviews in sequence

### Phase 7: Polish & UX (30 minutes)

- [ ] 31. Add smooth transitions between stages
- [ ] 32. Add loading states during processing
- [ ] 33. Improve error messages
- [ ] 34. Add keyboard shortcuts (Cmd+Enter to submit)
- [ ] 35. Add progress persistence (survive page reload)

### Phase 8: Visual Verification (15 minutes)

- [ ] 36. Take screenshots of all 4 stages
- [ ] 37. Take screenshots of all 3 flow types
- [ ] 38. Verify design system consistency
- [ ] 39. Test responsive layout
- [ ] 40. Verify accessibility (keyboard nav)

---

## TOTAL: 40 tasks
- Completed: 5 (12.5%)
- Remaining: 35 (87.5%)
- Estimated time: 4-5 hours

---

## Success Criteria

**Interview mode is DONE when:**

1. ✅ User says "I want to help someone" → PersonPicker appears
2. ✅ User selects person → "What outcome?" question appears
3. ✅ User provides outcome → Optional context question appears
4. ✅ User provides/skips context → Confirmation modal appears
5. ✅ User confirms → Dispatch executes
6. ✅ Power user says "Help Ray find investors" → 1 question max, then dispatch
7. ✅ User says "just do it" → Skip to confirmation
8. ✅ All flows work smoothly with premium UI
9. ✅ No console errors
10. ✅ Screenshots prove world-class UX

---

**Let's ship it!** 🚀
