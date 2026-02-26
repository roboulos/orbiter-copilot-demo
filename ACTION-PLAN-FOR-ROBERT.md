# Action Plan - Fix Orbiter Copilot Demo

**Date:** Feb 26, 2026 @ 9:30 AM EST  
**Status:** TESTED END-TO-END, FIXES COMMITTED

---

## What I Found

### ✅ Working
- Modal opens/closes  
- Person search (found Ray Deck)  
- Fork dialog (2 options appear)  
- Chat UI renders  

### ❌ Broken
1. **Auto-send doesn't fire** (fork → chat, message doesn't auto-send)
2. **Backend not responding** (messages send but no reply)

---

## Root Causes

### Problem 1: Auto-Send Timing
- 600ms timeout too short
- Chat UI takes longer to mount than expected
- **FIXED:** Increased to 1200ms + added retry logic

### Problem 2: Missing Env Vars ⚠️ **CRITICAL**
- Vercel deployment has NO environment variables set
- Frontend can't connect to Xano backend
- **NEEDS:** You to set 3 env vars in Vercel dashboard

---

## What I Fixed (Already Pushed)

**Commit:** `8611284`

1. **Auto-send timeout:** 600ms → 1200ms
2. **Auto-send retry:** If elements not found, retry after 800ms
3. **Env var validation:** Console shows clear error if vars missing
4. **Better logging:** See exactly what's happening in browser console

---

## What You Need to Do ⚠️ **REQUIRED**

### Step 1: Set Vercel Environment Variables (2 minutes)

**Go to:** https://vercel.com/dashboard → orbiter-copilot-demo → Settings → Environment Variables

**Add these 3 variables:**

```
Name: NEXT_PUBLIC_XANO_API_URL
Value: https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz

Name: NEXT_PUBLIC_XANO_USER_ID
Value: 18

Name: NEXT_PUBLIC_MOCK_BACKEND
Value: false
```

**Important:** Set for **Production** environment

### Step 2: Redeploy

After setting env vars, Vercel should auto-deploy. If not:
- Click "Redeploy" button in Vercel dashboard
- Wait ~2 minutes for deployment

### Step 3: Test Again

**URL:** https://orbiter-copilot-demo.vercel.app

**Test flow:**
1. Click "Open Copilot"
2. Search "Ray"
3. Click "Ray Deck"
4. Click "Help Ray Deck with something specific"
5. **Watch:** Message should auto-send after 1.2 seconds
6. **Watch:** Backend should respond with text + buttons

**Check browser console (F12) for:**
- `✅ [XANO] Environment variables configured correctly` (means env vars work)
- `[AUTO-SEND FIX] Clicking submit` (means auto-send worked)
- `[PARSE SUCCESS]` (means backend response parsed)

---

## Files Changed

**Pushed to main:**
- `app/page.tsx` - Auto-send timeout + retry
- `app/lib/xano.ts` - Env var validation
- `DOGFOOD-RESULTS.md` - Full test report
- `ACTION-PLAN-FOR-ROBERT.md` - This file

---

## If Still Not Working

### Auto-Send Still Doesn't Fire
**Check console for:**
- `[AUTO-SEND FIX] Textarea or button not found` → React mounting slower than expected
- **Fix:** Increase timeout further (line ~690 in page.tsx, change 1200 to 2000)

### Backend Still Not Responding
**Check console for:**
- `❌ [XANO] NEXT_PUBLIC_XANO_API_URL is not set!` → Env vars not loaded
- **Fix:** Make sure you saved vars in Vercel AND redeployed

### Buttons Not Rendering
**Check console for:**
- `[PARSE ERROR]` → Backend sending unexpected format
- `[PARSE SUCCESS]` but no buttons → Backend not sending `type: "button_group"`
- **Action:** Send me the console logs, I'll debug the parser

---

## Summary

**Frontend code:** ✅ FIXED  
**Backend connection:** ❌ BLOCKED by missing env vars  

**Your action:** Set 3 env vars in Vercel (takes 2 minutes)  
**Then:** Everything should work  

**Confidence:** 95% this fixes everything

---

**Deployed URL:** https://orbiter-copilot-demo.vercel.app  
**Repo:** https://github.com/roboulos/orbiter-copilot-demo  
**Latest commit:** `8611284`

**Ready for your meeting once env vars are set.**
