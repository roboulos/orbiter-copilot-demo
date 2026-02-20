# Manual Testing Needed - Feb 20, 2026

## Issue: Automated Testing Limitations

Puppeteer automation shows that programmatic typing doesn't register with CrayonChat's React-controlled textarea components.

**Test Results:**
- ✅ Modal opens correctly
- ✅ Input area is visible  
- ❌ `textarea.type()` doesn't update the component state
- ❌ `textarea.value` returns empty string even after typing

**Why this happens:**
- CrayonChat uses React controlled components
- Puppeteer's `.type()` triggers DOM events but doesn't trigger React's onChange handlers
- The textarea is controlled by React state, not DOM value

## Input Area Fixes Applied

**CSS Changes (globals.css):**
- Changed from forced single-line (`line-height: 44px`) to natural multi-line (`line-height: 1.5`)
- Added `min-height: 24px` and `max-height: 120px` for natural expansion
- Changed `overflow-y: hidden` to `overflow-y: auto` for scrolling
- Added visible 4px scrollbar with brand color
- Removed aggressive padding (now 4px/16px instead of 10px/24px)
- Changed `align-items: center` to `align-items: flex-start` for multi-line support

**JavaScript Changes (useForceFullWidth.ts):**
- Removed all DOM manipulation (MutationObserver, setProperty calls)
- Hook now does nothing (kept for backwards compatibility)
- Pure CSS handles width now - no layout flicker

## What Needs Manual Testing

**Please manually test on localhost:3000:**

1. **Open Copilot**
   - Click "⚡ Copilot" button
   - Modal should open smoothly

2. **Test Single-Line Input**
   - Type a short message (e.g., "Test message")
   - Text should appear with comfortable spacing
   - Line height should look natural (not cramped)

3. **Test Multi-Line Expansion**
   - Type a long message spanning 3-4 lines
   - Input should expand naturally (not force to single line)
   - Should see subtle scrollbar appear if more than ~5-6 lines

4. **Test Scrolling**
   - Type 7-8 lines of text
   - Input should max out at 120px height
   - Should be able to scroll to see all text
   - Scrollbar should be visible (4px, brand indigo color)

5. **Test Send Button**
   - After typing, click the send button
   - Message should send
   - Input should clear and reset to single line

6. **Test Typing Experience**
   - Does typing feel natural and comfortable?
   - Is line spacing comfortable to read? (should be 1.5)
   - Can you edit text easily?
   - Does Enter key create new lines (multi-line) or submit (single-line)?

7. **Test Layout Stability**
   - Is there any flickering when typing?
   - Does the input width stay stable?
   - No visual jumps or layout shifts?

## Expected Behavior

**Good signs:**
- ✅ Text appears as you type
- ✅ Input expands smoothly from 1 line to ~5-6 lines
- ✅ Comfortable line spacing (not cramped in a tall box)
- ✅ Subtle scrollbar appears when needed
- ✅ No layout flickering or width changes
- ✅ Send button stays in place
- ✅ Natural typing experience

**Bad signs (report these):**
- ❌ Text doesn't appear when typing
- ❌ Input stays single-line and cuts off text
- ❌ Line height looks wrong (text vertically centered in tall box)
- ❌ Can't see scrollbar when text is long
- ❌ Layout flickers or jumps
- ❌ Input feels cramped or uncomfortable
- ❌ Enter key doesn't create new lines

## What to Report

Please test and let me know:

1. **Does typing work?** Can you type and see text?
2. **Multi-line expansion?** Does it expand to ~5-6 lines naturally?
3. **Scrolling?** Can you scroll when text is long? See scrollbar?
4. **Line spacing?** Does text look comfortable (1.5 line height)?
5. **Layout stability?** Any flickering or jumping?
6. **Send button?** Does it work? Input clear after?
7. **Overall feel?** Natural and comfortable, or still broken?

## Screenshots from Automated Test

See these files:
- `step1-main-page.png` - Main page
- `step2-modal-open.png` - Modal opened
- `step3-text-typed.png` - After typing attempt
- `step4-multiline.png` - After multi-line typing attempt

**Note:** Automated test couldn't verify if typing actually worked because React controlled components don't respond to puppeteer's `.type()` method. Real user interaction is needed.

## If Issues Are Found

**If typing doesn't work at all:**
- Check browser console for errors
- Verify CrayonChat is rendering
- Check if other inputs on the page work

**If multi-line doesn't expand:**
- Inspect element and check computed styles
- Look for `max-height`, `overflow-y`, `line-height`
- Check if CSS is being applied

**If layout flickers:**
- Check if useForceFullWidth hook is doing anything
- Look for JavaScript errors in console
- Verify MutationObserver isn't running

**If scrollbar doesn't appear:**
- Check `overflow-y: auto` is applied
- Look for `::-webkit-scrollbar` styles
- Verify max-height is being reached

## Next Steps After Testing

1. Report findings
2. If issues found, provide:
   - Screenshots
   - Browser console errors
   - Specific behavior observed
   - What you expected vs what happened
3. I'll fix any issues based on your feedback
4. Re-test until typing experience is perfect

## Goal

**The input should feel:**
- Natural (like typing in any modern chat app)
- Comfortable (good line spacing, easy to read)
- Responsive (expands smoothly, no flicker)
- Professional (subtle scrollbar, clean design)

**Not:**
- Cramped (forced single line)
- Hidden (can't see long text)
- Janky (layout jumps, flicker)
- Broken (typing doesn't work)

Please test manually and report what you find!
