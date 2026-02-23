# Integration Examples - How to Use New Backend Endpoints

## 1. WaitingRoom with Real Process Monitoring

### Before (Mock)
```tsx
import { WaitingRoom } from "./components/WaitingRoom";

<WaitingRoom
  title="Analyzing Network"
  description="Processing..."
  status="running"
  progress={50}
  elapsedSeconds={60}
  onCancel={() => alert("Cancel")}
/>
```

### After (Real Backend)
```tsx
import { WaitingRoomConnected } from "./components/WaitingRoomConnected";

// After dispatching a leverage loop, you get a process_id
const processId = 123; // From backend response

<WaitingRoomConnected
  processId={processId}
  title="Analyzing Network for Ray Deck"
  description="Searching 1,247 contacts and 3,892 connections"
  onComplete={(result) => {
    console.log("Process complete!", result);
    // Show results in OutcomesView
  }}
  onError={(error) => {
    console.error("Process failed:", error);
    // Show error message
  }}
  onCancel={() => {
    console.log("Process cancelled");
    // Navigate back or show cancellation message
  }}
  authToken={userAuthToken} // Optional
  pollIntervalMs={2000} // Optional, default 2s
/>
```

**What it does:**
- Auto-polls `/process-status?process_id=123` every 2 seconds
- Updates progress, status, current_step automatically
- Calls onComplete when status = "complete"
- Handles cancel button click → POST /process-cancel
- Stops polling when process reaches terminal state

---

## 2. Meeting Prep Integration

### Option A: Manual Trigger (Works Without Calendar!)

```tsx
import { generateMeetingPrep } from "../lib/meeting-prep";
import { MeetingPrepCard } from "./MeetingPrepCard";

// User types: "meeting prep for Charles"
// Copilot detects intent and extracts master_person_id

async function handleMeetingPrepRequest(personId: number, context?: string) {
  try {
    const prep = await generateMeetingPrep({
      master_person_id: personId,
      context: context || "Integration meeting",
    });

    // Return MeetingPrepCard with data
    return {
      template: "meeting_prep_card",
      props: {
        person_name: "Charles Njenga", // From person data
        person_title: "Lead Developer at Orbiter",
        meeting_time: "Thursday, Feb 27 @ 9:00 AM",
        summary: prep.person_summary,
        talking_points: prep.talking_points,
        suggested_openers: prep.suggested_openers,
        why_they_care: prep.why_they_care,
        listen_for: prep.listen_for,
        landmines: prep.landmines,
      },
    };
  } catch (error) {
    console.error("Failed to generate meeting prep:", error);
    return { error: "Failed to generate meeting prep" };
  }
}
```

### Option B: Auto-Trigger from Calendar (Requires Calendar API)

```tsx
// Once calendar endpoints are live:
import { generateMeetingPrep } from "../lib/meeting-prep";

async function handleUpcomingMeeting(meetingId: number, attendees: Array<{ master_person_id: number }>) {
  // For each attendee, generate prep
  const preps = await Promise.all(
    attendees.map(attendee =>
      generateMeetingPrep({
        master_person_id: attendee.master_person_id,
        meeting_id: meetingId,
        context: "Upcoming calendar meeting",
      })
    )
  );

  // Return prep cards for all attendees
  return preps;
}
```

---

## 3. Server-Side Dispatch Descriptions (Optional Enhancement)

### Current: Client-Side (Works Great)

```tsx
import { generateBeautifiedDescription } from "../lib/dispatch";

const description = generateBeautifiedDescription(
  "Ray Deck",
  "Find seed investors for Xano.Snappy.ai"
);
// Returns: "I'll leverage your network to help Ray Deck find seed investors..."
```

### Enhanced: Server-Side LLM

```tsx
import { generateDispatchDescription } from "../lib/meeting-prep";

const description = await generateDispatchDescription(
  1024, // master_person_id
  "Find seed investors for Xano.Snappy.ai",
  "SaaS product, raising seed round, need dev tools investors"
);
// Returns: LLM-generated beautified description (more nuanced)
```

**When to use server-side:**
- Need more context-aware descriptions
- Want to incorporate person history/transcripts
- Client-side descriptions feel too generic

**When to stick with client-side:**
- Current descriptions work well
- Don't want extra API call delay
- Want instant UI feedback

---

## 4. Real Dispatch Flow (End-to-End)

### Current Flow:
```tsx
// User confirms dispatch
→ setTimeout(3000, ...) // Mock
→ Show success message
```

