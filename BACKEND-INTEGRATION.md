# Backend Integration Requirements

## 🚨 CRITICAL: Button Responses

The frontend is **READY** to display button-based interview questions, but the backend needs to return the correct format.

### Current State
✅ ButtonGroup component created and registered with Crayon
✅ Message alignment fixed (user=right, AI=left)
✅ Fork + Sub-fork working

❌ Backend currently returns text-only responses
❌ AI not instructed to return button options

### Required Response Format

When the AI asks a question that should have button options, return this format:

```json
{
  "response": [
    {
      "type": "text",
      "text": "What region of Costa Rica are you targeting?"
    },
    {
      "name": "button_group",
      "templateProps": {
        "options": [
          { 
            "label": "Pacific Coast", 
            "value": "pacific",
            "emoji": "🏖️" 
          },
          { 
            "label": "Central Valley", 
            "value": "central",
            "emoji": "🏔️"
          },
          { 
            "label": "Caribbean Side", 
            "value": "caribbean",
            "emoji": "🌴"
          }
        ]
      }
    }
  ]
}
```

### What Happens When User Clicks

When a user clicks a button option:
1. The `value` is automatically sent as a new message from the user
2. Example: User clicks "Pacific Coast" → sends message "pacific"  
3. AI receives "pacific" and asks the next question with more buttons

### AI Prompting Strategy

The backend AI system prompt should include:

```
When conducting an interview to gather context for an outcome:

1. Ask ONE question at a time (never dump 5 questions)
2. For each question, provide 3-5 button options in this format:
   - Return a text message with the question
   - Return a button_group with options array
   - Each option has: label (shown to user), value (sent as message), emoji (optional)
3. When you receive a button value back, acknowledge it and ask the next question
4. Keep questions concise - "Mark Cuban 5-word email" style
5. Progressive disclosure - more questions only if needed

Example flow:
User: "I want to buy a house in Costa Rica"
AI: [text: "What region?" + buttons: Pacific/Central/Caribbean]
User clicks → sends "pacific"
AI: [text: "What's your purpose?" + buttons: Vacation/Investment/Relocating]
User clicks → sends "relocating"
AI: [text: "Budget range?" + buttons: <$500k/$500k-$1M/$1M+]
...until enough context gathered...
AI: [text: "Ready to find connections?" + buttons: Proceed/Add More Info]
```

### Integration Points

**File:** `app/lib/xano.ts`

The `chat()` function currently processes responses but the Xano endpoint needs to be updated to return button_group template responses.

**Xano Endpoint:** `/chat` (or equivalent)

Current return format:
```typescript
{
  raw: string // JSON string with response array
}
```

Must continue to support:
- `{ type: "text", text: "..." }` for regular messages
- `{ name: "outcome_card", templateProps: {...} }` for existing cards
- `{ name: "button_group", templateProps: { options: [...] } }` for NEW button interviews

### Testing the Integration

1. Open copilot
2. Type: "I want to buy a house in Costa Rica"
3. AI should respond with text + button_group
4. Buttons should appear below the message
5. Clicking a button sends its value
6. Next question appears with new buttons

### Example Interview Flows

**Own Outcome (no person):**
```
User: "I want to find investors for my startup"
AI text: "What stage is your startup?"
AI buttons: [Pre-seed] [Seed] [Series A]
→ User clicks [Seed]
AI text: "What industry?"
AI buttons: [B2B SaaS] [Consumer] [FinTech] [HealthTech]
→ User clicks [B2B SaaS]
AI text: "Check size?"
AI buttons: [$500k-$1M] [$1M-$3M] [$3M+]
...etc
```

**Help Someone (person selected):**
```
After fork → "I already know what to help with"
User: "His son is going to USC, needs soft landing"
AI text: "What type of support?"
AI buttons: [Student Housing] [Campus Connections] [Local Network] [All of the Above]
→ User clicks [Campus Connections]
AI text: "What's the son's major/interest?"
AI buttons: [Business] [Engineering] [Liberal Arts] [Not Sure]
...etc
```

## Backend TODO List

- [ ] Update AI system prompt to return button_group format
- [ ] Test button response parsing in Xano
- [ ] Ensure OpenRouter/AI can handle structured output or format responses
- [ ] Add interview logic: ONE question at a time
- [ ] Progressive disclosure (don't ask everything upfront)
- [ ] Final "Ready to dispatch?" with [Proceed] button
- [ ] Return summary of collected context before dispatch

## Questions for Backend Team

1. Can the current AI setup return structured JSON like this?
2. Do we need to modify the prompt or add a post-processing step?
3. How do we track interview state server-side?
4. Should we store collected context in session/thread?
