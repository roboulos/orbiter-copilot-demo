# Interview-First Implementation Guide

**Purpose:** Step-by-step technical implementation for shifting the Orbiter copilot to an interview-first approach.

**Estimated effort:** 8-12 hours  
**Priority:** HIGH (Mark's direction from Feb 23 call)

---

## Phase 1: System Prompt Updates (2-3 hours)

### File: `/app/lib/xano.ts`

**Location:** Comment section starting at line ~280

**Action:** Replace/extend the existing system prompt guidance with interview-first protocol.

#### Current System Prompt Section:
```typescript
/**
 * System prompt additions for the Xano /chat endpoint.
 *
 * ─── meeting_prep_card ───────────────────────────────────────────────────────
 * TRIGGER phrases: "meeting with", "prep for", "prepare for", "before I meet",
 *                  "meeting prep", "prepare me for a meeting", "get me ready for"
 * ...
 */
```

#### New System Prompt Section:

Add this BEFORE the existing card schemas:

```typescript
/**
 * ════════════════════════════════════════════════════════════════════════════
 * INTERVIEW-FIRST PROTOCOL (Priority: HIGH)
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * You are a SUPER INTERVIEWER, not a command executor. Your goal is to help 
 * users clarify what they really want before taking action.
 * 
 * ─── Intent Classification ──────────────────────────────────────────────────
 * 
 * Classify every user prompt as:
 * 
 * 1. COMPLETE INTENT
 *    - Has specific person (name mentioned)
 *    - Has clear outcome (job, investors, experts, partnership)
 *    - Has actionable details (8+ words, specific constraints)
 *    Example: "Help Ray Deck find seed investors for Orbiter who've invested 
 *             in social graph products. Draft intro emails."
 *    → ACTION: 1-2 clarifying questions max, then dispatch
 * 
 * 2. PARTIAL INTENT
 *    - Has person OR outcome, but not both in detail
 *    - Vague about specifics
 *    Example: "I want to help Ray with something"
 *             "Help someone find a job"
 *    → ACTION: 2-4 clarifying questions, guide to specificity
 * 
 * 3. EXPLORATORY INTENT
 *    - No person specified
 *    - Vague or open-ended goal
 *    Example: "I want to help someone in my network"
 *             "Show me interesting connections"
 *    → ACTION: 4-6 questions, full interview flow
 * 
 * ─── Interview Flow for PARTIAL Intent ──────────────────────────────────────
 * 
 * STEP 1: Identify WHO (if person not specified)
 * 
 * Response card: question_card_enhanced
 * {
 *   "name": "question_card_enhanced",
 *   "templateProps": {
 *     "question": "Who would you like to help?",
 *     "helpText": "I'll search your network for the right person",
 *     "showPersonPicker": true,
 *     "placeholder": "Start typing a name..."
 *   }
 * }
 * 
 * STEP 2: Clarify OUTCOME (always required)
 * 
 * Response card: question_card_enhanced with examples
 * {
 *   "name": "question_card_enhanced",
 *   "templateProps": {
 *     "question": "What specific outcome are you looking for with [PersonName]?",
 *     "helpText": "Think about what [PersonName] needs right now",
 *     "examples": [
 *       "Help them find a job at [company type]",
 *       "Connect them with [role] in [industry]",
 *       "Introduce them to potential [partners/customers/investors]",
 *       "Get technical advice on [specific problem]"
 *     ],
 *     "showInput": true,
 *     "showIdkButton": true
 *   }
 * }
 * 
 * STEP 3: Extract CONTEXT (when relevant, not always needed)
 * 
 * Ask ONE of these questions max:
 * - "What's the specific [job type/industry/tech] you're thinking?"
 * - "Why does this matter to them right now?"
 * - "Are there any constraints I should know about?"
 * 
 * Use button_group for multiple choice OR question_card for open text.
 * 
 * STEP 4: Confirm & Dispatch
 * 
 * Response card: quick_result_card
 * {
 *   "name": "quick_result_card",
 *   "templateProps": {
 *     "title": "Leverage Loop: [Brief Title]",
 *     "summary": "Here's what I'm about to do: [2-3 sentence plain English summary]",
 *     "searchCriteria": [
 *       "• [Criterion 1]",
 *       "• [Criterion 2]",
 *       "• [Criterion 3]"
 *     ],
 *     "nextSteps": [
 *       "• Scan your network for matches (~X people)",
 *       "• Identify warm introduction paths",
 *       "• Draft personalized intro messages",
 *       "• Deliver ranked suggestions to Outcomes tab"
 *     ],
 *     "estimatedTime": "3-5 minutes",
 *     "showDispatchButton": true,
 *     "showRefineButton": true
 *   }
 * }
 * 
 * ─── Interview Flow for EXPLORATORY Intent ──────────────────────────────────
 * 
 * STEP 0: Identify GOAL TYPE
 * 
 * Response card: question_card_enhanced with goal buttons
 * {
 *   "name": "question_card_enhanced",
 *   "templateProps": {
 *     "question": "What are you trying to achieve?",
 *     "helpText": "Pick the goal that fits best",
 *     "options": [
 *       {"label": "Help someone", "value": "help_person"},
 *       {"label": "Find someone", "value": "find_person"},
 *       {"label": "Discover opportunities", "value": "serendipity"},
 *       {"label": "Prepare for a meeting", "value": "meeting_prep"}
 *     ]
 *   }
 * }
 * 
 * Then follow PARTIAL flow starting at appropriate step.
 * 
 * ─── Fast-Track for COMPLETE Intent ─────────────────────────────────────────
 * 
 * When user provides complete intent:
 * 1. Optionally ask ONE clarifying question if ambiguous
 * 2. Show quick_result_card with summary
 * 3. Auto-dispatch OR wait for user confirmation
 * 
 * Example:
 * User: "Help Ray Deck find graph database experts for Orbiter's backend"
 * 
 * Response: question_card with quick clarification
 * {
 *   "name": "question_card",
 *   "templateProps": {
 *     "question": "Are these experts for hiring, consulting, or partnerships?",
 *     "options": [
 *       {"label": "Hiring — Building Ray's team", "value": "hiring"},
 *       {"label": "Consulting — Technical advice", "value": "consulting"},
 *       {"label": "Partnerships — Business collaboration", "value": "partnership"}
 *     ]
 *   }
 * }
 * 
 * ─── Conversation Style ─────────────────────────────────────────────────────
 * 
 * • Concise questions — No walls of text
 * • One question at a time — Don't overwhelm
 * • Conversational tone — Like a smart assistant, not a robot
 * • Show progress — Use ProgressTracker when >2 steps
 * • Provide examples — Always give 3-4 options for open-ended questions
 * • Respect impatience — If user says "just do it", offer quick scan option
 * 
 * ─── Interrupt Protocol ─────────────────────────────────────────────────────
 * 
 * If user says "just do it", "skip this", "whatever makes sense":
 * 
 * Response: fork_in_the_road card
 * {
 *   "name": "fork_in_the_road",
 *   "templateProps": {
 *     "title": "Choose your path:",
 *     "option1": {
 *       "label": "Quick Scan",
 *       "description": "I'll analyze context and suggest the best move (30 sec)",
 *       "value": "quick_scan"
 *     },
 *     "option2": {
 *       "label": "Guide Me",
 *       "description": "Ask me a few quick questions to pinpoint exactly what's needed (2-3 min)",
 *       "value": "guided"
 *     }
 *   }
 * }
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * CARD SCHEMAS (keep existing schemas below)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ... existing card schemas continue here ...
```

---

## Phase 2: Create Intent Classifier (1 hour)

### File: `/app/lib/dispatch.ts`

**Action:** Add intent classification function.

#### Add to imports:
```typescript
import { chat } from "./xano";
```

#### Add new function:
```typescript
export type UserIntent = "complete" | "partial" | "exploratory";

export interface IntentAnalysis {
  intent: UserIntent;
  confidence: number;
  hasPerson: boolean;
  hasOutcome: boolean;
  hasDetails: boolean;
  personName?: string;
}

export function classifyUserIntent(prompt: string): IntentAnalysis {
  // Detect person name (simple heuristic: capitalized words that might be names)
  const personNameMatch = prompt.match(/\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/);
  const hasPerson = !!personNameMatch;
  const personName = personNameMatch?.[1];

  // Detect outcome keywords
  const outcomeKeywords = [
    "find", "connect", "introduce", "help.*with", 
    "hire", "recruit", "meet", "partner",
    "invest", "fund", "advise", "consult"
  ];
  const hasOutcome = outcomeKeywords.some(kw => 
    new RegExp(kw, "i").test(prompt)
  );

  // Detect specificity (word count and detail indicators)
  const wordCount = prompt.split(/\s+/).length;
  const detailIndicators = [
    "specifically", "exactly", "need", "looking for",
    "who", "what", "when", "where", "how"
  ];
  const hasDetailIndicators = detailIndicators.some(di =>
    prompt.toLowerCase().includes(di)
  );
  const hasDetails = wordCount > 8 || hasDetailIndicators;

  // Classify intent
  let intent: UserIntent;
  let confidence: number;

  if (hasPerson && hasOutcome && hasDetails) {
    intent = "complete";
    confidence = 0.9;
  } else if (hasPerson || hasOutcome) {
    intent = "partial";
    confidence = 0.7;
  } else {
    intent = "exploratory";
    confidence = 0.8;
  }

  // Lower confidence for very short prompts
  if (wordCount < 4) {
    confidence -= 0.2;
  }

  return {
    intent,
    confidence,
    hasPerson,
    hasOutcome,
    hasDetails,
    personName,
  };
}

// Example usage:
// const analysis = classifyUserIntent("I want to help Ray Deck find investors");
// → { intent: "partial", confidence: 0.7, hasPerson: true, hasOutcome: true, hasDetails: false, personName: "Ray Deck" }
```

---

## Phase 3: Update Conversation Starters (30 min)

### File: `/app/page.tsx`

**Location:** Around line 280 (inside `CopilotModal` function)

**Action:** Replace `defaultStarters` with interview-friendly prompts.

#### Find this block:
```typescript
const defaultStarters = selectedPerson
  ? [
      {
        displayText: `Leverage Network for ${personName}`,
        prompt: `Leverage my network for ${personName}...`,
      },
      ...
    ]
  : [ ... ];
```

#### Replace with:
```typescript
const defaultStarters = selectedPerson
  ? [
      {
        displayText: `Explore ways to help ${personName}`,
        prompt: `I want to explore ways to help ${personName}. Guide me through some options.`,
      },
      {
        displayText: `Find the best way to activate this relationship`,
        prompt: `What's my single best move right now to activate my relationship with ${personName}${personTitle ? ` (${personTitle})` : ""}? Be direct and specific.`,
      },
      {
        displayText: `Meeting Prep for ${personName}`,
        prompt: `Meeting prep for ${personName} — give me talking points, things to listen for, and any landmines to avoid.`,
      },
    ]
  : [
      {
        displayText: "Help someone in my network",
        prompt: "I want to help someone in my network. Ask me who and what they need.",
      },
      {
        displayText: "Explore my network for opportunities",
        prompt: "Guide me through exploring my network to find valuable connections.",
      },
      {
        displayText: "Find the right person for something specific",
        prompt: "I'm looking for someone specific in my network. Help me find them by asking what I need.",
      },
    ];
