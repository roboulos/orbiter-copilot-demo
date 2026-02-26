# MANUAL TESTING GUIDE - DO THIS NOW

**Open:** http://localhost:3000
**Time:** 15 minutes

---

## 🧪 TEST CHECKLIST

### Test #1: App Loads (1 min)
- [ ] Page loads without errors
- [ ] See the Orbiter interface
- [ ] Check browser console (Cmd+Option+J) - no red errors

### Test #2: Open Copilot (1 min)
- [ ] Press Cmd+K (or click "Open Copilot")
- [ ] Modal appears
- [ ] Can type in chat box

### Test #3: Person Picker (2 min)
- [ ] Click person search box
- [ ] Type "Ray"
- [ ] See Ray Deck appear
- [ ] Select him
- [ ] See his card/avatar in header

### Test #4: Simple Message (2 min)
- [ ] Type: "Hello"
- [ ] Press Enter
- [ ] Get a text response (not a card!)
- [ ] Check if any unwanted cards appear

### Test #5: Interview Flow (5 min)
- [ ] Clear chat (refresh if needed)
- [ ] Select Ray Deck
- [ ] Type: "Help Ray find a chief of staff"
- [ ] **CRITICAL:** Check if backend asks questions OR shows dispatch modal
- [ ] Answer any questions
- [ ] See dispatch confirmation at the end

### Test #6: Direct Dispatch (2 min)
- [ ] Clear chat (refresh)
- [ ] Select Ray Deck
- [ ] Type: "Make leverage loop for Ray Deck"
- [ ] Should show dispatch confirmation immediately

### Test #7: Dispatch Modal (2 min)
- [ ] When dispatch modal appears:
- [ ] Check it shows Ray's name
- [ ] Check it shows the goal
- [ ] Click "Dispatch" button
- [ ] See waiting room (or error - that's okay, backend might not be ready)

---

## 📸 TAKE SCREENSHOTS

Take screenshots of:
1. Main page loaded
2. Copilot opened
3. Person selected
4. Chat conversation
5. Dispatch modal
6. Any errors

Save to: `/Users/robertboulos/.openclaw/workspace/projects/orbiter-copilot-demo/test-screenshots/`

---

## 🐛 REPORT ISSUES

If you see:
- ❌ Person cards during conversation → GOOD (frontend filter working!)
- ❌ Leverage loop cards during conversation → GOOD (frontend filter working!)
- ❌ Console errors → Note them
- ❌ Dispatch doesn't work → Expected (backend not ready yet)
- ❌ Blank responses → Check backend

---

## ✅ WHAT TO LOOK FOR

### ✅ GOOD:
- App loads
- Copilot opens
- Person picker works
- Text responses work
- NO intermediate card suggestions

### ⚠️ NEEDS BACKEND:
- Interview questions (backend needs to ask them)
- Dispatch endpoint (backend needs to build it)
- Results (backend needs to process)

---

**After testing, report back what you found!**
