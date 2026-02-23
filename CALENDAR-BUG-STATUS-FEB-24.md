# Calendar Bug Status Report - Feb 24, 2026

**Task:** Fix the bug preventing Robert from connecting his email account for calendar testing  
**Source:** Transcript #430 (Mark/Robert Product Sync) - Action Item #1  
**Date:** February 24, 2026  
**Status:** ⚠️ BLOCKED ON BACKEND INFRASTRUCTURE

---

## 🎯 EXECUTIVE SUMMARY

**The "bug" isn't a code bug** - it's missing infrastructure. The frontend calendar integration is complete and working with mock data, but Robert can't connect his real email because the Xano backend endpoints don't exist yet.

**What Robert can do NOW:**
- ✅ Test the full calendar UI flow with realistic mock data
- ✅ Review the UX and design
- ✅ Demo the calendar feature to Mark's team

**What Robert CANNOT do yet:**
- ❌ Connect his actual Google/Outlook calendar
- ❌ See his real calendar events
- ❌ Generate meeting prep from actual upcoming meetings

**Why:** The 5 required Xano API endpoints haven't been built, and OAuth integration (Nylas) hasn't been configured.

---

## 📊 CURRENT STATE

### ✅ Frontend (100% Complete)

**Files in place:**
- `app/lib/calendar.ts` - API client with all 4 functions
- `app/lib/calendar-mock.ts` - Mock service for testing
- `app/components/CalendarSettings.tsx` - Full UI component
- `app/components/CalendarSettingsModal.tsx` - Modal wrapper

**Capabilities:**
- Connect/disconnect flow
- Provider selection (Google/Outlook)
- Email validation
- Error handling
- Status checking
- Events display

### ⏳ Backend (0% Complete)

**Missing infrastructure:**

1. **OAuth Provider** (Nylas or similar)
   - Google Calendar OAuth app
   - Outlook Calendar OAuth app
   - Redirect URLs configured
   - Client credentials stored

2. **5 Xano Endpoints** (None exist)
   - `POST /calendar/connect` - Initiate OAuth, store token
   - `GET /calendar/status` - Check connection state
   - `GET /calendar/events` - Fetch upcoming events
   - `POST /calendar/disconnect` - Revoke access
   - `POST /meeting-prep` - Generate AI prep for attendee

3. **Database Schema** (Not created)
   - `calendar_connections` table
   - `calendar_events` cache table
   - Attendee → master_person matching logic

4. **Background Sync** (Not implemented)
   - Cron job for periodic event refresh
   - Webhook handler for real-time updates (optional)

---

## 🚧 WHY ROBERT CAN'T CONNECT YET

When Robert tries to connect his email with the mock disabled (`NEXT_PUBLIC_USE_MOCK_CALENDAR=false`), here's what happens:

1. **User enters email** → `robert@snappy.ai`
2. **Clicks "Connect"** → Frontend calls `POST /calendar/connect`
3. **Xano endpoint missing** → 404 Not Found
4. **Error displayed** → "Failed to connect calendar: Not Found"

**With mocks enabled** (`NEXT_PUBLIC_USE_MOCK_CALENDAR=true`):
- Connection works instantly (no real OAuth)
- Mock data returned (4 fake meetings)
- All UI flows work perfectly
- But it's not Robert's real calendar

---

## 🎬 DEMONSTRATION VIDEO SCRIPT

Robert can still record a demo using mocks to show Mark's team the UX:

### Script:

> "Here's the calendar integration we discussed. Right now I'm using mock data while your backend team builds the OAuth integration.
>
> **[Show calendar settings]**  
> I enter my email, select Google Calendar, and click Connect.
>
> **[Success message appears]**  
> The connection is established - in production this would trigger the OAuth flow.
>
> **[Show connected state]**  
> Now it shows my calendar is connected, the provider, and my email.
>
> **[Show mock events]**  
> Here are upcoming meetings. The real version will pull from my actual Google Calendar.
>
> **[Point to attendees]**  
> Notice each meeting shows attendees - this is what triggers meeting prep generation. If I'm meeting with Mark tomorrow, the system can automatically generate talking points, context, and things to avoid based on our relationship in the knowledge graph.
>
> **[Show disconnect]**  
> And I can disconnect anytime.
>
> The frontend is done. We just need your team to build the 5 Xano endpoints and configure Nylas OAuth. I've documented everything in FOR-MARK-TEAM-CALENDAR.md."

