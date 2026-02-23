# Backend Integration TODO

This document tracks backend endpoints and integration work needed to complete the checklist.

## ✅ Already Available (from app/lib/xano.ts)

- `/dev-token` - Authentication
- `/person-search` or `/search` - Person search
- `/person-context/{id}` - Get person YAML context
- `/chat` - LLM chat with system prompt
- `/leverage-loop` (POST) - Create leverage loop
- `/leverage-loop/{id}/dispatch` (PATCH) - Dispatch leverage loop
- `/network` - Get network list (paginated)
- `/outcomes` - Get outcomes list
- `/horizon` - Get horizon targets
- `/leverage-loops` - Get leverage loops list

## 🟡 Needed for Checklist Completion

### Calendar Integration (Critical Items)
- [ ] **POST `/calendar/connect`** - Connect Robert's email/calendar
  - Params: `{ email: string, provider: "google" | "outlook" }`
  - Returns: `{ success: boolean, calendar_id: number }`
  
- [ ] **GET `/calendar/events`** - Get upcoming events
  - Params: `{ days_ahead?: number, limit?: number }`
  - Returns: `{ events: Array<{ id, title, start_time, attendees[], master_person_ids[] }> }`

- [ ] **POST `/meeting-prep/generate`** - Generate meeting prep for person
  - Params: `{ master_person_id: number, meeting_id?: number, context?: string }`
  - Returns meeting_prep_card template props

### Dispatch Flow Enhancement
- [ ] **POST `/dispatch/describe`** - Generate beautified dispatch description
  - Params: `{ master_person_id: number, goal: string, context?: string }`
  - Returns: `{ description: string }`
  
- [ ] **POST `/dispatch/detect-intent`** - Server-side keyword detection
  - Params: `{ message: string }`
  - Returns: `{ should_dispatch: boolean, confidence: number }`

### Long-Running Process Monitoring
- [ ] **GET `/process/{id}/status`** - Check process status
  - Returns: `{ status: "pending" | "running" | "complete" | "error", progress: number, current_step?: string, elapsed_seconds: number }`
  
- [ ] **POST `/process/{id}/cancel`** - Cancel running process
  - Returns: `{ success: boolean }`

### Network Graph Data
- [ ] **GET `/network/graph-data`** - Full network graph for visualization
  - Params: `{ master_person_id?: number, depth?: number }`
  - Returns: `{ nodes: Array<{ id, name, avatar, title }>, edges: Array<{ from, to, weight }> }`

### Context Add-Ons (Mark mentioned)
- [ ] **GET `/context/add-ons`** - Get available context sources
  - Returns: `{ sources: Array<{ id, name, enabled, description }> }`
  
- [ ] **POST `/context/enrich`** - Enrich person context with add-ons
  - Params: `{ master_person_id: number, source_ids: string[] }`
  - Returns: enriched context YAML

## 📝 Frontend Integration Points

### Components That Need Backend Wiring

1. **DispatchConfirmationModal** (app/components/DispatchConfirmationModal.tsx)
   - Line ~108: Replace setTimeout with actual `/leverage-loop` POST + `/dispatch`
   - Add success toast after dispatch
   - Redirect to OutcomesView or WaitingRoom

2. **WaitingRoom** (app/components/WaitingRoom.tsx)
   - Needs polling mechanism to check `/process/{id}/status`
   - Add WebSocket support for real-time updates (optional)

3. **MeetingPrepCard** (app/components/MeetingPrepCard.tsx)
   - Trigger from `/chat` endpoint when keywords detected
   - Or call `/meeting-prep/generate` directly

4. **NetworkView** (app/components/NetworkView.tsx)
   - Use `/network/graph-data` for visualization
   - Currently just lists, needs graph rendering

5. **QuickResultCard** (app/components/QuickResultCard.tsx)
   - Two-layer system needs backend support
   - Quick layer: simple `/person-search` (already works)
   - Deep layer: `/leverage-loop` with fast=false flag (needs backend)

## 🔧 Environment Variables Needed

Add to `.env.local`:

```bash
# Calendar Integration
NEXT_PUBLIC_GOOGLE_CALENDAR_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=

# Websockets (optional, for real-time updates)
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Feature Flags
NEXT_PUBLIC_ENABLE_CALENDAR=true
NEXT_PUBLIC_ENABLE_WAITING_ROOM=true
```

## 🎯 Priority Order

1. **High**: Calendar integration (Mark's critical item)
2. **High**: Dispatch beautification endpoint
3. **Medium**: Process monitoring for WaitingRoom
4. **Medium**: Network graph data
5. **Low**: Context add-ons (can mock for now)

## 📊 Current Integration Status

- ✅ Person search - Working
- ✅ Person context - Working
- ✅ Chat LLM - Working
- ✅ Create leverage loop - Working (needs testing)
- ✅ Dispatch leverage loop - Working (needs testing)
- 🟡 Calendar - Needs endpoints
- 🟡 Process monitoring - Needs endpoints
- 🟡 Meeting prep generation - Needs direct endpoint
- 🟡 Network graph - Needs endpoint
- 🟡 Dispatch beautification - Client-side only (works, but could be server-enhanced)
