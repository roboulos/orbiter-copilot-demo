# 🎯 MODE PICKER - Mark's Three Core Modes

## The Problem
Current UX is confusing - too many paths, unclear what each mode does. Hard to demo.

## Mark's Mental Model (From Transcript)

### 1. **Leverage Loops**
"I want to help someone from my network"
- **What it does:** Find connections to help a specific person
- **Flow:** Person → Outcome → Dispatch → Matches
- **Example:** "Help Ray Deck find seed investors"

### 2. **Meeting Prep**
"Prepare for a meeting"
- **What it does:** Context about people you're meeting
- **Flow:** Calendar → Person → Talking points
- **Example:** "Meeting prep for Charles"
- **Endpoint:** Calendar API already exists

### 3. **Outcomes**
"I want to achieve a goal"
- **What it does:** Map a goal through your network
- **Flow:** Goal → Plan → Tasks → Dispatch
- **Example:** "Raise $4M seed round"

---

## The Solution: Mode Picker

### When Copilot Opens:
```
┌─────────────────────────────────────────┐
│         Choose what you want to do      │
├─────────────────────────────────────────┤
│                                         │
│  🤝  Leverage Loops                    │
│  Help someone from your network        │
│  [Start]                                │
│                                         │
│  📅  Meeting Prep                      │
│  Prepare for an upcoming meeting       │
│  [Start]                                │
│                                         │
│  🎯  Outcomes                          │
│  Achieve a goal through your network   │
│  [Start]                                │
│                                         │
└─────────────────────────────────────────┘
```

---

## Simplified Flows

### Flow 1: Leverage Loops
```
1. User clicks "Leverage Loops"
2. "Who would you like to help?"
   → Person picker or type name
3. "What do you want to help them with?"
   → Job, investors, hire, intro, etc.
4. [2-3 clarifying questions]
5. [Shows matches]
6. [Dispatch confirmation modal]
7. [Waiting room]
```

### Flow 2: Meeting Prep
```
1. User clicks "Meeting Prep"
2. "Who are you meeting with?"
   → Shows calendar events OR type name
3. Backend pulls:
   - Person context
   - Recent activity
   - Relationship history
4. Shows meeting_prep_card:
   - Summary
   - Talking points
   - Openers
   - Landmines
5. Done (no dispatch needed)
```

### Flow 3: Outcomes
```
1. User clicks "Outcomes"
2. "What outcome do you want to achieve?"
   → Type goal
3. "Tell me more about this goal"
   → Budget, timeline, constraints
4. Backend creates plan with milestones
5. Shows plan
6. User can dispatch tasks to agents
7. Track progress
```

---

## UI Changes Needed

### 1. **Add Mode Picker Component**
**File:** `app/components/ModePicker.tsx`

```typescript
interface ModePickerProps {
  onSelectMode: (mode: 'leverage' | 'meeting' | 'outcome') => void;
}

export function ModePicker({ onSelectMode }: ModePickerProps) {
  return (
    <div className="mode-picker">
      <h2>Choose what you want to do</h2>
      
      <button onClick={() => onSelectMode('leverage')}>
        <div className="icon">🤝</div>
        <h3>Leverage Loops</h3>
        <p>Help someone from your network</p>
      </button>
      
      <button onClick={() => onSelectMode('meeting')}>
        <div className="icon">📅</div>
        <h3>Meeting Prep</h3>
        <p>Prepare for an upcoming meeting</p>
      </button>
      
      <button onClick={() => onSelectMode('outcome')}>
        <div className="icon">🎯</div>
        <h3>Outcomes</h3>
        <p>Achieve a goal through your network</p>
      </button>
    </div>
  );
}
```

### 2. **Show Mode Picker First**
**File:** `app/page.tsx`

