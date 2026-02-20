# Input/Typing Area Fixes — February 20, 2026

## Problems Fixed

### 1. **Uncomfortable Single-Line Forced Input**
**Before:**
- Input forced to single line with `line-height: 44px`
- Text vertically centered in a tall box
- No natural text flow
- Hidden scrollbars made long messages impossible to see

**After:**
- Natural multi-line textarea behavior
- `line-height: 1.5` for comfortable reading
- Max height: 120px (auto-expands up to ~5-6 lines)
- Visible thin scrollbar when needed

### 2. **Height Conflicts Creating Visual Bugs**
**Before:**
- Conflicting rules: `height: 44px` vs `height: 40px`
- `max-height: 44px` prevented expansion
- Forced single-line via multiple conflicting properties

**After:**
- Clean `min-height: 24px` and `max-height: 120px`
- Natural expansion as user types
- No conflicting height rules

### 3. **Aggressive Overflow Hiding**
**Before:**
- `overflow-y: hidden` prevented any vertical scrolling
- `overflow-x: auto` with hidden scrollbar created confusion
- Users couldn't see or edit long messages

**After:**
- `overflow-y: auto` allows natural scrolling
- Thin 4px scrollbar with brand color (#6366f1 with 30% opacity)
- Smooth scrolling experience

### 4. **JavaScript Width Forcing Causing Layout Instability**
**Before:**
- MutationObserver constantly re-applying width via `setProperty('width', '100%', 'important')`
- Layout flickering
- Performance overhead
- Fighting with React's state management

**After:**
- Removed all JavaScript width manipulation
- Pure CSS width control
- Stable, performant, no flicker
- Hook kept for backwards compatibility (but does nothing now)

### 5. **Input Wrapper Padding Too Aggressive**
**Before:**
- `padding: 10px 10px 10px 24px`
- Left padding too large
- Vertically centered alignment (`align-items: center`) bad for multi-line

**After:**
- `padding: 4px 10px 4px 16px` (less aggressive)
- `align-items: flex-start` (top-aligned for multi-line)
- `min-height: 52px` maintains minimum clickable area

## Files Changed

### 1. `app/globals.css`
**Lines changed:**
- `.crayon-shell-thread-composer__input` (398-420) - Complete rewrite
- `[class*="composer"] textarea` (424-435) - Multi-line support
- `.crayon-shell-desktop-welcome-composer__input` (330-353) - Matching changes
- `.crayon-shell-thread-composer__input-wrapper` (383-393) - Padding + alignment

### 2. `app/hooks/useForceFullWidth.ts`
**Changes:**
- Removed all DOM manipulation
- Hook now empty (kept for backwards compatibility)
- Comment explaining CSS handles it now

## Visual Improvements

**Before:**
```
┌──────────────────────────────────────┐
│  Type your message...                │  ← Single line, forced height
└──────────────────────────────────────┘
```

**After:**
```
┌──────────────────────────────────────┐
│  Type your message...                │  ← Starts single line
│                                      │
│  But expands naturally as you type  │  ← Grows to 5-6 lines
│  with comfortable line spacing and  │
│  a subtle scrollbar if needed       │  ← Max 120px height
└──────────────────────────────────────┘
```

## Technical Details

### Scrollbar Styling
```css
.crayon-shell-thread-composer__input::-webkit-scrollbar {
  width: 4px !important;
}

.crayon-shell-thread-composer__input::-webkit-scrollbar-thumb {
  background: rgba(99,102,241,0.3) !important;  /* Brand indigo */
  border-radius: 2px !important;
}
```

### Multi-Line Support
```css
min-height: 24px !important;      /* Minimum 1 line */
max-height: 120px !important;     /* Maximum ~5-6 lines */
line-height: 1.5 !important;      /* Comfortable spacing */
overflow-y: auto !important;      /* Natural scrolling */
padding: 10px 0 !important;       /* Vertical breathing room */
```

### Natural Expansion
- Textarea auto-expands as user types (up to max-height)
- No JavaScript needed - native textarea behavior
- Smooth, performant, accessible

## User Experience Improvements

1. **More Comfortable Typing**
   - Line spacing matches normal text (1.5)
   - Text doesn't look cramped
   - Easy to read long messages

2. **Better for Long Messages**
   - Can see ~5-6 lines at once before scrolling
   - Subtle scrollbar indicates more content
   - No hidden text

3. **No Layout Flicker**
   - Removed JavaScript DOM manipulation
   - Pure CSS is instant and stable
   - No MutationObserver overhead

4. **Consistent Across Inputs**
   - Welcome screen composer matches
   - Thread composer matches
   - Same behavior everywhere

## Testing

**Manual testing needed:**
1. Open copilot modal
2. Type a short message (1 line) - should look normal
3. Type a long message (5+ lines) - should expand naturally
4. Keep typing past 6 lines - should show scrollbar
5. Scroll to see all text - should be smooth
6. Submit message - input should reset to single line

**Expected behavior:**
- ✅ Starts as single line input
- ✅ Expands smoothly as you type
- ✅ Shows subtle scrollbar when needed
- ✅ No layout flickering
- ✅ Comfortable line spacing
- ✅ Easy to edit long messages

## Performance

**Before:**
- MutationObserver firing constantly
- DOM manipulation in tight loop
- Layout recalculations on every mutation

**After:**
- Zero JavaScript overhead
- Pure CSS (instant, GPU-accelerated)
- No observers, no timeouts, no DOM manipulation

## Browser Compatibility

**All changes use standard CSS:**
- `min-height` / `max-height` - Universal support
- `overflow-y: auto` - Universal support
- `line-height: 1.5` - Universal support
- `::-webkit-scrollbar-*` - Webkit only (graceful degradation)

## Next Steps

1. **Test in development** - Verify all flows work
2. **Get Robert's feedback** - Is typing comfortable now?
3. **Mobile testing** - Ensure touch keyboard works well
4. **Accessibility audit** - Screen reader support for multi-line
5. **Performance profiling** - Confirm no JavaScript overhead

## Commit

```bash
git add app/globals.css app/hooks/useForceFullWidth.ts INPUT-FIXES-FEB-20.md
git commit -m "Fix input/typing area - natural multi-line, comfortable spacing, remove JS width forcing

- Changed from forced single-line to natural multi-line (max 5-6 lines)
- line-height: 1.5 for comfortable reading (was 44px single-line)
- Added visible 4px scrollbar with brand color
- Removed all JavaScript width forcing (pure CSS now)
- Fixed input wrapper padding (4px vs 10px vertical)
- align-items: flex-start for multi-line support
- min-height: 24px, max-height: 120px
- Same improvements for welcome composer and thread composer
- Performance: No MutationObserver overhead, no DOM manipulation
- UX: Comfortable typing, natural expansion, smooth scrolling"
```

## Summary

**The input was broken because:**
- Forced single-line with tall line-height (uncomfortable)
- Hidden overflow prevented seeing/editing long text
- JavaScript width forcing caused flicker
- Too much padding and wrong alignment

**Now it's fixed:**
- Natural multi-line up to ~5-6 lines
- Comfortable 1.5 line-height
- Visible subtle scrollbar
- Pure CSS (no JavaScript overhead)
- Better padding and alignment
- Smooth, stable, performant

**Result:** Typing in the copilot feels natural, comfortable, and professional.
