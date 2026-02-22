# Ready Fixes - Depending on Backend Response

## Scenario A: Backend Returns Wrong Format

If backend response looks like:
```json
{
  "template": "question_card",
  "data": {...}
}
```

**Fix:** Add response transformer in page.tsx:
```typescript
// After parsing, transform single template to response array
if (parsed?.template && parsed?.data) {
  items = [{ name: parsed.template, templateProps: parsed.data }];
} else {
  items = parsed?.response ?? [];
}
```

## Scenario B: Backend Returns Multiple Messages Wrong

If backend returns:
```json
{
  "messages": [{...}, {...}]
}
```

**Fix:**
```typescript
items = parsed?.messages?.map(msg => ({
  name: msg.template,
  templateProps: msg.data
})) ?? parsed?.response ?? [];
```

## Scenario C: Error During Parsing Closes Modal

If try-catch is closing modal on error:

**Fix in page.tsx processMessage:**
```typescript
try {
  // existing parsing logic
} catch (err) {
  console.error('[PARSE ERROR]', err, 'Raw:', raw);
  // DON'T close modal, show fallback
  items = [{ type: "text", text: "I need a moment to process that. Can you try again?" }];
}
```

## Scenario D: Modal Closes Due to State Issue

If modal is closing due to state management:

**Fix:** Add modal close prevention:
```typescript
// In page.tsx, prevent modal close during active conversation
const [conversationActive, setConversationActive] = useState(false);

// Don't allow close if conversation is active
if (conversationActive && !userConfirmedClose) {
  return; // Prevent close
}
```

## Scenario E: CrayonChat Internal Issue

If Crayon SDK is closing the chat:

**Fix:** Override close behavior or use custom chat component

## Most Likely: Scenario A or B

Backend probably isn't returning `{response: [...]}` format.

## Ready to Apply

Once Robert sends backend response screenshot, I'll:
1. Identify which scenario
2. Apply appropriate fix
3. Test immediately
4. Commit and push
5. Verify full flow works

**ETA after seeing response: 5-10 minutes**
