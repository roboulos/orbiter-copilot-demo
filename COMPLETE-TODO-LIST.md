# Complete To-Do List - Orbiter Copilot Demo
**Generated:** February 23, 2026 (End of Day)  
**Status:** 46/86 original items complete (53%)  
**New Total with Interview Flow:** 46/102 items (45%)

---

## 🔴 CRITICAL - Must Have for Demo (10 items, 6-8 hours)

### Meeting Prep Integration (2-3 hours)
- [ ] 1. Update chat system prompt to detect meeting prep intent
  - Add keyword patterns: "meeting prep for", "prepare me for meeting"
  - Return `{ action: "meeting_prep", master_person_id: X, context: Y }`
  - File: Backend chat endpoint or system prompt config
  - Estimated: 30 minutes

- [ ] 2. Add meeting prep handler in page.tsx
  - Detect `action === "meeting_prep"` in chat response
  - Call `generateMeetingPrep({ master_person_id, context })`
  - Map response to MeetingPrepCard props
  - File: `app/page.tsx` line ~200-300 (chat handler)
  - Estimated: 1-2 hours

- [ ] 3. Test meeting prep flow end-to-end
  - Type: "meeting prep for Charles"
  - Verify all fields populate (talking_points, openers, landmines)
  - Test with different people
  - Estimated: 30 minutes

### Integration Testing (1-2 hours)
- [ ] 4. Test dispatch → waiting room flow
  - Create real leverage loop
  - Verify WaitingRoom polls every 2s
  - Watch progress bar update
  - Test current_step displays
  - Estimated: 30 minutes

- [ ] 5. Test cancel button functionality
  - Click cancel during process
  - Verify API call to /process-cancel
  - Check process actually stops
  - Estimated: 15 minutes

- [ ] 6. Test complete → outcomes navigation
  - Wait for process to complete
  - Verify tab switches to Outcomes
  - Check results display
  - Estimated: 30 minutes

- [ ] 7. Error handling improvements
  - Test failed API calls
  - Better error messages (not just alerts)
  - Add retry logic
  - Estimated: 30 minutes

### OutcomesView Integration (1 hour)
- [ ] 8. Wire OutcomeCardEnhanced to OutcomesView
  - Replace current outcome display with enhanced cards
  - Add fold-down panel functionality
  - Show timeline and results
  - File: `app/components/OutcomesView.tsx`
  - Estimated: 1 hour

### Demo Preparation (1 hour)
- [ ] 9. Write demo script for Thursday
  - Scenario: Meeting prep + Dispatch flow
  - Timing: 3-4 minutes
  - Fallback slides if demo fails
  - Estimated: 30 minutes

- [ ] 10. Practice demo with Charles scenario
  - Rehearse flow
  - Test on production URL
  - Prepare Q&A answers
  - Estimated: 30 minutes

---

## 🟡 HIGH PRIORITY - Interview Flow Implementation (16 items, 8-12 hours)

### System Prompt Updates (1-2 hours)
- [ ] 11. Add interview-first protocol to chat system prompt
  - Define 3 intent types: complete | partial | exploratory
  - Add stage tracking: identifying_person → clarifying_outcome → extracting_context → confirming
  - Add interrupt protocol ("just do it", "skip questions")
  - File: Backend chat endpoint system prompt
  - Reference: INTERVIEW_FIRST_REQUIREMENTS.md
  - Estimated: 1-2 hours

### Intent Classification (2 hours)
- [ ] 12. Build intent classifier function
  - Parse user prompt for person name, goal, specificity
  - Return: `{ intent: "complete" | "partial" | "exploratory", confidence: 0-1 }`
  - File: `app/lib/intent-classifier.ts` (new file)
  - Estimated: 2 hours

### Stage Management (2-3 hours)
- [ ] 13. Create interview state management
  - Track current stage (4 stages)
  - Store context across turns
  - Persist person selection, outcome fragments
  - File: `app/hooks/useInterviewState.ts` (new file)
  - Estimated: 2-3 hours

### Guided Questions (2 hours)
- [ ] 14. Build question template system
  - Questions for each stage
  - Dynamic examples based on context
  - Progressive disclosure logic
  - File: `app/lib/interview-questions.ts` (new file)
  - Estimated: 2 hours

