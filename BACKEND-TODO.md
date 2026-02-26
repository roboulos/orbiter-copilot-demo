# 🔧 BACKEND TODO - Real Endpoints Needed

**Purpose:** Build real Xano endpoints to replace all mock data

**Status:** Currently using mock data for demo - these endpoints will make it production-ready

**Priority:** Calendar endpoints are highest priority for Thursday demo impact

---

## 🔴 CRITICAL: Calendar Integration (Priority 1)

### Overview
Currently using mock data (`calendar-mock.ts`) - need real Google/Outlook calendar integration

### Required Endpoints

#### 1. `POST /calendar/connect`
**Purpose:** OAuth flow to connect user's calendar

**Request:**
```json
{
  "provider": "google" | "outlook",
  "code": "oauth_authorization_code",
  "redirect_uri": "https://app.orbiter.io/callback"
}
```

**Response:**
```json
{
  "success": true,
  "calendar_id": 12345,
  "provider": "google",
  "email": "robert@snappy.ai",
  "connected_at": 1709265600,
  "scopes": ["calendar.readonly"]
}
```

**Backend Tasks:**
- [ ] Set up Google OAuth 2.0 app (Google Cloud Console)
- [ ] Set up Microsoft OAuth app (Azure AD)
- [ ] Store OAuth tokens securely (encrypted)
- [ ] Handle token refresh (Google tokens expire after 1 hour)
- [ ] Store calendar connection in database (users table or calendar_connections table)

**OAuth Scopes Needed:**
- **Google:** `https://www.googleapis.com/auth/calendar.readonly`
- **Outlook:** `Calendars.Read`

---

#### 2. `GET /calendar/events`
**Purpose:** Fetch upcoming calendar events for connected user

**Request:**
```
GET /calendar/events?days_ahead=7&limit=10
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "events": [
    {
      "id": "google_event_abc123",
      "title": "Weekly Sync with Mark",
      "start_time": 1709352000,
      "end_time": 1709355600,
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
  "total": 5
}
```

**Backend Tasks:**
- [ ] Call Google Calendar API: `GET https://www.googleapis.com/calendar/v3/calendars/primary/events`
- [ ] Call Microsoft Graph API: `GET https://graph.microsoft.com/v1.0/me/events`
- [ ] Parse events into unified format
- [ ] Match attendee emails to `master_person_id` (join with users/network table)
- [ ] Filter to next N days
- [ ] Sort by start_time ASC
- [ ] Cache results (5-15 min TTL to reduce API calls)

**Google Calendar API Params:**
```
timeMin: 2024-02-26T00:00:00Z
timeMax: 2024-03-04T23:59:59Z
maxResults: 10
singleEvents: true
orderBy: startTime
```

**Microsoft Graph API Params:**
```
$filter: start/dateTime ge '2024-02-26T00:00:00Z' and start/dateTime le '2024-03-04T23:59:59Z'
$top: 10
$orderby: start/dateTime
```

---

#### 3. `GET /calendar/status`
**Purpose:** Check if user has calendar connected

**Request:**
```
GET /calendar/status
Authorization: Bearer {user_token}
```

**Response:**
```json
{
  "connected": true,
  "email": "robert@snappy.ai",
  "provider": "google",
  "last_sync": 1709265600,
  "token_valid": true
}
```

**Backend Tasks:**
- [ ] Query calendar_connections table for user
- [ ] Check if OAuth token is still valid (not expired)
- [ ] Return connection status

---

#### 4. `POST /calendar/disconnect`
**Purpose:** Unlink calendar connection

**Request:**
```json
{
  "calendar_id": 12345
}
```

**Response:**
```json
{
  "success": true,
  "message": "Calendar disconnected"
}
```

**Backend Tasks:**
- [ ] Revoke OAuth token (call Google/Microsoft revoke endpoint)
- [ ] Delete calendar_connections record
- [ ] Clear any cached calendar data

---

#### 5. `POST /calendar/refresh` (Optional, but recommended)
**Purpose:** Manually trigger calendar sync

