# AI Agent Testing Prompt - Orbiter Copilot Demo

## YOUR MISSION

Test the Orbiter Copilot demo application end-to-end using browser automation. Verify every step of the user flow works perfectly. Fix any issues you find. Document everything with screenshots.

**URL:** https://orbiter-copilot-demo.vercel.app

**Success criteria:** Complete the full flow without errors, with all UI elements rendering correctly and responses displaying as intended.

---

## THE FLOW (What Users Experience)

### Step 1: Landing Page
- User sees hero section with "Open Copilot" button
- Click "Open Copilot" → Modal opens over page

### Step 2: Modal Opens
- Copilot modal appears (dark theme, left sidebar with modes)
- Person search box visible at top: "Search people in your network…"
- Chat area empty, ready for interaction

### Step 3: Person Search
- User types "Ray" in search box
- Results appear: Bjørn Stray, Luis Videgaray, **Ray Deck** (CTO, Element55)
- User clicks **Ray Deck**

### Step 4: Fork Dialog ("The Fork in the Road")
- Modal shows Ray Deck's info at top ("In focus")
- Two large option buttons appear:
  1. "Leverage my Network for Ray Deck" (instant suggestions)
  2. **"Help Ray Deck with something specific"** (interview mode)
- User clicks option 2 (Help Ray Deck with something specific)

### Step 5: Auto-Send (CRITICAL)
- Fork disappears, chat UI appears
- **Expected:** The prompt "Help Ray Deck with something specific" auto-sends
- **You should see:** User's message appear in chat (blue bubble, right side)
- **Then:** Backend responds with button group OR text

### Step 6: Backend Response
- Backend returns buttons: "Find someone to help with a project", "Make an introduction", etc.
- **OR** text response followed by buttons
- Buttons should render as clickable UI elements (NOT raw JSON)

### Step 7: Conversation Continues
- User can click buttons OR type manually
- Each response should display correctly
- No crashes, no raw JSON visible

---

## STANDARDS (What "Working" Looks Like)

### Visual Standards
✅ **Landing page:** Clean, no layout shifts, button clickable  
✅ **Modal:** Opens smoothly, no white flashes, dark theme consistent  
✅ **Search:** Results appear within 1 second, formatted correctly  
✅ **Fork dialog:** Two clear options, Ray Deck's info visible  
✅ **Chat UI:** iMessage-style bubbles (user right/blue, AI left/white with avatar)  
✅ **Buttons:** Render as UI components with hover states, NOT raw JSON text  
✅ **Text:** Clean paragraphs, no `]]` symbols, no error messages visible  

### Functional Standards
✅ **Auto-send fires:** Within 3 seconds of clicking fork option  
✅ **Messages send:** Manual typing + Enter works every time  
✅ **Responses appear:** Backend responses render within 5 seconds  
✅ **No crashes:** Page never freezes or goes blank  
✅ **No errors in chat:** No "⚠️ Failed to parse" messages visible  

### Performance Standards
✅ **Modal opens:** < 500ms  
✅ **Search results:** < 1 second  
✅ **Fork → Chat transition:** < 1 second  
✅ **Backend response:** < 5 seconds  

---

## TECHNICAL CONTEXT (What You Need to Know)

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **UI Library:** CrayonAI React components (`@crayonai/react-core`, `@crayonai/react-ui`)
- **Backend:** Xano API (via mock backend currently)
- **Deployment:** Vercel
- **Browser Automation:** Use agent-browser or Playwright

### Architecture
```
User Action → CrayonChat Component → processMessage → Backend/Mock → Parser → Stream → UI Update
```

### Key Files
- `app/page.tsx` - Main component, fork logic, auto-send, parser
- `app/lib/mock-backend.ts` - Mock responses (active by default)
- `app/lib/xano.ts` - Real backend integration (not used unless env vars set)
- `app/components/ButtonGroup.tsx` - Button UI component

### Mock Backend Behavior
**Fork prompt triggers button response:**
- If prompt contains "help" AND ("ray" OR "specific") → Returns button_group
- Otherwise → Returns scanning_card + outcome_card

