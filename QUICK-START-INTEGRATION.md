# Quick Start: Backend Integration

**Goal:** Wire up 4 new backend endpoints to frontend in 6-8 hours  
**Deadline:** Wednesday EOD for Thursday 9 AM demo  
**Status:** Backend ready, utilities built, examples documented

---

## ⚡ TL;DR - What to Do

1. **WaitingRoom** - Replace mock setTimeout with real polling (2-3h)
2. **Meeting Prep** - Wire chat to `/meeting-prep` endpoint (2-3h)
3. **Test** - End-to-end with real data (1-2h)
4. **Demo Prep** - Script + rehearsal (1h)

**Total:** 6-8 hours

---

## 🎯 Priority 1: WaitingRoom (2-3 hours)

### Current Code (Mock)
```tsx
// In DispatchConfirmationModal.tsx line 89-95
setTimeout(() => {
  setIsDispatchComplete(true);
}, 3000);
```

### New Code (Real)
```tsx
import { WaitingRoomConnected } from "../components/WaitingRoomConnected";

// After dispatch confirms:
const dispatchResponse = await fetch(`${BASE_URL}/leverage-loop`, {
  method: "POST",
  body: JSON.stringify({
    master_person_id: selectedPerson.master_person_id,
    goal: goal,
    context: context,
    fast: false,
  }),
});

const { id: loopId, process_id } = await dispatchResponse.json();

// Submit dispatch
await fetch(`${BASE_URL}/leverage-loop/${loopId}/dispatch`, {
  method: "PATCH",
  body: JSON.stringify({ approved: true }),
});

// Show waiting room
return (
  <WaitingRoomConnected
    processId={process_id}
    title={`Analyzing network for ${selectedPerson.full_name}`}
    description={beautifiedDescription}
    onComplete={(result) => {
      // Navigate to Outcomes tab
      // Show results
    }}
    onError={(error) => {
      // Show error toast
    }}
    onCancel={() => {
      // Go back to copilot
    }}
  />
);
```

### Files to Edit
- `app/components/DispatchConfirmationModal.tsx` (line 89-95)
- `app/page.tsx` (add WaitingRoomConnected to navigation flow)

---

## 🎯 Priority 2: Meeting Prep (2-3 hours)

### Step 1: Update System Prompt

Edit `app/lib/xano.ts` chat system prompt:

```typescript
const SYSTEM_PROMPT = `
You are Orbiter Copilot...

## Meeting Prep Mode

When user requests meeting preparation:
- "meeting prep for [Person Name]"
- "prepare me for meeting with [Person Name]"
- "what should I know before talking to [Person Name]"

Respond with this JSON structure:
{
  "template": "meeting_prep_card",
  "action": "meeting_prep",
  "person_name": "[extracted name]",
  "master_person_id": [person ID from search],
  "context": "[extracted context from user message]"
}

The frontend will call the meeting-prep endpoint automatically.

...
`;
```

### Step 2: Handle Response in Frontend

Edit `app/page.tsx` chat handler:

```tsx
import { generateMeetingPrep } from "./lib/meeting-prep";

async function handleChatMessage(message: unknown) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    body: JSON.stringify({ message, /* ... */ }),
  });

  const data = await response.json();

  // Check if it's a meeting prep action
  if (data.action === "meeting_prep") {
    try {
      const prep = await generateMeetingPrep({
        master_person_id: data.master_person_id,
        context: data.context,
      });

      // Return meeting prep card with data
      return {
        template: "meeting_prep_card",
        props: {
          person_name: data.person_name,
          person_title: "", // Fetch from person data
          meeting_time: "", // Optional: fetch from calendar when available
          summary: prep.person_summary,
          talking_points: prep.talking_points,
          suggested_openers: prep.suggested_openers,
          why_they_care: prep.why_they_care,
          listen_for: prep.listen_for,
          landmines: prep.landmines,
        },
      };
    } catch (error) {
      console.error("Meeting prep failed:", error);
      return {
        template: "text",
        content: "Sorry, I couldn't generate meeting prep for that person.",
      };
    }
  }

  // Handle other responses...
}
```

### Files to Edit
- `app/lib/xano.ts` (system prompt)
- `app/page.tsx` (chat handler)

---

## 🧪 Testing (1-2 hours)

### 1. Test Process Monitoring

```bash
# Open browser console at localhost:3000
# Type in copilot: "help Ray Deck find investors"
# Confirm dispatch
# Check that WaitingRoomConnected appears
# Verify it polls every 2 seconds
# Test cancel button
```

### 2. Test Meeting Prep

```bash
# In copilot, type: "meeting prep for Charles"
# Should show MeetingPrepCard with:
# - Person summary
# - Talking points
# - Suggested openers
# - Why they care
# - Listen for
# - Landmines (topics to avoid)
```

### 3. Test Network Features (Already Fixed!)

```bash
# Click Network tab
# Should show 135 contacts (seeded by backend)
# Test person search in PersonPicker
# Should work without null errors
```

---

## 📋 Detailed Checklist

