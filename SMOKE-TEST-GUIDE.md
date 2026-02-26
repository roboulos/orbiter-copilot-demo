# 🧪 SMOKE TEST GUIDE - Before Mark's Demo

**Purpose:** Verify all critical flows work end-to-end before Thursday 9 AM demo

**Time Required:** 15-20 minutes for complete test

---

## 🎯 TEST 1: LEVERAGE LOOPS FLOW

### Setup
1. Open `http://localhost:3000`
2. Click "Open Copilot" button

### Steps
1. **Open Modal**
   - ✅ Modal appears with smooth animation
   - ✅ No emojis visible anywhere
   - ✅ Linear styling (purple accents, gradients)
   - ✅ ModePicker on left side

2. **Select Leverage Loops**
   - ✅ Click "Leverage Loops" in left sidebar
   - ✅ Selected state shows (gradient background, lift effect)
   - ✅ PersonPicker appears HIGH on screen (not bottom)
   - ✅ Title: "Who would you like to help?"

3. **Search Person**
   - ✅ Type "Ray" in search
   - ✅ Results appear quickly
   - ✅ Ray Deck shows in results
   - ✅ Avatar, title, company visible

4. **Select Person**
   - ✅ Click "Ray Deck"
   - ✅ Fork appears with 2 options only
   - ✅ Options: "Direct dispatch" and "Help with specific task"
   - ✅ Person context visible (name, title, company)

5. **Choose Fork Option**
   - ✅ Click "Help with specific task"
   - ✅ Fork closes immediately
   - ✅ Chat starts WITHOUT welcome screen
   - ✅ First AI message appears: "What would you like to help Ray Deck with?"

6. **Complete Interview**
   - ✅ Type: "Find investors"
   - ✅ AI asks 2-4 follow-up questions
   - ✅ NO intermediate suggestion cards appear (critical!)
   - ✅ Answer each question
   - ✅ Dispatch button appears after final answer

7. **Dispatch Confirmation**
   - ✅ Click dispatch button
   - ✅ Modal appears with summary
   - ✅ Shows: Person name, goal, context
   - ✅ Linear styling (blur backdrop, purple accents)
   - ✅ Buttons: "Confirm" and "Cancel"

8. **Confirm Dispatch**
   - ✅ Click "Confirm"
   - ✅ Waiting room appears
   - ✅ Progress indicator shows
   - ✅ Success state or navigation to Outcomes

