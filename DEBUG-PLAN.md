# Debug Plan - Interview Flow Issue
**Problem:** Interview closes after first answer instead of continuing

## Hypothesis
The issue is NOT in the frontend code (no console errors). Most likely:
1. Backend response format incorrect
2. Modal closing logic triggered incorrectly
3. Event handling issue

## Debug Steps

### 1. Check Backend Response
- Open Network tab in DevTools
- Start interview
- Answer first question
- Capture backend response JSON
- Verify it matches expected format

### 2. Check Frontend Event Handling
- Look for any code that closes the modal
- Check if error handling closes modal
- Verify message processing logic

### 3. Test Each Template Independently
- Test question_card alone
- Test quick_result_card alone  
- Test submit_button alone

### 4. Add Debug Logging
- Log every message received
- Log every state change
- Log modal open/close events

## Expected Backend Response Format

After first answer, should return:
```json
{
  "role": "assistant",
  "messages": [
    {
      "template": "quick_result_card",
      "data": { "matches": [...] }
    },
    {
      "template": "question_card",
      "data": { "title": "Budget?", "buttons": [...] }
    }
  ]
}
```

## Quick Fix Options

If backend is correct but frontend breaks:
1. Add try-catch around message processing
2. Add null checks for templates
3. Prevent modal close on non-critical errors
4. Add fallback rendering

## Testing Now...
