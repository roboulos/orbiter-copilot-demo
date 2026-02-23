# Calendar Connection Demo Video - Viewing Guide

**Video File:** `calendar-connection-demo.mp4`  
**Duration:** ~16 seconds  
**Resolution:** 1920x1080  
**Created:** February 23, 2026

---

## Overview

This video demonstrates the complete flow for connecting an email account to enable calendar integration in the Orbiter Copilot platform. The calendar feature enables meeting prep functionality that pulls context from your upcoming meetings.

---

## Video Timeline & Steps

### Frame 1: Homepage (0:00 - 0:03)
**What you see:**
- The Orbiter Copilot homepage at https://orbiter-copilot-demo.vercel.app
- Main navigation tabs: Network, Search, Outcomes, Horizon, Collections, Insights, Docs
- Calendar Settings button (📅 icon) visible in the header
- Three main feature cards: Leverage Loop, Outcomes, Serendipity

**Action:**
- Navigate to the Orbiter Copilot demo site
- Locate the Calendar Settings button in the top-right area of the header

---

### Frame 2: Calendar Settings Modal (0:03 - 0:06)
**What you see:**
- Calendar Settings modal dialog opened
- "Connect Your Calendar" heading
- Email Address input field (empty)
- Calendar provider selection:
  - ◉ Google Calendar (selected by default)
  - ○ Outlook Calendar
- "Connect Google Calendar" button (currently disabled)
- Close (×) button in top-right

**Action:**
- Click the Calendar Settings button (📅) from the header
- The modal automatically opens with Google Calendar pre-selected

---

### Frame 3: Email Entered (0:06 - 0:09)
**What you see:**
- Same Calendar Settings modal
- Email Address field now filled with: `robert@snappy.ai`
- Google Calendar still selected
- "Connect Google Calendar" button now **enabled** (blue/active)

**Action:**
- Type your email address into the Email Address field
- The Connect button activates automatically once valid email is entered

**Note:** This is a mock/demo environment - any valid email format will work for testing

---

### Frame 4: Calendar Connected (0:09 - 0:12)
**What you see:**
- Calendar Settings modal after successful connection
- Success indicator (likely showing "Calendar Connected" status)
- Email address displayed: robert@snappy.ai
- Provider confirmed: Google Calendar
- The interface may show additional options or confirmation UI

**Action:**
- Click the "Connect Google Calendar" button
- System simulates calendar connection (in production, this would trigger OAuth flow)
- Success state displayed immediately

**Technical Note:** In the current demo, this uses a mock calendar service. Real production will use Nylas OAuth for actual Google/Outlook calendar access.

---

### Frame 5: Calendar Events (0:12 - 0:16)
**What you see:**
- Calendar Settings modal scrolled down to show "Upcoming Meetings" section
- **4 mock calendar events** with Orbiter team:
  1. **Weekly Sync with Mark**
     - Tomorrow @ 10:00 AM - 11:00 AM
     - Attendees: Mark Pederson, Robert Boulos
     - Location: Zoom
  
  2. **Demo Review with Charles**
     - Day after tomorrow @ 2:00 PM - 3:00 PM
     - Attendees: Charles Njenga, Robert Boulos
     - Location: Google Meet
  
  3. **1:1 with Josh**
     - +3 days @ 4:00 PM - 4:30 PM
     - Attendees: Josh, Robert Boulos
     - Location: Office
  
  4. **Team Standup**
     - +4 days @ 9:00 AM - 9:30 AM
     - Attendees: Mark, Josh, Charles, Dennis, Robert
     - Location: Zoom

**Action:**
- Scroll down within the modal to view upcoming meetings
- Each meeting shows full details: title, time, attendees, location

**What this enables:**
- Meeting prep feature can now pull context about these attendees
- AI can provide insights before meetings
- Calendar data feeds into Copilot responses

---

## Key Features Demonstrated

### ✅ Calendar Connection Flow
- Simple 3-step process: Click → Enter Email → Connect
- No complex OAuth flow in demo (mock service for testing)
- Instant feedback and confirmation

### ✅ Multiple Provider Support
- Google Calendar (shown)
- Outlook Calendar (available)
- Easy switching between providers

### ✅ Meeting Context
- Full meeting details displayed
- Attendee names mapped to knowledge graph
- Time, location, and description visible

### ✅ Mock Service Architecture
- Allows testing without backend OAuth infrastructure
- Generates realistic mock events
- Simulates production UX exactly

---

## Technical Details

### Current Implementation (Demo/Mock)
- **Environment Variable:** `NEXT_PUBLIC_USE_MOCK_CALENDAR=true`
- **Mock Service:** `app/lib/calendar-mock.ts`
- **Mock Events:** 4 pre-defined events with Orbiter team members
- **Data Structure:**
  ```json
  {
    "id": "evt-1",
    "title": "Weekly Sync with Mark",
    "start": "2026-02-25T10:00:00",
    "end": "2026-02-25T11:00:00",
    "attendees": [
      {"email": "mark@orbiter.io", "master_person_id": 1},
      {"email": "robert@snappy.ai", "master_person_id": 1024}
    ],
    "location": "Zoom",
    "description": "Weekly product sync"
  }
  ```

### Production Implementation (Future)
- **OAuth Provider:** Nylas (Google + Outlook integration)
- **Xano Endpoints:** 5 endpoints for calendar CRUD operations
- **Database:** `calendar_connections` + `calendar_events` tables
- **Background Sync:** Cron job every 4 hours
- **Encrypted Tokens:** Secure storage of OAuth tokens
- **Timeline:** ~2 weeks to build (estimated March 10, 2026)

