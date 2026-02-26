# XANO BACKEND - SIMPLE TO-DO

**For Robert's Other AI**
**Must be done: TODAY (4 hours)**

---

## 🔴 TASK #1: Stop Sending These Cards During Conversation (1 hour)

**Problem:** Backend is sending `contact_card`, `leverage_loop_card` during the interview. Mark said NO.

**Solution:** Update system prompt to ONLY send these response types during conversation:

### ✅ ALLOWED During Interview:
```json
{
  "response": [
    {"type": "text", "text": "What kind of role is Ray looking for?"}
  ]
}
```

### ❌ BLOCKED During Interview:
```json
{
  "response": [
    {"name": "contact_card", "templateProps": {...}},
    {"name": "leverage_loop_card", "templateProps": {...}},
    {"name": "serendipity_card", "templateProps": {...}}
  ]
}
```

### ✅ ONLY AT THE END:
```json
{
  "response": [
    {
      "name": "dispatch_confirmation",
      "templateProps": {
        "person_name": "Ray Deck",
        "goal": "find a chief of staff",
        "details": ["$75-85k/year", "Fully remote", "Dynamic"],
        "master_person_id": 123
      }
    }
  ]
}
```

---

## 🔴 TASK #2: Add Interview Questions (2 hours)

**Problem:** Need to ask 2-4 clarifying questions based on user intent.

**Solution:** Add to system prompt:

```
INTERVIEW PROTOCOL:

1. User says: "Help Ray find a chief of staff"
   → Ask: "Full-time or part-time?"
   → Ask: "Remote or in-office?"
   → Ask: "Budget range?"
   → Ask: "Key qualities needed?"

2. User says: "Help Ray with fundraising"
   → Ask: "What stage? (Seed, Series A, etc.)"
   → Ask: "How much?"
   → Ask: "Type of investors? (Angels, VCs, etc.)"

3. User says: "Make leverage loop for Ray Deck"
   → Ask: 0 questions (direct dispatch)

4. After 2-4 questions, send dispatch_confirmation card
```

---

## 🔴 TASK #3: Build Dispatch Endpoint (1 hour)

**Endpoint:** `POST /api/leverage-loop`

**Request:**
```json
{
  "master_person_id": 123,
  "goal": "find a chief of staff",
  "context": "$75-85k, remote, dynamic",
  "fast": false
}
```

**Response:**
```json
{
  "success": true,
  "process_id": "abc123",
  "status": "processing"
}
```

---

## 🟡 TASK #4: Build Status Endpoint (30 min - Nice to have)

**Endpoint:** `GET /api/process-status/{process_id}`

**Response:**
```json
{
  "status": "in_progress",
  "current_step": "Finding connections...",
  "progress": 45,
  "results": []
}
```

---

## ⚡ PRIORITY

1. **Task #1** - CRITICAL (1 hour)
2. **Task #2** - CRITICAL (2 hours)
3. **Task #3** - CRITICAL (1 hour)
4. **Task #4** - Nice to have (30 min)

**Total: 3-4 hours**

---

## ✅ TEST IT

### Test Scenario 1:
```
User: "Help Ray find a chief of staff"
Expected: 2-4 text questions, then dispatch_confirmation
NOT: contact_card or leverage_loop_card during conversation
```

### Test Scenario 2:
```
User: "Make leverage loop for Ray Deck"
Expected: Immediate dispatch_confirmation
```

---

**Questions?** Ask Robert!
