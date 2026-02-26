# XANO BACKEND TASKS - For Other AI

**Critical for Thursday Demo**
**Generated:** Feb 26, 2026

---

## 🔴 CRITICAL - System Prompt Changes (2-3 hours)

### Task #1: Remove Intermediate Suggestions

**Problem:** Backend is currently sending suggestion cards (contact_card, leverage_loop_card, etc.) DURING the conversation. Mark explicitly said: **"NO SUGGESTIONS before dispatch"** (repeated 3x in transcript).

**Solution:** Update chat system prompt to:

1. **Interview Mode Only** during conversation
   - Ask clarifying questions
   - Gather context
   - Build understanding
   - DO NOT send person suggestions
   - DO NOT send leverage loop cards
   - DO NOT send contact cards

2. **Only Send Text Responses** during interview
   ```json
   {
     "response": [
       {
         "type": "text",
         "text": "What kind of role is Ray looking for? Full-time or part-time?"
       }
     ]
   }
   ```

3. **Dispatch Confirmation** at the END
   ```json
   {
     "response": [
       {
         "name": "dispatch_confirmation",
         "templateProps": {
           "person_name": "Ray Deck",
           "goal": "find a chief of staff",
           "details": [
             "$75-85k/year",
             "Fully remote",
             "Must be dynamic, organized, great communicator"
           ],
           "compiled_context": "Full context for agents..."
         }
       }
     ]
   }
   ```

**Files to Update:**
- System prompt for `/api/chat` endpoint
- Conversation flow logic
- Template selection logic

---

### Task #2: Interview Question Logic

**Add to System Prompt:**

```
INTERVIEW PROTOCOL:

1. DETECT INTENT:
   - Complete: "Help Ray Deck find seed investors for social graph product"
     → Ask 0-1 clarifying questions
   
   - Partial: "Help Ray with something"
     → Ask 2-4 guided questions
   
   - Exploratory: "I want to help someone"
     → Start from scratch

2. QUESTION TEMPLATES:

   Job Search:
   - "What kind of role are they looking for?"
   - "Full-time or part-time?"
   - "Remote, hybrid, or in-office?"
   - "What's the budget/salary range?"
   - "What key qualities or skills are needed?"

   Fundraising:
   - "What stage are they at? (Pre-seed, seed, Series A, etc.)"
   - "How much are they looking to raise?"
   - "What kind of investors? (Angels, VCs, strategic, etc.)"
   - "Any specific criteria or preferences?"

   Hiring:
   - Same as job search but from employer perspective

   Generic:
   - "What would you like to help [Person] with?"
   - Follow up based on their answer

3. PROGRESSION:
   - Ask ONE question at a time
   - Wait for user answer
   - Build context progressively
   - After 2-4 Q&A turns, move to dispatch confirmation

4. INTERRUPT PROTOCOL:
   - If user says "just do it", "skip questions", "that's enough"
     → Immediately move to dispatch confirmation with gathered context

5. NO SUGGESTIONS DURING INTERVIEW
   - Only text responses
   - No person cards
   - No leverage loop cards
   - Save ALL suggestions for post-dispatch
```

---

### Task #3: Dispatch Endpoint

**Endpoint:** POST `/api/leverage-loop` (or similar)

**Request Body:**
```json
{
  "master_person_id": 123,
  "goal": "find a chief of staff",
  "context": {
    "budget": "$75-85k/year",
    "remote": true,
    "requirements": ["dynamic", "charming", "organized"],
    "additional_notes": "Ray needs someone who can handle multiple projects"
  },
  "conversation_history": [
    {"role": "user", "content": "Help Ray find a chief of staff"},
    {"role": "assistant", "content": "What kind of role..."},
    // ... full conversation
  ],
  "fast": true
}
```

**Response:**
```json
{
  "success": true,
  "process_id": "abc123",
  "status": "processing",
  "message": "Dispatch successful. Agents are analyzing your network."
}
```

---

### Task #4: Process Status Endpoint

**Endpoint:** GET `/api/process-status/{process_id}`

**Response:**
```json
{
  "process_id": "abc123",
  "status": "in_progress" | "complete" | "failed",
  "current_step": "Finding mutual connections...",
  "progress": 45,
  "steps_completed": 3,
  "total_steps": 7,
  "results": [] // populated when complete
}
```

**Used by:** WaitingRoom component (polls every 2 seconds)

---

### Task #5: Meeting Prep Integration (Bonus)

**Endpoint:** POST `/api/meeting-prep`

