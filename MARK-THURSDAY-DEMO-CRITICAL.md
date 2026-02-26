# MARK THURSDAY DEMO - CRITICAL TO-DO LIST
**Meeting with Denis/Charles:** Thursday @ 9 AM EST
**Demo Day:** Thursday Feb 27 @ 9 AM
**Generated:** Feb 26, 2026

---

## 🎯 MARK'S EXACT REQUIREMENTS (From Transcript)

### **LEVERAGE LOOPS ONLY** (Demo Priority #1)

**What Mark Wants:**
> "infinitely simpler than what you've been doing right now"
> "Just a conversation about an interview to understand exactly what you want to help somebody with"

**Two Paths:**

#### Path 1: Direct Dispatch (No Interview)
1. User searches person: "Ray Deck"
2. User says: "Make leverage loop for Ray Deck"
3. System → Agent finds mutual connections (no interview)
4. Dispatch happens

#### Path 2: Specific Help (Interview Required)
1. User searches person: "Ray Deck"
2. User says: "Help Ray Deck find a chief of staff"
3. Co-pilot asks clarifying questions:
   - "Full-time or part-time?"
   - "Remote or in-person?"
   - "Budget range?"
   - "Key qualities needed?"
4. User answers 2-4 questions
5. Beautiful dispatch confirmation modal shows:
   > "Leverage my network to help Ray Deck find a chief of staff for $75-85k/year, fully remote. Must be dynamic and charming..."
6. User clicks "Yes" → Dispatch

**CRITICAL RULE:**
> "NO SUGGESTIONS before dispatch" - Mark (repeated 3x in transcript)

**What to Remove:**
- All intermediate search results during conversation
- All person suggestions mid-flow
- Anything that looks like we're "jumping ahead"

**What to Add:**
- Beautiful dispatch confirmation modal (Mark will send copy today)
- Interview questions for Path 2
- Clean flow from search → interview → dispatch

---

## ✅ TO-DO LIST (Prioritized)

### 🔴 CRITICAL - Must Complete Today (6-8 hours)

#### 1. Remove Intermediate Suggestions (30 min)
**File:** `app/page.tsx` (chat handler section)
**Change:** Comment out or remove any person suggestion logic during conversation
**Test:** Type "I want to help someone" → Should NOT show person cards until dispatch confirmation

#### 2. Build Dispatch Confirmation Modal (2-3 hours)
**File:** Create `app/components/DispatchConfirmationModal.tsx`
**Props:**
```typescript
interface DispatchConfirmationProps {
  person: string; // "Ray Deck"
  goal: string; // "find a chief of staff"
  details: string[]; // ["$75-85k/year", "fully remote", "dynamic and charming"]
  onConfirm: () => void;
  onEdit: () => void;
  onCancel: () => void;
}
```
**Design:**
- Clean modal overlay
- Large readable text
- Green "Yes, Leverage My Network" button
- Gray "Edit" and "Cancel" buttons
- Show compiled context from interview

#### 3. Interview Question Logic (2-3 hours)
**File:** Update chat system prompt or create `app/lib/interview-logic.ts`
**Detect scenarios:**
- **Complete intent:** "Help Ray find seed investors for social graph product" → 0-1 clarifying questions
- **Partial intent:** "Help Ray with something" → 2-4 guided questions
- **Exploratory:** "I want to help someone" → Start from scratch

**Question templates:**
- Job search: role, remote/onsite, salary, key requirements
- Fundraising: stage, amount, investor criteria
- Hiring: role, budget, remote/onsite, key qualities
- Generic: "What would you like to help [Person] with?"

#### 4. Wire Interview → Dispatch Flow (1-2 hours)
**Files:** `app/page.tsx`, new modal component
**Flow:**
1. User completes interview (2-4 Q&A turns)
2. System builds dispatch summary
3. Show DispatchConfirmationModal
4. User clicks "Yes"
5. POST to `/leverage-loop` or similar
6. Redirect to WaitingRoom

#### 5. Test Both Paths End-to-End (1 hour)
**Path 1 Test:**
- Search "Ray Deck"
- Say "Make leverage loop for Ray Deck"
- Verify → dispatch confirmation
- Click "Yes"
- Verify → waiting room

**Path 2 Test:**
- Search "Ray Deck"
- Say "Help Ray find a chief of staff"
- Answer 2-4 questions
- Verify → dispatch confirmation with compiled context
- Click "Yes"
- Verify → waiting room

#### 6. Polish & Clean UI (30 min - 1 hour)
- Remove any debug console.logs
- Fix any visual glitches
- Test on both desktop and mobile
- Ensure loading states work

---

