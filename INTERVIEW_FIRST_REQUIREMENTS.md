# Interview-First Copilot Requirements

**Date:** Feb 23, 2026  
**Source:** Transcript #430 (Mark/Robert Product Sync)  
**Priority:** HIGH — Shift from command-driven to interview-style interaction

---

## Mark's Vision (From Transcript)

### Key Quotes

**08:31 - The "Super Interviewer" Concept:**
> "I do really want I want it to be like the super interviewer like I want I don't want to try to give me the results. I don't because I wanted to try and I think there are two paths there is the that you want to serve both of them."

**09:04 - Two User Paths:**
> "Like, one of them is the hardcore path of, like, you know, the hard core user that just wants to type as little as possible and just go, bam, yes, this. Yeah, that's it. Go. Go help Kim find a New job, right? Or whatever.
> 
> And then there's going to be people that want to kind of idea and talk to the agent a little bit, you know what I mean? And it guides them. It is helping them better understand what they really want to achieve."

**17:16 - Robert's Commitment:**
> "I'll put more focus on the interview aspect and then, you know, over the necessarily go through this immediately type of aspect because you know, we're that's what we're focusing on."

---

## Problem Statement

**Current state:** The copilot acts as a command executor — user types a request, agent returns results immediately.

**Desired state:** The copilot acts as a **super interviewer** — it guides users through clarifying questions to help them understand what they really want, then executes the refined request.

---

## Two User Archetypes

### 1. The Hardcore User (Power User)
- **Behavior:** Knows exactly what they want
- **Input:** Complete, specific commands
- **Example:** "Go help Kim find a New job"
- **Experience:** Minimal questions, fast execution
- **UI Pattern:** Quick confirmation → Execute

### 2. The Explorer User (Guided User)
- **Behavior:** Has a general idea, needs help clarifying
- **Input:** Vague or exploratory prompts
- **Example:** "I want to help someone with something"
- **Experience:** Guided interview flow with clarifying questions
- **UI Pattern:** Multi-turn conversation → Refinement → Execute

---

## Interview-First Design Principles

### 1. Ask Before Acting
- **OLD:** "Leverage loop created for Ray Deck!"
- **NEW:** "Who do you want to help? What specific outcome are you looking for?"

### 2. Guide the User to Clarity
- Don't just accept vague requests
- Help them articulate *what they really want*
- Make them think about *why* they want it

### 3. Extract Context Progressively
Instead of asking everything at once, build context through natural conversation:
- **First:** Who is this for?
- **Then:** What's the specific outcome?
- **Then:** Why does this matter to them?
- **Finally:** What constraints or preferences?

### 4. Provide Examples to Inspire
When users are stuck, show them what's possible:
- "For example, you could help them find a job, connect them with investors, or introduce them to a potential partner."

### 5. Confirm Before Dispatch
Always show the user what you're about to do:
- **Summary:** "I'm going to leverage your network to help Ray find graph database experts for Orbiter's backend migration."
- **Confirmation:** "Does this sound right? [Yes, dispatch] [Let me refine]"

---

## Implementation Changes

### Phase 1: System Prompt Redesign

**File:** `/app/lib/xano.ts` (comments section for system prompt)

**Current approach:** Direct card generation on trigger phrases

**New approach:** Interview-first flow with progressive clarification

#### Example System Prompt Addition:

