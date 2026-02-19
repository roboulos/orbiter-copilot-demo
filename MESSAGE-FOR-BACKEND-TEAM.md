# Message for Backend Team - Visual Template Integration

## TL;DR

**Stop returning plain text.** Start returning visual template objects so the copilot looks premium instead of basic.

Frontend has beautiful visual cards ready to display — backend just needs to return the right format.

---

## What to Change

### ❌ Current (Plain Text Response)
```json
{
  "response": "What region of Costa Rica interests you? You can choose Pacific Coast, Central Valley, or Caribbean Coast."
}
```

**Result:** Boring text bubble that user has to type a response to

### ✅ New (Visual Template Response)
```json
{
  "response": {
    "template": "question_card",
    "data": {
      "icon": "🏝️",
      "title": "Costa Rica Relocation",
      "description": "Which region interests you most?",
      "buttons": [
        {
          "label": "Pacific Coast",
          "value": "pacific",
          "emoji": "🏖️",
          "subtitle": "Guanacaste, Manuel Antonio"
        },
        {
          "label": "Central Valley",
          "value": "central",
          "emoji": "🏔️",
          "subtitle": "San José, Escazú"
        },
        {
          "label": "Caribbean Coast",
          "value": "caribbean",
          "emoji": "🌴",
          "subtitle": "Puerto Viejo, Limón"
        },
        {
          "label": "Still exploring all regions",
          "value": "exploring",
          "emoji": "🗺️"
        }
      ]
    }
  }
}
```

**Result:** Beautiful visual card with icon, description, and clickable buttons

---

## Available Templates

### 1. `question_card` - Visual Multiple Choice

**Use when:** Asking user a question with 2-6 options

**Format:**
```json
{
  "template": "question_card",
  "data": {
    "icon": "🏝️",              // Large emoji icon (or use image_url instead)
    "image_url": "https://source.unsplash.com/800x400/?costa-rica,beach", // OR use this for real image
    "title": "Costa Rica Relocation",
    "description": "Which region interests you most?",  // Optional
    "buttons": [
      {
        "label": "Pacific Coast",
        "value": "pacific",     // This gets sent back when clicked
        "emoji": "🏖️",         // Optional
        "subtitle": "Guanacaste, Manuel Antonio"  // Optional
      }
    ]
  }
}
```

**Visual result:** Large icon/image at top, title, description, beautiful gradient buttons with hover states

---

### 2. `scanning_card` - Network Analysis Animation

**Use when:** AI is "thinking" or "scanning the network"

**Format:**
```json
{
  "template": "scanning_card",
  "data": {
    "title": "🔍 Scanning Your Network...",
    "total_connections": 847,
    "matches_found": 12,
    "status": "Finding connections in Pacific Coast..."
  }
}
```

**Visual result:** Animated radar effect, real-time counters, pulsing animations

---

### 3. `contact_card` - Show a Person

**Use when:** Presenting someone from the network

**Format:**
```json
{
  "template": "contact_card",
  "data": {
    "name": "David Park",
    "title": "Real Estate Developer",
    "company": "Costa Rica Coastal Properties",
    "avatar": "https://...",
    "bio": "Specializes in Pacific Coast properties for American expats",
    "why_matters": "David has helped 50+ Americans buy property in Guanacaste"
  }
}
```

**Visual result:** Profile-style card with avatar, title, company, bio

---

### 4. `outcome_card` - Summary Before Dispatch

**Use when:** Showing final summary before creating outcome

**Format:**
```json
{
  "template": "outcome_card",
  "data": {
    "goal": "Buy vacation property in Pacific Coast, Costa Rica",
    "whyItMatters": "Building a retreat and investment property",
    "idealHelper": "Local realtors, expat community, legal advisors",
    "timeframe": "6 months",
    "contextToShare": "Budget $300-500K, prefer beachfront",
    "matchStrength": "high"  // "high" | "medium" | "building"
  }
}
```

**Visual result:** Polished summary card with gradient background, editable fields, "Save to Orbiter" button

---

### 5. `button_group` - Simple Buttons (No Image)

**Use when:** Quick yes/no or simple choice without needing visuals

**Format:**
```json
{
  "template": "button_group",
  "data": {
    "question": "Do you have existing connections in Costa Rica?",
    "options": [
      { "label": "Yes, show them", "value": "yes", "emoji": "✓" },
      { "label": "No, find some", "value": "no", "emoji": "🔍" },
      { "label": "Not sure", "value": "unsure", "emoji": "🤔" }
    ]
  }
}
```

**Note:** Use `question_card` instead if you want images/descriptions for richer experience.

---

## Complete Interview Flow Example

Here's what the **full Costa Rica interview** should return from backend:

### User: "I want to buy a house in Costa Rica"

**Backend Response 1:**
```json
{
  "response": {
    "template": "question_card",
    "data": {
      "icon": "🏝️",
      "title": "Costa Rica Relocation",
      "description": "Let's find your perfect region",
      "buttons": [
        { "label": "Pacific Coast", "value": "pacific", "emoji": "🏖️", "subtitle": "Beaches & surf towns" },
        { "label": "Central Valley", "value": "central", "emoji": "🏔️", "subtitle": "Mountains & cities" },
        { "label": "Caribbean Coast", "value": "caribbean", "emoji": "🌴", "subtitle": "Rainforest & culture" },
        { "label": "Still exploring", "value": "exploring", "emoji": "🗺️" }
      ]
    }
  }
}
```

---

### User clicks: "Pacific Coast"

