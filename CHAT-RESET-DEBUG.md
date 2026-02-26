# Chat Reset Bug - Debug Investigation

## Robert's Feedback
> "This is the page after doing leverage loops and then you choose to help the person and then you come back to be reset here???"

Pointing at: WelcomeScreen after completing flow

## Expected Flow
1. Open Copilot modal
2. Select "Leverage Loops" mode
3. Search and select person (e.g., Ray Deck)
4. Fork appears: "Direct dispatch" OR "Help with specific task"
5. Click "Help with specific task"
6. Interview starts (4-5 questions)
7. Complete interview → Dispatch button appears
8. Click Dispatch → Modal shows
9. Confirm dispatch → Waiting room appears
10. Process completes → Navigate to Outcomes tab
11. **BUG:** Come back to modal → Chat is reset to WelcomeScreen

## Actual Flow (Bug)
Somewhere between steps 9-11, the chat conversation gets reset.

## State Management Analysis

### `hasStartedConversation` State
Controls whether chat shows welcome screen or conversation interface.

**Sets to TRUE:**
- Line 153: When `showFork` becomes false AND `selectedPerson` exists
- Line 535: When ModeStartScreen submits (Meeting/Outcomes modes)

**Sets to FALSE:**
- Line 468: When switching modes (if mode !== 'default')

### `chatKey` Ref
Controls CrayonChat component remounting (resetting conversation).

**Increments:**
- Line 472: When switching modes (if mode !== selectedMode)

### Hypothesis 1: Modal Close/Reopen
When modal closes after dispatch, does reopening it reset state?

**Test:** Check if `modalOpen` changing causes state reset

### Hypothesis 2: Tab Navigation
After dispatch completes, it navigates to Outcomes tab.
Does this trigger a mode switch?

**Code:** Line 639: `onTabChange?.("outcomes")`
**Issue:** This doesn't change `selectedMode` in CopilotModal

### Hypothesis 3: Person State Lost
Does `selectedPerson` get cleared somewhere?

**Clears person:**
- Line 916: `handlePersonClear()` 
- Line 471: `onPersonClear()` when switching modes

### Most Likely Cause
Line 468-472:
```typescript
if (mode !== selectedMode) {
  setSelectedMode(mode);
  setHasStartedConversation(mode === 'default');  // ← Sets to FALSE for leverage mode
  setPromptToSend(null);
  onPersonClear();  // ← Clears person
  chatKey.current += 1;  // ← Resets chat
}
```

If anything triggers a mode change (even to the same mode?), this resets everything.

## Proposed Fix

**Option 1: Preserve conversation state**
Don't reset `hasStartedConversation` if mode is the same:
```typescript
if (mode !== selectedMode) {
  const wasInConversation = hasStartedConversation;
  setSelectedMode(mode);
  setHasStartedConversation(wasInConversation || mode === 'default');
  // ... rest
}
```

**Option 2: Don't clear person on same mode**
Only clear person if actually switching modes:
```typescript
if (mode !== selectedMode) {
  setSelectedMode(mode);
  setHasStartedConversation(mode === 'default');
  setPromptToSend(null);
  
  // Only clear person if switching TO a different mode
  if (selectedMode !== mode) {
    onPersonClear();
    chatKey.current += 1;
  }
}
```

**Option 3: Never reset during leverage flow**
If in leverage mode with person selected, preserve state:
```typescript
if (mode !== selectedMode) {
  setSelectedMode(mode);
  
  // Preserve conversation if switching within same mode or has active person
  const shouldPreserve = selectedPerson || (mode === selectedMode);
  setHasStartedConversation(shouldPreserve || mode === 'default');
  
  if (!shouldPreserve) {
    onPersonClear();
    chatKey.current += 1;
  }
}
```

## Testing Needed
1. Complete full leverage loop flow
2. After dispatch, navigate away
3. Return to modal
4. Verify chat conversation persists
5. Verify person context visible
6. Verify can continue conversation

## Questions for Robert
1. Does this happen every time after dispatch?
2. Or only when you close and reopen the modal?
3. Or only after navigating to Outcomes tab and back?
4. Does the dispatch confirmation modal close properly?