### Expected Results
- ❌ **NO EMOJIS** anywhere in flow
- ✅ **SMOOTH TRANSITIONS** between all states
- ✅ **NO WELCOME SCREEN** after fork choice
- ✅ **NO INTERMEDIATE SUGGESTIONS** during interview
- ✅ **CONVERSATION PERSISTS** (doesn't reset)

---

## 📅 TEST 2: MEETING PREP FLOW

### Setup
1. Ensure calendar is mocked: `NEXT_PUBLIC_USE_MOCK_CALENDAR=true` in `.env.local`
2. Open `http://localhost:3000`
3. Click "Open Copilot"

### Steps
1. **Select Meeting Prep**
   - ✅ Click "Meeting Prep" in left sidebar
   - ✅ Start screen appears
   - ✅ Title: "Who are you meeting with?"

2. **View Calendar Events**
   - ✅ Section: "Upcoming Meetings" appears
   - ✅ Shows 5 events (mock data)
   - ✅ Each event shows: Title, Date/Time, Attendees
   - ✅ Green highlight for "Today" events
   - ✅ Hover effect on events (lift, shadow)

3. **Click Event**
   - ✅ Click first event (e.g., "Copilot Demo Planning")
   - ✅ Chat input auto-populates
   - ✅ Chat starts immediately
   - ✅ AI provides meeting prep context

4. **Verify Meeting Prep Card** (if backend returns it)
   - ✅ Card shows: Summary, Talking Points, Listen For, Landmines
   - ✅ NO EMOJIS in card
   - ✅ Linear styling throughout
   - ✅ Clean, professional design

### Expected Results
- ✅ Calendar events load (mock data)
- ✅ Events are clickable and responsive
- ✅ Chat starts with meeting context
- ✅ NO EMOJIS in UI
- ✅ Linear styling throughout

### If Calendar NOT Connected
- ✅ Shows message: "Connect your calendar to see upcoming meetings"
- ✅ Provides instructions (click calendar icon in header)
- ✅ No errors or crashes

---

## 🎯 TEST 3: OUTCOMES FLOW

### Setup
1. Open `http://localhost:3000`
2. Click "Open Copilot"

### Steps
1. **Select Outcomes**
   - ✅ Click "Outcomes" in left sidebar
   - ✅ Start screen appears
   - ✅ Title: "What outcome do you want to achieve?"

2. **Enter Goal**
   - ✅ Type: "Raise $4M seed round"
   - ✅ Press Enter or click example
   - ✅ Chat starts immediately

3. **Complete Flow**
   - ✅ AI asks clarifying questions
   - ✅ Provides plan or network suggestions
   - ✅ Can dispatch to agents (if implemented)

### Expected Results
- ✅ Start screen is clear and inviting
- ✅ Examples are helpful
- ✅ Chat starts smoothly
- ✅ Linear styling throughout

---

## 🚨 ERROR STATE TESTS

### Test Network Error
1. Disconnect internet
2. Try to search for person
3. ✅ Error appears: "Connection Lost"
4. ✅ Retry button visible
5. ✅ Linear styling (orange accent)

### Test No Results
1. Search for "zzzzzzz" (invalid name)
2. ✅ Shows: "No person found"
3. ✅ Helpful message
4. ✅ Try again / go back options

### Test Backend Failure
1. Set invalid API URL in `.env.local`
2. Try any flow
3. ✅ Graceful error (no crash)
4. ✅ Recovery options
5. ✅ No stack traces to user

---

## 🎨 VISUAL CHECKLIST

Walk through ANY flow and verify:

### Colors
- [ ] Purple accents (#6366f1) throughout
- [ ] Subtle backgrounds (rgba(255,255,255,0.03))
- [ ] Text hierarchy (95% / 65% / 45% opacity)
- [ ] NO EMOJIS (👤🎯📅🤝💼)

### Animations
- [ ] Smooth modal entrance (0.3s)
- [ ] Button hover lift (-2px)
- [ ] Card fade-in effects
- [ ] Spring animations (cubic-bezier(0.34, 1.56, 0.64, 1))

### Typography
- [ ] Consistent font sizes (14px base, 40px titles)
- [ ] Letter-spacing (-0.02em to -0.03em for large text)
- [ ] Line-height (1.6 for body, 1.2 for headings)
- [ ] Font weight hierarchy (400/500/600)

### Spacing
- [ ] Consistent padding (8px, 16px, 24px, 32px, 48px)
- [ ] Proper gaps between elements
- [ ] No cramped or overly spacious areas

### Interactions
- [ ] All buttons respond to hover
- [ ] All buttons have click feedback
- [ ] Focus states visible (purple ring)
- [ ] Tab order makes sense

---

## ⌨️ KEYBOARD NAVIGATION TEST

1. **Tab Through Modal**
   - [ ] Tab key cycles through all interactive elements
   - [ ] Focus ring visible on each element
   - [ ] Order is logical (top to bottom, left to right)

2. **Enter to Activate**
   - [ ] Enter key activates focused buttons
   - [ ] Enter submits forms
   - [ ] Enter selects options

3. **Escape to Close**
   - [ ] Esc key closes modals
   - [ ] Esc clears focus when appropriate

---

## 📱 RESPONSIVE TEST (Optional)

1. Resize browser window to mobile width (375px)
2. Verify:
   - [ ] Modal fits on screen
   - [ ] Text is readable
   - [ ] Buttons are touch-friendly (44px min)
   - [ ] No horizontal scroll

---

## 🎬 DEMO DAY FINAL CHECK

**30 minutes before demo:**

1. **Test on Mark's Screen**
   - [ ] Open on his laptop resolution
   - [ ] Verify all flows work
   - [ ] Check font sizes are readable

2. **Backup Plan**
   - [ ] Screenshot all states
   - [ ] Have video recording ready
   - [ ] Know how to restart if crashes

3. **Quick Fixes**
   - [ ] Clear browser cache
   - [ ] Restart dev server
   - [ ] Check `.env.local` settings

4. **Talking Points**
   - [ ] Prepare 3-sentence pitch for each flow
   - [ ] Know Mark's favorite features (Linear styling, smooth animations)
   - [ ] Be ready to explain technical decisions

---

## ✅ PASS CRITERIA

### Must Pass (Critical)
- ✅ NO EMOJIS anywhere
- ✅ Interview auto-starts (no welcome screen)
- ✅ NO intermediate suggestions during interview
- ✅ Smooth transitions throughout
- ✅ No crashes or errors

### Should Pass (Important)
- ✅ Calendar events show in Meeting Prep
- ✅ All error states are graceful
- ✅ Keyboard navigation works
- ✅ Focus states visible
- ✅ Linear styling consistent

### Nice to Pass (Polish)
- ✅ Mobile responsive
- ✅ Loading states smooth
- ✅ Accessibility features
- ✅ Performance optimized

---

## 🐛 KNOWN ISSUES

Document any issues found during testing:

1. **Issue:** [Description]
   - **Severity:** Critical / High / Medium / Low
   - **Workaround:** [How to avoid during demo]
   - **Fix ETA:** [When will be fixed]

2. **Issue:** [Description]
   - **Severity:** Critical / High / Medium / Low
   - **Workaround:** [How to avoid during demo]
   - **Fix ETA:** [When will be fixed]

---

**Test Date:** ____________
**Tester:** ____________
**Result:** PASS / FAIL / NEEDS WORK
**Notes:** ____________________________________________