**Request:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "events_synced": 12,
  "last_sync": 1709265600
}
```

**Backend Tasks:**
- [ ] Force refresh calendar events cache
- [ ] Re-fetch from Google/Outlook
- [ ] Update last_sync timestamp

---

### Database Schema Needed

#### `calendar_connections` table
```sql
CREATE TABLE calendar_connections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  provider ENUM('google', 'outlook') NOT NULL,
  email VARCHAR(255) NOT NULL,
  access_token TEXT NOT NULL,        -- Encrypted
  refresh_token TEXT,                -- Encrypted
  token_expires_at TIMESTAMP,
  scopes JSON,                       -- Array of granted scopes
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_sync TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_provider (user_id, provider)
);
```

#### `cached_calendar_events` table (optional, for performance)
```sql
CREATE TABLE cached_calendar_events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  calendar_connection_id INT NOT NULL,
  external_event_id VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  attendees JSON,                    -- Array of {email, name, master_person_id}
  location VARCHAR(500),
  description TEXT,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (calendar_connection_id) REFERENCES calendar_connections(id),
  INDEX idx_connection_time (calendar_connection_id, start_time)
);
```

---

### OAuth Flow Implementation

#### Frontend Flow (already built in demo):
```typescript
// 1. User clicks "Connect Calendar"
// 2. Redirect to OAuth URL
const authUrl = `${XANO_URL}/calendar/oauth-url?provider=google`;
window.location.href = authUrl;

// 3. User approves in Google/Outlook
// 4. Redirect back to app with code
// 5. Exchange code for tokens
const response = await fetch(`${XANO_URL}/calendar/connect`, {
  method: 'POST',
  body: JSON.stringify({ code, provider }),
});
```

#### Backend Flow (needs building):
```javascript
// Xano function: GET /calendar/oauth-url
const provider = request.query.provider;

if (provider === 'google') {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${REDIRECT_URI}&` +
    `response_type=code&` +
    `scope=https://www.googleapis.com/auth/calendar.readonly&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  return { url: authUrl };
}

// Xano function: POST /calendar/connect
const { code, provider } = request.body;

// Exchange code for tokens
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  body: JSON.stringify({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  })
});

const { access_token, refresh_token, expires_in } = tokenResponse;

// Get user's email from Google
const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: { Authorization: `Bearer ${access_token}` }
});
const { email } = profileResponse;

// Store in database (encrypt tokens!)
const connection = await db.calendar_connections.create({
  user_id: auth_user.id,
  provider: 'google',
  email,
  access_token: encrypt(access_token),
  refresh_token: encrypt(refresh_token),
  token_expires_at: Date.now() + (expires_in * 1000),
  scopes: ['calendar.readonly']
});

return {
  success: true,
  calendar_id: connection.id,
  provider: 'google',
  email,
  connected_at: connection.connected_at
};
```

---

### Environment Variables Needed

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://app.orbiter.io/auth/google/callback

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_application_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_REDIRECT_URI=https://app.orbiter.io/auth/microsoft/callback

# Encryption (for storing OAuth tokens)
OAUTH_ENCRYPTION_KEY=random_32_byte_key_here
```

---

### API Rate Limits to Handle

**Google Calendar API:**
- 1,000,000 requests/day
- 10 requests/second per user
- Handle 429 (rate limit) errors

**Microsoft Graph API:**
- 10,000 requests/10 minutes per app
- Handle 429 (throttle) errors

**Strategy:**
- Cache calendar events (5-15 min TTL)
- Only fetch on user request or periodic background sync
- Show cached data if API fails

---

### Security Considerations

1. **Token Storage:**
   - ✅ Encrypt `access_token` and `refresh_token` before storing
   - ✅ Use AES-256 encryption
   - ✅ Never log tokens

2. **Token Refresh:**
   - ✅ Google tokens expire after 1 hour
   - ✅ Automatically refresh when expired
   - ✅ Store refresh_token to get new access_token

3. **Scopes:**
   - ✅ Request minimum scopes (readonly only)
   - ✅ Never request write access unless needed

4. **Revocation:**
   - ✅ Revoke tokens on disconnect
   - ✅ Google: `POST https://oauth2.googleapis.com/revoke`
   - ✅ Microsoft: Delete app registration

---

### Testing Checklist

- [ ] Google OAuth flow end-to-end
- [ ] Microsoft OAuth flow end-to-end
- [ ] Fetch events from Google
- [ ] Fetch events from Microsoft
- [ ] Token refresh when expired
- [ ] Handle no calendar connected
- [ ] Handle revoked tokens
- [ ] Match attendees to master_person_id
- [ ] Cache invalidation works
- [ ] Disconnect flow works

