# Orbiter Copilot - Testing Guide

**Last Updated:** Feb 19, 2026

---

## 🚀 Quick Start

1. **Start dev server:**
   ```bash
   cd /Users/robertboulos/.openclaw/workspace/projects/orbiter-copilot-demo
   npm run dev
   ```

2. **Open:** http://localhost:3000

3. **Click:** "⚡ Copilot" button in top right

---

## ✅ What to Test

### Test 1: Message UI Alignment ⭐ CRITICAL
**Goal:** Verify messages look like iMessage (user=right, AI=left)

**Steps:**
1. Open copilot (don't select anyone)
2. Type: "Hello, I want to buy a house in Costa Rica"
3. Click send
4. Wait for AI response

**Expected:**
- ✅ Your message appears RIGHT-aligned (blue gradient bubble)
- ✅ AI message appears LEFT-aligned with avatar
- ✅ Messages max 480px wide (not full width)
- ✅ Speech bubbles have proper tails
- ✅ No expansion/contraction of modal

**Pass Criteria:**
- Looks like iMessage chat
- Messages stay narrow
- Clear L/R alignment

---

### Test 2: Dynamic Conversation Starters
**Goal:** Verify starters change based on context

**Scenario A: No Person Selected**
1. Open copilot (blank state)
2. Look at conversation starters

**Expected:**
- 🏠 I want to buy a house in Costa Rica
- 💰 Find investors for my startup
- 🎯 Help someone I know with...

**Scenario B: Person Selected**
1. Search for someone (type "random" or any name)
2. Select a person from dropdown
3. Look at conversation starters

**Expected:**
- ⚡ Leverage Network for [Name]
- 🎯 Help [Name] with something specific
- 📅 Meeting Prep for [Name]

**Pass Criteria:**
- Starters change dynamically
- Relevant to context
- Clear action-oriented language

---

### Test 3: Fork in the Road (Person Selected)
**Goal:** Verify fork appears and works

**Steps:**
1. Open copilot
2. Search and select "random" (or any person)
3. Should see Fork in the Road UI

**Expected:**
- Person badge with name/title at top
- Divider line
- Prompt: "What do you want to do with this relationship?"
- Two big buttons:
  - ⚡ Leverage my Network for [Name]
  - 🎯 Help [Name] with a specific task

**Click "Leverage Network":**
- Should start chat immediately
- Fork disappears
- Shows chat interface

**Click "Help with specific task":**
- Should show SUB-FORK with 2 more buttons:
  - 💡 Suggest what [Name] might need
  - 🎯 I already know what to help with
- Back button (← Back) should work

**Pass Criteria:**
- Fork appears when person selected
- Both main buttons work
- Sub-fork appears and works
- Back button returns to main fork
- Animations smooth

---

### Test 4: Button Interview System (BLOCKED - Backend)
**Goal:** Test button-based questions

**⚠️ CURRENTLY BLOCKED:** Backend doesn't return button format yet

**What SHOULD happen:**
1. Start conversation: "I want to buy a house in Costa Rica"
2. AI should respond with text + button options:
   - What region? [Pacific Coast] [Central Valley] [Caribbean]
3. Click a button → sends value
4. Next question with more buttons
5. Continue until complete
6. Final: Submit button appears

**Pass Criteria:**
- Buttons appear below AI messages
- Clicking sends value
- Next question appears
- ONE question at a time (not dumping 5)

**To Enable:** Backend team needs to implement (see BACKEND-INTEGRATION.md)

---

### Test 5: Confirmation Modal & Dispatch
**Goal:** Test the full dispatch flow

**⚠️ PARTIALLY BLOCKED:** Submit button needs backend to return it

**What SHOULD happen:**
1. Complete interview (or click conversation starter)
2. AI returns submit_button template
3. Click "Submit & Deploy"
4. Confirmation modal appears with summary
5. Click "Proceed"
6. Shows spinner "Agent working..."
7. After 2 seconds → Success toast

**Expected:**
- Modal has backdrop blur
- Summary text displayed
- Proceed/Cancel buttons
- Spinner during dispatch
- Success toast bottom-right
- Modal closes
- Chat resets

**Pass Criteria:**
- Modal appears and looks good
- Proceed triggers dispatch
- Cancel closes modal
- Success feedback clear
- State resets properly

---

### Test 6: Own Outcome Flow (No Person)
**Goal:** Test starting without selecting anyone

**Steps:**
1. Open copilot (don't select anyone)
2. Click: "🏠 I want to buy a house in Costa Rica"
3. Chat should start

**Expected:**
- No fork (goes straight to chat)
- AI starts interview
- (Would show buttons if backend ready)
- Eventually: Submit button
- Dispatch → Success

**Pass Criteria:**
- Works without person selected
- Chat starts immediately
- Interview flow makes sense

---

### Test 7: Error Handling
**Goal:** Test error states

**Currently:**
- Errors logged to console
- No user-facing error yet

**To Test (when backend integrated):**
- Trigger network error
- Should show ErrorMessage component
- Retry button should work

---

## 🎨 Visual Checklist

### ✅ Modal Appearance
- [ ] 1200px max width, 88vh height
- [ ] Rounded corners (24px)
- [ ] Backdrop blur
- [ ] Top shimmer line
- [ ] Clean header with logo
- [ ] Person picker in header
- [ ] Close button (✕)

### ✅ Chat Messages
- [ ] User messages RIGHT-aligned
- [ ] AI messages LEFT-aligned with avatar
- [ ] Max 480px width
- [ ] Speech bubble style
- [ ] Proper tails (right/left)
- [ ] Box shadows
- [ ] Smooth animations

### ✅ Fork UI
- [ ] Person badge centered
- [ ] Avatar if available
- [ ] Name + title/company
- [ ] Divider line
- [ ] Two big gradient buttons
- [ ] Hover states smooth
- [ ] Sub-fork appears correctly

### ✅ Components
- [ ] ButtonGroup (when backend ready)
- [ ] SubmitButton (when backend returns it)
- [ ] ConfirmationModal
- [ ] SuccessToast (bottom-right)
- [ ] ErrorMessage (inline)

---

## 🐛 Known Issues

### Backend Blockers
1. **Button responses not implemented**
   - Frontend ready, backend needs to return button_group format
   - See: BACKEND-INTEGRATION.md

2. **Submit button not returned by AI**
   - Frontend component ready
   - Backend needs to return submit_button template

3. **Dispatch endpoint not implemented**
   - Currently simulated (2s delay)
   - Need real endpoint spec

### Frontend TODOs
1. Add loading state for initial AI response
2. Add error boundary
3. Test keyboard navigation
4. Test on mobile/tablet
5. Add real demo data (5 contacts from DEMO-CONTACTS.md)

---

## 📊 Test Results Template

```markdown
## Test Session: [Date]
**Tester:** [Name]
**Environment:** [Dev/Staging/Prod]

### Test 1: Message UI ✅/❌
- [ ] Messages aligned correctly
- [ ] Width constrained
- [ ] Bubbles styled properly
**Notes:**

### Test 2: Dynamic Starters ✅/❌
- [ ] No person: Shows own-outcome starters
- [ ] Person selected: Shows person-specific starters
**Notes:**

### Test 3: Fork ✅/❌
- [ ] Appears when person selected
- [ ] Main fork works
- [ ] Sub-fork works
- [ ] Back button works
**Notes:**

### Test 4: Button Interview ⚠️ BLOCKED
**Status:** Waiting for backend

### Test 5: Confirmation & Dispatch ✅/❌
- [ ] Modal appears
- [ ] Proceed works
- [ ] Success toast shows
**Notes:**

### Test 6: Own Outcome ✅/❌
- [ ] Works without person
- [ ] Chat starts correctly
**Notes:**

### Bugs Found:
1. [Description]
2. [Description]

### Overall: ✅ Pass / ❌ Fail / ⚠️ Partial
```

---

## 🎯 Success Criteria

**For Demo-Ready:**
- [x] Message UI looks professional ✅
- [x] Fork flow works smoothly ✅
- [ ] Button interview works (BLOCKED - backend)
- [x] Confirmation modal works ✅
- [x] Success feedback clear ✅
- [ ] 5 demo contacts loaded (needs data)
- [ ] Backend integration complete (in progress)

**For Production-Ready:**
- [ ] All backend endpoints working
- [ ] Real data integrated
- [ ] Error handling complete
- [ ] Loading states polished
- [ ] Mobile responsive
- [ ] Accessibility checked
- [ ] Performance optimized

---

## 📅 Next Steps

**Immediate:**
1. Get backend button responses working
2. Add 5 demo contacts (from DEMO-CONTACTS.md)
3. Test all flows with real data

**This Weekend:**
1. Backend coordination
2. Full testing pass
3. Bug fixes

**Before Thursday Feb 27:**
1. Integration with Charles
2. Final polish
3. Demo walkthrough

---

**Questions?** See STATUS.md, BACKEND-INTEGRATION.md, or DONE-TODAY.md