```

---

## Phase 4: Add Interview State Management (2 hours)

### File: `/app/page.tsx`

**Location:** Inside the main `Home` component, after existing state declarations

**Action:** Add interview flow state tracking.

#### Add new state:
```typescript
const [interviewState, setInterviewState] = useState<{
  mode: "idle" | "identifying_person" | "clarifying_outcome" | "extracting_context" | "confirming";
  personId?: number;
  personName?: string;
  outcome?: string;
  context?: Record<string, unknown>;
  userIntent?: "complete" | "partial" | "exploratory";
}>({ mode: "idle" });
```

#### Add helper functions:
```typescript
const updateInterviewState = useCallback((updates: Partial<typeof interviewState>) => {
  setInterviewState(prev => ({ ...prev, ...updates }));
}, []);

const resetInterviewState = useCallback(() => {
  setInterviewState({ mode: "idle" });
}, []);

// Detect intent on first message
const analyzeIntent = useCallback((prompt: string) => {
  const analysis = classifyUserIntent(prompt);
  updateInterviewState({
    userIntent: analysis.intent,
    personName: analysis.personName,
    mode: analysis.hasPerson ? "clarifying_outcome" : "identifying_person",
  });
  return analysis;
}, [updateInterviewState]);
```

#### Update processMessage function:

Find the `processMessage` function and add intent analysis:

```typescript
const processMessage = useCallback(
  async ({
    threadId,
    messages,
    abortController,
  }: {
    threadId: string;
    messages: Array<{ role: string; message?: unknown }>;
    abortController: AbortController;
  }) => {
    const lastMessage = messages[messages.length - 1];
    const userPrompt = typeof lastMessage.message === "string" 
      ? lastMessage.message 
      : JSON.stringify(lastMessage.message);

    // Analyze intent on first user message
    if (interviewState.mode === "idle") {
      analyzeIntent(userPrompt);
    }

    // Rest of existing processMessage logic...
    // Include interview_mode and current_step in Xano request
    const context = selectedPerson?.master_person?.id
      ? await getPersonContext(selectedPerson.master_person.id)
      : undefined;

    const result = await chat(
      userPrompt,
      context,
      // Convert messages to history format
      messages.slice(0, -1).map(m => ({
        role: m.role,
        content: typeof m.message === "string" ? m.message : JSON.stringify(m.message),
      })),
      selectedPerson?.master_person?.id,
      undefined // networkData can be added later
    );

    // ... rest of existing code
  },
  [interviewState, selectedPerson, analyzeIntent]
);
```

---

## Phase 5: Test with Real Examples (2-3 hours)

### Testing Checklist

Create test scenarios based on `INTERVIEW_EXAMPLES.md`:

1. **Vague request** → Full interview flow
   - Input: "I want to help someone"
   - Expected: 4-6 clarifying questions

2. **Partial request** → Guided flow
   - Input: "Help Ray with something"
   - Expected: 2-4 clarifying questions

3. **Specific request** → Fast-track
   - Input: "Help Ray Deck find graph database experts for Orbiter"
   - Expected: 1-2 clarifying questions, quick dispatch

4. **Complete request** → Immediate dispatch
   - Input: "Help Ray Deck find seed investors for Orbiter who've invested in social graph products. Draft intro emails."
   - Expected: Confirm and dispatch immediately

5. **Interrupt protocol** → Offer quick scan
   - Input: "I want to help someone" → "Just do it"
   - Expected: Fork-in-the-road card

### Testing Script

Create `/test/interview-flows.test.ts`:

```typescript
import { classifyUserIntent } from "../app/lib/dispatch";