```markdown
## Interview-First Protocol

You are a SUPER INTERVIEWER, not a command executor. Your goal is to help users clarify what they really want before taking action.

### User Intent Detection

Classify user prompts as:
1. **Complete Intent** — Specific person, clear outcome, actionable
   - Example: "Help Ray Deck find graph database experts for Orbiter"
   - Action: Ask 1-2 clarifying questions, then dispatch
   
2. **Partial Intent** — Person identified, but outcome vague
   - Example: "I want to help Ray with something"
   - Action: Ask about specific outcomes, provide examples
   
3. **Exploratory Intent** — No person, vague goal
   - Example: "I want to help someone in my network"
   - Action: Guide them to identify who and why

### Interview Flow Pattern

For **Partial** or **Exploratory** intents:

1. **IDENTIFY WHO** (if not specified)
   - "Who would you like to help?"
   - Show PersonPicker component for selection
   
2. **CLARIFY OUTCOME** (always required)
   - "What specific outcome are you looking for with [person]?"
   - Provide 3-4 example prompts:
     * "Help them find a job at [company type]"
     * "Connect them with [role] in [industry]"
     * "Introduce them to potential [partners/customers/investors]"
   - Use `question_card_enhanced` component with help button

3. **EXTRACT CONTEXT** (when relevant)
   - "Why does this matter to them right now?"
   - "Are there any constraints I should know about?"
   - Keep this light — 1-2 questions max

4. **CONFIRM & DISPATCH**
   - Summarize the leverage loop in plain English
   - Show `quick_result_card` with dispatch button
   - Wait for explicit confirmation

### Response Style

- **Concise questions** — No walls of text
- **One question at a time** — Don't overwhelm
- **Conversational tone** — Like a smart assistant, not a robot
- **Show progress** — Let them know where they are in the flow
```

### Phase 2: Component Updates

#### A. Add "Interview Mode" State

**File:** `/app/page.tsx`

Add state to track the interview flow:

```typescript
const [interviewState, setInterviewState] = useState<{
  mode: "idle" | "identifying_person" | "clarifying_outcome" | "extracting_context" | "confirming";
  personId?: number;
  personName?: string;
  outcome?: string;
  context?: Record<string, unknown>;
}>({ mode: "idle" });
```

#### B. Enhanced Question Card with Help

**File:** `/app/components/QuestionCardEnhanced.tsx` (already exists!)

Ensure it includes:
- Clear question text
- "I don't know" button → triggers examples/guidance
- Help icon → expandable explanation
- Input field with smart suggestions

#### C. Progress Indicator

**File:** `/app/components/ProgressTracker.tsx` (already exists!)

Show users where they are:
```
[●] Identify person → [●] Clarify outcome → [○] Confirm → [○] Dispatch
```

### Phase 3: Conversation Starters Overhaul

**File:** `/app/page.tsx` (line ~280)

**Current starters:** Assume specific use cases

**New starters (interview-friendly):**
```typescript
const defaultStarters = selectedPerson
  ? [
      {
        displayText: `Start a conversation about ${personName}`,
        prompt: `I want to explore ways to help ${personName}. Guide me through some options.`,
      },
      {
        displayText: `Find the best way to activate this relationship`,
        prompt: `What's my single best move right now to activate my relationship with ${personName}? Be direct — tell me what to do.`,
      },
      {
        displayText: `Meeting Prep for ${personName}`,
        prompt: `Meeting prep for ${personName} — give me talking points and things to watch for.`,
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
        displayText: "Find the right person for...",
        prompt: "I'm looking for someone specific in my network. Help me find them.",
      },
    ];
```

---

## Example Conversation Flows

### Flow 1: Vague Request → Interview → Dispatch

**User:** "I want to help someone with a job"

**Copilot:** 
```
[question_card_enhanced]
Who would you like to help find a job?

[PersonPicker component appears]

[Help button] "I'll search your network for people actively looking or open to opportunities"
```

**User:** Selects "Ray Deck"

**Copilot:**
```
[question_card_enhanced]
What kind of job opportunity are you thinking for Ray?

Examples:
• Software engineering at a startup
• Leadership role in graph database companies
• Consulting opportunities in AI/ML

[Text input field]
[Help button] "Think about what Ray's skills and interests are"
```

**User:** "CTO role at an AI startup working with graph databases"

**Copilot:**
```
[quick_result_card]
Got it! Here's what I'm about to do:

**Leverage Loop: Help Ray Deck find CTO roles**
• Searching your network for AI startup founders
• Filtering for companies using graph databases
• Identifying warm introduction paths
• Drafting personalized intro messages

This will create a background task that may take 3-5 minutes.

[Dispatch] [Refine Request]
```

### Flow 2: Specific Request → Minimal Interview → Dispatch

**User:** "Help Ray Deck find graph database experts for Orbiter"

**Copilot:**
```
[question_card]
Just to clarify — are you looking to:

1. Hire them for Orbiter's team
2. Get technical advice/consulting
3. Find potential partners or investors

