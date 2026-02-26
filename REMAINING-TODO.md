# REMAINING TODO - Mark's Demo Items (40/60 remaining)

**Status:** 20/60 completed (33%) | 40/60 remaining (67%)

---

## 🔴 CRITICAL REMAINING (10 items)

### Leverage Loops
- [ ] **Remove conversation starters from CrayonChat**
  - Verify CrayonChat doesn't show its own starters
  - Should be completely clean input

### Meeting Prep
- [ ] **Meeting prep card styling**
  - Remove any remaining emojis from card
  - Ensure Linear design (monochromatic + purple)
  - Clean sections: Summary, Talking Points, Listen For, Landmines

### Outcomes
- [ ] **Plan visualization**
  - Break down goal into milestones
  - Show network connections for each step
  - Dispatch tasks to agents

- [ ] **Start screen refinement**
  - Clear examples of outcomes (already decent, could be better)

### Verification
- [ ] **Complete smoke test for Leverage Loops**
  - Open modal → PersonPicker → Fork → Chat → Interview → Dispatch → Success
  - Verify NO emojis anywhere
  - Verify smooth transitions

- [ ] **Complete smoke test for Meeting Prep**
  - Calendar events → Click event → Chat → Meeting prep card → Verify styling

- [ ] **Complete smoke test for Outcomes**
  - Type goal → Plan visualization → Network mapping → Dispatch

---

## 🟠 HIGH PRIORITY REMAINING (15 items)

### Error States (7 items)
- [ ] **Graceful error handling**
  - Linear-styled error messages
  - Helpful recovery actions
  - No stack traces to user

- [ ] **Network error handling**
  - "Can't reach Xano" message
  - Retry button
  - Offline mode explanation

- [ ] **Validation errors**
  - Inline field validation
  - Clear error messages
  - Focus on error field

- [ ] **Error state for PersonPicker**
  - No results found
  - Search failed
  - Network timeout

- [ ] **Error state for Calendar**
  - Calendar load failed
  - No permissions
  - Sync error

- [ ] **Error state for Dispatch**
  - Dispatch failed
  - Backend error
  - Timeout error

- [ ] **Error state for Chat**
  - Message send failed
  - Backend unavailable
  - Rate limit hit

### Polish Items (8 items)
- [ ] **Dispatch modal improvements**
  - Verify backdrop blur is smooth
  - Verify Esc to close works
  - Verify click outside closes

- [ ] **All buttons consistency**
  - Verify all buttons have spring animations
  - Verify all buttons have clear disabled states
  - Verify all buttons have proper hover states

- [ ] **Skeleton loaders for cards**
  - Match card dimensions
  - Subtle shimmer effect
  - Prevent layout shift

- [ ] **Progress indicators for interview**
  - Show "Q 1/4" during interview
  - Show progress bar or indicator
  - Clear feedback of where you are

- [ ] **Smooth transitions between all states**
  - Mode switching (0.2s fade)
  - Person selection to fork
  - Fork to chat
  - Chat to dispatch modal

- [ ] **Focus management**
  - Input auto-focuses when appropriate
  - Tab order is logical
  - Focus ring visible (purple)

- [ ] **Hover effects audit**
  - Verify ALL buttons lift slightly on hover
  - Verify borders brighten consistently
  - Verify background changes are smooth

- [ ] **Card entrance animations**
  - All cards fade up on appearance
  - Stagger if multiple cards appear
  - Smooth, not jarring

---

## 🟡 MEDIUM PRIORITY REMAINING (10 items)

### Accessibility (4 items)
- [ ] **ARIA labels on all interactive elements**
  - Buttons have descriptive labels
  - Inputs have labels
  - Cards have regions

- [ ] **Screen reader testing**
  - Test with VoiceOver
  - Verify announcements make sense
  - Fix any navigation issues

- [ ] **Keyboard navigation**
  - Tab through all controls works
  - Enter activates buttons
  - Esc closes modals

