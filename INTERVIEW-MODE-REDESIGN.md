# Interview Mode Redesign - Conversational & Integrated

**Date:** Feb 23, 2026 - 11:00 PM  
**Issue:** Current full-screen overlay is too aggressive, hijacks experience, not usable  
**Goal:** Make it conversational, inline, dynamic, world-class UX

---

## Current Problems

1. **Full-screen modal blocks everything** - User can't see chat history
2. **Feels like a separate app** - Not integrated into conversation
3. **Too rigid** - Form-like, not conversational
4. **Hijacks the flow** - Takes over entire interface
5. **Not dynamic** - Doesn't adapt to context

---

## New Approach: Conversational Interview

### Core Principle
**The interview IS the conversation.** No separate modal. No blocking overlay. Just natural back-and-forth in the chat.

### How It Works

**User types:** "I want to help someone"

**Backend detects:** Exploratory intent

**Backend responds with inline card:**
```
┌─────────────────────────────────────┐
│ 🎯 Let's get started                │
│                                      │
│ Who would you like to help?        │
│                                      │
│ [Search your network...            ]│
│                                      │
│ Or browse:                          │
│ • Recent contacts                   │
│ • Strongest connections             │
│ • People you've helped before       │
└─────────────────────────────────────┘
```

**User selects person OR types name**

**Backend responds:**
```
┌─────────────────────────────────────┐
│ Great! What outcome for Mark?       │
│                                      │
│ Quick ideas:                        │
│ • Help them find a job              │
│ • Connect with investors            │
│ • Introduce to experts              │
│ • Find partnership opportunities    │
│                                      │
│ Or tell me what you have in mind... │
└─────────────────────────────────────┘
```

**User types:** "Help him find seed investors"

**Backend responds:**
```
┌─────────────────────────────────────┐
│ Perfect. Any specific constraints?  │
│                                      │
│ Examples:                           │
│ • Geographic location               │
│ • Industry focus                    │
│ • Investment stage                  │
│                                      │
│ [Optional - type details or skip]   │
│                                      │
│ [Skip] [Continue]                   │
└─────────────────────────────────────┘
```

**User types details OR skips**

**Backend responds with dispatch card:**
```
┌─────────────────────────────────────┐
│ ✨ Ready to dispatch                │
│                                      │
│ I'll help Mark Pederson find seed   │
│ investors focused on social graph   │
│ products in SF Bay Area.            │
│                                      │
│ [Edit] [Dispatch]                   │
└─────────────────────────────────────┘
```

---

## Technical Implementation

### Phase 1: Remove InterviewPanel Component
- Delete full-screen overlay
- Remove blocking modal approach
- Let chat flow naturally

### Phase 2: Backend-Driven Interview
Move logic to backend system prompt:

```typescript
// In xano.ts /chat endpoint system prompt
When user has exploratory intent:
1. First message: Ask who to help
   - Include person picker card
   - Or accept name in text

2. Second message: Ask what outcome
   - Show 4 example buttons
   - Or accept freeform text

3. Third message (optional): Ask for constraints
   - Show examples
   - Include skip button

4. Fourth message: Show dispatch confirmation card
   - Summary of request
   - Edit/Dispatch buttons
```

### Phase 3: Inline Cards (Not Modals)

**PersonPickerCard** (inline in chat):
```tsx
<div style={{
  maxWidth: "500px",
  background: "rgba(99,102,241,0.08)",
  border: "1px solid rgba(99,102,241,0.2)",
  borderRadius: "12px",
  padding: "16px",
  margin: "12px 0",
}}>
  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
    Who would you like to help?
  </div>
  <PersonPicker compact inline />
</div>
```

**QuestionCard** (inline in chat):
```tsx
<div style={{
  maxWidth: "500px",
  background: "rgba(99,102,241,0.08)",
  border: "1px solid rgba(99,102,241,0.2)",
  borderRadius: "12px",
  padding: "16px",
  margin: "12px 0",
}}>
  <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
    {question}
  </div>
  
  {examples && (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
      {examples.map(ex => (
        <button key={ex} onClick={() => handleExample(ex)}>
          {ex}
        </button>
      ))}
    </div>
  )}
  
  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
    {helpText}
  </div>
</div>
```

