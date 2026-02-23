# Email Template: Calendar Integration Backend Request

**To:** mark@orbiter.io  
**CC:** charles@orbiter.io, denis@orbiter.io  
**Subject:** Calendar Integration - Backend Requirements & Timeline  
**Attachment:** FOR-MARK-TEAM-CALENDAR.md

---

Hi Mark,

Quick update on the calendar integration for meeting prep:

## What's Done ✅

I've completed the **frontend implementation**:
- Full calendar connection UI (Google + Outlook)
- Settings modal with connect/disconnect flow
- Events display with attendee matching
- Error handling and status checking
- Working perfectly with mock data for testing

**Demo:** I can show you the UX on our Thursday call (Feb 27).

## What's Needed ⏳

To connect real calendars, your backend team needs to build **5 Xano endpoints** + configure **OAuth** (Nylas):

1. **POST /calendar/connect** - Initiate OAuth, store token
2. **GET /calendar/status** - Check connection state
3. **GET /calendar/events** - Fetch upcoming events
4. **POST /calendar/disconnect** - Revoke access
5. **POST /meeting-prep** - Generate AI prep for attendees

## Documentation 📋

I've created comprehensive specs in the repo:
- **FOR-MARK-TEAM-CALENDAR.md** - Full backend requirements (attached)
- **CALENDAR-BUG-STATUS-FEB-24.md** - Current state & timeline
- Includes: OAuth setup steps, database schema, code examples, testing checklist

## Estimate ⏱️

**Best case:** 4-5 days (dedicated engineer)  
**Realistic:** 2 weeks (part-time alongside other work)  
**Target completion:** March 10 (before our next sync)

## Next Steps

1. Review the attached requirements doc
2. Assign to Charles or Dennis (whoever has capacity)
3. I'm happy to hop on a call to walk through the specs
4. Test with my email accounts when ready

The frontend is polished and demo-ready - just needs the backend to catch up. Let me know if you have questions!

– Robert

---

**P.S.** The mock data includes meetings with you, Josh, Charles, and Dennis so you can see exactly how meeting prep will work when it's live. Looking forward to showing you on Thursday!
