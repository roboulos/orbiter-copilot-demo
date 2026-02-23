# 🚀 Quick Start: Test Calendar Connection

## 1-Minute Setup

```bash
# Navigate to project
cd /Users/robertboulos/.openclaw/workspace/projects/orbiter-copilot-demo

# Start dev server
npm run dev

# Open browser
open http://localhost:3000
```

## What to Look For

1. **Calendar icon in header** (top-right, between Copilot button and avatar)
2. **Click icon** → Modal opens
3. **Enter email:** `robert@snappy.ai`
4. **Select:** Google Calendar
5. **Click "Connect"**

## Expected Result

```
❌ Error message:
"Calendar connection requires OAuth authorization. 
Please contact Mark to grant Nylas OAuth access for your email."
```

This is **CORRECT** - the UI is working! OAuth needs to be granted by Mark.

## Files Changed

- ✅ `app/lib/calendar.ts` (NEW)
- ✅ `app/components/CalendarSettings.tsx` (NEW)
- ✅ `app/components/CalendarSettingsModal.tsx` (NEW)
- ✅ `app/page.tsx` (UPDATED)

## To Unblock

**Contact Mark** to grant Nylas OAuth for `robert@snappy.ai`  
**Timeline:** 5-10 minutes for Mark to configure

---

**Status:** ✅ Frontend Complete | ⏸️ Needs OAuth  
**Date:** Feb 23, 2026