### Before You Start
- [ ] Read BACKEND-STATUS-FEB23.md (8KB overview)
- [ ] Read INTEGRATION-EXAMPLES.md (9KB code examples)
- [ ] Review current code structure
- [ ] Test backend endpoints with curl (see examples)

### WaitingRoom Integration
- [ ] Import WaitingRoomConnected in DispatchConfirmationModal
- [ ] Replace setTimeout with real dispatch flow
- [ ] Get process_id from leverage-loop response
- [ ] Pass process_id to WaitingRoomConnected
- [ ] Handle onComplete callback (navigate to Outcomes)
- [ ] Handle onError callback (show toast)
- [ ] Handle onCancel callback (go back)
- [ ] Test with real dispatch
- [ ] Verify polling works
- [ ] Verify cancel works
- [ ] Verify progress updates
- [ ] Check terminal states (complete/error)

### Meeting Prep Integration
- [ ] Import generateMeetingPrep in page.tsx
- [ ] Update system prompt in xano.ts
- [ ] Add meeting_prep action handler
- [ ] Call generateMeetingPrep() when detected
- [ ] Map response to MeetingPrepCard props
- [ ] Test with "meeting prep for Charles"
- [ ] Verify all fields populate correctly
- [ ] Test with different people
- [ ] Handle errors gracefully
- [ ] Add loading state while generating

### End-to-End Testing
- [ ] Full dispatch flow (copilot → confirm → waiting → results)
- [ ] Meeting prep flow (chat → detect → generate → display)
- [ ] Person search (network tab)
- [ ] Network list (135 contacts)
- [ ] Error states (network failures)
- [ ] Cancel flows (user aborts)
- [ ] Multiple concurrent processes (if applicable)

### Demo Prep
- [ ] Write demo script (see below)
- [ ] Practice demo flow
- [ ] Prepare fallback slides (if demo fails)
- [ ] Test on production URL (Vercel)
- [ ] Rehearse with Charles scenario

---

## 🎬 Demo Script (Thursday 9 AM)

### Scenario: Meeting Prep for Charles

**Setup (30 seconds):**
- "This is the Orbiter Copilot demo we've been building"
- "It helps you leverage your network intelligently"
- "Let me show you the new features we just integrated"

**Demo 1: Meeting Prep (1 minute):**
1. Open copilot
2. Type: "meeting prep for Charles"
3. Wait 2-3 seconds (LLM generates)
4. Show MeetingPrepCard with:
   - Summary of Charles
   - Talking points (demo improvements, integration, timeline)
   - Suggested openers
   - What to listen for
   - Landmines (don't over-promise, don't criticize existing work)
5. "This pulls from our knowledge graph and transcripts"

**Demo 2: Dispatch + Process Monitoring (2 minutes):**
1. Type: "help Ray Deck find investors for his new startup"
2. Show dispatch confirmation modal
3. Highlight beautified description
4. Click "Dispatch"
5. Show WaitingRoom with:
   - Real-time progress bar
   - Current step updates
   - Elapsed time counter
6. "This is monitoring a real background process"
7. Optional: Show cancel button
8. Wait for completion (or skip if taking too long)
9. Navigate to Outcomes tab
10. Show results in enhanced outcome card

**Wrap-up (30 seconds):**
- "Frontend is 95% done"
- "4 endpoints integrated today"
- "Ready to wire into main Orbiter app"
- "Questions?"

**Total time:** 3-4 minutes

---

## 🚨 Troubleshooting

### Process polling not working
- Check `NEXT_PUBLIC_XANO_API_URL` in .env.local
- Verify process_id is valid number
- Check network tab for 401/403 errors
- Ensure auth token is passed if required

### Meeting prep not triggering
- Check system prompt includes meeting_prep pattern
- Verify chat handler checks for `action === "meeting_prep"`
- Test endpoint directly with curl first
- Check console for errors

### "Export OutcomeCard doesn't exist"
- Should be fixed (OutcomeCardEnhanced)
- If error persists: `npm run dev` restart

---

## 📞 Need Help?

**Files to reference:**
- BACKEND-STATUS-FEB23.md (overview)
- INTEGRATION-EXAMPLES.md (code examples)
- app/lib/process.ts (utilities)
- app/lib/meeting-prep.ts (utilities)
- app/components/WaitingRoomConnected.tsx (polling wrapper)

**Backend team:**
- All endpoints live at: https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz
- Test with curl commands in INTEGRATION-EXAMPLES.md

**Frontend utilities:**
- All imported and ready to use
- Full TypeScript support
- Error handling included

---

## ✅ Success Criteria

By Wednesday EOD:

- [ ] WaitingRoom polls real backend every 2s
- [ ] Process cancel button works
- [ ] Meeting prep generates from chat
- [ ] MeetingPrepCard displays all fields
- [ ] End-to-end test passes
- [ ] Demo script written
- [ ] Charles scenario tested

**Then Thursday 9 AM = 🚀 DEMO TIME!**

---

**Time estimate:** 6-8 hours focused work  
**Difficulty:** Medium (utilities built, just wiring)  
**Blockers:** None (calendar not needed for demo)

**Let's ship it! 🎉**
