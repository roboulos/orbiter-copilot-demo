# Backend Team: Critical Endpoints Needed for Feb 27 Demo

**From:** Robert  
**Date:** February 23, 2026  
**Deadline:** February 26 (Wednesday EOD) for Thursday 9 AM demo with Charles

---

## Executive Summary

Frontend is **95% complete** and production-ready. We need **10 backend endpoints** to connect everything for the Thursday demo. All specs below with request/response formats.

**Priority:** 🔴 Critical (must-have for demo) | 🟡 High (demo enhancement) | 🟢 Nice-to-have

---

## 🔴 CRITICAL - Must Have for Demo (4 endpoints)

### 1. Calendar Integration (HIGHEST PRIORITY)

**Blocker:** Mark needs to enable calendar API access for robert@snappy.ai

#### POST `/calendar/connect`
**Purpose:** Connect Robert's Google Calendar  
**Request:**
```json
{
  "email": "robert@snappy.ai",
  "provider": "google"
}
```
**Response:**
```json
{
  "success": true,
  "calendar_id": 123,
  "connected_at": 1708714800
}
```

#### GET `/calendar/events`
**Purpose:** Get upcoming meetings  
**Query Params:**
- `days_ahead` (optional, default: 7)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "events": [
    {
      "id": 456,
      "title": "Charles Integration Meeting",
      "start_time": 1708948800,
      "end_time": 1708952400,
      "attendees": ["charles@orbiter.io"],
      "master_person_ids": [40],
      "location": "Zoom"
    }
  ]
}
```

---

### 2. Meeting Prep Generation

#### POST `/meeting-prep/generate`
**Purpose:** Generate meeting prep materials for a person  
**Request:**
```json
{
  "master_person_id": 40,
  "meeting_id": 456,
  "context": "Integration demo, showing copilot progress"
}
```

**Response:**
```json
{
  "person_summary": "Charles Njenga - Lead developer on Copilot UI at Orbiter...",
  "talking_points": [
    "Demo new interview-first copilot flow",
    "Show dispatch confirmation modal",
    "Walk through waiting room for long processes"
  ],
  "suggested_openers": [
    "I've been working on the copilot improvements we discussed..."
  ],
  "why_they_care": "Charles owns the Copilot UI integration and needs to see how our work fits into the main app",
  "listen_for": [
    "Technical concerns about integration",
    "Timeline questions",
    "UI/UX feedback"
  ],
  "landmines": [
    "Don't over-promise on timeline - integration is complex",
    "Avoid criticizing existing Copilot implementation"
  ]
}
```

---

### 3. Dispatch Execution (Wire Real API)

**Current State:** DispatchConfirmationModal uses `setTimeout` mock  
**Need:** Wire to actual backend

#### POST `/leverage-loop` (if not already working)
**Purpose:** Create leverage loop  
**Request:**
```json
{
  "master_person_id": 1024,
  "goal": "Find seed investors for SaaS product",
  "context": "Xano.Snappy.ai raising seed round, need intros to dev tools investors",
  "fast": false
}
```

**Response:**
```json
{
  "id": 789,
  "status": "processing",
  "estimated_seconds": 180
}
```

#### PATCH `/leverage-loop/{id}/dispatch`
**Purpose:** Submit loop for execution  
**Request:**
```json
{
  "approved": true
}
```

**Response:**
```json
{
  "success": true,
  "dispatched_at": 1708714900,
  "process_id": 999
}
```

---

### 4. Process Monitoring (for Waiting Room)

#### GET `/process/{id}/status`
**Purpose:** Check status of long-running process  
**Response:**
```json
{
  "id": 999,
  "status": "running",
  "progress": 65,
  "current_step": "Analyzing second-degree connections",
  "elapsed_seconds": 142,
  "estimated_seconds": 240
}
```

**Status values:** `"queued"` | `"running"` | `"complete"` | `"failed"` | `"cancelled"`

#### POST `/process/{id}/cancel`
**Purpose:** Cancel running process  
**Response:**
```json
{
  "success": true,
  "cancelled_at": 1708714950
}
```

---

## 🟡 HIGH PRIORITY - Demo Enhancement (3 endpoints)

### 5. Network Graph Visualization

#### GET `/network/graph-data`
**Purpose:** Full network graph for visualization  
**Query Params:**
- `master_person_id` (optional, filter to specific person's network)
- `depth` (optional, default: 2)

**Response:**
```json
{
  "nodes": [
    {
      "id": 1024,
      "name": "Robert Boulos",
      "type": "person",
      "avatar": "https://...",
      "in_my_network": true
    }
  ],
  "edges": [
    {
      "source": 1024,
      "target": 42,
      "relationship": "works_with",
      "strength": 0.8
    }
  ]
}
```

---

### 6. Server-Side Dispatch Enhancement

#### POST `/dispatch/describe`
**Purpose:** Generate beautified descriptions server-side (currently done client-side)  
**Request:**
```json
{
  "master_person_id": 1024,
  "goal": "Find seed investors",
  "context": "Xano.Snappy.ai SaaS product"
}
```

**Response:**
```json
{
  "description": "I'll leverage your network to help Robert Boulos find seed investors for Xano.Snappy.ai. By analyzing your connections in the dev tools and B2B SaaS space, I can identify warm introductions to investors who've backed similar products. This approach uses your social capital strategically while helping Robert access funding through trusted relationships."
}
```

---

### 7. Intent Detection

#### POST `/dispatch/detect-intent`
**Purpose:** Server-side keyword detection (currently client-side)  
**Request:**
```json
{
  "message": "Alright, show me what you've got. Let's do this."
}
```

**Response:**
```json
{
  "should_dispatch": true,
  "confidence": 0.92,
  "keywords_matched": ["show me", "let's do this"]
}
```

---

## 🟢 NICE-TO-HAVE - Future Enhancement (3 endpoints)

### 8. Context Add-Ons

#### GET `/context/add-ons`
**Purpose:** List available context sources  
**Response:**
```json
{
  "sources": [
    {
      "id": "linkedin",
      "name": "LinkedIn Profile",
      "enabled": true,
      "description": "Enrich with work history and connections"
    },
    {
      "id": "transcripts",
      "name": "Call Transcripts",
      "enabled": true,
      "description": "Include conversation context"
    }
  ]
}
```

#### POST `/context/enrich`
**Purpose:** Enrich person context with additional sources  
**Request:**
```json
{
  "master_person_id": 1024,
  "source_ids": ["linkedin", "transcripts"]
}
```

**Response:**
```yaml
# Returns enriched YAML context (same format as /person-context/{id})
```

---

## 🔧 Frontend Integration Points

### Files That Need Wiring

1. **DispatchConfirmationModal.tsx** (line 89-95)
   - Replace `setTimeout` mock with actual POST `/leverage-loop`
   - Add error handling
   - Redirect to WaitingRoom on success

2. **WaitingRoom.tsx** (line 120-130)
   - Add polling to GET `/process/{id}/status` every 2 seconds
   - Wire cancel button to POST `/process/{id}/cancel`
   - Optional: WebSocket for real-time updates

3. **MeetingPrepCard.tsx** (not yet triggered)
   - Call POST `/meeting-prep/generate` when copilot detects meeting prep intent
   - Needs chat endpoint update or direct integration

4. **NetworkView.tsx** (future)
   - Use GET `/network/graph-data` for visualization
   - Currently just lists, needs canvas/SVG rendering

5. **QuickResultCard.tsx** (two-layer system)
   - Quick layer: existing chat works
   - Deep layer: needs `/leverage-loop` with `fast=false`
   - Poll for results or use WebSocket

---

## 🚨 Critical Path for Thursday Demo

**Wednesday EOD Deadline:**

1. ✅ **Mark enables calendar API** (external dependency)
2. 🔴 `/calendar/connect` + `/calendar/events` working
3. 🔴 `/meeting-prep/generate` working
4. 🔴 `/leverage-loop` dispatch wired (if not already)
5. 🔴 `/process/{id}/status` working

**With these 5 items, demo is:**
- ✅ Calendar integration working
- ✅ Meeting prep generates real data
- ✅ Dispatch executes (not mock)
- ✅ Waiting room shows real progress

**Without these, demo shows:**
- ❌ Mocked dispatch (setTimeout)
- ❌ No calendar integration
- ❌ No meeting prep data
- ❌ Static waiting room

---

## 📦 Environment Variables Needed

Add to `.env.local`:

```bash
# Calendar Integration
NEXT_PUBLIC_GOOGLE_CALENDAR_CLIENT_ID=your_client_id
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your_api_key
NEXT_PUBLIC_ENABLE_CALENDAR=true