[Button: Option 1] [Button: Option 2] [Button: Option 3]
```

**User:** [Clicks "Hire them for Orbiter's team"]

**Copilot:**
```
[quick_result_card]
Perfect. Here's the plan:

**Leverage Loop: Find graph database experts to hire**
• Targeting engineers with FalkorDB, Neo4j, or Neptune experience
• Prioritizing people open to startup opportunities
• Highlighting Orbiter's unique network intelligence angle

[Dispatch & Track Progress →]
```

### Flow 3: Power User → Fast Track

**User:** "Leverage my network for Ray Deck to find seed investors for Orbiter. Focus on people who've invested in social or knowledge graph products. Draft intros."

**Copilot:**
```
[quick_result_card]
On it. Creating leverage loop...

**Target:** Seed investors with social/graph product experience
**For:** Ray Deck (Orbiter fundraising)
**Action:** Warm intro drafts

This is specific enough — dispatching now.

[View in Outcomes →]
```

---

## Technical Specifications

### Detection Logic

**File:** `/app/lib/dispatch.ts` (update `detectDispatchIntent`)

```typescript
export function classifyUserIntent(prompt: string): "complete" | "partial" | "exploratory" {
  const hasPersonName = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(prompt);
  const hasSpecificOutcome = /(find|connect|introduce|help.*with)/i.test(prompt);
  const hasActionableDetails = prompt.split(" ").length > 8;

  if (hasPersonName && hasSpecificOutcome && hasActionableDetails) {
    return "complete";
  }
  
  if (hasPersonName || hasSpecificOutcome) {
    return "partial";
  }
  
  return "exploratory";
}
```

### Backend Requirements

**Xano `/chat` endpoint must support:**
- `interview_mode: boolean` parameter
- `current_step: string` parameter (identifying_person | clarifying_outcome | extracting_context | confirming)
- Returns appropriate card type based on step

**Example request:**
```json
{
  "prompt": "I want to help someone",
  "interview_mode": true,
  "current_step": "identifying_person",
  "history": [...]
}
```

**Example response:**
```json
{
  "raw": "{\"response\": [{\"name\": \"question_card_enhanced\", \"templateProps\": {\"question\": \"Who would you like to help?\", \"helpText\": \"I'll search your network for the right person\", \"showPersonPicker\": true}}]}",
  "model": "anthropic/claude-sonnet-4"
}
```

---

## Success Metrics

### User Experience
- **Clarity rate:** % of users who successfully dispatch after interview flow
- **Refinement rate:** % of users who edit/refine before dispatching
- **Abandonment rate:** % of users who start interview but don't finish

### Conversation Quality
- **Average turns to dispatch:** Target 2-4 for partial intent, 4-6 for exploratory
- **Question effectiveness:** Track which questions most often lead to successful dispatch

### Speed vs Quality Trade-off
- **Power users:** Should dispatch in 1-2 turns (fast track)
- **Exploratory users:** 4-6 turns is acceptable if it produces higher-quality outcomes

---

## Open Questions for Mark

1. **Threshold for "complete" intent:** How specific does a request need to be before we skip the interview?
2. **Interrupt protocol:** If user says "just do it" mid-interview, should we fast-track or insist on clarity?
3. **Learning from history:** Should the copilot remember that a user is a "power user" and adjust behavior?
4. **Multi-person leverage loops:** What if they want to help multiple people with the same outcome?

---

## Next Steps

1. **Implement system prompt changes** in `/app/lib/xano.ts` comments
2. **Update conversation starters** to be interview-friendly
3. **Add intent classification logic** to `dispatch.ts`
4. **Test with real examples** (Ray Deck use case from transcript)
5. **Schedule demo with Mark** to validate approach

---

## References

- **Source Transcript:** #430 (Mark/Robert Product Sync, Feb 23, 2026)
- **Key Components:** `QuestionCardEnhanced.tsx`, `QuickResultCard.tsx`, `ProgressTracker.tsx`
- **System Prompt:** `/app/lib/xano.ts` (line ~280 comments)
- **Current Demo:** https://orbiter-copilot-demo.vercel.app
