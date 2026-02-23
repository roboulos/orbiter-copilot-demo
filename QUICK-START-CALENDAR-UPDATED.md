# 🚀 Quick Start: Test Calendar Connection (Feb 24, 2026)

## Current State

- ✅ **Frontend:** 100% complete and working
- ⚠️ **Backend:** Not built yet (5 Xano endpoints + OAuth needed)
- 🎭 **Mock Service:** Available for testing UX

## Option 1: Test with Mocks (Works Now)

### 1-Minute Setup

```bash
# Navigate to project
cd /Users/robertboulos/.openclaw/workspace/projects/orbiter-copilot-demo

# Ensure mock is enabled
grep NEXT_PUBLIC_USE_MOCK_CALENDAR .env.local
# Should show: NEXT_PUBLIC_USE_MOCK_CALENDAR=true

# Start dev server
npm run dev

# Open browser
open http://localhost:3000
```

### Test the Flow

1. **Look for calendar icon** in header (top-right)
2. **Click icon** → Settings modal opens
3. **Enter any email:** `robert@snappy.ai`
4. **Select provider:** Google Calendar
5. **Click "Connect"**

### Expected Result ✅

```
✅ Success message:
"Successfully connected google calendar for robert@snappy.ai"

Calendar Connected:
- Email: robert@snappy.ai
- Provider: google

Mock Events Loaded:
1. Weekly Sync with Mark (Tomorrow 10:00 AM)
2. Demo Review with Charles (Day After 2:00 PM)
3. 1:1 with Josh (3 Days 4:00 PM)
4. Team Standup (4 Days 9:00 AM)
```

### Console Output

Look for these logs:
```
[CALENDAR] Using mock calendar service
[MOCK] Calendar connected: { success: true, calendar_id: 12345, ... }
[MOCK] Returning 4 calendar events
```

### Test Disconnect

1. **Click "Disconnect Calendar"**
2. Status resets to "Not Connected"
3. Can reconnect anytime

## Option 2: Test with Real Backend (Not Available Yet)

### Prerequisites (Not Ready)

- [ ] Nylas account created
- [ ] Google OAuth configured
- [ ] Outlook OAuth configured
- [ ] 5 Xano endpoints built:
  - POST /calendar/connect
  - GET /calendar/status
  - GET /calendar/events
  - POST /calendar/disconnect
  - POST /meeting-prep
- [ ] Database schema created
- [ ] Access tokens encrypted

### When Backend is Ready

```bash
# Disable mock mode
# In .env.local, change to:
NEXT_PUBLIC_USE_MOCK_CALENDAR=false

# Restart server
npm run dev
```

### Real Flow (After Backend Complete)

1. Click calendar icon
2. Enter your actual email
3. Click "Connect"
4. **OAuth popup opens** (Google/Outlook)
5. Grant permissions
6. Redirected back to app
7. **Real events loaded** from your calendar
8. Meeting prep generated for actual attendees

## What Works Now vs. Later

| Feature | Mock (Now) | Real (Later) |
|---------|------------|--------------|
| Calendar connection UI | ✅ Works | ⏳ Needs backend |
| Connect button | ✅ Works | ⏳ Needs OAuth |
| Status check | ✅ Works | ⏳ Needs endpoint |
| Events display | ✅ 4 mock events | ⏳ Your real events |
| Disconnect | ✅ Works | ⏳ Needs endpoint |
| Meeting prep | 🟡 Can test UX | ⏳ Needs AI endpoint |
| Attendee matching | 🟡 Mock data | ⏳ Needs graph logic |

## Troubleshooting

### "No calendar icon in header"
```bash
# Check if component was added
grep -r "CalendarSettings" app/page.tsx
# If missing, add it to header
```

### "Connection fails even with mock enabled"
```bash
# Verify mock flag
cat .env.local | grep MOCK_CALENDAR
# Should be: NEXT_PUBLIC_USE_MOCK_CALENDAR=true

# Clear Next.js cache
rm -rf .next
npm run dev
```

### "Events not showing"
```bash
# Check console logs
# Look for: [MOCK] Returning 4 calendar events
# If missing, check mock service import in calendar.ts
```

### "Want to test real OAuth"
```
⚠️ Not possible yet - backend endpoints don't exist.
See: FOR-MARK-TEAM-CALENDAR.md for what needs to be built.
Timeline: ~2 weeks for Mark's team.
```

## Files to Review

| File | Purpose | Lines |
|------|---------|-------|
| `app/lib/calendar.ts` | API client | 163 |
| `app/lib/calendar-mock.ts` | Mock service | 145 |
| `app/components/CalendarSettings.tsx` | UI component | 238 |
| `FOR-MARK-TEAM-CALENDAR.md` | Backend specs | 312 |
| `CALENDAR-BUG-STATUS-FEB-24.md` | Current status | 445 |

## Demo Script for Mark

> "Let me show you the calendar integration. Right now I'm using mock data while your team builds the OAuth backend.
>
> [Click icon] Here's the calendar settings.
>
> [Enter email] I'll use my Snappy email.
>
> [Click Connect] And connect Google Calendar.
>
> [Success message] Perfect - in production this would trigger the OAuth flow.
>
> [Show status] Now it shows connected with my email and provider.
>
> [Show events] And here are mock meetings - the real version will pull from my actual calendar.
>
> [Point to attendees] Each meeting shows attendees with master_person_ids - this is what drives meeting prep generation. If I'm meeting with you tomorrow, the system can pull our history, recent transcripts, and generate talking points automatically.
>
> [Click disconnect] And I can disconnect anytime.
>
> The frontend is complete - just needs your team to build the 5 Xano endpoints I documented. Should take about 2 weeks part-time."

## Next Steps

**For Robert:**
1. ✅ Test with mocks (works now)
2. ✅ Record demo video for Mark
3. ⏭️ Forward requirements doc to Mark's team
4. ⏭️ Schedule backend kickoff call

**For Mark's Team:**
1. ⏭️ Review FOR-MARK-TEAM-CALENDAR.md
2. ⏭️ Assign engineer (Charles or Dennis)
3. ⏭️ Create Nylas account
4. ⏭️ Build 5 endpoints in priority order
5. ⏭️ Test with Robert's email
6. ⏭️ Notify when ready

**Target:** March 10, 2026

---

**Status:** Frontend ✅ | Backend ⏳ | Demo 🎬 | Blocked on: Mark's team  
**Updated:** February 24, 2026 by Zora