---

## 🟠 HIGH PRIORITY: Person Context Enhancement

### Current Status
`/person-context/{id}` exists but may need enhancement for interview flow

### Potential Enhancements

#### `GET /person-context/{master_person_id}/interview`
**Purpose:** Get context optimized for interview questions

**Response:**
```json
{
  "master_person_id": 123,
  "name": "Ray Deck",
  "current_title": "CTO",
  "company": "Element55",
  "bio": "Built 3 successful startups...",
  "recent_interactions": [
    {
      "type": "meeting",
      "date": 1709265600,
      "context": "Discussed AI strategy"
    }
  ],
  "suggested_help_areas": [
    "Investor introductions",
    "Technical hiring",
    "Product strategy"
  ],
  "network_overlap": {
    "shared_connections": 12,
    "potential_intros": ["Person A", "Person B"]
  }
}
```

**Backend Tasks:**
- [ ] Enhance existing `/person-context` endpoint
- [ ] Add suggested help areas (ML/heuristics)
- [ ] Calculate network overlap
- [ ] Pull recent interaction history

---

## 🟡 MEDIUM PRIORITY: Leverage Loop Enhancements

### Current Status
Basic leverage loop creation works, may need enhancements

### Potential Enhancements

#### `POST /leverage-loop/interview`
**Purpose:** Create leverage loop from interview conversation

**Request:**
```json
{
  "master_person_id": 123,
  "goal": "Find investors for Series A",
  "interview_transcript": [
    {"role": "ai", "content": "What would you like to help Ray with?"},
    {"role": "user", "content": "Find investors"},
    {"role": "ai", "content": "What stage?"},
    {"role": "user", "content": "Series A, $4M"}
  ],
  "constraints": ["Fintech focused", "Bay Area preferred"]
}
```

**Response:**
```json
{
  "leverage_loop_id": 456,
  "process_id": "proc_abc123",
  "status": "processing",
  "estimated_completion": 1709268000,
  "suggested_contacts": [
    {
      "master_person_id": 789,
      "name": "Investor Name",
      "relevance_score": 0.95,
      "reason": "Has invested in similar companies"
    }
  ]
}
```