---

## User Experience Flow

**Before (Current - BAD):**
1. User types message
2. **BOOM** - Full screen modal covers everything
3. User forced into form-like flow
4. Can't see chat history
5. Feels disconnected from conversation

**After (New - GOOD):**
1. User types message
2. Backend responds with inline card
3. User can still see full chat history
4. Can type naturally OR click buttons
5. Feels like guided conversation
6. Can scroll up to see context
7. Can skip any step
8. Chat history preserved

---

## Visual Design

### Key Principles

1. **Inline, not overlay** - Cards in the chat stream
2. **Subtle suggestions** - Not blocking
3. **Always visible history** - Can scroll to see context
4. **Buttons are shortcuts** - Can always type instead
5. **Skip anytime** - Not forced
6. **Progressive** - One question at a time
7. **Context-aware** - Adapts to what user said

### Card Styling

```css
/* Inline interview card */
.interview-card {
  max-width: 500px;
  background: linear-gradient(135deg, 
    rgba(99,102,241,0.08), 
    rgba(139,92,246,0.06)
  );
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 12px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Example buttons */
.interview-example {
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.interview-example:hover {
  background: rgba(99,102,241,0.25);
  transform: translateY(-1px);
}
```

---

## Implementation Plan

### Immediate (Tonight - 2 hours)

1. **Remove InterviewPanel.tsx** - Delete the overlay component
2. **Remove interview modal logic** - Clean up page.tsx
3. **Keep intent classifier** - Still useful for backend
4. **Keep useInterviewFlow** - But use differently

### Tomorrow (2-3 hours)

1. **Create inline card components:**
   - PersonPickerCard (compact, in-chat)
   - QuestionCard (with examples)
   - ConfirmCard (dispatch summary)

2. **Update backend system prompt:**
   - Add interview flow logic
   - Return appropriate cards
   - Track state server-side

3. **Wire up message handling:**
   - Detect interview state
   - Route responses appropriately
   - Maintain conversation flow

### Polish (1 hour)

1. Smooth transitions
2. Loading states
3. Error handling
4. Skip flow refinement

---

## Success Criteria

**Must Have:**
- [ ] No full-screen blocking modal
- [ ] All interview UI inline in chat
- [ ] User can see chat history at all times
- [ ] Feels like natural conversation
- [ ] Can type freely OR use buttons
- [ ] Skip functionality preserved
- [ ] Smooth, not jarring

**Should Have:**
- [ ] Adapts to context (partial intents)
- [ ] Quick for power users
- [ ] Helpful for exploratory users
- [ ] Beautiful, premium design
- [ ] Subtle animations

**Nice to Have:**
- [ ] Smart defaults based on history
- [ ] Context suggestions
- [ ] Learning from patterns

---

## Examples of Good Conversational UI

**ChatGPT with DALL-E:**
- Asks questions inline
- Shows options as buttons
- Doesn't block chat
- Natural flow

**Claude Artifacts:**
- Creates without hijacking
- Shows preview inline
- Can continue chatting
- Smooth integration

**Notion AI:**
- Asks clarifying questions inline
- Suggestions as subtle cards
- Never blocks interface
- Feels collaborative

---

## What We're Building

Think: **Guided conversation, not a form**

**User:** "I want to help someone"  
**Copilot:** *[Inline card with PersonPicker]*  
**User:** *Selects Mark*  
**Copilot:** "Great! What outcome for Mark?"  
**User:** "Help him find investors"  
**Copilot:** *[Shows dispatch card]*  
**User:** *Clicks dispatch*  
**Copilot:** "On it! I'll find relevant investors..."  

**The entire conversation is visible. No hijacking. Just natural flow.**

---

## Next Steps

**Decision needed:**
1. Remove overlay tonight (2h) and ship improved version
2. OR rebuild completely tomorrow (5-6h total)

**My recommendation:** Remove overlay tonight, make it usable, iterate tomorrow.

The current version is unusable because of the full-screen modal. Fixing that is priority #1.

---

**Status:** Awaiting approval to proceed with redesign

