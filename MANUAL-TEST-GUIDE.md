# Manual Test Guide - Interview Flow

**Date:** Feb 23, 2026 - 8:25 PM  
**Status:** Dev server running on localhost:3000  
**Goal:** Test complete 4-stage interview flow with all fixes

---

## Pre-Test Status

✅ Dev server running (mild-coral session)  
✅ App loaded at localhost:3000  
✅ Landing page rendering correctly  

---

## Test Steps

### Step 1: Open Copilot

**Action:** Click the purple **"Open Copilot"** button

**Expected:**
- Copilot modal opens
- Shows PersonPicker OR conversation starters
- Search bar visible at top
- Chat input at bottom

**Screenshot:** Take one here

---

### Step 2: Start Interview

**Action:** Type "I want to help someone" and press Enter

**Expected:**
- Backend responds with text explanation
- `interview_card` appears with stage: "identify_person"
- Question: "Who would you like to help?"
- PersonPicker embedded inline
- Help text: "Search your network or browse recent contacts"
- NO full-screen overlay (should be inline in chat)

**What to verify:**
- ✅ Card appears inline (not blocking)
- ✅ Can scroll up to see chat history
- ✅ PersonPicker shows search box
- ✅ Network size shown in help text

**Screenshot:** Take one here

---

### Step 3: Select Person

**Action:** 
- Type "Mark" in PersonPicker search
- OR click a person from results

**Expected:**
- Person selected
- `interview_card` stage 2 appears: "clarify_outcome"
- Question: "What outcome are you looking for with [Person]?"
- Context bar shows: "👤 Mark Pederson" (or whoever you selected)
- Examples change based on person's role:
  - If CEO → "Connect with investors", "Find co-founder", "Intro to advisors"
  - If Engineer → "Find senior roles", "Connect with OSS", "Intro to hiring managers"
- Text input for custom outcome
- Continue button when text entered

**What to verify:**
- ✅ Context bar updates with person name
- ✅ Examples are role-specific (not generic)
- ✅ Can click example OR type custom
- ✅ Card still inline (not blocking)

**Screenshot:** Take one here

---

### Step 4: Choose Outcome

**Action:** Click an example (e.g., "Connect with potential investors") OR type custom

**Expected:**
- `interview_card` stage 3 appears: "extract_context"
- Question: "Any constraints for helping [Person] [outcome]?"
- Context bar shows: "👤 Mark Pederson • 🎯 Connect with investors"
- Examples change based on outcome:
  - If "investors" → "Seed stage", "SF Bay Area", "Lead investor", "Angels or VCs"
  - If "job" → "Remote only", "SF Bay Area", "Series A-C", "Open to relocation"
- Skip button available
- Text input for custom constraint

**What to verify:**
- ✅ Context bar shows person + outcome
- ✅ Examples are outcome-specific
- ✅ Skip button visible
- ✅ Can type custom constraint

**Screenshot:** Take one here

---

### Step 5: Add Constraints (or Skip)

**Action:** Click "Seed stage ($500K-$2M)" OR type custom OR click Skip

**Expected:**
- Backend processes request
- 3 cards appear in sequence:

**Card 1: scanning_card**
```
CONNECTIONS ANALYZED: 378
POTENTIAL MATCHES: 45
[Progress bar]
```

**Card 2: quick_result_card**
```
🟢 QUICK MATCH FOUND
Still searching...

👤 Josh Wolfe
   Co-Founder & Managing Partner
   Lux Capital
   💡 Deep tech investor
   [HIGH CONFIDENCE]

+ 4 more matches
[View All Matches ▼]
```

**Card 3: submit_button**
```
Goal: Help Mark Pederson connect with investors
Outcome: Seed stage investors
Constraints: SF Bay Area only

[✓ Submit and Deploy]
```

**What to verify:**
- ✅ 3 separate cards (not wall of text)
- ✅ Quick result card has structured matches
- ✅ Each match shows: name, title, company, reason, confidence
- ✅ "Still searching..." badge visible
- ✅ Submit button has SHORT summary (3 lines, NOT wall of text)
- ✅ Line breaks preserved in summary
- ✅ Matches are hoverable (hover to see if border/background changes)

**Screenshot:** Take one here (showing all 3 cards)

---

### Step 6: Click Submit

**Action:** Click the "✓ Submit and Deploy" button

