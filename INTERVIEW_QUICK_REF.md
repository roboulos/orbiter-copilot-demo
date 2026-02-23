# Interview-First Copilot: Quick Reference

**Use this during implementation and demos**

---

## 🎯 The Core Concept

**OLD:** Command Executor (user types → agent executes)  
**NEW:** Super Interviewer (user types → agent clarifies → user confirms → execute)

---

## 👥 Two User Paths

### Hardcore User (Power)
- Complete, specific commands
- 1-2 questions max
- Fast-track to dispatch

### Explorer User (Guided)
- Vague or exploratory prompts
- 4-6 clarifying questions
- Guided to clarity

---

## 🔍 Three Intent Types

| Type | Has Person? | Has Outcome? | Has Details? | Questions | Example |
|------|-------------|--------------|--------------|-----------|---------|
| **Complete** | ✅ | ✅ | ✅ (8+ words) | 1-2 | "Help Ray Deck find seed investors for Orbiter who've invested in social graph products" |
| **Partial** | ✅ or ✅ | ✅ or ✅ | ❌ | 2-4 | "I want to help Ray with something" |
| **Exploratory** | ❌ | ❌ | ❌ | 4-6 | "I want to help someone" |

---

## 💬 Interview Flow Patterns

### Exploratory → Partial → Complete

```
❓ EXPLORATORY:
"I want to help someone"
  → What goal? (help | find | discover | meeting prep)
  → Who? (PersonPicker)
  → What outcome? (with examples)
  → Any constraints? (optional)
  → Confirm & Dispatch

❓ PARTIAL:
"I want to help Ray with something"
  → What specific outcome? (with examples)
  → Clarifying detail (hiring vs consulting vs partnership)
  → Confirm & Dispatch

✅ COMPLETE:
"Help Ray Deck find graph database experts for Orbiter"
  → (Optional: 1 question if ambiguous)
  → Confirm & Dispatch
```

---

## 🛠️ Key Components

### QuestionCardEnhanced
- Clear question text
- Help icon → expandable explanation
- "I don't know" button → triggers examples
- Input field with suggestions
- PersonPicker dropdown (when needed)

### QuickResultCard
- **Title:** Leverage Loop: [Brief Title]
- **Summary:** 2-3 sentence plain English
- **Search Criteria:** Bulleted list
- **Next Steps:** What will happen
- **Estimated Time:** 3-5 minutes
- **Buttons:** [Dispatch] [Refine]

### ProgressTracker
```
[●] Identify person → [●] Clarify outcome → [○] Confirm → [○] Dispatch
```

---

## 📝 Conversation Style Rules

✅ **DO:**
- Concise questions (no walls of text)
- One question at a time
- Conversational tone (smart assistant, not robot)
- Provide 3-4 examples for open-ended questions
- Show progress through flow

❌ **DON'T:**
- Ask multiple questions at once
- Use jargon or technical language
- Repeat yourself
- Make assumptions about what user wants
- Auto-execute without confirmation

---

## ⚡ Interrupt Protocol

**If user says: "just do it" | "skip this" | "whatever makes sense"**

→ Show ForkInTheRoad card:

**Option 1: Quick Scan (30 sec)**
Analyze context, suggest best move

**Option 2: Guide Me (2-3 min)**
Ask a few questions to pinpoint need

---

## 🧪 Test Scenarios

1. ✅ **Vague** → "I want to help someone" (4-6 questions)
2. ✅ **Partial** → "Help Ray with something" (2-4 questions)
3. ✅ **Specific** → "Help Ray find graph database experts" (1-2 questions)
4. ✅ **Complete** → "Help Ray find seed investors who've invested in social graphs" (immediate)
5. ✅ **Interrupt** → Start vague → "just do it" (fork in road)

---

## 🎬 Demo Script (2-3 minutes)

**For Charles meeting (Feb 27 @ 9 AM):**

1. **Open copilot**
   - Show clean, premium interface

2. **Type vague request:**
   - "I want to help Ray with something"

3. **Walk through flow:**
   - **Q1:** "What specific outcome are you looking for with Ray?"
     → User: "Find graph database experts"
   - **Q2:** "Are these for hiring, consulting, or partnerships?"
     → User: "Consulting"
   - **Q3:** "What's the specific technical challenge?"
     → User: "Evaluating FalkorDB for production"

4. **Show summary card:**
   - Quick result card with clear summary
   - Search criteria visible
   - Estimated time shown

5. **Dispatch:**
   - Click "Dispatch & Track"
   - Show confetti animation
   - Navigate to Outcomes tab
   - **Point out:** "This is now running in the background"

---

## 🔧 Implementation Checklist

### Phase 1: System Prompt (2-3h)
- [ ] Add interview-first protocol to xano.ts comments
- [ ] Define 3 intent types
- [ ] Specify flows for each type
- [ ] Add interrupt protocol

### Phase 2: Intent Classifier (1h)
- [ ] Create `classifyUserIntent()` function in dispatch.ts
- [ ] Test with all 5 scenarios
- [ ] Verify confidence scores

### Phase 3: Conversation Starters (30min)
- [ ] Update defaultStarters in page.tsx
- [ ] Shift from action to exploration
- [ ] Test with/without person selected

### Phase 4: State Management (2h)
- [ ] Add interviewState to page.tsx
- [ ] Track: identifying_person | clarifying_outcome | extracting_context | confirming
- [ ] Update processMessage to include interview_mode

### Phase 5: Testing (2-3h)
- [ ] Test all 5 scenarios
- [ ] Measure turn counts
- [ ] Verify UI polish

---

## 📊 Success Criteria

**User Experience:**
- Clarity rate: >80% (dispatches succeed)
- Refinement rate: 20-30% (users edit before dispatch)
- Abandonment rate: <10% (users complete flow)

**Conversation Quality:**
- Avg turns: 2-4 for partial, 4-6 for exploratory
- Question effectiveness: Track which questions help most

**Speed vs Quality:**
- Power users: 1-2 turns
- Exploratory users: 4-6 turns acceptable

---

## 🚨 Critical Reminders

1. **Always confirm before dispatch** — Never auto-execute without showing summary
2. **Respect user impatience** — Offer quick scan when they say "just do it"
3. **Show your work** — Let users see what you're analyzing
4. **Provide examples** — Always give 3-4 concrete options
5. **One question at a time** — Don't overwhelm

---

## 📚 Full Documentation

- **Requirements:** INTERVIEW_FIRST_REQUIREMENTS.md (13KB)
- **Examples:** INTERVIEW_EXAMPLES.md (13KB)
- **Implementation:** IMPLEMENTATION_GUIDE.md (19KB)
- **Summary:** INTERVIEW_FIRST_SUMMARY.md (8KB)

---

## 💡 Quick Wins

### For Demo:
- Use Ray Deck example (Mark already knows him)
- Show vague → guided → dispatch flow
- Highlight "2-3 minute conversation" timing
- Emphasize "super interviewer" positioning

### For Mark:
- "This is the interview-first approach you requested"
- "Serves both hardcore and explorer users"
- "Quality over speed — higher success rate"

### For Charles:
- Show technical implementation
- Explain intent classification
- Demonstrate state management
- Walk through system prompt additions

---

**Last Updated:** Feb 23, 2026  
**Estimated Total Time:** 8-12 hours  
**Demo Ready:** 1-2 days after implementation  
**Production Ready:** End of week

---

🎯 **Remember:** You're building a SUPER INTERVIEWER, not a command executor!
