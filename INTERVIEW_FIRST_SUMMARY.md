# Interview-First Copilot: Executive Summary

**Date:** Feb 23, 2026  
**Author:** Zora (for Robert)  
**Source:** Transcript #430 analysis  
**Status:** Ready for implementation

---

## What Changed

Mark provided clear direction on Feb 23: shift the copilot from a **command executor** to a **super interviewer** that guides users to clarity before acting.

### Mark's Vision (Timestamp 08:31)

> "I do really want I want it to be like the super interviewer like I want I don't want to try to give me the results. I don't because I wanted to try and I think there are two paths there is the that you want to serve both of them."

---

## The Two User Paths

### Path 1: The Hardcore User
- Knows exactly what they want
- Types complete, specific commands
- Gets minimal questions, fast execution
- **Example:** "Help Ray Deck find seed investors for Orbiter who've invested in social graph products. Draft intros."

### Path 2: The Explorer User
- Has a general idea, needs guidance
- Types vague or exploratory prompts
- Gets interview flow with clarifying questions
- **Example:** "I want to help someone with something"

---

## What This Means

### Before (Command-Driven)
```
User: "I want to help Ray"
Copilot: [Creates leverage loop immediately]
User: "Wait, that's not what I meant..."
```

### After (Interview-First)
```
User: "I want to help Ray"
Copilot: "What specific outcome are you looking for with Ray?"
         [Shows examples: find talent, connect with investors, solve technical challenge]
User: "Help him find graph database experts"
Copilot: "Are these for hiring, consulting, or partnerships?"
User: "Consulting on FalkorDB"
Copilot: "Perfect! Here's what I'm about to do: [shows summary]"
         [Dispatch & Track →]
```

---

## Deliverables Created

### 1. Requirements Document
**File:** `INTERVIEW_FIRST_REQUIREMENTS.md` (13KB)
- Complete analysis of Mark's vision
- Two user archetypes documented
- Design principles defined
- Success metrics specified

### 2. Conversation Examples
**File:** `INTERVIEW_EXAMPLES.md` (13KB)
- 6 complete conversation flows
- Real examples using Ray Deck scenario
- Testing checklist included
- Patterns across all examples documented

### 3. Implementation Guide
**File:** `IMPLEMENTATION_GUIDE.md` (19KB)
- Step-by-step technical instructions
- Code snippets for all changes
- 7 phases with time estimates (8-12 hours total)
- Testing scripts included

### 4. This Summary
**File:** `INTERVIEW_FIRST_SUMMARY.md` (this document)
- Executive overview for Mark
- Quick reference for Robert
- Next steps clearly defined

---

## Implementation Phases

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | System Prompt Updates | 2-3h | Ready |
| 2 | Intent Classifier | 1h | Ready |
| 3 | Conversation Starters | 30min | Ready |
| 4 | Interview State Management | 2h | Ready |
| 5 | Testing with Real Examples | 2-3h | Ready |
| 6 | UI Polish | 2-3h | Ready |
| 7 | Documentation | 1h | Ready |

**Total Estimated Time:** 8-12 hours

---

## Key Technical Changes

### 1. System Prompt (xano.ts)
Add comprehensive interview-first protocol to guide the LLM through clarification flows.

### 2. Intent Classification (dispatch.ts)
New function: `classifyUserIntent(prompt)` → Returns "complete" | "partial" | "exploratory"

### 3. State Management (page.tsx)
Track interview progress:
- `identifying_person`
- `clarifying_outcome`
- `extracting_context`
- `confirming`

### 4. Conversation Starters (page.tsx)
Shift from action-oriented to exploration-oriented prompts.