# WebSocket (optional, for real-time updates)
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_ENABLE_WAITING_ROOM=true

# Xano API (already exists?)
NEXT_PUBLIC_XANO_API_URL=https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz
NEXT_PUBLIC_XANO_API_KEY=your_key
```

---

## 🧪 Testing Checklist

Once endpoints are live:

- [ ] Connect Robert's calendar successfully
- [ ] Fetch upcoming meetings (should see Charles @ Feb 27 9 AM)
- [ ] Generate meeting prep for Charles (Dennis)
- [ ] Dispatch leverage loop (not mock)
- [ ] Watch process status update in real-time
- [ ] Cancel a running process
- [ ] View completed results in Outcomes tab

---

## 📚 Documentation

**Full specs available in:**
- `BACKEND-TODO.md` (5KB)
- `COMPLETE-GAP-ANALYSIS.md` (12KB)
- `IMPLEMENTATION_GUIDE.md` (19KB)

**All files in:** `/projects/orbiter-copilot-demo/`

---

## 🎯 What's Already Working (Frontend)

✅ Dispatch confirmation modal (beautiful UI)  
✅ Beautified LLM descriptions (client-side)  
✅ Keyword detection (client-side)  
✅ Waiting room UI (needs polling)  
✅ Meeting prep card template (needs data)  
✅ Project context selector  
✅ Enhanced outcome cards with fold-down panels  
✅ Help system ("I don't know" button)  
✅ Two-path UX (hardcore + conversational)  
✅ Premium loading animations  
✅ All emojis removed  
✅ Consistent visual design  

**Demo page:** localhost:3000/demo-components

---

## 📞 Questions?

Ping Robert:
- Telegram: @robert_gram
- Email: robert@snappy.ai

**Let's ship this by Wednesday EOD! 🚀**

---

## Summary for Quick Reference

| Endpoint | Priority | Deadline | Purpose |
|----------|----------|----------|---------|
| POST `/calendar/connect` | 🔴 Critical | Wed EOD | Connect calendar |
| GET `/calendar/events` | 🔴 Critical | Wed EOD | Get meetings |
| POST `/meeting-prep/generate` | 🔴 Critical | Wed EOD | Generate prep |
| POST `/leverage-loop` | 🔴 Critical | Wed EOD | Dispatch (wire real) |
| PATCH `/leverage-loop/{id}/dispatch` | 🔴 Critical | Wed EOD | Submit loop |
| GET `/process/{id}/status` | 🔴 Critical | Wed EOD | Monitor progress |
| POST `/process/{id}/cancel` | 🔴 Critical | Wed EOD | Cancel process |
| GET `/network/graph-data` | 🟡 High | Post-demo | Network viz |
| POST `/dispatch/describe` | 🟡 High | Post-demo | Server descriptions |
| POST `/dispatch/detect-intent` | 🟡 High | Post-demo | Server detection |

**Critical: 7 endpoints  
High: 3 endpoints  
Total: 10 endpoints**