**Backend Response 2 (Show scanning animation):**
```json
{
  "response": {
    "template": "scanning_card",
    "data": {
      "title": "🔍 Scanning Your Network...",
      "total_connections": 847,
      "matches_found": 0,
      "status": "Finding connections in Pacific Coast..."
    }
  }
}
```

*After 2 seconds, update with results:*

```json
{
  "response": {
    "template": "scanning_card",
    "data": {
      "title": "🔍 Scanning Your Network...",
      "total_connections": 847,
      "matches_found": 8,
      "status": "Ranking by relevance..."
    }
  }
}
```

---

**Backend Response 3 (Next question):**
```json
{
  "response": {
    "template": "question_card",
    "data": {
      "icon": "🏠",
      "title": "What's your main purpose?",
      "buttons": [
        { "label": "Vacation Property", "value": "vacation", "emoji": "🏝️" },
        { "label": "Investment Rental", "value": "investment", "emoji": "💰" },
        { "label": "Full Relocation", "value": "relocate", "emoji": "🎯" },
        { "label": "Exploring Options", "value": "exploring", "emoji": "🤔" }
      ]
    }
  }
}
```

---

### User clicks: "Full Relocation"

**Backend Response 4:**
```json
{
  "response": {
    "template": "question_card",
    "data": {
      "icon": "💰",
      "title": "Budget Range",
      "buttons": [
        { "label": "$200-300K", "value": "low", "emoji": "💵" },
        { "label": "$300-500K", "value": "mid", "emoji": "💰" },
        { "label": "$500K+", "value": "high", "emoji": "💎" },
        { "label": "Still researching", "value": "unsure", "emoji": "🤔" }
      ]
    }
  }
}
```

---

### User clicks: "$300-500K"

**Backend Response 5:**
```json
{
  "response": {
    "template": "button_group",
    "data": {
      "question": "Do you have existing connections in Costa Rica?",
      "options": [
        { "label": "Yes, show them", "value": "yes", "emoji": "✓" },
        { "label": "No, find some", "value": "no", "emoji": "🔍" },
        { "label": "Not sure", "value": "unsure", "emoji": "🤔" }
      ]
    }
  }
}
```

---

### User clicks: "No, find some"

**Backend Response 6 (Show top connection):**
```json
{
  "response": {
    "template": "contact_card",
    "data": {
      "name": "David Park",
      "title": "Real Estate Developer",
      "company": "Costa Rica Coastal Properties",
      "avatar": "https://example.com/david.jpg",
      "bio": "Specializes in Pacific Coast properties for American expats. 15+ years experience.",
      "why_matters": "David has helped 50+ Americans buy property in Guanacaste and knows all the local pitfalls to avoid"
    }
  }
}
```

---

**Backend Response 7 (Final summary):**
```json
{
  "response": {
    "template": "outcome_card",
    "data": {
      "goal": "Buy property in Pacific Coast, Costa Rica for full relocation",
      "whyItMatters": "Ready to leave corporate life and embrace pura vida",
      "idealHelper": "Local realtors specializing in expats, recent American relocators, legal advisors",
      "timeframe": "6 months",
      "contextToShare": "Budget $300-500K, prefer Pacific Coast, interested in full relocation",
      "matchStrength": "high"
    }
  }
}
```

*(User clicks "Save to Orbiter" → frontend calls `/dispatch` endpoint)*

---

## Images

### Option 1: Use Emojis (Easiest)
```json
"icon": "🏝️"
```
Works great, no additional setup needed.

### Option 2: Use Unsplash (Free)
```json
"image_url": "https://source.unsplash.com/800x400/?costa-rica,beach"
```
Free random images, instant.

### Option 3: Hosted Images (Best Quality)
```json
"image_url": "https://cdn.orbiter.ai/images/costa-rica-pacific.jpg"
```
Upload custom images to your CDN.

---

## When to Use Each Template

| Scenario | Template | Why |
|----------|----------|-----|
| Multiple choice with context | `question_card` | Rich visual, images, subtitles |
| Simple yes/no | `button_group` | Lightweight, faster |
| AI "thinking" | `scanning_card` | Visual feedback, engagement |
| Show a person | `contact_card` | Profile-style with actions |
| Final summary | `outcome_card` | Polished, editable, saveable |

**Default rule:** When in doubt, use `question_card` — it's the most visual and engaging.

---

## Testing

### Endpoint
```
POST /chat
```

### Request
```json
{
  "message": "I want to buy a house in Costa Rica",
  "thread_id": "test-123"
}
```

### Expected Response
```json
{
  "response": {
    "template": "question_card",
    "data": {
      "icon": "🏝️",
      "title": "Costa Rica Relocation",
      "description": "Which region interests you most?",
      "buttons": [...]
    }
  }
}
```

---

## Summary

**What backend needs to do:**

1. ✅ Return `{ template: "...", data: {...} }` format instead of plain text
2. ✅ Use `question_card` for all multiple-choice questions
3. ✅ Use `scanning_card` when analyzing/thinking
4. ✅ Use `contact_card` when showing people
5. ✅ Use `outcome_card` for final summary
6. ✅ Add images (emojis or Unsplash URLs)
7. ✅ Include subtitles on buttons for extra context

**Result:** Premium visual experience that matches Mark's expectations.

---

## Documentation Reference

See `BACKEND-VISUAL-TEMPLATES.md` for complete examples and integration guide.

---

**Questions?** Ask in Slack or reference the frontend code:
- `app/components/QuestionCard.tsx`
- `app/components/ScanningCard.tsx`
- `app/components/ContactCard.tsx`
- `app/components/OutcomeCard.tsx`