**File for Mark's team:** `FOR-MARK-TEAM-CALENDAR.md` (already exists)

---

## 🔧 WHAT MARK'S TEAM NEEDS TO DO

### Phase 1: OAuth Setup (4-6 hours)

1. **Create Nylas account** (or use existing)
   - URL: https://nylas.com
   - Sign up for developer plan

2. **Configure Google Calendar OAuth**
   - Create OAuth app in Google Cloud Console
   - Add authorized redirect URLs
   - Copy Client ID + Secret to Nylas

3. **Configure Outlook Calendar OAuth**
   - Register app in Azure AD
   - Configure permissions
   - Copy credentials to Nylas

4. **Store credentials in Xano**
   - Add environment variables:
     - `NYLAS_CLIENT_ID`
     - `NYLAS_CLIENT_SECRET`
     - `NYLAS_REDIRECT_URL`

### Phase 2: Database Schema (2-3 hours)

Create two tables in Xano:

**Table: calendar_connections**
```
- id (int, auto-increment, PK)
- user_id (int, FK → users.id)
- provider (text, enum: 'google' | 'outlook')
- email (text)
- nylas_access_token (text, encrypted)
- nylas_account_id (text)
- connected_at (timestamp)
- last_synced_at (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

**Table: calendar_events**
```
- id (int, auto-increment, PK)
- calendar_connection_id (int, FK)
- external_id (text) -- Nylas event ID
- title (text)
- start_time (timestamp)
- end_time (timestamp)
- attendees (json) -- [{email, name, master_person_id}]
- master_person_ids (json) -- [1, 40, 1024]
- location (text)
- description (text)
- last_synced_at (timestamp)
- created_at (timestamp)
```

### Phase 3: Xano Endpoints (8-12 hours)

**Priority order:**

1. **POST /calendar/connect** (3-4 hours)
   - Initiate OAuth with Nylas
   - Handle callback + exchange code for token
   - Store encrypted token in database
   - Return connection object

2. **GET /calendar/status** (1 hour)
   - Query calendar_connections for current user
   - Return connection state

3. **GET /calendar/events** (4-5 hours)
   - Fetch events from Nylas API
   - Match attendee emails to master_person_id
   - Cache results in calendar_events table
   - Return events array

4. **POST /calendar/disconnect** (1 hour)
   - Revoke Nylas token
   - Delete from calendar_connections
   - Delete cached events

5. **POST /meeting-prep** (2-3 hours)
   - Accept master_person_id
   - Fetch person context from knowledge graph
   - Call OpenRouter with Claude Sonnet 4
   - Return meeting prep object

### Phase 4: Background Sync (4-6 hours)

1. **Cron job**: Run every 4 hours
   - For each calendar_connection
   - Fetch events for next 14 days
   - Update calendar_events cache
   - Match new attendees

2. **Webhook handler** (optional)
   - Subscribe to Nylas webhooks
   - Real-time event updates
   - Incremental sync

---

## ⏱️ ESTIMATED TIMELINE

**Best case (dedicated resource):**
- Phase 1 (OAuth): 1 day
- Phase 2 (Schema): 0.5 day
- Phase 3 (Endpoints): 2 days
- Phase 4 (Sync): 1 day
- **Total: 4-5 days**

**Realistic (part-time):**
- 2 weeks (10 business days)
- Assumes 4 hours per day on this feature

**Target completion:** By March 10, 2026 (before next Mark/Robert sync)

---

## 📋 ACCEPTANCE CRITERIA

Robert will consider this COMPLETE when:

- [ ] Can connect real Google Calendar (OAuth flow works)
- [ ] Can connect real Outlook Calendar (OAuth flow works)
- [ ] Status check shows actual connection state
- [ ] Events API returns real calendar events (next 7-14 days)
- [ ] Attendees matched to master_person_id correctly
- [ ] Can disconnect and revoke access
- [ ] Meeting prep generates for actual attendees
- [ ] Background sync keeps events fresh
- [ ] Frontend works with `NEXT_PUBLIC_USE_MOCK_CALENDAR=false`

---

## 🚨 CRITICAL PATH BLOCKERS

1. **OAuth complexity**: Nylas setup requires Azure AD + Google Cloud Console access
2. **Encryption**: Access tokens must be encrypted at rest (compliance)
3. **Attendee matching**: Email → master_person_id logic needs careful testing
4. **Rate limits**: Nylas API has limits; need caching strategy
5. **Error handling**: OAuth can fail silently; need robust retry logic

---

## 🎯 IMMEDIATE NEXT STEPS

### For Robert:
1. ✅ Record demo video using mocks (show Mark the UX)
2. ✅ Forward `FOR-MARK-TEAM-CALENDAR.md` to Mark + Charles
3. ⏭️ Mention on Thursday (Feb 27) integration call
4. ⏭️ Set deadline: March 10 for backend completion

### For Mark's Team:
1. ⏭️ Review `FOR-MARK-TEAM-CALENDAR.md` (comprehensive specs)
2. ⏭️ Assign engineer (Charles or Dennis?)
3. ⏭️ Create Nylas account + configure OAuth
4. ⏭️ Build 5 endpoints in priority order
5. ⏭️ Test with Robert's email accounts
6. ⏭️ Notify when ready for integration

### For Zora:
1. ✅ Document current state (this file)
2. ✅ Create demo script for Robert
3. ⏭️ Monitor progress (check in weekly)
4. ⏭️ Help test endpoints when ready

---

## 📂 KEY FILES REFERENCE

| File | Purpose | Status |
|------|---------|--------|
| `app/lib/calendar.ts` | API client | ✅ Complete |
| `app/lib/calendar-mock.ts` | Mock service | ✅ Working |
| `app/components/CalendarSettings.tsx` | UI component | ✅ Complete |
| `FOR-MARK-TEAM-CALENDAR.md` | Backend specs | ✅ Complete |
| `CALENDAR-BUG-FIX.md` | Technical docs | ✅ Complete |
| `.env.local` | Config | ✅ Mock enabled |

---

## 💬 COMMUNICATION TEMPLATES

### Email to Mark (Robert to send):

**Subject:** Calendar Integration - Backend Requirements

> Hi Mark,
>
> I've finished the frontend for calendar integration (connect Google/Outlook → generate meeting prep). The UI is complete and working with mock data.
>
> To make it work with real calendars, your backend team needs to build 5 Xano endpoints + configure OAuth. I've documented everything here:
>
> **File:** `FOR-MARK-TEAM-CALENDAR.md` (in the repo)
>
> **Estimate:** 4-5 days of focused work, or 2 weeks part-time
>
> **Demo:** I can show you the UX on our Thursday call using mocks
>
> **Target:** March 10 (before our next sync)
>
> Can Charles or Dennis take this on? Happy to hop on a call to walk through the requirements.
>
> – Robert

### Slack to Charles:

> Hey Charles! 👋
>
> I built the calendar integration frontend for meeting prep. It's ready to go, just needs backend:
>
> - 5 Xano endpoints (connect, status, events, disconnect, meeting-prep)
> - Nylas OAuth setup (Google + Outlook)
> - Two database tables
>
> Full specs: `FOR-MARK-TEAM-CALENDAR.md` in the repo
>
> Estimate: ~4-5 days
>
> Can you take this? Or should I sync with Dennis?

---

## ✅ SUMMARY

| Aspect | Status | Owner |
|--------|--------|-------|
| Frontend code | ✅ Complete | Robert/Zora |
| Mock service | ✅ Working | Robert/Zora |
| Documentation | ✅ Complete | Robert/Zora |
| UI/UX | ✅ Demo-ready | Robert/Zora |
| OAuth setup | ⏳ Not started | Mark's team |
| Xano endpoints | ⏳ Not started | Mark's team |
| Database schema | ⏳ Not started | Mark's team |
| Background sync | ⏳ Not started | Mark's team |

**Ball is in Mark's court.** Frontend is done, backend specs are clear, timeline is realistic.

---

**Status:** ⚠️ BLOCKED ON BACKEND (Mark's team)  
**Next Milestone:** OAuth configured + first endpoint working  
**Target Completion:** March 10, 2026  
**Demo Available:** Yes (with mocks)

---

*Report generated by Zora on Feb 24, 2026*
