# Agentation Feedback Fixes

## Priority Order

### CRITICAL
1. **#4 - Chat reset bug** - After completing leverage loop, chat resets to welcome screen
2. **#2 - PersonPicker too low** - Feels like afterthought at bottom

### HIGH  
3. **#1 - CopilotModal styling** - Plain/ugly modal needs visual upgrade
4. **#5 - Calendar integration** - Meeting Prep missing calendar connection

### MEDIUM
5. **#3 - WelcomeScreen styling** - Plain chat welcome screen
6. **#6 - Outcomes flow** - Needs testing/work

---

## Fix #2: PersonPicker Positioning (QUICK WIN)

**Issue:** "should be up higher... feels like an afterthought"

**Location:** `app/page.tsx` line 486-490

**Current:**
```tsx
padding: "120px 48px 80px",  // 120px top padding pushes it way down
justifyContent: "center",     // Centers vertically
```

**Fix:**
```tsx
padding: "40px 48px 80px",    // Much less top padding
justifyContent: "flex-start", // Align to top instead of center
```

**Impact:** PersonPicker appears immediately, feels intentional not afterthought

---

## Fix #1: CopilotModal Styling (HIGH PRIORITY)

**Issue:** "looks ugly needs to be better looking... so plain"

**Current:** Basic modal with gradient background
**Needed:** Premium Linear-style modal

**Changes:**
1. Better backdrop blur
2. Subtle animations on mode cards
3. Gradient accents
4. Hover states on all buttons
5. Smooth transitions

---

## Fix #4: Chat Reset Bug (CRITICAL - INVESTIGATE)

**Issue:** "after doing leverage loops... you come back to be reset here???"

**Hypothesis:** After dispatch/waiting room, something triggers chat reset

**Investigation needed:**
1. Check if `chatKey.current` increments somewhere unexpected
2. Check if modal close triggers state reset
3. Check if navigation to Outcomes tab clears chat state
4. Verify conversation history persists through dispatch flow

**Possible culprits:**
- Line 472: `chatKey.current += 1` on mode switch
- Waiting room completion might trigger unexpected reset
- Modal state management

---

## Fix #5: Calendar Integration (BACKEND + FRONTEND)

**Issue:** "don't we need to be connecting the calendar here?"

**Required:**
1. Backend: Calendar API endpoint (already exists?)
2. Frontend: Fetch upcoming meetings
3. UI: Display calendar events in Meeting Prep start screen
4. Flow: Click meeting → load context automatically

**Files to modify:**
- `app/components/ModeStartScreen.tsx` - Add calendar display
- `app/lib/xano.ts` - Add calendar fetch function
- Backend API - Verify endpoint exists

---

## Implementation Order

1. **Fix #2 (5 min)** - Quick padding adjustment
2. **Fix #1 (30 min)** - Modal styling improvements  
3. **Fix #4 (60 min)** - Debug and fix chat reset
4. **Fix #5 (90 min)** - Calendar integration
5. **Fix #3 (30 min)** - Welcome screen styling
6. **Fix #6 (TBD)** - Outcomes flow testing

**Total estimated time:** 3-4 hours for critical fixes

---

## Testing Checklist

- [ ] PersonPicker appears high on screen
- [ ] Modal looks premium (not plain)
- [ ] Chat persists through dispatch flow
- [ ] Calendar shows in Meeting Prep
- [ ] Welcome screen looks better
- [ ] Outcomes flow works end-to-end