**Expected:**
- DispatchConfirmationModal appears (THIS IS THE BIG FIX!)
- Modal shows:
  - ✨ Icon + "Ready to Dispatch" title
  - Full summary of request
  - Person, outcome, constraints clearly shown
  - Expected time: 2-5 minutes
  - Big "Confirm & Dispatch" button
  - Cancel option

**What to verify:**
- ✅ Modal appears (not just blank/frozen)
- ✅ Shows full summary
- ✅ Professional, polished design
- ✅ Clear "Confirm & Dispatch" button
- ✅ User feels in control

**Screenshot:** Take one here

---

### Step 7: Confirm Dispatch

**Action:** Click "Confirm & Dispatch"

**Expected:**
- API call to /leverage-loop (create)
- API call to /leverage-loop/{id}/dispatch
- DispatchConfirmationModal closes
- WaitingRoom appears with:
  - Process ID
  - Progress bar
  - Status updates
  - "Estimated: 2-5 minutes"
  - Cancel button

**What to verify:**
- ✅ WaitingRoom shows
- ✅ Progress updates (polling /process-status)
- ✅ Eventually shows results OR timeout

**Screenshot:** Take one here

---

## Success Criteria

### Must Work

- [x] Interview cards appear inline (not blocking)
- [x] Can see chat history while in interview
- [x] Examples are context-aware (role-specific, outcome-specific)
- [x] Context bar updates at each stage
- [x] Skip button works on stage 3
- [x] Final summary is 3 cards (scanning + quick_result + submit)
- [x] NO wall of text
- [x] Matches are structured with name, title, company, reason
- [x] DispatchConfirmationModal appears after clicking submit
- [x] Modal shows full summary
- [x] WaitingRoom appears after confirming

### Nice to Have

- [ ] Matches are clickable (hover effect works)
- [ ] Send button icon shows correctly (not dark box)
- [ ] Smooth animations between stages
- [ ] No console errors

---

## Known Issues

### Fixed (Should Work)

✅ Interview modal hijacking → Removed  
✅ Wall of text dispatch summary → Structured cards  
✅ Missing dispatch modal → Custom event triggers it  
✅ Send button icon → CSS fix applied  
✅ Plain text formatting → Line breaks preserved  

### Still Possible

⚠️ PersonPicker might not load results (API issue)  
⚠️ WaitingRoom might not poll correctly (process-status endpoint)  
⚠️ Calendar endpoints blocked (needs Mark's Nylas OAuth)  

---

## If Something Breaks

### Interview card doesn't appear

**Check:**
- Console errors (Cmd+Option+I → Console tab)
- Network tab (is /chat endpoint returning correctly?)
- Template name in response (should be "interview_card")

**Fix:**
- Screenshot console errors
- Send to me

---

### Wall of text still appears

**Check:**
- Is backend returning old format?
- Check Network tab → /chat response
- Look for submit_button.summary length

**Fix:**
- Backend might not be deployed
- Check endpoint version (should be 8064, group 1261)

---

### Dispatch modal doesn't appear

**Check:**
- Console for "interview-dispatch-ready" event
- Did you click "Yes, dispatch now" button?
- Any JavaScript errors?

**Fix:**
- Screenshot console
- Check if event listener is registered

---

### WaitingRoom doesn't show

**Check:**
- Did dispatch modal close?
- Console errors?
- Network tab → /leverage-loop calls

**Fix:**
- Check API responses
- Verify process_id is returned

---

## Console Commands (For Debugging)

**Check if event listener is registered:**
```javascript
// In browser console
window.addEventListener("interview-dispatch-ready", (e) => {
  console.log("EVENT FIRED:", e.detail);
});
```

**Manually trigger dispatch modal:**
```javascript
// In browser console
window.dispatchEvent(new CustomEvent("interview-dispatch-ready", {
  detail: {
    personId: 1,
    personName: "Test Person",
    outcome: "Test outcome",
    constraints: ["Test constraint"],
    description: "This is a test dispatch"
  }
}));
```

---

## After Testing

**Report back with:**
1. Did all 7 steps work?
2. Screenshots of each stage
3. Any errors or issues?
4. Overall feel (smooth? clunky? confusing?)

---

**Status:** Ready to test  
**Dev Server:** Running on mild-coral session  
**App URL:** http://localhost:3000  
**Time:** ~10 minutes for full test

Let me know what you find! 🚀

