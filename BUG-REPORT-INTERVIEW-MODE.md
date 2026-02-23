# Bug Report: Interview Mode Not Rendering

**Date:** Feb 23, 2026, 5:00 PM EST  
**Branch:** `feature/complete-checklist-feb23`  
**Commit:** `17e9579`

---

## 🐛 Bug Summary

Interview Mode logic is triggering correctly but the InterviewPanel UI component is NOT rendering when it should.

## 📸 Evidence

**Test performed:**
1. Opened localhost:3000
2. Pressed Cmd+K to open Copilot modal
3. Typed: "I want to help someone"
4. Pressed Enter

**Expected behavior:**
- Purple InterviewPanel overlay appears
- Progress bar shows "Step 1 of 4"
- PersonPicker component displays
- Question: "Who would you like to help?"

**Actual behavior:**
- Input field clears
- UI resets to homepage welcome screen
- No InterviewPanel visible
- No chat response at all
- No user message bubble showing

**Screenshots:**
- `/tmp/orbiter-05-interview-started.png` - 2 seconds after Enter
- `/tmp/orbiter-06-interview-panel.png` - 3 seconds after Enter
- Both show homepage, no interview panel

---

## 🔍 Root Cause Analysis

### What's Working ✅

1. **Intent Classification**
   - Prompt "I want to help someone" correctly classified as `exploratory`
   - Code path reaches interview trigger block
   - File: `app/page.tsx` lines 168-194

2. **State Machine Logic**
   - `useInterviewFlow` hook exists and is initialized
   - `processInput()` function should set `active: true`
   - File: `app/hooks/useInterviewFlow.ts` lines 107-111

3. **Component Structure**
   - InterviewPanel component exists and compiles
   - Conditional render: `{interview.state.active && (<InterviewPanel...)`
   - File: `app/page.tsx` lines 605-700

### What's Broken ❌

**The InterviewPanel is NOT rendering despite state.active supposedly being true.**

### Likely Causes (Priority Order)

#### 1. **State Update Not Triggering Re-render** ⚠️ MOST LIKELY

**Problem:** When `interview.processInput()` is called inside `processMessageWithInterview`, it calls `setState({active: true, ...})`. But this state update happens INSIDE the async function that's processing the message. By the time the state updates, the empty streaming response has already been returned to CrayonChat.

**Evidence:**
- Empty response returned immediately: Lines 184-192 in `app/page.tsx`
- CrayonChat might be resetting UI when it receives empty response
- No error in console (would show if component crashed)
- UI returns to initial state (suggests reset, not crash)

**Fix:** Force immediate state update BEFORE returning response, or use a synchronous state setter.

---

#### 2. **CrayonChat Closing Modal on Empty Response** ⚠️ POSSIBLE

**Problem:** CrayonChat receives an empty streaming response (no text, no cards) and interprets this as "conversation ended" or "error" and closes/resets the modal.

**Evidence:**
- Modal appears to close (UI resets to homepage)
- `CopilotModal` has `if (!open) return null` at line 226
- If modal closes, InterviewPanel inside it also disappears

**Fix:** Don't return empty response. Return a text message like "Starting interview..." or keep stream open.

---

#### 3. **React State Batching Issue** ⚠️ LESS LIKELY

**Problem:** React 18+ batches state updates in event handlers, but async functions might not batch correctly. The `interview.state.active` check happens before the setState completes.

**Evidence:**
- `processMessageWithInterview` is an async callback
- State update happens inside Promise chain
- Render might execute before state commits

**Fix:** Use `flushSync` to force immediate state update, or redesign flow to be synchronous.

---

#### 4. **Z-Index or CSS Positioning Issue** ❌ UNLIKELY

**Problem:** InterviewPanel is rendering but hidden behind other elements.

**Evidence Against:**
- InterviewPanel has `zIndex: 2000` (highest)
- CopilotModal has `zIndex: 1000` (lower)
- No overlapping backdrops visible in screenshots
- Would still see SOME visual artifact if rendering

**Not the issue.**

---

## 🔧 Recommended Fixes

### Fix #1: Add Intermediate Text Response (QUICK FIX)

Instead of returning empty response, return a text message to keep chat alive:

```typescript
if (intent.type === "exploratory" || intent.type === "partial") {
  console.log('[Interview] Triggering interview mode');
  
  // Start interview flow
  const action = interview.processInput(...);
  
  // Return text response to keep chat alive
  const stream = new ReadableStream({
    start(controller) {
      const text = "Let's get started! ";
      controller.enqueue(new TextEncoder().encode(`event: text\ndata: ${text}\n\n`));
      controller.close();
    }
  });
  
  return new Response(stream);
}
```

**Pros:** Simple, keeps CrayonChat happy  
**Cons:** Shows text before interview panel (might be confusing)

---

### Fix #2: Force Synchronous State Update (BETTER FIX)

Use `flushSync` to force immediate state commit:

```typescript
import { flushSync } from 'react-dom';

if (intent.type === "exploratory" || intent.type === "partial") {
  // Force immediate state update
  flushSync(() => {
    interview.processInput(...);
  });
  
  // Now state is guaranteed to be updated
  // Return empty response
  return new Response(...);
}
```

**Pros:** Guarantees state is updated before response returns  
**Cons:** Requires React DOM import, breaks React's batching optimization

---

### Fix #3: Move Interview State to Parent Component (BEST FIX)

Move `useInterviewFlow()` hook from `CopilotModal` to parent component and pass it as prop. This ensures state persists even if modal re-renders.

**Changes:**
1. In main component (line ~1000):
   ```typescript
   const interview = useInterviewFlow();
   ```

2. Pass to CopilotModal as prop:
   ```typescript
   <CopilotModal
     interview={interview}
     processMessage={processMessage}
     ...
   />
   ```

3. Update CopilotModalProps interface:
   ```typescript
   interface CopilotModalProps {
     interview: ReturnType<typeof useInterviewFlow>;
     ...
   }
   ```

4. Remove `useInterviewFlow()` call from inside CopilotModal

**Pros:**  
- State persists across modal open/close  
- No async issues  
- Cleaner architecture  

**Cons:**  
- More refactoring  
- ~30 minutes of work

---

## 🧪 Testing the Fix

After implementing ANY fix, test with:

```bash
python3 /tmp/test_interview_simple.py
```

**Success criteria:**
- Screenshot 05 or 06 shows purple InterviewPanel overlay
- Progress bar visible
- PersonPicker component visible
- Question text visible

**If still broken:**
- Check browser console for errors (Cmd+Option+I)
- Add more console.log statements
- Verify `interview.state.active === true` in React DevTools

---

## 📊 Priority

**Severity:** HIGH - Interview mode is 100% non-functional  
**Impact:** Cannot demo on Thursday (Feb 27)  
**Urgency:** CRITICAL - need fix today  

**Recommended Action:** Implement Fix #1 immediately (5 minutes), then Fix #3 properly (30 minutes)

---

## 🎯 Next Steps

1. **Immediate (5 min):** Add text response to keep modal alive (Fix #1)
2. **Short-term (30 min):** Move interview state to parent (Fix #3)
3. **Testing (10 min):** Run automated test, verify screenshots
4. **Verification (5 min):** Manual test in browser
5. **Commit & Push:** Document fix in commit message

**Total time to working demo:** ~50 minutes

---

**Status:** Bug identified, fixes proposed, awaiting implementation