### Interview UI Components (3-4 hours)
- [ ] 15. Create ProgressTracker component
  - Shows current stage (1/4, 2/4, etc.)
  - Visual breadcrumbs
  - File: `app/components/InterviewProgressTracker.tsx` (exists but needs wiring)
  - Estimated: 1 hour

- [ ] 16. Update QuestionCardEnhanced for interview
  - Add stage-specific help text
  - Show examples dynamically
  - "I don't know" button behavior per stage
  - File: `app/components/QuestionCardEnhanced.tsx`
  - Estimated: 1-2 hours

- [ ] 17. Create InterviewSummary component
  - Shows collected context before dispatch
  - Allow editing before confirmation
  - File: `app/components/InterviewSummary.tsx` (new file)
  - Estimated: 1 hour

### Testing & Refinement (2 hours)
- [ ] 18. Test exploratory flow (vague input)
  - "I want to help someone"
  - Verify 4-6 clarifying questions
  - Check dispatch confirmation
  - Estimated: 30 minutes

- [ ] 19. Test partial flow (person OR outcome)
  - "I want to help Ray with something"
  - Verify 2-4 guided questions
  - Estimated: 30 minutes

- [ ] 20. Test complete flow (person + outcome)
  - "Help Ray Deck find seed investors for social graph product"
  - Verify 0-1 clarifying questions
  - Verify fast-track to dispatch
  - Estimated: 30 minutes

- [ ] 21. Test interrupt protocol
  - User says "just do it" mid-interview
  - Verify immediate dispatch
  - Estimated: 15 minutes

- [ ] 22. Test "super interviewer" quality
  - Questions feel natural
  - Examples are helpful
  - Flow doesn't feel robotic
  - Estimated: 15 minutes

### Conversation Starters Update (1 hour)
- [ ] 23. Update default conversation starters
  - Shift from action-oriented to exploration-oriented
  - "Explore ways to help [Person]" instead of "Leverage Network"
  - File: `app/page.tsx` (line ~140)
  - Estimated: 30 minutes

- [ ] 24. Update rich welcome screen copy
  - Emphasize interview-first approach
  - "I'll help you think through..."
  - File: `app/components/RichWelcomeScreen.tsx`
  - Estimated: 30 minutes

### Documentation (1 hour)
- [ ] 25. Update AGENTS.md with interview protocol
  - Add to system instructions
  - Reference interview requirements
  - Estimated: 30 minutes

- [ ] 26. Create interview flow diagram
  - Visual representation of stages
  - Decision tree for intent types
  - Estimated: 30 minutes

---

## 🟢 HIGH PRIORITY - Post-Demo Week (12 items, 14-20 hours)

### Network Visualization (6-8 hours)
- [ ] 27. Wire NetworkGraph component to /network-graph-data endpoint
  - Fetch 379 nodes, 378 edges
  - File: `app/components/NetworkView.tsx`
  - Estimated: 2 hours

- [ ] 28. Build canvas/SVG graph rendering
  - Use D3.js or similar library
  - Interactive nodes
  - Estimated: 3-4 hours

- [ ] 29. Add zoom, pan, node selection
  - Mouse controls
  - Touch support
  - Estimated: 1-2 hours

- [ ] 30. Add graph filters and controls
  - Filter by relationship type
  - Depth control
  - Search within graph
  - Estimated: 1-2 hours

### Context Add-Ons (3-4 hours)
- [ ] 31. Wire /context-add-ons endpoint
  - Show 7 available sources
  - Toggle enable/disable
  - File: New component `ContextAddOnsPanel.tsx`
  - Estimated: 1-2 hours

- [ ] 32. Wire /context-enrich endpoint
  - Allow user to select sources
  - Enrich person context
  - Display enriched YAML
  - Estimated: 2 hours

### Deep Research Layer (4-6 hours)
- [ ] 33. Implement two-layer agent system
  - Quick layer: existing (works)
  - Deep layer: POST /leverage-loop with fast=false
  - Estimated: 2-3 hours

- [ ] 34. Wire QuickResultCard deep layer
  - Show "Quick results while deep research continues..."
  - Poll for deep results or use WebSocket
  - File: `app/components/QuickResultCard.tsx`
  - Estimated: 2-3 hours

### Project Context Integration (1 hour)
- [ ] 35. Wire ProjectContextSelector to meeting prep
  - Pass selected project to /meeting-prep
  - File: Already built, needs integration
  - Estimated: 1 hour

