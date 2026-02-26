# 🎯 COMPLETE TODO LIST - Mark's Demo Requirements

Based on transcript #438 (Feb 24, 2026) and Robert's feedback.

---

## ✅ COMPLETED

### Core Flow
- [x] 4 modes (Chat, Leverage, Meeting, Outcome)
- [x] Linear-style mode picker (no emojis)
- [x] PersonPicker for Leverage mode
- [x] Fork appears after person selection
- [x] Simplified to 2-path fork (removed sub-fork)
- [x] Fork → Chat transition works (no reset)
- [x] Premium start screens for each mode

---

## 🔴 CRITICAL (Must Fix Before Demo)

### 1. Leverage Loops Flow
**Mark's Quote:** "Just a conversation about an interview to understand exactly what you want to help somebody with"

- [ ] **Auto-send first question** when interview starts
  - After clicking "Help with something specific"
  - AI immediately asks: "What would you like to help Ray Deck with?"
  - No empty chat waiting

- [ ] **Premium chat title**
  - Title: "Help Ray Deck" (not just name)
  - Subtitle: "Chief Technology Officer · Element55"
  - Mode badge: "Leverage Loops"

- [ ] **Remove ALL conversation starters**
  - Already removed from defaultStarters
  - Verify CrayonChat doesn't show its own