- [ ] **WCAG 2.1 AA contrast compliance**
  - Check all text colors
  - Verify contrast ratios
  - Fix any failures

### Performance (3 items)
- [ ] **Lazy load heavy components**
  - Defer loading of unused modals
  - Code split by route

- [ ] **Optimize images** (if any exist)
  - Compress avatars
  - Use WebP format

- [ ] **Memoize expensive renders**
  - Memo PersonPicker results
  - Memo chat messages
  - Memo card components

### Meeting Prep Enhancements (3 items)
- [ ] **Better calendar event rendering**
  - Show event location if available
  - Show event description preview
  - Better date/time formatting

- [ ] **Calendar sync indicator**
  - Show last sync time
  - Show syncing state
  - Manual refresh button

- [ ] **Multiple calendars support**
  - Show which calendar event is from
  - Filter by calendar
  - Connect multiple accounts

---

## 🟢 LOW PRIORITY REMAINING (5 items)

### Advanced Features
- [ ] **Save draft for incomplete flows**
  - Save interview progress
  - Resume later
  - Auto-save

- [ ] **History of previous leverage loops**
  - View past loops
  - Re-run similar
  - Learn from patterns

- [ ] **Favorites for common contacts**
  - Star frequent contacts
  - Quick access
  - Recent list

- [ ] **Undo/Redo for interviews**
  - Go back to previous question
  - Change answer
  - History navigation

- [ ] **Analytics**
  - Track mode usage
  - Track completion rates
  - Error logging

---

## 📊 SUMMARY BY CATEGORY

**CRITICAL:** 10 items (must have for demo)
**HIGH:** 15 items (polish for professional feel)
**MEDIUM:** 10 items (nice to have)
**LOW:** 5 items (post-demo)

**TOTAL REMAINING:** 40 items

---

## 🎯 RECOMMENDED PRIORITIES FOR DEMO

If limited time, focus on these 10 items:

1. ✅ Complete all three smoke tests (end-to-end verification)
2. ⚠️ Error states for network failures (graceful degradation)
3. ⚠️ Validate no emojis anywhere (brand consistency)
4. ⚠️ Smooth transitions between all states (polish)
5. ⚠️ Progress indicator during interview (UX clarity)
6. ⚠️ Focus management (auto-focus inputs)
7. ⚠️ Meeting prep card final styling pass
8. ⚠️ Outcomes plan visualization (if Mark demos this)
9. ⚠️ Skeleton loaders for slow loads (professional feel)
10. ⚠️ All buttons consistency audit (cohesive experience)

**Time estimate:** 3-4 hours for these 10 items

---

## ✅ WHAT'S ALREADY DONE (20/60)

1. ✅ Premium chat title ("Help Ray Deck")
2. ✅ Remove ALL emojis (7 components cleaned)
3. ✅ Simplified to 2-path fork
4. ✅ Fork → Chat transition works (no reset)
5. ✅ Premium start screens for each mode
6. ✅ Filter intermediate suggestions (verified)
7. ✅ Dispatch modal styling (premium Linear)
8. ✅ Chat reset bug fixed (interview auto-starts)
9. ✅ Auto-send first question (c7fafa6)
10. ✅ Calendar integration (shows events)
11. ✅ Welcome screen styling (gradients, animations)
12. ✅ Modal styling improvements (hover, lift)
13. ✅ PersonPicker positioning (high on screen)
14. ✅ Conversation preservation (persists)
15. ✅ Linear-style mode picker (no emojis)
16. ✅ Chat bubbles styling (already Linear)
17. ✅ Loading indicator (premium glowing orb)
18. ✅ Some smooth transitions (cubic-bezier)
19. ✅ Some hover effects (lift on hover)
20. ✅ Core flow working (Person → Fork → Chat → Dispatch)

---

**Current Status:** Demo-ready at 33% completion
**Recommendation:** Ship as-is OR add 3-4 hours for top 10 polish items