### Results Display Polish (2-3 hours)
- [ ] 36. Integrate OutcomeCardEnhanced with OutcomesView
  - Full integration (not just display)
  - Dispatch actions from cards
  - Estimated: 1-2 hours

- [ ] 37. Add fold-down panel animations
  - Smooth expand/collapse
  - Stagger child elements
  - Estimated: 1 hour

---

## 🔵 INFRASTRUCTURE - Nice to Have (5 items, 14-21 hours)

### Real-Time Updates (4-6 hours)
- [ ] 38. Implement WebSocket for process monitoring
  - Replace 2-second polling
  - More efficient, better UX
  - File: New `app/lib/websocket.ts`
  - Estimated: 4-6 hours

### Notification System (2-3 hours)
- [ ] 39. Browser notifications when process completes
  - Request permission
  - Send notification
  - Click to open results
  - Estimated: 2-3 hours

### Performance Optimization (8-12 hours)
- [ ] 40. Lazy loading for large lists
  - Network list virtualization
  - Outcomes pagination
  - Estimated: 4-6 hours

- [ ] 41. Caching strategy
  - Cache person data
  - Cache network graph
  - Invalidation logic
  - Estimated: 2-3 hours

- [ ] 42. Bundle optimization
  - Code splitting
  - Lazy load components
  - Tree shaking
  - Estimated: 2-3 hours

---

## 🟣 VISUAL POLISH - Nice to Have (3 items, 7-10 hours)

### Send Icon (1-2 hours)
- [ ] 43. Verify send icon CSS override works
  - Test in CrayonChat
  - May need to fork @crayonai/react-ui
  - File: `app/globals.css`
  - Estimated: 1-2 hours

### Network Graph Visual Enhancement (6-8 hours)
- [ ] 44. Premium graph animations
  - Particle effects
  - Glow on hover
  - Connection highlighting
  - Estimated: 3-4 hours

- [ ] 45. Graph layout improvements
  - Force-directed layout
  - Clustering algorithm
  - Edge bundling
  - Estimated: 3-4 hours

---

## 🎯 STRATEGIC - Future Work (6 items, 20-36 hours)

### Positioning & Messaging (4 hours)
- [ ] 46. Document "AI harness for whole network 24/7" positioning
  - Update all UI copy
  - Homepage messaging
  - Estimated: 2 hours

- [ ] 47. Frame all messaging around "Help people, not close deals"
  - Review content
  - Adjust tone
  - Estimated: 2 hours

### Validation & Testing (10-12 hours)
- [ ] 48. User testing sessions
  - 5-10 users
  - Record sessions
  - Collect feedback
  - Estimated: 4-6 hours

- [ ] 49. Validate copilot helps define what to dispatch
  - Quality of dispatch definitions
  - Success rate
  - Estimated: 2-3 hours

- [ ] 50. Confirm "super interviewer" functionality
  - Conversation quality testing
  - Refine question patterns
  - Estimated: 2-3 hours

- [ ] 51. Test with real network contacts
  - Ray Deck scenario
  - Multiple real goals
  - Actual suggestions evaluation
  - Estimated: 2 hours

### Scale Testing (10-14 hours)
- [ ] 52. Performance test with huge networks
  - Test with 5000+ contacts
  - Identify bottlenecks
  - Estimated: 4-6 hours

- [ ] 53. Scale optimization
  - Database query optimization
  - Graph algorithm improvements
  - Estimated: 6-8 hours

---

## 📅 TIMELINE & COORDINATION (3 items, 2.5 hours)

- [ ] 54. Schedule UI review meeting with Mark
  - Before Thursday demo
  - Get feedback on interview flow
  - Estimated: 1 hour meeting

- [ ] 55. Thursday Feb 27 @ 9 AM demo with Charles
  - Integration meeting
  - Show copilot progress
  - Estimated: 1 hour

- [ ] 56. Coordinate endpoint delivery timeline with backend
  - Calendar endpoints (when Mark approves)
  - Future enhancements priority
  - Estimated: 30 minutes

---

## 🔧 TECHNICAL DEBT & POLISH (13 items, 30-48 hours)

### Error Handling (3 hours)
- [ ] 57. Add success toast after dispatch
  - Replace alert with toast
  - File: `app/components/SuccessToast.tsx` (exists, needs wiring)
  - Estimated: 30 minutes