**Full backend specifications:** See `FOR-MARK-TEAM-CALENDAR.md` in repo

---

## Use Cases

### 1. Meeting Prep
**Before:** "Tell me about my meeting with Mark tomorrow"
**After:** AI pulls calendar context, knows Mark is CEO (master_person_id=1), generates prep with relevant relationship history

### 2. Scheduling Intelligence
**Before:** Manual checking of calendar
**After:** AI suggests best times, identifies conflicts, proposes rescheduling

### 3. Network Context
**Before:** Generic contact suggestions
**After:** "You have a meeting with Josh in 3 days - here are relevant talking points"

### 4. Relationship Tracking
**Before:** Manual logging of meetings
**After:** Automatic relationship activity tracking via calendar sync

---

## Testing Instructions (For Robert)

**Quick 30-Second Test:**
1. Visit https://orbiter-copilot-demo.vercel.app
2. Click Calendar icon (📅) in header
3. Enter `robert@snappy.ai`
4. Click "Connect Google Calendar"
5. Verify success message
6. Scroll down to see 4 mock meetings

**Expected Results:**
- ✅ Connection successful (no errors)
- ✅ 4 meetings visible with full details
- ✅ All attendees shown correctly
- ✅ Times displayed as future dates

**What to test:**
- Calendar settings button visibility
- Modal open/close behavior
- Email validation
- Provider selection (Google/Outlook switching)
- Success state display
- Meeting list rendering
- Disconnect functionality

**Full testing guide:** See `ROBERT-QUICK-START.md`

---

## Integration Points

### With Meeting Prep Feature
```typescript
// When user asks about a meeting:
const calendarEvents = await getUpcomingEvents(7); // next 7 days
const meetingContext = calendarEvents.find(e => 
  e.title.includes("Mark") && e.attendees.includes(targetPerson)
);
// Feed meetingContext to AI for prep generation
```

### With Knowledge Graph
```typescript
// Match attendees to master_person_id
const attendees = event.attendees.map(a => ({
  email: a.email,
  person: await getPersonByMasterPersonId(a.master_person_id),
  relationships: await getRelationships(a.master_person_id)
}));
```

### With Copilot Chat
```typescript
// System prompt includes calendar context:
systemPrompt += `\nUpcoming meetings: ${JSON.stringify(calendarEvents)}`;
// AI can reference this context in responses
```

---

## Next Steps

### For Mark's Team (Backend)
1. ⏭️ Review `FOR-MARK-TEAM-CALENDAR.md` (backend specs)
2. ⏭️ Assign engineer (Charles or Dennis)
3. ⏭️ Create Nylas account + OAuth apps
4. ⏭️ Build 5 Xano calendar endpoints
5. ⏭️ Implement database schema
6. ⏭️ Test with Robert's real accounts
7. ⏭️ Deploy to production
8. ⏭️ Switch `USE_MOCK_CALENDAR=false`

**Target:** March 10, 2026  
**Estimate:** 2 weeks (part-time) or 4-5 days (dedicated)

### For Robert (Immediate)
1. ✅ Watch this video
2. ⏭️ Test the flow at https://orbiter-copilot-demo.vercel.app
3. ⏭️ Provide UX feedback
4. ⏭️ Demo to Mark on Thursday (Feb 27) call
5. ⏭️ Validate meeting prep integration

---

## Files & Documentation

| File | Purpose |
|------|---------|
| `calendar-connection-demo.mp4` | This video (148KB, 16 seconds) |
| `CALENDAR-CONNECTION-VIDEO-GUIDE.md` | This guide |
| `demo-screenshots/01-homepage.png` | Frame 1 screenshot |
| `demo-screenshots/02-calendar-settings-modal.png` | Frame 2 screenshot |
| `demo-screenshots/03-email-entered.png` | Frame 3 screenshot |
| `demo-screenshots/04-calendar-connected.png` | Frame 4 screenshot |
| `demo-screenshots/05-calendar-events.png` | Frame 5 screenshot |
| `ROBERT-QUICK-START.md` | Quick start testing guide |
| `CALENDAR-BUG-RESOLUTION-FEB-24.md` | Full technical documentation |
| `FOR-MARK-TEAM-CALENDAR.md` | Backend specifications |

---

## Credits

**Video Creation:**
- Created: February 23, 2026
- By: Zora (AI Agent)
- Tool: agent-browser (Vercel Labs) + ffmpeg
- Method: Automated browser flow capture → slideshow video

**Calendar Feature:**
- Frontend: Robert Boulos
- Backend Specs: Robert Boulos
- Mock Service: Built for testing without OAuth dependencies
- Production Backend: Pending (Mark's team, ~2 weeks)

---

## FAQs

**Q: Why is this a mock service?**
A: The backend OAuth infrastructure doesn't exist yet. Rather than block testing, we built a complete mock that simulates the exact production UX.

**Q: Will my real calendar work?**
A: Not yet. Real calendar requires Nylas OAuth + 5 Xano endpoints (in progress, ~2 weeks).

**Q: Can I test the UX now?**
A: Yes! Visit the demo, enter any email, and see the full flow with mock events.

**Q: What's the difference between mock and production?**
A: Mock simulates instantly, production triggers real OAuth redirect. Frontend code is identical.

**Q: When will production be ready?**
A: Target: March 10, 2026 (depends on Mark's team prioritization)

---

**Questions?** Check `CALENDAR-TEST-VERIFICATION.md` for troubleshooting or contact Robert.

---

**Video URL (when hosted):** _To be added after upload_  
**Demo URL:** https://orbiter-copilot-demo.vercel.app  
**Repository:** https://github.com/roboulos/orbiter-copilot-demo