**Backend Tasks:**
- [ ] Parse interview transcript
- [ ] Extract structured goal + constraints
- [ ] Run network analysis
- [ ] Return suggested contacts immediately (don't wait for full process)
- [ ] Queue background processing

---

## 🟢 LOW PRIORITY: Meeting Prep Enhancements

### Current Status
Meeting prep card template exists in backend

### Potential Enhancements

#### `GET /meeting-prep/{master_person_id}`
**Purpose:** Get comprehensive meeting prep beyond card template

**Response:**
```json
{
  "person": {
    "name": "Mark Pederson",
    "title": "CEO",
    "company": "Orbiter"
  },
  "prep_card": {
    "summary": "...",
    "talking_points": [...],
    "listen_for": [...],
    "landmines": [...]
  },
  "recent_news": [
    {
      "title": "Orbiter raises Series A",
      "url": "https://...",
      "date": 1709265600
    }
  ],
  "shared_interests": ["AI", "Product Strategy"],
  "previous_meetings": [
    {
      "date": 1708660800,
      "notes": "Discussed Copilot roadmap"
    }
  ]
}
```

**Backend Tasks:**
- [ ] Fetch recent news (Google News API or similar)
- [ ] Pull previous meeting notes
- [ ] Calculate shared interests (LinkedIn, bio analysis)

---

## 🔵 NICE-TO-HAVE: Real-time Features

### Webhook Support for Calendar Sync

#### `POST /webhooks/calendar-update` (webhook receiver)
**Purpose:** Google/Outlook sends webhook when calendar changes

**Benefits:**
- Real-time calendar updates (no polling needed)
- Instant notification of new meetings
- Auto-refresh Meeting Prep when calendar changes

**Backend Tasks:**
- [ ] Register webhook with Google: `POST https://www.googleapis.com/calendar/v3/calendars/primary/events/watch`
- [ ] Register webhook with Microsoft: `POST https://graph.microsoft.com/v1.0/subscriptions`
- [ ] Handle webhook verification
- [ ] Process calendar change notifications
- [ ] Invalidate cache
- [ ] Optional: Push notification to user via WebSocket

---

## 📋 Implementation Priority

### Phase 1: Demo Ready (Thursday)
**Goal:** Calendar integration working for Mark's demo

- [ ] `POST /calendar/connect` (Google OAuth only)
- [ ] `GET /calendar/events` (Google only)
- [ ] `GET /calendar/status`
- [ ] Database schema (calendar_connections table)
- [ ] Token encryption
- [ ] Basic error handling

**Time Estimate:** 4-6 hours
**Complexity:** Medium (OAuth setup is the hardest part)

---

### Phase 2: Production Ready (Post-Demo)
**Goal:** Full calendar integration + enhancements

- [ ] Microsoft OAuth support (Outlook)
- [ ] `POST /calendar/disconnect`
- [ ] `POST /calendar/refresh`
- [ ] Token refresh logic
- [ ] Caching layer (cached_calendar_events table)
- [ ] Rate limit handling
- [ ] Person context interview enhancement
- [ ] Leverage loop interview endpoint

**Time Estimate:** 8-12 hours
**Complexity:** Medium-High

---

### Phase 3: Advanced Features (Future)
**Goal:** Real-time updates + ML enhancements

- [ ] Calendar webhooks (real-time sync)
- [ ] Meeting prep news integration
- [ ] Suggested help areas (ML)
- [ ] Network overlap calculations
- [ ] WebSocket push notifications

**Time Estimate:** 16-20 hours
**Complexity:** High

---

## 🎯 Quick Wins (Can Build Today)

### 1. Calendar OAuth (Google Only)
**Impact:** ⭐⭐⭐⭐⭐ (Highest)
**Time:** 2-3 hours
**Complexity:** Medium

Replace mock calendar with real Google Calendar data. Most impressive for demo.

### 2. Calendar Status Endpoint
**Impact:** ⭐⭐⭐
**Time:** 30 minutes
**Complexity:** Low

Simple database query, enables "Connect Calendar" UI flow.

### 3. Enhanced Person Context
**Impact:** ⭐⭐⭐⭐
**Time:** 1-2 hours
**Complexity:** Medium

Better interview experience, suggested help areas make AI feel smarter.

---

## 🚀 Recommended Approach

### Option A: Calendar for Thursday Demo
**Focus:** Just Google Calendar integration (endpoints 1-3)

**Pros:**
- ✅ Biggest demo impact
- ✅ Shows real data (no mock)
- ✅ Realistic timeline (4-6 hours)

**Cons:**
- ⚠️ Microsoft support later
- ⚠️ Basic error handling only

**Recommendation:** ⭐⭐⭐⭐⭐ **BEST for Thursday**

---

### Option B: Full Calendar + Enhancements
**Focus:** Complete calendar + person context + leverage loop

**Pros:**
- ✅ Production-ready calendar
- ✅ Both Google + Microsoft
- ✅ Enhanced AI features

**Cons:**
- ⚠️ 12-16 hours (might not finish before demo)
- ⚠️ More complexity = more bugs

**Recommendation:** ⭐⭐⭐ **BETTER for post-demo**

---

### Option C: Keep Mock for Demo, Build After
**Focus:** Ship demo as-is, build backend after Mark approves

**Pros:**
- ✅ Zero risk for demo
- ✅ More time to build properly
- ✅ Can gather Mark's feedback first

**Cons:**
- ⚠️ Demo uses fake data
- ⚠️ Mark might want to see real calendar

**Recommendation:** ⭐⭐⭐⭐ **SAFE option**

---

## 💡 My Recommendation

**For Thursday's Demo:**

**Option A** - Build Google Calendar integration (4-6 hours)

**Why:**
1. Most impressive feature (real calendar data!)
2. Realistic timeline (can finish today)
3. Shows real value (not mock)
4. Mark will love seeing his actual calendar
5. Easy to add Microsoft later

**Fallback:**
Keep mock enabled (NEXT_PUBLIC_USE_MOCK_CALENDAR=true) if OAuth hits issues. Switch to real calendar when ready.

**Post-Demo:**
Build remaining endpoints (Microsoft, webhooks, enhancements) based on Mark's feedback.

---

**Last Updated:** Feb 26, 2026 8:45 AM
**Status:** Ready to build - prioritized by demo impact
**Next Step:** Choose Option A, B, or C and start building! 🚀