describe("Intent Classification", () => {
  it("should classify complete intent", () => {
    const result = classifyUserIntent(
      "Help Ray Deck find graph database experts for Orbiter's backend migration"
    );
    expect(result.intent).toBe("partial"); // Not enough detail for "complete"
    expect(result.hasPerson).toBe(true);
    expect(result.hasOutcome).toBe(true);
    expect(result.personName).toBe("Ray Deck");
  });

  it("should classify exploratory intent", () => {
    const result = classifyUserIntent("I want to help someone");
    expect(result.intent).toBe("exploratory");
    expect(result.hasPerson).toBe(false);
    expect(result.hasOutcome).toBe(false);
  });

  it("should classify partial intent", () => {
    const result = classifyUserIntent("Help Ray with something");
    expect(result.intent).toBe("partial");
    expect(result.hasPerson).toBe(true);
    expect(result.personName).toBe("Ray");
  });
});
```

---

## Phase 6: UI Polish (2-3 hours)

### Progress Indicator

Ensure `ProgressTracker.tsx` is wired up for multi-step flows:

```typescript
// In CopilotModal, show progress for exploratory/partial flows
{interviewState.userIntent !== "complete" && interviewState.mode !== "idle" && (
  <ProgressTracker
    steps={[
      { label: "Who", completed: !!interviewState.personName },
      { label: "What", completed: !!interviewState.outcome },
      { label: "Confirm", completed: interviewState.mode === "confirming" },
    ]}
  />
)}
```

### Enhanced Question Card

Verify `QuestionCardEnhanced.tsx` supports all required props:
- `question: string`
- `helpText?: string`
- `examples?: string[]`
- `showPersonPicker?: boolean`
- `showInput?: boolean`
- `showIdkButton?: boolean`
- `placeholder?: string`

---

## Phase 7: Documentation Update (1 hour)

### Update README

Add section about interview-first approach:

```markdown
## Interview-First Copilot

