# 🚨 Message for Backend Team - Critical Issues

**Date:** Feb 19, 2026  
**From:** Robert (Frontend)  
**Re:** 2 Critical Issues Blocking March 2nd Demo

---

## ✅ What's Working

**Costa Rica flow:** Perfect end-to-end
- User clicks starter
- Question 1: Region → User selects "Pacific Coast"
- ScanningCard appears + Question 2: Property type → User selects "Beach House"
- OutcomeCard appears with full summary
- **Zero errors, smooth experience**

---

## 🔴 Issue #1: Investor Flow - 500 Error (CRITICAL)

### What Breaks

**Flow that fails:**
1. User clicks "💰 Find investors for my startup" ✅
2. Backend asks: "What's your target raise amount?" ✅
3. User selects: "$1M - $3M" ✅
4. Backend asks: "What's your B2B SaaS vertical?" ✅
5. User selects: "Developer Tools" ✅
6. **Backend returns 500 error** ❌

### Error Details

```
Failed to load resource: 500 ()
URL: https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz/chat
Timestamp: 2026-02-19T23:36:11.402Z

Error: Xano error
```

### What User Sees

- ScanningCard appears: "Scanning for DevTools Seed Investors"
- But then... nothing
- No follow-up question
- No outcome card
- User is stuck

### Expected Behavior

After "Developer Tools" selection, backend should return:
```json
{
  "messages": [
    {
      "template": "scanning_card",
      "data": {
        "title": "Scanning for DevTools Seed Investors",
        "connections_analyzed": 50,
        "potential_matches": 8
      }
    },
    {
      "template": "question_card",
      "data": {
        "title": "Next Question...",
        "buttons": [...]
      }
    }
  ]
}
```

OR deliver outcome_card if enough context gathered.

### Root Cause Hypothesis

- Works for Costa Rica (2 questions)
- Fails for Investors (3 questions)
- Possibly related to conversation history length?
- Or specific to investor flow logic?

---

## ⚠️ Issue #2: Help Someone Flow - Too Many Questions (BAD UX)

### What Happens

**Flow that goes too deep:**
1. User clicks "🎯 Help someone I know with..." ✅
2. Backend asks: "Who do you want to help?" (3 options) ✅
3. User selects: "Someone specific I have in mind" ✅
4. Backend asks: "Who?" (network people + search) ✅
5. User selects: "Aaron Skonnard" ✅
6. Backend asks: "How can you help Aaron?" (4 options) ✅
7. User selects: "Talent & Hiring" ✅
8. Backend asks: "What type of role?" (4 options) ✅
9. User selects: "Engineering" ✅
10. Backend asks: "What level?" (2 options) ✅
11. **STILL NO OUTCOME CARD** ⚠️

### The Problem

- Costa Rica: 2 questions → outcome ✅
- Help Someone: 5+ questions → still asking ❌

**User experience:**
- Feels like interrogation
- Too much friction
- Unclear when it will end
- Possible infinite loop?

### Expected Behavior

After 2-3 questions max, deliver outcome_card:
```json
{
  "template": "outcome_card",
  "data": {
    "goal": "Help Aaron Skonnard find senior engineering talent at Pluralsight",
    "whyItMatters": "...",
    "idealHelper": "...",
    "timeframe": "...",
    "contextToShare": "..."
  }
}
```

### Root Cause Hypothesis

- LLM not limiting question depth for "help someone" flow
- Needs explicit instruction: "Ask max 2-3 questions, then deliver outcome"
- Or question counter not working

---

## 🎯 What Backend Needs to Fix

### Fix #1: Investor Flow 500 Error

**Priority:** 🔴 **CRITICAL** (blocks 1 of 3 demo flows)

**Action Items:**
1. Debug why `/chat` endpoint crashes on 3rd investor message
2. Check backend logs for stack trace
3. Verify history parsing works for 3+ message conversations
4. Ensure scanning_card + question_card paired in SAME response
5. Test fix with full investor flow

**Success Criteria:**
- Investor flow works end-to-end like Costa Rica
- No 500 errors
- Outcome delivered after 2-3 questions

---

### Fix #2: Help Someone Question Depth

**Priority:** 🟡 **HIGH** (bad UX, possible infinite loop)

**Action Items:**
1. Add question counter to LLM system prompt
2. Force outcome delivery after 2-3 questions max
3. Update system prompt:
   ```
   "After gathering 2-3 key details, deliver an outcome_card.
    Do not ask more than 3 follow-up questions."
   ```
4. Test that outcome appears consistently

**Success Criteria:**
- Help someone flow: 2-3 questions → outcome
- Consistent with Costa Rica flow depth
- No infinite question loops

---

## ✅ Frontend Status

**Visual Design:** 100% Complete (8-pass premium upgrade applied)
- Glass-morphism surfaces
- Animated radar in ScanningCard
- Confetti on save in OutcomeCard
- Premium typography + interactions

**Testing:** Ready
- Costa Rica flow: ✅ Works perfectly
- Investor flow: ❌ Waiting for backend fix
- Help someone: ⚠️ Waiting for backend fix

**Deployment:** Ready to demo once backend fixed

---

## 📅 Timeline

**Today (Feb 19):** Frontend enhancements complete  
**Feb 20-21:** Backend fixes investor 500 + question depth  
**Feb 22-23:** Full testing of all 3 flows  
**Feb 24-26:** Polish + rehearsal  
**Feb 27:** Buffer day  
**March 2:** 🚀 **DEMO**

---

## 🤝 What We Need from Backend

1. **Fix investor 500 error** (highest priority)
2. **Limit help someone to 2-3 questions**
3. **Test both flows end-to-end**
4. **Confirm both deliver outcome_cards**

Once these are fixed, we're 100% ready to launch!

---

**Questions? Need more details?**  
DM Robert or check:
- COMPREHENSIVE-TEST-RESULTS.md (full test documentation)
- MARCH-2-STATUS.md (executive summary)
