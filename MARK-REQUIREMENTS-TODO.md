# Complete To-Do List - Mark/Josh/Jason Requirements
**Created:** Feb 22, 2026 @ 6:21 PM EST
**Target:** 100% alignment with Transcript #423

---

## 🔴 CRITICAL (Must Have for Thursday Integration)

### 1. Build "Help Someone Else" Entry Point ⏳
**Current:** Only "your own outcome" starters
**Required:** Person picker → Fork in the road

**Tasks:**
- [ ] Add PersonPicker search to welcome screen
- [ ] Build Fork component with 2 buttons:
  - [ ] "Leverage my Network for [Person]" → Quick confirm → Dispatch
  - [ ] "Help [Person] with a specific task" → Sub-fork:
    - [ ] "Suggest what [Person] might need" → AI suggestions as buttons
    - [ ] "I already know what to help with" → User describes
- [ ] Wire fork choices to backend
- [ ] Test full leverage loop flow

**Acceptance:** User can select person first, then choose how to help them

---

### 2. Add Context/Help for Choices ⏳
**Current:** Just button labels (e.g., "Central Valley")
**Required:** Help text so users understand options

**Tasks:**
- [ ] Add expandable "?" info icon to each button
- [ ] On hover/click: Show 2-3 sentence explanation
- [ ] Add "I don't know" / "Help me choose" option to all multi-choice questions
- [ ] "I don't know" triggers research/context mode

**Example:**
```
🏔️ Central Valley
San José, Escazú, Atenas
ℹ️ "Year-round spring climate, close to capital, lower costs than beach areas"
```

**Acceptance:** Josh can understand what each region means without prior knowledge

---

### 3. Build Dispatch Confirmation Modal ⏳
**Current:** Interview ends without clear summary
**Required:** Confirmation screen before dispatch

**Tasks:**
- [ ] Create ConfirmationModal component
- [ ] Show after interview complete:
  - [ ] Summary of all answers
  - [ ] Preview of what will be dispatched
  - [ ] Clear "Proceed" button
- [ ] "Proceed" → calls dispatch endpoint
- [ ] Show success state (spinner → confetti → "✓ Dispatched")
- [ ] Link to view in Outcomes tab

**Acceptance:** Mark sees exactly what's being sent before it goes

---

### 4. Separate Leverage Loops vs Outcomes Workflows ⏳
**Current:** Same interview flow for both
**Required:** Different logic based on use case

**Tasks:**
- [ ] Detect entry point (person selected vs not)
- [ ] Leverage Loop path:
  - [ ] Shorter interview (2-3 questions max)
  - [ ] Focus on "what can I offer this person?"
  - [ ] Less context needed (you don't know their full situation)
- [ ] Outcome path:
  - [ ] Deeper interview (can ask more)
  - [ ] Focus on "what do I personally want?"
  - [ ] More context gathered (you know your own goals)
- [ ] Different system prompts for each mode

**Acceptance:** Two distinct flows that feel different to use

---

### 5. Form Builder Priority (No Parallel Search) ⏳
**Current:** Unknown if backend searches during interview
**Required:** Pure form builder - NO searching until dispatch

**Tasks:**
- [ ] Review backend /chat endpoint
- [ ] Ensure NO network search happens during questions
- [ ] Questions purely gather context
- [ ] ONLY after dispatch: agents search/analyze
- [ ] Add comment in code: "Form builder mode - search on dispatch only"

**Acceptance:** Interview is fast, no waiting for network analysis mid-flow

---

## 🟡 HIGH PRIORITY (Improves Experience)

### 6. Add "I Don't Know" Fallback ⏳
**Current:** Fixed buttons only
**Required:** Escape hatch for uncertain users

**Tasks:**
- [ ] Add "I don't know" button to all multi-choice questions
- [ ] Click "I don't know" → AI provides more context/research
- [ ] OR: AI suggests "Let me help you narrow this down" → follow-up questions
- [ ] User can then go back and choose informed option

**Acceptance:** Josh can ask for help when he doesn't understand a choice

---

### 7. Large Network Handling (8000+ Contacts) ⏳
**Current:** Unknown performance with large networks
**Required:** No freezing/hanging with massive contact lists

**Tasks:**
- [ ] Load network data in chunks (not all at once)
- [ ] PersonPicker: Search as you type (don't load all 8000)
- [ ] Virtual scrolling for search results
- [ ] Show loading state during search
- [ ] Test with 8000+ mock contacts

**Acceptance:** Brian's 8000 contacts don't freeze the app

---

### 8. Backend Visual Template Integration ⏳
**Current:** Backend may return plain text
**Required:** Backend returns visual templates

**Tasks:**
- [ ] Verify backend returns `{ template: "question_card", data: {...} }` format
- [ ] Test QuestionCard rendering from backend
- [ ] Test ScanningCard appears during processing
- [ ] Confirm images/icons included in responses
- [ ] End-to-end test: Costa Rica flow + Investor flow

**Acceptance:** All questions show as beautiful QuestionCards, not plain text

---

## 🟢 COORDINATION (Schedule/Process)

### 9. Schedule Wednesday UI Meeting ⏳
**Required:** Meeting before Thursday integration

**Tasks:**
- [ ] Robert: Send calendar invite to Mark + team
- [ ] Agenda: UI tweaks, final polish, integration plan
- [ ] Prepare demo walkthrough
- [ ] List any blockers/questions

---

### 10. Verify Endpoint Add-Ons Ready ⏳
**Required:** Mark's endpoint updates deployed

**Tasks:**
- [ ] Check with Mark: Did you add the add-ons?
- [ ] Test endpoint with new fields
- [ ] Update frontend to use new data
- [ ] Document new endpoint shape

---

### 11. Load Real Network Data for Testing ⏳
**Required:** Dogfood with actual data

**Tasks:**
- [ ] Get real network export from Mark
- [ ] Load into demo app
- [ ] Test full flow with real names/data
- [ ] Identify any UX issues with real data
- [ ] Fix issues found

---

## 📊 SUCCESS CRITERIA

**100% Complete When:**
- ✅ User can select person FIRST → help them (leverage loop)
- ✅ OR user can state own goal → get help (outcome)
- ✅ All choices have context/help available
- ✅ "I don't know" option exists and works
- ✅ Interview ends with clear confirmation modal
- ✅ Dispatch happens AFTER confirmation, not during
- ✅ No searching/processing during interview (form builder only)
- ✅ Works smoothly with 8000+ contacts
- ✅ Backend returns visual templates (QuestionCards)
- ✅ Wednesday meeting scheduled
- ✅ Real data loaded and tested

---

**Start Time:** Feb 22, 6:21 PM EST
**Target:** Before Wednesday meeting
**Status:** 0/11 complete
