# Calendar Integration - Backend Requirements

**To:** Mark's Backend Team (Charles, Dennis)  
**From:** Robert (via Zora)  
**Date:** February 23, 2026  
**Priority:** HIGH (Critical for demo)

## 🎯 What Robert Needs

Robert can now **test the calendar UI** using mock data, but we need **5 Xano endpoints** to make it work for real.

## 📋 Required Endpoints

All endpoints should be added to **Group 1261** (`api:Bd_dCiOz`) - Robert's sandbox.

### 1. POST `/calendar/connect`
Connect user's Google or Outlook calendar via OAuth.

**Request:**
```json
{
  "email": "robert@snappy.ai",
  "provider": "google"  // or "outlook"
}
```

**Response:**
```json
{
  "success": true,
  "calendar_id": 12345,
  "provider": "google",
  "email": "robert@snappy.ai",
  "connected_at": 1708704000
}
```

**Notes:**
- Requires Nylas integration (or similar OAuth provider)
- Store encrypted access token
- Return error if OAuth fails

---

### 2. GET `/calendar/status`
Check if user has a calendar connected.

**Response:**
```json
{
  "connected": true,
  "email": "robert@snappy.ai",
  "provider": "google"
}
```

Or if not connected:
```json
{
  "connected": false
}
```

---

### 3. GET `/calendar/events`
Fetch upcoming calendar events.

**Query Params:**
- `days_ahead` (optional, default: 7) - How many days to look ahead
- `limit` (optional, default: 20) - Max events to return

**Response:**
```json
{
  "events": [
    {
      "id": 1,
      "title": "Weekly Sync with Mark",
      "start_time": 1708704000,
      "end_time": 1708707600,
      "attendees": [
        {
          "email": "mark@orbiter.io",
          "name": "Mark Pederson",
          "master_person_id": 1
        }
      ],
      "master_person_ids": [1, 1024],
      "location": "Zoom",
      "description": "Weekly product sync"
    }
  ],
  "total": 4
}
```

**Important:**
- Must match attendee emails to `master_person_id` in your database
- Include `master_person_ids` array for easy lookup
- Filter out past events

---

### 4. POST `/calendar/disconnect`
Disconnect user's calendar.

**Response:**
```json
{
  "success": true
}
```

---

### 5. POST `/meeting-prep`
Generate AI meeting prep for a person.

**Request:**
```json
{
  "master_person_id": 1,
  "meeting_id": 123,  // optional
  "context": "Discussing Q1 goals"  // optional
}
```

**Response:**
```json
{
  "person_summary": "Mark Pederson is the CEO of Orbiter...",
  "talking_points": [
    "Ask about Q1 roadmap progress",
    "Discuss leverage loops feature",
    "Review demo feedback"
  ],
  "suggested_openers": [
    "How's the Q1 roadmap shaping up?",
    "What's your take on the leverage loops prototype?"
  ],
  "why_they_care": "Mark is focused on shipping core features before fundraise...",
  "listen_for": [
    "Concerns about timeline",
    "Questions about technical feasibility"
  ],
  "landmines": [
    "Avoid criticizing current Copilot UI (Dennis built it)",
    "Don't promise specific dates"
  ]
}
```

**Notes:**
- Use OpenRouter + Claude Sonnet 4
- Pull person context from knowledge graph
- Include recent transcript mentions
- Keep it concise (3-5 items per array)

---

## 🔧 Technical Setup Required

### Nylas Integration (for OAuth)

1. **Create Nylas account**: https://nylas.com
2. **Configure OAuth apps**:
   - Google Calendar API
   - Microsoft Outlook Calendar API
3. **Store credentials** in Xano environment variables:
   - `NYLAS_CLIENT_ID`
   - `NYLAS_CLIENT_SECRET`
   - `NYLAS_REDIRECT_URL`

### Database Schema

```sql
-- Calendar connections
calendar_connections:
  - id (int, PK)
  - user_id (int, FK)
  - provider (enum: google, outlook)
  - email (text)
  - nylas_access_token (text, encrypted)
  - connected_at (timestamp)
  - last_synced (timestamp)

-- Cached calendar events
calendar_events:
  - id (int, PK)
  - calendar_id (int, FK)
  - external_id (text)  -- Nylas event ID
  - title (text)
  - start_time (timestamp)
  - end_time (timestamp)
  - attendees (json)
  - location (text)
  - description (text)
  - master_person_ids (json)  -- [1, 40, 1024]
  - last_synced (timestamp)
```

### Sync Strategy

1. **On connect**: Fetch next 30 days of events
2. **Cron job**: Sync every 4 hours
3. **Webhook**: Real-time updates from Nylas (optional)

---

## 🎨 Frontend is Ready

The frontend code is **100% complete** and waiting for these endpoints:

- ✅ `app/lib/calendar.ts` - API client
- ✅ `app/components/CalendarSettings.tsx` - UI component
- ✅ `app/components/CalendarSettingsModal.tsx` - Modal wrapper
- ✅ Mock service for testing (can be removed after backend is ready)

To test with mocks, Robert just needs to set:
```bash
NEXT_PUBLIC_USE_MOCK_CALENDAR=true
```

To use real endpoints, set:
```bash
NEXT_PUBLIC_USE_MOCK_CALENDAR=false
```

---

## 📅 Timeline

**Target:** Build in next 2 weeks (before next Mark/Robert sync)

**Priority order:**
1. `/calendar/connect` + `/calendar/status` (core connection)
2. `/calendar/events` (fetch events)
3. `/meeting-prep` (AI integration)
4. `/calendar/disconnect` (cleanup)

**Testing:**
1. Use Robert's email (robert@snappy.ai, robertjboulos@gmail.com)
2. Test with both Google and Outlook
3. Verify attendee matching works
4. Test error cases (invalid email, OAuth rejection)

---

## 🔗 References

- **Full bug report**: `CALENDAR-BUG-FIX.md`
- **Backend TODO**: `BACKEND-TODO.md` (lines 15-25)
- **Frontend types**: `app/lib/calendar.ts` (lines 8-41)
- **Demo repo**: https://github.com/roboulos/orbiter-copilot-demo
- **Latest commit**: `65fcef1` (calendar mock + components)

---

## ❓ Questions?

Ping Robert on Slack or during the Thursday integration call (Feb 27 @ 9 AM).

The frontend is ready to go — just needs the backend to catch up! 🚀
