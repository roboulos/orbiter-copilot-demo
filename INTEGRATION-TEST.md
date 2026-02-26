# INTEGRATION TEST - Robert Do This Now

**Server:** `http://localhost:3000`
**Time:** 10 minutes
**Status:** Backend is done, frontend is done, just need to verify integration

---

## ✅ QUICK SMOKE TEST

### Test #1: App Loads (30 seconds)
```
1. Open http://localhost:3000
2. Page loads without errors
3. Open browser console (Cmd+Option+J)
4. No red errors
```

**Expected:** Clean load ✅

---

### Test #2: Copilot Opens (30 seconds)
```
1. Press Cmd+K
2. Modal appears
3. See chat interface
```

**Expected:** Modal opens ✅

---

### Test #3: Exploratory Interview (2 minutes)
```
1. Type: "I want to help someone"
2. Press Enter
3. Wait for response
```

**Expected:**
- ✅ See `interview_card` appear (not contact_card!)
- ✅ Question: "Who would you like to help?"
- ✅ Examples shown
- ✅ Can type answer or pick person

**If you see:**
- ❌ `contact_card` during conversation → Backend still sending wrong card type
- ❌ Blank response → Check backend logs
- ❌ Error → Check console

---

### Test #4: Interview Flow Continues (3 minutes)
```
1. Answer: "Ray Deck"
2. Wait for next question
3. Answer the clarifying questions
4. Continue until dispatch confirmation
```

**Expected:**
- ✅ Backend asks 2-4 clarifying questions
- ✅ Each question shows as `interview_card` (or text)
- ✅ NO person suggestion cards during conversation
- ✅ At the end: Dispatch confirmation modal

---

### Test #5: Dispatch Works (2 minutes)
```
1. In dispatch modal, click "Dispatch"
2. Wait for response
```

**Expected:**
- ✅ POST to /leverage-loop succeeds
- ✅ PATCH to /leverage-loop/{id}/dispatch succeeds
- ✅ Waiting room appears
- ✅ Shows "Processing..." status

**If dispatch fails:**
- Check browser Network tab
- Verify endpoints 8048 and 8052 exist
- Check if token is valid

---

### Test #6: Person Selection Flow (3 minutes)
```
1. Clear chat (reload page)
2. Open copilot (Cmd+K)
3. Use person picker to select Ray Deck
4. Type: "Help Ray find a job"
5. Answer clarifying questions
6. Dispatch
```

**Expected:**
- ✅ Backend knows person is already selected
- ✅ Asks outcome-specific questions
- ✅ Shows dispatch confirmation
- ✅ Dispatch succeeds

---

## 🐛 DEBUGGING CHECKLIST

### If interview_card doesn't appear:
```
□ Check backend response in Network tab
□ Look for: {response: [{name: "interview_card", ...}]}
□ Verify stage matches: "identify_person" | "clarify_outcome" | etc.
□ Check console for template registration errors
```

### If contact_card still appears:
```
□ Backend still sending it (check /chat endpoint)
□ System prompt not updated yet
□ Frontend filter is blocking it (check console logs)
□ Should see: [FILTERED] contact_card - Mark wants NO intermediate suggestions
```

### If dispatch fails:
```
□ Check /leverage-loop endpoint exists (8048)
□ Check /leverage-loop/{id}/dispatch exists (8052)
□ Verify request body format matches
□ Check auth token is valid
□ Look at backend error logs
```

---

## 📸 TAKE SCREENSHOTS

Capture:
1. ✅ Interview card appearing
2. ✅ Chat conversation flow
3. ✅ Dispatch confirmation modal
4. ✅ Waiting room
5. ❌ Any errors or issues

Save to: `test-screenshots/`

---

## ✅ SUCCESS CRITERIA

**Integration works if:**
- [x] interview_card appears for exploratory queries
- [x] Backend asks 2-4 clarifying questions
- [x] NO contact/leverage cards during conversation
- [x] Dispatch confirmation shows at the end
- [x] Dispatch button triggers API calls
- [x] Waiting room appears after dispatch

**If ALL checkboxes pass:** Ready for demo! ✅

**If ANY fail:** Note which one, we'll debug together.

---

## 🎯 REPORT BACK

After testing, tell Zora:
1. Which tests passed ✅
2. Which tests failed ❌
3. Screenshots of any issues
4. Console errors (if any)

Then we'll fix whatever's broken!