### 🟡 NICE TO HAVE (If Time Permits)

#### 7. Meeting Prep Mode (Bonus)
**Only if leverage loops is 100% solid**
- Show as mode option
- Wire to calendar endpoint
- Generate talking points, openers, landmines
- Estimated: 2-3 hours

---

## 🧪 TESTING PROTOCOL

### Manual Test Checklist
```
□ Path 1: Direct dispatch works
□ Path 2: Interview flow works
□ No intermediate suggestions appear
□ Dispatch modal shows correct info
□ "Yes" button triggers dispatch
□ Waiting room appears after dispatch
□ Can test with multiple people
□ Works on mobile
□ No console errors
□ Looks professional
```

---

## 📋 XANO BACKEND REQUIREMENTS

### For Robert's Other AI to Handle

#### 1. Leverage Loop Dispatch Endpoint
**Endpoint:** POST `/api/leverage-loop`
**Body:**
```json
{
  "master_person_id": 123,
  "goal": "find a chief of staff",
  "context": {
    "budget": "$75-85k/year",
    "remote": true,
    "requirements": ["dynamic", "charming", "organized"]
  },
  "fast": true
}
```
**Response:**
```json
{
  "process_id": "abc123",
  "status": "processing"
}
```

#### 2. Process Status Endpoint
**Endpoint:** GET `/api/process-status/{process_id}`
**Response:**
```json
{
  "status": "in_progress" | "complete" | "failed",
  "current_step": "Finding mutual connections...",
  "progress": 45,
  "results": [] // populated when complete
}
```

#### 3. Interview System Prompt Update
**File:** Backend chat endpoint system prompt
**Add:**
- Detect leverage loop intent
- Ask 2-4 clarifying questions for partial intent
- Return compiled context for dispatch confirmation
- No intermediate suggestions

---

## 🚀 EXECUTION PLAN

### Today (Wednesday Feb 26)
**6-8 hours of focused work**

1. **9:00 AM - 10:00 AM:** Remove intermediate suggestions, test
2. **10:00 AM - 1:00 PM:** Build dispatch confirmation modal
3. **1:00 PM - 2:00 PM:** Lunch break
4. **2:00 PM - 5:00 PM:** Interview question logic + wiring
5. **5:00 PM - 6:00 PM:** End-to-end testing
6. **6:00 PM - 7:00 PM:** Polish & final checks

### Tomorrow (Thursday Feb 27)
**9:00 AM:** Meeting with Denis/Charles to integrate
**9:00 AM (later):** Demo with Mark

---

## 📸 DEMO SCRIPT (3-4 minutes)

### Scenario 1: Direct Dispatch (30 seconds)
1. Open copilot
2. Search "Ray Deck"
3. Say: "Make leverage loop for Ray Deck"
4. Dispatch confirmation appears
5. Click "Yes"
6. Show waiting room

### Scenario 2: Interview Flow (2-3 minutes)
1. Open copilot
2. Search "Ray Deck"
3. Say: "Help Ray find a chief of staff"
4. Answer questions:
   - Full-time or part-time? → "Full-time"
   - Remote? → "Yes, fully remote"
   - Budget? → "$75-85k per year"
   - Key qualities? → "Dynamic, organized, great communicator"
5. Dispatch confirmation shows compiled context
6. Click "Yes"
7. Show waiting room → results

### Scenario 3: Meeting Prep (Bonus - 1 minute)
1. Switch to "Meeting Prep" mode
2. Say: "Meeting prep for Charles"
3. Show: Summary, talking points, openers, landmines

---

## 💬 MARK'S FEEDBACK QUOTES (For Reference)

> "I want it to be as lean and mean and right to the point"

> "The user doesn't know how agents work. So the user it's sort of like the difference between people that get really good at just basic prompting because they learn a few basic tricks but you and I don't pro when we're making the system prompt it's like we're doing the super whisper"

> "This co-pilot is really just a contextrich go do this make it so for a bunch of agents"

> "It's all about an interview process to have the right context that is secretly behind the curtains"

> "Whether it's you or them, but I mean it needs to end up in our UI or close to our UI"

> "What I really want to be able to do is demo leverage loops"

---

## ⚠️ CRITICAL SUCCESS FACTORS

1. **Simplicity:** Leverage loops only, no other features
2. **No Premature Suggestions:** Clean interview, dispatch at end
3. **Beautiful Modal:** Mark sending copy, make it look professional
4. **Both Paths Work:** Direct dispatch + Interview flow
5. **In Orbiter UI:** Must be integrated with Denis/Charles
6. **3-4 Min Demo:** Rehearse, time it, have fallback

---

**Status:** Ready to execute. Let's build! 🚀