```typescript
const [selectedMode, setSelectedMode] = useState<'leverage' | 'meeting' | 'outcome' | null>(null);

// In copilot modal:
{!selectedMode ? (
  <ModePicker onSelectMode={setSelectedMode} />
) : (
  <CrayonChat
    mode={selectedMode}
    // ... rest of chat
  />
)}
```

### 3. **Remove Emojis from Cards**
**Files:** All card components
- `QuickResultCard.tsx` - Remove emojis
- `QuestionCard.tsx` - Remove emojis
- `InlineInterviewCard.tsx` - Remove emojis
- Any other cards

### 4. **Wire Meeting Prep**
**Backend needs to:**
- Accept `mode: "meeting_prep"`
- Call calendar endpoint
- Return `meeting_prep_card` with:
  - Person summary
  - Talking points (topic, opener, why_care, listen_for)
  - Landmines

**Frontend has:** `MeetingPrepCard.tsx` component ready

---

## Backend Changes Needed

### 1. **Accept Mode Parameter**
```json
POST /chat
{
  "prompt": "...",
  "user_id": 18,
  "mode": "leverage" | "meeting" | "outcome"
}
```

### 2. **Route Based on Mode**

**Leverage Loop Mode:**
- Interview for person + outcome
- Search network
- Return matches + dispatch_confirmation

**Meeting Prep Mode:**
- Get calendar events (next 24-48h)
- Extract attendees
- Pull context for each
- Return meeting_prep_card (NO dispatch)

**Outcome Mode:**
- Interview for goal
- Create plan with milestones
- Return outcome_card
- User can dispatch later

---

## Demo Script (After Changes)

### Demo 1: Leverage Loops (2 min)
```
Robert: "Let me show you Leverage Loops"
[Clicks "Leverage Loops"]
Robert: "I want to help Ray Deck find seed investors"
[Backend asks 2-3 questions]
[Shows matches]
[Dispatch confirmation appears]
Robert: "See? Interview → Matches → Dispatch"
[Clicks Dispatch → Waiting room]
```

### Demo 2: Meeting Prep (1 min)
```
Robert: "Now Meeting Prep"
[Clicks "Meeting Prep"]
Robert: "Charles" or selects from calendar
[Shows talking points card]
Robert: "See the structured talking points Mark wanted?"
- Topic, opener, why they care, listen for
[No dispatch needed]
```

### Demo 3: Outcomes (2 min)
```
Robert: "And Outcomes"
[Clicks "Outcomes"]
Robert: "Raise $4M seed round"
[Backend creates plan]
[Shows milestones]
Robert: "I can dispatch tasks to agents as needed"
```

---

## Priority Order

### 🔴 CRITICAL (For Demo Tomorrow):
1. Add Mode Picker at copilot start
2. Remove emojis from all cards
3. Wire Meeting Prep mode
4. Test all three paths

### 🟡 HIGH (Nice to Have):
5. Simplify Leverage Loops flow
6. Make Dispatch button always work
7. Polish transitions between modes

### 🟢 LATER:
8. Outcomes full implementation
9. Calendar integration UI
10. Advanced features

---

## Questions for Backend Team

1. **Calendar endpoint** - Does it return next 24-48h of events?
2. **Meeting prep format** - Can you return talking_points array as shown in Mark's screenshot?
3. **Mode routing** - Can you accept `mode` parameter and route accordingly?

---

## Success Criteria

### Before Demo:
- [ ] Three modes clearly visible at start
- [ ] No emojis in any cards
- [ ] Leverage Loops works (interview → dispatch)
- [ ] Meeting Prep works (shows talking points)
- [ ] Outcomes shows (even if simple)
- [ ] Demo script rehearsed

### Demo Success:
- [x] Mark sees his three concepts immediately
- [x] Each mode is distinct and clear
- [x] Flow matches his mental model
- [x] No confusion about what to click
- [x] Professional, polished experience

---

**Bottom Line:** Make Mark's three modes **obvious and distinct** from the start. No confusion, clear paths, professional execution! 🎯