The Orbiter copilot uses an interview-first approach to help users clarify their goals before taking action.

### User Intent Types

1. **Complete Intent** — Fast-track to execution
2. **Partial Intent** — 2-4 clarifying questions
3. **Exploratory Intent** — Full interview flow (4-6 questions)

### Flow Examples

See `INTERVIEW_EXAMPLES.md` for detailed conversation flows.

### Testing

Run `npm test` to verify intent classification logic.
```

---

## Success Criteria

✅ System prompt includes full interview-first protocol  
✅ Intent classifier correctly categorizes user prompts  
✅ Conversation starters are interview-friendly  
✅ Interview state is tracked across conversation  
✅ All 5 test scenarios pass  
✅ UI shows progress for multi-step flows  
✅ Documentation updated

---

## Rollout Plan

### Stage 1: Internal Testing (This week)
- Robert tests with real examples
- Mark reviews flows on demo call

### Stage 2: Beta Testing (Next week)
- Charles tests with Orbiter team
- Collect feedback on interview experience

### Stage 3: Production Release
- Deploy to beta.orbiter.io
- Monitor conversation success rates
- Iterate based on user feedback

---

## Open Questions for Mark

1. **Auto-dispatch threshold:** Should "complete" intent auto-dispatch or always confirm?
2. **Learning from history:** Should copilot remember user preferences (e.g., "this user prefers minimal questions")?
3. **Multi-person loops:** How should interview flow handle "help multiple people with X"?
4. **Context enrichment:** Should copilot proactively pull transcript data to suggest outcomes?

---

## Next Demo (Thursday Feb 27 @ 9 AM with Charles)

**Focus:** Show interview-first flow with Ray Deck example from transcript.

**Demo Script:**
1. Open copilot
2. Type: "I want to help Ray with something"
3. Walk through interview flow
4. Show quick_result_card summary
5. Dispatch and show in Outcomes tab

---

**Last Updated:** Feb 23, 2026  
**Estimated Total Time:** 8-12 hours  
**Priority:** HIGH (Mark's direction from call)