**Request Body:**
```json
{
  "master_person_id": 123,
  "context": "Meeting about Q1 strategy",
  "project_id": 456 // optional
}
```

**Response:**
```json
{
  "person": {
    "name": "Charles Njenga",
    "title": "Senior Developer",
    "company": "Orbiter"
  },
  "summary": "Charles is...",
  "talking_points": [
    "Recent work on Copilot UI",
    "Technical background in React/Next.js",
    "Interest in AI-powered tools"
  ],
  "openers": [
    "How's the Copilot development going?",
    "I saw you worked on the interview card - great work!"
  ],
  "landmines": [
    "Avoid: Pushing too hard on deadlines",
    "Avoid: Micromanaging technical decisions"
  ],
  "context_signals": [
    "Posted on LinkedIn about React 19 features",
    "Recently joined Orbiter team"
  ]
}
```

---

## 🟡 RESPONSE FORMAT STANDARDS

### Text Response (During Interview)
```json
{
  "response": [
    {
      "type": "text",
      "text": "Your question or clarification here"
    }
  ]
}
```

### Dispatch Confirmation (End of Interview)
```json
{
  "response": [
    {
      "name": "dispatch_confirmation",
      "templateProps": {
        "person_name": "Ray Deck",
        "goal": "find a chief of staff",
        "details": ["$75-85k/year", "Fully remote", "Dynamic and organized"],
        "compiled_context": "Full context for agents",
        "master_person_id": 123
      }
    }
  ]
}
```

### Meeting Prep Card
```json
{
  "response": [
    {
      "name": "meeting_prep_card",
      "templateProps": {
        "person": {
          "name": "Charles Njenga",
          "title": "Senior Developer",
          "avatar": "https://..."
        },
        "summary": "...",
        "talking_points": ["...", "..."],
        "openers": ["...", "..."],
        "landmines": ["...", "..."]
      }
    }
  ]
}
```

---

## 🔧 TESTING CHECKLIST (For Backend)

### Test Scenario 1: Direct Dispatch
```
Input: "Make leverage loop for Ray Deck"
Expected: Immediate dispatch confirmation (no interview)
```

### Test Scenario 2: Partial Intent
```
Input: "Help Ray with something"
Expected: 2-4 clarifying questions, then dispatch confirmation
```

### Test Scenario 3: Complete Intent
```
Input: "Help Ray Deck find seed investors for social graph product"
Expected: 0-1 clarifying questions, then dispatch confirmation
```

### Test Scenario 4: Exploratory
```
Input: "I want to help someone in my network"
Expected: Start from scratch (who, what, details)
```

### Test Scenario 5: Interrupt
```
User: "Help Ray find a job"
Assistant: "What kind of role..."
User: "Just do it"
Expected: Immediate dispatch with gathered context
```

---

## ⚠️ CRITICAL RULES (From Mark's Transcript)

1. **"NO SUGGESTIONS before dispatch"** - No person cards during interview
2. **"Interview to understand exactly what you want to help somebody with"** - Ask questions first
3. **"Lean and mean and right to the point"** - Don't over-interview, 2-4 questions max
4. **"Make it feel nice"** - Natural conversation, not robotic
5. **"Super whisper behind the curtains"** - Frontend shows simple UI, backend does complex reasoning

---

## 📊 PRIORITY

| Task | Priority | Hours | Blocks Demo? |
|------|----------|-------|--------------|
| Remove intermediate suggestions | 🔴 Critical | 1h | YES |
| Interview question logic | 🔴 Critical | 2h | YES |
| Dispatch endpoint | 🔴 Critical | 1h | YES |
| Process status endpoint | 🟡 High | 30min | NO (frontend has mock) |
| Meeting prep | 🟢 Nice to have | 2h | NO |

**Total Critical Path:** 4 hours

---

## 🚀 DEPLOYMENT

**Staging Environment:**
- Test all changes in staging first
- Robert will test frontend integration
- Verify no regressions

**Production:**
- Deploy Wednesday evening
- Final test Thursday morning before 9 AM demo

---

## 📞 COORDINATION

**Frontend Ready For:**
- Dispatch confirmation modal (exists, needs wiring)
- Interview flow UI (exists, needs backend responses)
- Waiting room (exists, works)
- Meeting prep card (exists, needs endpoint)

**Frontend Needs From Backend:**
- Correct response formats (text during interview, dispatch at end)
- No intermediate suggestions
- Dispatch endpoint that returns process_id
- Process status endpoint for polling

---

**Questions?** Slack Robert in #copilot-dev or email robert@snappy.ai
