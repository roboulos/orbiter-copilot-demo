# Orbiter Copilot - Complete Implementation Plan
**Based on Transcript #417 with Mark (Feb 19, 2026)**

## 🎯 The Real Vision

Mark doesn't want a chat interface. He wants a **BUTTON-FIRST GUIDED INTERVIEW SYSTEM**.

Think: TurboTax, not ChatGPT.
Think: Linear's command palette, not Slack.
Think: Mark Cuban's 5-word emails, not essays.

---

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   USER OPENS COPILOT                     │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
   NO PERSON              PERSON
   SELECTED              SELECTED
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────────┐
│  BLANK STATE  │    │  FORK IN THE ROAD  │
│               │    │                    │
│ "What do you  │    │  ┌──────────────┐  │
│  want help    │    │  │ Leverage my  │  │
│  with?"       │    │  │ Network for  │  │
│               │    │  │    [Name]    │──┼──→ Quick Dispatch
│ User types    │    │  └──────────────┘  │    (confirmation modal)
│ their OWN     │    │                    │
│ outcome       │    │  ┌──────────────┐  │
│               │    │  │ Help [Name]  │  │
└───────┬───────┘    │  │ with specific│  │
        │            │  │     task     │  │
        │            │  └──────┬───────┘  │
        │            └─────────┼──────────┘
        │                      │
        │                      ▼
        │            ┌──────────────────┐
        │            │    SUB-FORK      │
        │            │                  │
        │            │ ┌──────────────┐ │
        │            │ │   Suggest    │ │
        │            │ │ what [Name]  │ │
        │            │ │ might need   │─┼──→ Shows AI-generated
        │            │ └──────────────┘ │    button suggestions
        │            │                  │
        │            │ ┌──────────────┐ │
        │            │ │  I already   │ │
        │            │ │ know what to │ │
        │            │ │     help     │─┼──→ User describes
        │            │ └──────────────┘ │    specific need
        │            └─────────┬────────┘
        │                      │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  BUTTON-BASED        │
        │  INTERVIEW FLOW      │
        │                      │
        │  AI: "What region?"  │
        │  ┌─────────────────┐ │
        │  │ [Pacific Coast] │ │
        │  │ [Central Valley]│ │
        │  │ [Caribbean Side]│ │
        │  └─────────────────┘ │
        │                      │
        │  User clicks button  │
        │         ↓            │
        │  Next question       │
        │  with new buttons    │
        │                      │
        │  ONE AT A TIME       │
        │  (not dumping 5!)    │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  SUBMIT/DEPLOY       │
        │                      │
        │  User satisfied?     │
        │  ┌────────────────┐  │
        │  │ [Submit]       │  │
        │  │ [Add more info]│  │
        │  └────────────────┘  │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  CONFIRMATION MODAL  │
        │                      │
        │  Summary:            │
        │  "Leverage network   │
        │   to find Costa Rica │
        │   realtors in Pacific│
        │   Coast region for   │
        │   relocation"        │
        │                      │
        │  ┌────────────────┐  │
        │  │   [Proceed]    │  │
        │  │   [Cancel]     │  │
        │  └────────────────┘  │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  DISPATCHING...      │
        │                      │
        │     ⚡ Spinner       │
        │                      │
        │  "Agent working on   │
        │   your request..."   │
        └──────────────────────┘
```

---

## 🔨 Implementation Tasks

### PHASE 1: Fix The Basics (2-3 hours)

#### 1.1 Message Alignment
**File:** `app/globals.css`

```css
/* User messages - RIGHT aligned */
.crayon-shell-thread-message-user {
  display: flex !important;
  justify-content: flex-end !important;
  margin-left: auto !important;
  max-width: 70% !important;
}

.crayon-shell-thread-message-user__content {
  background: linear-gradient(135deg, rgba(99,102,241,0.16), rgba(139,92,246,0.12)) !important;
  border-radius: 18px 18px 4px 18px !important;
}

/* AI messages - LEFT aligned */
.crayon-shell-thread-message-agent {
  display: flex !important;
  justify-content: flex-start !important;
  margin-right: auto !important;
  max-width: 70% !important;
}

.crayon-shell-thread-message-agent__content {
  background: rgba(255,255,255,0.04) !important;
  border-radius: 18px 18px 18px 4px !important;
}
```

#### 1.2 Test Button Responses
**File:** `app/lib/xano.ts`

Update `chat()` function to return button options in response:

```typescript
// Example response format:
{
  response: [
    { type: "text", text: "What region of Costa Rica are you interested in?" },
    {
      name: "button_group",
      templateProps: {
        options: [
          { label: "Pacific Coast", value: "pacific" },
          { label: "Central Valley", value: "central" },
          { label: "Caribbean Side", value: "caribbean" }
        ]
      }
    }
  ]
}
```

**Need to verify:** Does Crayon support this format? Check their docs.

### PHASE 2: Fork & Sub-Fork (2-3 hours)

#### 2.1 Update ForkInTheRoad Component
**File:** `app/components/ForkInTheRoad.tsx`

Add the sub-fork state:

```typescript
const [showSubFork, setShowSubFork] = useState(false);
const [subForkChoice, setSubForkChoice] = useState<'suggest' | 'know' | null>(null);

