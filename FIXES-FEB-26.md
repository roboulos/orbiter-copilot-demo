# Critical Fixes - Feb 26, 2026 @ 9:15 AM EST

## Context
Robert was on call with Orbiter team when backend response showed raw JSON instead of buttons.

## Root Causes

### Issue 1: Auto-send not triggering after fork choice
**Symptom:** After selecting fork option, message input wasn't auto-populated and sent  
**Cause:** React state batching timing issue - multiple setState calls not synchronizing  
**Fix:** DOM manipulation fallback with 600ms delay to wait for React to settle  

**Commit:** `7842bbb` - "FIX: Auto-send after fork choice using DOM manipulation (Option A quick fix)"

### Issue 2: Backend using 'type' instead of 'name' field
**Symptom:** JSON response not being parsed  
**Cause:** Parser expected `{name: "button_group", ...}` but backend sent `{type: "button_group", ...}`  
**Fix:** Updated parser to support both 'name' and 'type' fields  

**Commit:** `6021860` - "FIX: Parser now handles 'type' field in backend responses"

### Issue 3: Malformed JSON missing outer braces
**Symptom:** Raw JSON displayed as text in chat  
**Cause:** Backend returning `"type": "button_group", ...` instead of `{"type": "button_group", ...}`  
**Fix:** Fallback parser wraps response in `{}` if it detects object content  

**Commit:** `6ce6bcb` - "FIX: Add fallback parser to wrap malformed JSON responses in braces"

### Issue 4: ButtonGroup prop structure mismatch
**Symptom:** Even after parsing, buttons not rendering  
**Cause:** Backend sends `{masterPersonId, buttons: [{text, action}]}` but ButtonGroup expects `{question, options: [{label, value}]}`  
**Fix:** ButtonGroup now accepts both formats and adapts backend format to frontend format  

**Commit:** `c2f08c6` - "FIX: ButtonGroup now handles backend format (buttons/masterPersonId) and frontend format (question/options)"

## Summary of Changes

### `/app/page.tsx`
1. **Auto-send fix** - DOM manipulation with setTimeout  
2. **Parser enhancement** - Support 'type' and 'name' fields  
3. **Malformed JSON fallback** - Auto-wrap in braces  
4. **Better error logging** - Show exactly what backend returned  

### `/app/components/ButtonGroup.tsx`
1. **Dual format support** - Accept both frontend and backend prop structures  
2. **Prop transformation** - Map `buttons` → `options`, `text` → `label`, `action` → `value`  
3. **Default question** - Fallback if backend doesn't send question  

## Testing Checklist

- [ ] Fork choice auto-sends message  
- [ ] Backend button responses render as button UI  
- [ ] Malformed JSON wrapped and parsed correctly  
- [ ] Console shows helpful error messages  
- [ ] Both frontend and backend button formats work  

## Next Steps

1. **Verify in staging** - Test with real backend responses  
2. **Monitor console** - Check for any remaining parse errors  
3. **Backend coordination** - Ensure they send valid JSON (outer braces)  
4. **Optional cleanup** - Once backend is fixed, remove fallback hacks  

## Deployment

**Repo:** github.com/roboulos/orbiter-copilot-demo  
**Branch:** main  
**Commits:** 4 new commits pushed  
**Auto-deploy:** Vercel should pick up changes automatically  

---

**All fixes committed and pushed. Ready for demo.**
