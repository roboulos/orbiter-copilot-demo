# Message for Backend Team - Orbiter Copilot Integration

**From:** Robert  
**Date:** Feb 19, 2026  
**Urgency:** Need by this weekend for Thursday Feb 27 demo  
**Repo:** github.com/roboulos/orbiter-copilot-demo

---

## 🎯 TL;DR

Frontend is 100% done. We need 2 things from backend:

1. **Return button options** in AI responses (for interview questions)
2. **Create dispatch endpoint** (to activate the network)

**Estimated:** 1-2 hours total work

---

## 1️⃣ Button Response Format (CRITICAL)

### What's Needed

When the AI asks an interview question, return **button options** instead of just text.

### Current Response Format (Text Only)
```json
{
  "raw": "{\"response\":[{\"type\":\"text\",\"text\":\"What region are you interested in?\"}]}"
}
```

### NEW Required Format (Text + Buttons)
```json
{
  "raw": "{\"response\":[{\"type\":\"text\",\"text\":\"What region of Costa Rica are you targeting?\"},{\"name\":\"button_group\",\"templateProps\":{\"options\":[{\"label\":\"Pacific Coast\",\"value\":\"pacific\",\"emoji\":\"🏖️\"},{\"label\":\"Central Valley\",\"value\":\"central\",\"emoji\":\"🏔️\"},{\"label\":\"Caribbean Side\",\"value\":\"caribbean\",\"emoji\":\"🌴\"}]}}]}"
}
```

### Format Breakdown

```javascript
{
  "raw": JSON.stringify({
    "response": [
      // 1. The question (as text)
      {
        "type": "text",
        "text": "What region of Costa Rica are you targeting?"
      },
      
      // 2. The button options
      {
        "name": "button_group",  // ← This tells frontend to render buttons
        "templateProps": {
          "options": [
            {
              "label": "Pacific Coast",    // Shown to user
              "value": "pacific",           // Sent back when clicked
              "emoji": "🏖️"                // Optional emoji
            },
            {
              "label": "Central Valley",
              "value": "central",
              "emoji": "🏔️"
            },
            {
              "label": "Caribbean Side",
              "value": "caribbean",
              "emoji": "🌴"
            }
          ]
        }
      }
    ]
  })
}
```

### When User Clicks a Button

Frontend automatically sends the **value** as the next user message:

```
User clicks [Pacific Coast] → Sends message "pacific"
```

AI then responds with the next question + more buttons.

---

## 2️⃣ Submit Button (When Interview Complete)

### When to Return

After gathering enough context, return a submit button:

```json
{
  "raw": "{\"response\":[{\"type\":\"text\",\"text\":\"Got it! I can help you find connections to Costa Rica real estate in the Pacific Coast region.\"},{\"name\":\"submit_button\",\"templateProps\":{\"summary\":\"Find warm introductions to real estate agents and expat communities in Pacific Coast, Costa Rica for relocation purposes.\",\"label\":\"Leverage My Network\"}}]}"
}
```

### Format Breakdown

```javascript
{
  "raw": JSON.stringify({
    "response": [
      {
        "type": "text",
        "text": "Got it! I can help you find connections..."
      },
      {
        "name": "submit_button",  // ← Renders submit button
        "templateProps": {
          "summary": "Find warm introductions to real estate agents...",
          "label": "Leverage My Network"  // Optional button text
        }
      }
    ]
  })
}
```

When user clicks → Opens confirmation modal → User confirms → Calls dispatch endpoint.

---

## 3️⃣ Dispatch Endpoint

### What's Needed

An endpoint to receive the final dispatch request when user confirms.

### Suggested Endpoint

```
POST /api/dispatch
```

### Request Body

```json
{
  "summary": "Find warm introductions to real estate agents and expat communities in Pacific Coast, Costa Rica",
  "context": {
    "outcome": "Buy a house in Costa Rica",
    "region": "Pacific Coast",
    "purpose": "Relocation",
    "budget": "$500k-$1M"
  },
  "person_id": null,  // or master_person_id if helping someone
  "conversation_history": [
    {"role": "user", "content": "I want to buy a house in Costa Rica"},
    {"role": "assistant", "content": "What region?"},
    {"role": "user", "content": "pacific"}
  ]
}
```

### Response

```json
{
  "success": true,
  "dispatch_id": "disp_123456",
  "message": "Leveraging your network. We'll notify you when connections are found."
}
```

### Error Response

```json
{
  "success": false,
  "error": "Failed to dispatch: insufficient context"
}
```

---

## 📋 Implementation Checklist

### Part 1: Button Responses
- [ ] Update AI prompt to return button options for multiple-choice questions
- [ ] Wrap response in correct JSON format (text + button_group)
- [ ] Test that buttons render correctly
- [ ] Ensure button values get sent back as next user message

### Part 2: Submit Button
- [ ] Detect when interview is complete (enough context gathered)
- [ ] Return submit_button template with summary
- [ ] Test that clicking opens confirmation modal

### Part 3: Dispatch Endpoint
- [ ] Create POST /api/dispatch endpoint
- [ ] Accept summary + context + conversation history
- [ ] Return dispatch_id or error
- [ ] Update frontend to call this endpoint (currently simulated)

---

## 🎨 Example Interview Flow (What It Should Look Like)

```
User: "I want to buy a house in Costa Rica"

AI (text + buttons):
  "What region are you targeting?"
  [🏖️ Pacific Coast] [🏔️ Central Valley] [🌴 Caribbean Side]

User clicks: [Pacific Coast]

AI (text + buttons):
  "What's your purpose?"
  [🏠 Vacation Property] [💰 Investment] [✈️ Relocating]

User clicks: [Relocating]

AI (text + buttons):
  "Budget range?"
  [💵 Under $500k] [💰 $500k-$1M] [💎 $1M+]

User clicks: [$500k-$1M]

AI (text + submit button):
  "Got it! I can help you find connections to Costa Rica real estate."
  [⚡ Leverage My Network]

User clicks submit → Confirmation modal → Dispatch
```

---

## 🚀 Where to Update

**Backend AI Integration:**
- File: Wherever chat endpoint processes messages
- Function: The one that calls OpenRouter/GPT and formats response
- Change: Return button_group format instead of just text

**New Endpoint Needed:**
- Route: POST /api/dispatch
- Handler: Create new dispatch handler
- Integration: Connect to Orbiter's network activation system

---

## 📚 Full Documentation

See `BACKEND-INTEGRATION.md` in the repo for:
- Complete examples
- All template formats
- Error handling
- Interview prompting strategy
- Progressive disclosure guidelines

---

## ⏰ Timeline

**Need by:** This weekend (for testing)  
**Demo date:** Thursday Feb 27 @ 9 AM  
**Frontend status:** 100% complete, waiting on these 2 backend items  

---

## 🤝 Support

**Questions?** Ping Robert  
**Full spec:** See `BACKEND-INTEGRATION.md` in repo  
**Frontend code:** `orbiter-copilot-demo` repo on GitHub  

---

## ✅ Success Criteria

**You'll know it's working when:**
1. User starts chat → sees button options below AI messages
2. Clicking buttons sends the value as next message
3. After interview → submit button appears
4. Clicking submit → confirmation modal → dispatch succeeds
5. Frontend shows "✅ Your network has been activated!"

---

**Thanks! This is the last piece we need for the demo.** 🙏