### 5. UI Components
- `QuestionCardEnhanced` — Supports "I don't know" button + help text
- `QuickResultCard` — Two-layer system (Jason's requirement)
- `ProgressTracker` — Shows where user is in flow

---

## Test Scenarios (From Examples)

✅ **Test 1:** Vague request → Full interview (4-6 questions)  
✅ **Test 2:** Partial request → Guided flow (2-4 questions)  
✅ **Test 3:** Specific request → Fast-track (1-2 questions)  
✅ **Test 4:** Complete request → Immediate dispatch  
✅ **Test 5:** Interrupt protocol → Offer quick scan  

---

## Demo Plan (Thursday Feb 27 @ 9 AM with Charles)

### Setup
1. Open copilot on beta.orbiter.io
2. Have Ray Deck's profile ready

### Script
1. **Vague start:** "I want to help Ray with something"
2. **Copilot asks:** "What specific outcome are you looking for?"
3. **User clarifies:** "Find graph database experts"
4. **Copilot asks:** "For hiring, consulting, or partnerships?"
5. **User picks:** "Consulting"
6. **Copilot asks:** "What's the specific technical challenge?"
7. **User provides:** "Evaluating FalkorDB for production"
8. **Copilot confirms:** [Shows quick_result_card with summary]
9. **User dispatches:** [Track in Outcomes tab]

**Expected time:** 2-3 minutes for full flow

---

## Success Metrics (Post-Launch)

### User Experience
- **Clarity rate:** % of dispatches that succeed after interview
- **Refinement rate:** % who edit before dispatching
- **Abandonment rate:** % who start but don't finish

### Conversation Quality
- **Avg turns to dispatch:** 2-4 for partial, 4-6 for exploratory
- **Question effectiveness:** Which questions lead to best outcomes

### Speed vs Quality
- **Power users:** 1-2 turns (fast track working)
- **Exploratory users:** 4-6 turns acceptable if quality high

---

## What Robert Committed To (17:16)

> "I'll put more focus on the interview aspect and then, you know, over the necessarily go through this immediately type of aspect because you know, we're that's what we're focusing on."

This work delivers on that commitment.

---

## Open Questions for Mark

1. **Auto-dispatch threshold:** Should "complete" intent auto-dispatch or always confirm first?
2. **Learning from history:** Should copilot remember user preferences (e.g., minimal questions for power users)?
3. **Multi-person loops:** How to handle "help 5 people find jobs"?
4. **Context enrichment:** Should copilot proactively suggest outcomes based on transcript data?

---

## Next Steps

### For Robert
1. ✅ Review requirements document
2. ⏳ Implement Phase 1-2 (system prompt + intent classifier) — 3-4 hours
3. ⏳ Test with Ray Deck example
4. ⏳ Demo to Mark for feedback
5. ⏳ Complete remaining phases

### For Mark
1. ⏳ Review this summary + examples document
2. ⏳ Provide feedback on conversation flows
3. ⏳ Answer open questions above
4. ⏳ Approve demo plan for Charles meeting

---

## Files Created

All documents are in: `/Users/robertboulos/.openclaw/workspace/projects/orbiter-copilot-demo/`

1. `INTERVIEW_FIRST_REQUIREMENTS.md` — Full requirements (13KB)
2. `INTERVIEW_EXAMPLES.md` — 6 conversation flows (13KB)
3. `IMPLEMENTATION_GUIDE.md` — Technical implementation (19KB)
4. `INTERVIEW_FIRST_SUMMARY.md` — This executive summary (5KB)

**Total documentation:** 50KB (comprehensive coverage)

---

## Why This Matters

### For Users
- **Better outcomes** — Guided to clarity before acting
- **Higher success rate** — Copilot understands what they really want
- **Less frustration** — No more "that's not what I meant"

### For Orbiter
- **Differentiation** — "Super interviewer" is unique positioning
- **User satisfaction** — Quality over speed leads to retention
- **Data collection** — Interview flows reveal what users actually need

### For the Pitch
- **Compelling demo** — Show AI that guides, not just executes
- **VC story** — "AI harness for your network" becomes tangible
- **Proof of concept** — Working interview system validates vision

---

## Robert's Assessment

This work directly addresses Mark's Feb 23 direction. The "super interviewer" concept is now fully documented with:
- ✅ Clear requirements
- ✅ Complete conversation examples
- ✅ Step-by-step implementation guide
- ✅ Testing framework
- ✅ Success metrics

**Estimated implementation:** 8-12 hours  
**Demo-ready:** Within 1-2 days after implementation starts  
**Production-ready:** End of week (if testing goes smoothly)

---

**Next call with Mark:** Confirm approach, get feedback on examples, align on demo strategy.

---

*Generated by Zora on Feb 23, 2026 based on Transcript #430 analysis*