- [ ] **NO intermediate suggestions** (Mark's critical rule!)
  - Filter out `contact_card`, `leverage_loop_card`, `serendipity_card` during interview
  - Only show after dispatch button clicked

- [ ] **Dispatch confirmation modal**
  - Premium Linear styling
  - Clear summary: "Leverage my network to help Ray Deck find investors"
  - Person context visible
  - Professional buttons

### 2. Meeting Prep Flow
**Mark's Quote:** "Who are you meeting with? → talking points, openers, landmines"

- [ ] **Calendar integration working**
  - Endpoint already exists (verified in transcript)
  - Show upcoming meetings
  - Select meeting → get context

- [ ] **Meeting prep card styling**
  - Remove emojis (📅)
  - Linear design (monochromatic + purple)
  - Clean sections: Summary, Talking Points, Listen For, Landmines

- [ ] **Auto-populate from calendar**
  - "Who are you meeting with?" → show calendar events
  - Click event → load context automatically

### 3. Outcomes Flow
**Mark's Quote:** "Map a goal to an actionable plan through your network"

- [ ] **Start screen refinement**
  - Clear examples of outcomes
  - Goal-oriented language

- [ ] **Plan visualization**
  - Break down goal into milestones
  - Show network connections for each step
  - Dispatch tasks to agents

---

## 🟠 HIGH PRIORITY (Polish)

### 4. Remove ALL Emojis
- [ ] `ContactCard.tsx` - remove 🤝
- [ ] `LeverageLoopCard.tsx` - remove 👤🎯
- [ ] `MeetingPrepCard.tsx` - verify no emojis
- [ ] `OutcomeCard.tsx` - verify no emojis
- [ ] `DispatchReadyCard.tsx` - remove emojis
- [ ] `QuickResultCard.tsx` - verify no emojis
- [ ] `InlineInterviewCard.tsx` - verify no emojis
- [ ] Search all files: `grep -r "👤\|🎯\|📅\|🤝\|💼" app/`

### 5. Linear Styling Throughout
- [ ] **Chat bubbles**
  - User messages: Right-aligned, subtle background
  - AI messages: Left-aligned, purple accent border
  - Monochromatic colors
  - Clean typography (14px, -0.01em)

- [ ] **Cards**
  - All cards use Linear color palette
  - Consistent border radius (8px)
  - Subtle shadows (0 2px 8px -2px rgba(0,0,0,0.08))
  - Purple accents for interactive elements

- [ ] **Buttons**
  - Consistent hover states
  - Spring animations (cubic-bezier(0.34, 1.56, 0.64, 1))
  - Clear disabled states

- [ ] **Modals**
  - Clean backdrop blur
  - Smooth entrance animations
  - Esc to close
  - Focus management

### 6. Loading States
- [ ] **Linear-style spinner**
  - Minimal, elegant
  - Purple color
  - Smooth rotation

- [ ] **Skeleton loaders** for cards
  - Match card dimensions
  - Subtle shimmer effect
  - Prevent layout shift

- [ ] **Progress indicators** for multi-step
  - Interview progress (Q 1/4)
  - Dispatch processing
  - Clear feedback

### 7. Error States
- [ ] **Graceful error handling**
  - Linear-styled error messages
  - Helpful recovery actions
  - No stack traces to user
  - Retry mechanisms

- [ ] **Network error handling**
  - "Can't reach Xano" message
  - Retry button
  - Offline mode explanation

- [ ] **Validation errors**
  - Inline field validation
  - Clear error messages
  - Focus on error field

---

## 🟡 MEDIUM PRIORITY (Enhancement)

### 8. Premium Interactions
- [ ] **Smooth transitions**
  - Fade between states (0.2s)
  - Card entrance animations (fade up)
  - Modal open/close animations

- [ ] **Hover effects consistency**
  - All buttons lift slightly
  - Border brightens
  - Background changes

- [ ] **Focus states**
  - Visible focus ring (purple)
  - Keyboard navigation works
  - Tab order logical

### 9. Accessibility
- [ ] **ARIA labels** on all interactive elements
- [ ] **Screen reader** tested
- [ ] **Keyboard navigation** throughout
  - Tab through all controls
  - Enter to activate
  - Esc to close/cancel
- [ ] **WCAG 2.1 AA** contrast compliance

### 10. Performance
- [ ] **Lazy load** heavy components
- [ ] **Optimize images** (if any)
- [ ] **Debounce** search inputs
- [ ] **Memoize** expensive renders
- [ ] **Code split** routes

---

## 🟢 LOW PRIORITY (Nice to Have)

### 11. Advanced Features
- [ ] **Undo/Redo** for interviews
- [ ] **Save draft** for incomplete flows
- [ ] **History** of previous leverage loops
- [ ] **Favorites** for common contacts

### 12. Mobile Responsive
- [ ] Stack modes vertically
- [ ] Touch-friendly buttons (44px min)
- [ ] No horizontal scroll
- [ ] Proper viewport meta tag

### 13. Analytics
- [ ] Track mode usage
- [ ] Track completion rates
- [ ] Track dispatch success
- [ ] Error logging

---

## 📋 VERIFICATION CHECKLIST

### Demo Day Smoke Test
- [ ] **Open modal** → Clean, no emojis
- [ ] **Click Leverage** → PersonPicker appears
- [ ] **Search "Ray"** → Results show
- [ ] **Select Ray Deck** → Fork appears (2 options only)
- [ ] **Click "Help with specific task"** → Chat starts IMMEDIATELY
- [ ] **First AI message** appears: "What would you like to help Ray with?"
- [ ] **Type "Find investors"** → Interview continues (2-4 questions)
- [ ] **Answer questions** → NO intermediate suggestions shown
- [ ] **Dispatch button** appears after interview
- [ ] **Click Dispatch** → Premium confirmation modal
- [ ] **Confirm** → Success state
- [ ] **All UI** is Linear-styled throughout
- [ ] **No emojis** anywhere in the flow
- [ ] **Smooth** transitions, no jarring moments

### Meeting Prep Test
- [ ] Click Meeting Prep → Start screen
- [ ] Calendar events shown OR type name
- [ ] Meeting prep card appears
- [ ] Shows: Summary, Talking Points, Listen For, Landmines
- [ ] No emojis in card
- [ ] Linear styling throughout

### Outcomes Test
- [ ] Click Outcomes → Start screen
- [ ] Type goal → Plan creation begins
- [ ] Shows milestones and network connections
- [ ] Can dispatch tasks to agents
- [ ] Linear styling throughout

---

## 🎯 MARK'S CRITICAL REQUIREMENTS (From Transcript #438)

### Leverage Loops
> "Just a conversation about an interview to understand exactly what you want to help somebody with"
- ✅ Interview flow exists
- ✅ Two paths: direct OR interview
- ⚠️ Auto-send first question (TODO)
- ⚠️ No intermediate suggestions (TODO - verify filter)

> "Whether it's you or them, but I mean it needs to end up in our UI or close to our UI"
- ✅ Linear design (Mark loves Linear)
- ⚠️ All cards need Linear styling (TODO)

> "Lean and mean and right to the point"
- ✅ Removed sub-fork
- ⚠️ Remove emojis (TODO)
- ⚠️ Simplify chat UI (TODO)

### Meeting Prep
> "Who are you meeting with? → talking points, openers, landmines"
- ⚠️ Calendar integration (TODO - wire up)
- ⚠️ Talking points card (TODO - style)

### Outcomes
> "Map a goal to an actionable plan through your network"
- ⚠️ Plan visualization (TODO)
- ⚠️ Network mapping (TODO)

---

## 📊 COMPLETION STATUS

**Total Items:** 60+
**Completed:** 8 (13%)
**In Progress:** 0
**Remaining:** 52+ (87%)

**Critical Path:**
1. Auto-send first question (30 min)
2. Premium chat title (15 min)
3. Remove all emojis (45 min)
4. Linear style chat bubbles (60 min)
5. Dispatch modal styling (30 min)
6. Filter intermediate suggestions (30 min)
7. Loading states (30 min)
8. Error states (30 min)

**Estimated Time to Complete Critical:** 4-5 hours
**Demo:** Thursday Feb 27 @ 9 AM (less than 36 hours!)

---

## 🚀 EXECUTION PLAN

### Phase 1: CRITICAL (Tonight)
1. Auto-send first question
2. Premium chat title
3. Remove ALL emojis
4. Style chat bubbles
5. Dispatch modal
6. Filter intermediate suggestions

### Phase 2: HIGH (Tomorrow Morning)
7. Loading states
8. Error states
9. Calendar integration
10. Meeting prep card

### Phase 3: MEDIUM (Tomorrow Afternoon)
11. Smooth transitions
12. Accessibility basics
13. Final polish

### Phase 4: VERIFICATION (Tomorrow Evening)
14. Complete smoke test
15. All three flows end-to-end
16. Screenshot all states
17. Demo prep

---

**Next Action:** Start Phase 1, Item 1 (Auto-send first question)