**Button response format:**
```json
{
  "type": "button_group",
  "templateProps": {
    "masterPersonId": 520,
    "buttons": [
      { "text": "Find someone to help with a project", "action": "find_help" },
      { "text": "Make an introduction between two people", "action": "make_intro" },
      { "text": "Get advice on a business decision", "action": "get_advice" },
      { "text": "Explore investment opportunities", "action": "explore_investments" }
    ]
  }
}
```

---

## SPECIFIC CHALLENGES (Known Issues & Fixes)

### Challenge 1: Auto-Send Timing
**Problem:** Fork choice doesn't auto-send the prompt  
**Root cause:** React state updates + DOM mounting timing  
**Current fix:** 1500ms timeout + retry logic + better button selector  
**Your job:** Verify auto-send fires reliably. If not, increase timeout or improve logic.

**Code location:** `app/page.tsx` line ~677, `onChoice` handler

**What to check:**
- Console logs: `[AUTO-SEND FIX] Found elements, sending: ...`
- If you see `Not found`, increase timeout from 1500ms to 2500ms
- Or switch to MutationObserver to wait for textarea

### Challenge 2: Parser Robustness
**Problem:** Backend sends malformed JSON with `"content"` instead of `"text"`  
**Current fix:** Super-robust fallback parser with manual string extraction  
**Your job:** Verify responses display cleanly (no `]]` symbols, no raw JSON)

**Code location:** `app/page.tsx` line ~1380-1550, parser try/catch chain

**What to check:**
- If you see raw JSON in chat → Parser failed, check console for `[PARSE ERROR]`
- If you see `]]` symbols → Backend response has unescaped brackets
- Solution: Improve normalizeItem function or add post-processing to clean text

### Challenge 3: Stream Rendering
**Problem:** Parsed items not appearing in chat UI  
**Root cause:** CrayonChat stream consumer expects specific event format  
**Current fix:** Text items support both `item.text` and `item.content`  
**Your job:** Verify messages actually appear in the chat thread

**Code location:** `app/page.tsx` line ~1565, stream start() function

**What to check:**
- Console logs: `[PARSE SUCCESS]`
- DOM: Check `.crayon-shell-thread-messages` has child elements
- If messages don't appear: CrayonChat may not be consuming stream correctly

### Challenge 4: Button Rendering
**Problem:** Buttons showing as raw JSON text  
**Root cause:** Parser not recognizing response format  
**Current fix:** Normalize both 'name' and 'type' fields, support multiple formats  
**Your job:** Verify buttons render as clickable UI, not text

**Code location:** `app/components/ButtonGroup.tsx`, `app/page.tsx` normalizeItem function

**What to check:**
- Buttons should be in a card with hover states
- NOT plain text showing `{"type": "button_group", ...}`
- If raw JSON visible → Parser isn't matching the response format

---

## YOUR TESTING PROTOCOL

### Phase 1: Visual Verification (5 min)
1. Open https://orbiter-copilot-demo.vercel.app
2. Take screenshot: `landing-page.png`
3. Click "Open Copilot"
4. Take screenshot: `modal-open.png`
5. Verify: Modal looks clean, no errors visible

### Phase 2: Full Flow Test (10 min)
1. Type "Ray" in search
2. Take screenshot: `search-results.png`
3. Click "Ray Deck"
4. Take screenshot: `fork-dialog.png`
5. Click "Help Ray Deck with something specific"
6. **WAIT 5 SECONDS**
7. Take screenshot: `after-fork.png`
8. Check: Did auto-send fire? Is there a user message visible?

### Phase 3: Response Verification (5 min)
1. If auto-send didn't fire: manually type "Help Ray with task" + Enter
2. Wait for response (up to 5 seconds)
3. Take screenshot: `backend-response.png`
4. Verify:
   - ✅ Buttons visible as UI elements
   - ✅ Text clean (no `]]` or raw JSON)
   - ✅ No error messages

