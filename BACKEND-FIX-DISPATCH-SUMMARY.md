# Backend Fix Needed: Dispatch Summary Formatting

**Date:** Feb 23, 2026 - 8:00 PM  
**Issue:** Dispatch summaries being returned as plain text wall instead of structured template

---

## The Problem

**Current (Screenshot Feb 23):**

Backend returns dispatch summary as **plain text**:

```
Goal: Help Mark Tluszcz get expert advice Target: Mark Tluszcz Outcome: Connect with expert advisors Constraints: No specific industry or expertise area specified Quick matches found in your network: • Josh Wolfe (Lux Capital) - Frontier tech investing expert • Joe Lonsdale (8VC, Palantir founder) - Entrepreneurship & policy • Deena Shakir (Lux Capital) - Health tech & AI expertise • Eric Hippeau (Lerer Hippeau) - Media & consumer tech • Gavin Baker (Atreides Management) - Public markets & growth investing I will search your full network of 378 connections to find the most relevant experts across industries, investment stages, and functional expertise areas.
```

**Result:** Wall of text, no formatting, hard to read

---

## The Solution

Backend should return structured template instead of plain text.

### Option 1: Use `outcome_card` Template (Preferred)

**Backend returns:**
```json
{
  "type": "text",
  "text": "Here's what I found:"
},
{
  "name": "outcome_card",
  "templateProps": {
    "title": "Expert Advice for Mark Tluszcz",
    "description": "Connect with expert advisors",
    "constraints": [
      "No specific industry specified"
    ],
    "quickMatches": [
      {
        "name": "Josh Wolfe",
        "title": "Partner",
        "company": "Lux Capital",
        "reason": "Frontier tech investing expert",
        "confidence": "high"
      },
      {
        "name": "Joe Lonsdale",
        "title": "Founder",
        "company": "8VC, Palantir",
        "reason": "Entrepreneurship & policy",
        "confidence": "high"
      }
    ],
    "searchProgress": {
      "analyzed": 378,
      "found": 5
    }
  }
}
```

---

### Option 2: Use `quick_result_card` Template

**For showing matches during interview:**

```json
{
  "name": "quick_result_card",
  "templateProps": {
    "matches": [
      {
        "name": "Josh Wolfe",
        "title": "Partner at Lux Capital",
        "company": "Lux Capital",
        "reason": "Frontier tech investing expert",
        "confidence": "high"
      },
      {
        "name": "Joe Lonsdale",
        "title": "Founder",
        "company": "8VC",
        "reason": "Entrepreneurship & policy expertise",
        "confidence": "high"
      }
    ],
    "stillSearching": true
  }
}
```

---

### Option 3: Create New `dispatch_summary` Template

**If existing templates don't fit, create dedicated template:**

```json
{
  "name": "dispatch_summary",
  "templateProps": {
    "goal": "Help Mark Tluszcz get expert advice",
    "target": "Mark Tluszcz",
    "outcome": "Connect with expert advisors",
    "constraints": "No specific industry or expertise area specified",
    "quickMatches": [
      "Josh Wolfe (Lux Capital) - Frontier tech investing expert",
      "Joe Lonsdale (8VC, Palantir founder) - Entrepreneurship & policy",
      "Deena Shakir (Lux Capital) - Health tech & AI expertise"
    ],
    "searchDescription": "I will search your full network of 378 connections to find the most relevant experts across industries, investment stages, and functional expertise areas."
  }
}
```

**Frontend component:** Already created (`FormattedDispatchSummary.tsx`)

---

## Why This Matters

### Current UX Issues:

1. **Wall of Text** - Hard to scan, looks unfinished
2. **No Visual Hierarchy** - Everything same weight
3. **Missing Icons** - No visual cues for sections
4. **Poor Readability** - Dense paragraph format
5. **Looks Unprofessional** - Not "world class UI/UX"

### After Fix:

1. ✅ **Clear Sections** - Goal, Target, Outcome, Constraints separated
2. ✅ **Visual Hierarchy** - Headers, cards, spacing
3. ✅ **Icons** - 👤 for person, 🎯 for outcome, 📋 for constraints
4. ✅ **Scannable** - Bullet points properly formatted
5. ✅ **Professional** - Polished, premium feeling

---

## Implementation Timeline

**Immediate (Tonight):**
- Frontend: ✅ Added CSS to make plain text more readable
- Frontend: ✅ Created FormattedDispatchSummary component (ready when backend switches)

**Backend Team (Tomorrow):**
- Choose template approach (Option 1, 2, or 3)
- Update /chat endpoint to return structured template
- Test with Robert

**Timeline:** 30-60 minutes backend work

---

## Testing

**Before Fix:**
```
User completes interview
→ Backend returns plain text wall
→ User sees dense paragraph
❌ Looks unfinished
```

**After Fix:**
```
User completes interview
→ Backend returns outcome_card template
→ User sees beautifully formatted summary
→ Clear sections, icons, visual hierarchy
✅ Professional, polished
```

---

## Additional Issue: Send Button Icon

**Problem:** Send button in bottom-right shows as dark box with no icon

**Fix Applied:** Added CSS to ensure icon displays:
```css
.crayon-shell-input button[type="submit"] svg {
  display: block !important;
  width: 20px !important;
  height: 20px !important;
  fill: currentColor !important;
}

/* Fallback if icon missing */
.crayon-shell-input button[type="submit"]:empty::after {
  content: "→";
  font-size: 22px;
}
```

**Status:** Should be fixed on next refresh

---

## Files Created/Updated

**Frontend:**
- `app/components/FormattedDispatchSummary.tsx` (new, 6.2KB)
- `app/globals.css` (added send button + text formatting CSS)
- `app/page.tsx` (imported FormattedDispatchSummary)

**Backend Needs:**
- Update `/chat` endpoint response format
- Return structured template instead of plain text
- Choose which template to use (outcome_card recommended)

---

## Example Backend Change

**Current backend code (pseudocode):**
```python
# BAD: Returning plain text
response_text = f"Goal: {goal} Target: {target} Outcome: {outcome}..."
return {"type": "text", "text": response_text}
```

**Fixed backend code:**
```python
# GOOD: Returning structured template
return {
    "type": "text",
    "text": "Here's your request summary:"
},
{
    "name": "outcome_card",
    "templateProps": {
        "title": f"{outcome} for {target}",
        "description": goal,
        "constraints": constraints,
        "quickMatches": quick_matches,
        "searchProgress": {"analyzed": 378, "found": len(quick_matches)}
    }
}
```

---

## Priority

**Medium-High**

- Not blocking demo (works, just looks bad)
- Significant UX improvement (wall of text → beautiful card)
- Easy backend fix (30-60 min)
- Big visual impact for Thursday demo

---

**Status:** Frontend ready, waiting for backend template switch  
**ETA:** 30-60 min backend work