- [ ] 58. Better error messages for failed dispatch
  - User-friendly text
  - Show what went wrong
  - Offer retry
  - Estimated: 1 hour

- [ ] 59. Error boundaries for components
  - Catch React errors
  - Fallback UI
  - Error reporting
  - Estimated: 1.5 hours

### Navigation (2 hours)
- [ ] 60. Smooth redirect flow after dispatch
  - Transition to WaitingRoom
  - Then to OutcomesView
  - Back button handling
  - Estimated: 1 hour

- [ ] 61. Tab state persistence
  - Remember active tab
  - Restore on reload
  - Estimated: 1 hour

### Documentation (3 hours)
- [ ] 62. Update README with setup instructions
  - Environment variables
  - Dev server setup
  - Common issues
  - Estimated: 1 hour

- [ ] 63. Create deployment guide
  - Vercel configuration
  - Environment setup
  - Domain configuration
  - Estimated: 1 hour

- [ ] 64. API integration guide for backend team
  - How frontend calls endpoints
  - Expected request/response formats
  - Error handling
  - Estimated: 1 hour

### Testing (22-42 hours)
- [ ] 65. Write component unit tests
  - WaitingRoom tests
  - DispatchModal tests
  - QuestionCard tests
  - Estimated: 8-12 hours

- [ ] 66. Write integration tests
  - Dispatch flow
  - Meeting prep flow
  - Interview flow
  - Estimated: 6-12 hours

- [ ] 67. E2E testing suite with Playwright
  - Critical user journeys
  - Happy paths
  - Error scenarios
  - Estimated: 8-12 hours

- [ ] 68. Visual regression testing
  - Screenshot comparison
  - Component variations
  - Estimated: 2-4 hours

- [ ] 69. Accessibility testing
  - Keyboard navigation
  - Screen reader support
  - ARIA labels
  - Estimated: 2-4 hours

---

## ⏸️ BLOCKED - Waiting on External (2 items)

### Calendar Integration (2-4 hours after unblocked)
- [ ] 70. POST /calendar/connect implementation
  - **BLOCKER:** Mark needs to grant Nylas OAuth for robert@snappy.ai
  - Backend endpoint exists (ID 8102 or similar)
  - Frontend wiring: 1 hour
  - Testing: 1 hour
  - Estimated: 2 hours after unblock

- [ ] 71. GET /calendar/events implementation
  - Depends on #70
  - Backend endpoint exists
  - Frontend wiring: 1 hour
  - Testing: 1 hour
  - Estimated: 2 hours after unblock

---

## 📊 SUMMARY

| Category | Items | Hours | Priority |
|----------|-------|-------|----------|
| 🔴 Critical (Demo) | 10 | 6-8h | This week |
| 🟡 Interview Flow | 16 | 8-12h | Next week |
| 🟢 High Priority | 12 | 14-20h | Sprint 2 |
| 🔵 Infrastructure | 5 | 14-21h | Future |
| 🟣 Visual Polish | 3 | 7-10h | Future |
| 🎯 Strategic | 6 | 20-36h | Future |
| 📅 Timeline | 3 | 2.5h | This week |
| 🔧 Technical Debt | 13 | 30-48h | Future |
| ⏸️ Blocked | 2 | 4h | When unblocked |
| **TOTAL** | **70** | **106-160h** | |

**Note:** Original 86-item checklist was incomplete. This is the full scope.

---

## 🎯 IMMEDIATE PRIORITIES (Next 3 Days)

### Wednesday (6-8 hours)
1. Meeting prep integration (2-3h)
2. Integration testing (1-2h)
3. OutcomesView integration (1h)
4. Demo preparation (1h)

### Thursday (1 hour)
5. Demo to Charles @ 9 AM

### Friday-Next Week (8-12 hours)
6. Interview flow implementation (8-12h)

---

## 📈 PROGRESS TRACKING

**Completed:** 46/116 total items (40%)
**Critical Path:** 10 items (6-8h)
**This Sprint:** 26 items (14-20h)
**Next Sprint:** 18 items (34-57h)
**Future:** 24 items (52-79h)
**Blocked:** 2 items (4h when unblocked)

---

**Status:** 85% demo-ready now, 95% after Wednesday work, 100% feature-complete after interview flow implementation.