// Main fork
if (!showSubFork) {
  return (
    // Two buttons:
    // 1. "Leverage Network for {name}" → dispatch immediately
    // 2. "Help {name} with specific task" → setShowSubFork(true)
  );
}

// Sub-fork
return (
  <SubFork>
    // "← Back" button
    // Two choices:
    // 1. "Suggest what {name} might need"
    // 2. "I already know what to help with"
  </SubFork>
);
```

#### 2.2 Support "No Person" Entry Point
**File:** `app/page.tsx`

```typescript
// When no person selected and user starts typing:
// - Don't show fork at all
// - Go straight to interview flow
// - Treat it as "own outcome" mode
```

### PHASE 3: Button-Based Interview (4-6 hours)

#### 3.1 Create Custom Response Template
**File:** `app/components/ButtonGroup.tsx`

```typescript
export function ButtonGroup({ options, onSelect }: {
  options: Array<{ label: string; value: string }>;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="button-group">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className="interview-button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
```

#### 3.2 Register Template with Crayon
**File:** `app/page.tsx`

```typescript
const templates = [
  { name: "button_group", Component: ButtonGroup },
  { name: "outcome_card", Component: OutcomeCard },
  // ... existing templates
];
```

#### 3.3 Update Backend to Return Buttons
**File:** Backend/Xano (coordinate with Mark/team)

The AI agent needs to return responses like:

```json
{
  "response": [
    { "type": "text", "text": "What's your budget range?" },
    {
      "name": "button_group",
      "templateProps": {
        "options": [
          { "label": "$200k - $500k", "value": "mid" },
          { "label": "$500k - $1M", "value": "high" },
          { "label": "$1M+", "value": "premium" },
          { "label": "Still exploring", "value": "exploring" }
        ]
      }
    }
  ]
}
```

**CRITICAL:** Need to coordinate with backend team on this format.

### PHASE 4: Confirmation Modal (2-3 hours)

#### 4.1 Create Confirmation Component
**File:** `app/components/ConfirmationModal.tsx`

```typescript
interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  summary: string;
}

export function ConfirmationModal({ open, onClose, onConfirm, summary }: ConfirmationModalProps) {
  if (!open) return null;
  
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-card">
        <h3>Ready to dispatch?</h3>
        <div className="summary">{summary}</div>
        <div className="actions">
          <button onClick={onConfirm}>Proceed</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
```

#### 4.2 Dispatch Flow
**File:** `app/page.tsx`

```typescript
const [showConfirmation, setShowConfirmation] = useState(false);
const [dispatching, setDispatching] = useState(false);

const handleDispatch = async () => {
  setDispatching(true);
  // Call dispatch endpoint
  await dispatchToAgent(outcomeData);
  setDispatching(false);
  // Show success state
};
```

### PHASE 5: Polish & Testing (2-3 hours)

- Test both entry points thoroughly
- Test fork → sub-fork flow
- Test button-based interview with real questions
- Verify message alignment on all screen sizes
- Add loading states, transitions, animations
- Send Robert 3-5 LinkedIn profiles to test with

---

## 🚨 Critical Questions for Backend Team

1. **Button response format**: Does Crayon support button groups? What's the exact format?
2. **AI prompting**: How do we instruct the AI to return button options instead of just text?
3. **Dispatch endpoint**: What's the API for final dispatch? What payload format?
4. **Context passing**: How do we pass accumulated interview answers to the AI?

---

## 📅 Timeline

**Total estimate: 12-17 hours of focused work**

- **Tonight (Feb 19)**: Phases 1-2 (message alignment + fork/sub-fork)
- **Tomorrow (Feb 20)**: Phase 3 (button-based interview)
- **Weekend (Feb 22-23)**: Phase 4-5 (confirmation + polish)
- **Monday (Feb 24)**: Buffer for issues
- **Thursday (Feb 27)**: Integration meeting with Charles

---

## ✅ Success Criteria

Mark should be able to:
1. Open copilot and type "I want to buy a house in Costa Rica"
2. See button-based questions ONE AT A TIME
3. Click through the interview with MINIMAL typing
4. See a confirmation summary
5. Dispatch to agent
6. **OR** select a person, see the fork, choose help path, go through interview
7. Feel like it's fast, decisive, button-first (not chat-first)

**The bar:** "Would Mark Cuban use this?"