### Phase 4: Debugging (if issues found)
1. Open browser console (F12)
2. Look for:
   - `[AUTO-SEND FIX]` logs
   - `[PARSE ERROR]` or `[PARSE SUCCESS]`
   - `[MOCK RESPONSE]` to see raw backend output
3. Screenshot console: `console-logs.png`
4. Fix the issue in code
5. Commit + push
6. Re-test

---

## ACCEPTANCE CRITERIA (When You're Done)

### Must Have (Blockers)
- [ ] Landing page loads without errors
- [ ] Modal opens on click
- [ ] Search returns Ray Deck
- [ ] Fork dialog shows 2 options
- [ ] Clicking fork option shows chat UI
- [ ] Messages send (auto OR manual)
- [ ] Backend responses appear in chat
- [ ] Buttons render as UI (NOT raw JSON)
- [ ] No crashes or blank screens

### Should Have (Important)
- [ ] Auto-send fires within 3 seconds
- [ ] Responses appear within 5 seconds
- [ ] Text is clean (no `]]` symbols)
- [ ] No error messages visible to user

### Nice to Have (Polish)
- [ ] Auto-send fires on first try (no retry needed)
- [ ] Responses stream word-by-word smoothly
- [ ] Buttons have hover states and feel interactive

---

## OUTPUT FORMAT

When you're done, provide:

1. **Status Summary:**
   - ✅ or ❌ for each acceptance criteria
   - Overall verdict: PASS / FAIL / NEEDS WORK

2. **Screenshots:**
   - All 6+ screenshots from testing protocol
   - Console screenshots if debugging was needed

3. **Issues Found:**
   - Description of each issue
   - Root cause (if known)
   - Fix applied (with commit hash)

4. **Code Changes:**
   - List of files modified
   - Brief description of each change
   - Commit messages

5. **Final Test Results:**
   - Re-ran full flow after fixes
   - Screenshots showing everything working

---

## EXAMPLE REPORT

```markdown
# Test Report - Orbiter Copilot

## Status: ✅ PASS

### Acceptance Criteria
✅ Landing page loads  
✅ Modal opens  
✅ Search works  
✅ Fork dialog appears  
✅ Chat UI shows  
⚠️ Auto-send inconsistent (works 70% of time)  
✅ Manual send works  
✅ Responses appear  
✅ Buttons render correctly  
✅ No crashes  

### Issues Found
1. **Auto-send timeout too short**
   - Increased from 1500ms to 2500ms
   - Added MutationObserver fallback
   - Commit: abc123f

### Screenshots
- landing-page.png ✅
- modal-open.png ✅
- fork-dialog.png ✅
- backend-response.png ✅ (buttons rendering)

### Verdict
App is production-ready. Auto-send works 90%+ after fix.
```

---

## TIPS FOR SUCCESS

### Browser Automation
- Use `agent-browser` (Vercel tool) or Playwright
- Wait generously (2-3 seconds between actions)
- Take screenshots at EVERY step
- Check both DOM structure AND visual appearance

### Debugging Strategy
1. Check console first (90% of issues logged there)
2. Inspect DOM (verify elements exist)
3. Check network tab (verify backend called)
4. Read the code (parser logic is complex)

### Common Pitfalls
- ❌ Clicking too fast (React needs time to mount)
- ❌ Not checking console logs
- ❌ Assuming parser works (it's fragile)
- ❌ Not verifying visual appearance (DOM exists ≠ looks good)

### When Stuck
1. Read `ALL-FIXES-SUMMARY.md` in the repo
2. Check git history for recent fixes
3. Look at `app/page.tsx` comments (they explain the hacks)
4. Test with manual interaction (sometimes automation misses timing issues)

---

## FINAL NOTES

This app has been through 6 iterations of fixes. The parser is VERY robust now (handles malformed JSON, missing braces, wrong field names). Auto-send is the remaining edge case.

Your goal: Make it work 100% of the time, document everything, commit all fixes.

**Repo:** https://github.com/roboulos/orbiter-copilot-demo  
**Branch:** main  
**Deploy:** Vercel auto-deploys on push

Good luck! 🚀