### New Flow with Backend:
```tsx
import { WaitingRoomConnected } from "./components/WaitingRoomConnected";

async function handleDispatchConfirm(leverageLoopData) {
  // 1. Create leverage loop
  const response = await fetch("/leverage-loop", {
    method: "POST",
    body: JSON.stringify({
      master_person_id: leverageLoopData.personId,
      goal: leverageLoopData.goal,
      context: leverageLoopData.context,
      fast: false, // Deep research mode
    }),
  });

  const { id: loopId, process_id } = await response.json();

  // 2. Dispatch the loop
  await fetch(`/leverage-loop/${loopId}/dispatch`, {
    method: "PATCH",
    body: JSON.stringify({ approved: true }),
  });

  // 3. Show waiting room with process monitoring
  return (
    <WaitingRoomConnected
      processId={process_id}
      title={`Analyzing network for ${leverageLoopData.personName}`}
      description={leverageLoopData.description}
      onComplete={(result) => {
        // Navigate to Outcomes tab
        // Show results in OutcomeCardEnhanced
      }}
    />
  );
}
```

---

## 5. Update Chat System Prompt for Meeting Prep

### Add to xano.ts chat endpoint prompt:

```typescript
const SYSTEM_PROMPT = `...

## Meeting Prep Mode

When user says:
- "meeting prep for [person]"
- "prepare me for meeting with [person]"
- "what should I know before meeting [person]"

Generate:
{
  "template": "meeting_prep_card",
  "action": "meeting_prep",
  "master_person_id": <extract from person name>,
  "context": "<extract from user message>"
}

The frontend will call the meeting-prep endpoint and display results.

...`;
```

### In frontend chat handler:

```tsx
async function handleChatResponse(response) {
  if (response.action === "meeting_prep") {
    const prep = await generateMeetingPrep({
      master_person_id: response.master_person_id,
      context: response.context,
    });

    return {
      template: "meeting_prep_card",
      props: {
        ...prep,
        person_name: response.person_name,
      },
    };
  }
}
```

---

## 6. Testing Checklist

### Process Monitoring
```bash
# 1. Create a test process (via leverage loop or other endpoint)
curl -X POST https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz/leverage-loop \
  -H "Content-Type: application/json" \
  -d '{"master_person_id": 1024, "goal": "Test", "fast": false}'

# Response: { "id": 789, "process_id": 999 }

# 2. Check status
curl https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz/process-status?process_id=999

# 3. Cancel
curl -X POST https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz/process-cancel \
  -H "Content-Type: application/json" \
  -d '{"process_id": 999}'
```

### Meeting Prep
```bash
# Test meeting prep generation
curl -X POST https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz/meeting-prep \
  -H "Content-Type: application/json" \
  -d '{
    "master_person_id": 40,
    "context": "Integration demo for copilot"
  }'

# Should return:
# {
#   "person_summary": "...",
#   "talking_points": [...],
#   "suggested_openers": [...],
#   "why_they_care": "...",
#   "listen_for": [...],
#   "landmines": [...]
# }
```

### Dispatch Descriptions
```bash
curl -X POST https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz/dispatch-describe \
  -H "Content-Type: application/json" \
  -d '{
    "master_person_id": 1024,
    "goal": "Find seed investors",
    "context": "Xano.Snappy.ai SaaS product"
  }'
```

---

## 7. Environment Variables

Add to `.env.local`:

```bash
# Xano API (Robert's sandbox)
NEXT_PUBLIC_XANO_API_URL=https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz

# Optional: Auth token
NEXT_PUBLIC_XANO_AUTH_TOKEN=your_token_here

# Process monitoring
NEXT_PUBLIC_POLL_INTERVAL_MS=2000

# Calendar (when Mark enables)
NEXT_PUBLIC_GOOGLE_CALENDAR_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=
```

---

## 8. Error Handling

All utilities include proper error handling:

```tsx
try {
  const prep = await generateMeetingPrep({ ... });
  // Success
} catch (error) {
  if (error instanceof Error) {
    console.error("Meeting prep failed:", error.message);
  }
  // Show error toast or fallback UI
}
```

WaitingRoomConnected automatically handles errors via `onError` callback:

```tsx
<WaitingRoomConnected
  processId={123}
  title="..."
  onError={(error) => {
    // Show error toast
    toast.error(`Process failed: ${error}`);
  }}
/>
```

---

## Summary

**Ready to integrate:**
✅ Process monitoring (WaitingRoomConnected)  
✅ Meeting prep (generateMeetingPrep)  
✅ Dispatch descriptions (generateDispatchDescription)  

**Estimated integration time:** 5-8 hours  
**Demo-ready by:** Wednesday EOD  

**Blocked:** Calendar endpoints (needs Mark's OAuth grant)  
**Workaround:** Manual meeting prep trigger works without calendar!
