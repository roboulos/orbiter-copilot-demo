# Backend Visual Templates - How to Use Rich UI

## Overview

The frontend now has **visual card components** that make the copilot feel rich and polished instead of basic text chat.

**Instead of returning plain text**, the backend should return **template objects** that trigger these visual cards.

## Available Templates

### 1. QuestionCard (For Interview Questions)

**When to use:** Any multiple-choice question during the interview

**Backend response format:**
```json
{
  "template": "question_card",
  "data": {
    "image_url": "https://images.unsplash.com/photo-costa-rica",  // Optional
    "icon": "🏝️",                                                  // Use if no image
    "title": "Costa Rica Relocation",
    "description": "Let's find you the perfect region to explore",
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
```

**Visual result:**
- Large image or icon at top
- Title and description
- Beautiful gradient buttons with emojis
- Subtitles for additional context
- Hover states and animations
- Selected state with checkmark
- Auto-sends selection as next message

---

### 2. ScanningCard (Network Analysis)

**When to use:** When AI is "thinking" or "analyzing the network"

**Backend response format:**
```json
{
  "template": "scanning_card",
  "data": {
    "title": "🔍 Scanning Your Network...",
    "total_connections": 847,
    "matches_found": 12,                    // Animates from 0 to this number
    "status": "Finding best connectors..."
  }
}
```

**Visual result:**
- Animated radar/ripple effect
- Real-time counter animation
- Progress indicators
- Pulsing glow effects
- Professional "working on it" feedback

---

### 3. ContactCard (Show People)

**When to use:** Showing a specific person from the network

**Backend response format:**
```json
{
  "template": "contact_card",
  "data": {
    "name": "Sarah Chen",
    "title": "VP Engineering",
    "company": "Stripe",
    "avatar": "https://avatars.com/sarah-chen",
    "bio": "Relocated to Costa Rica last year, expert on the real estate market",
    "connection_strength": "2nd degree",
    "why_relevant": "Sarah moved to Pacific Coast and knows local realtors",
    "actions": [
      { "label": "Get Intro", "value": "intro" },
      { "label": "Quick Call", "value": "call" }
    ]
  }
}
```

---

### 4. OutcomeCard (Outcome Summary)

**When to use:** Showing the user's goal/outcome before dispatch

**Backend response format:**
```json
{
  "template": "outcome_card",
  "data": {
    "goal": "Buy a house in Costa Rica for relocation",
    "whyItMatters": "Ready to leave corporate life and embrace pura vida",
    "idealHelper": "Expat realtors, recent relocators, legal advisors",
    "timeframe": "6 months",
    "contextToShare": "Budget $300-500K, prefer Pacific Coast, working remotely",
    "matchStrength": "high"  // "high" | "medium" | "building"
  }
}
```

**Visual result:**
- Dark gradient card with glow effects
- Network scan status indicator (pulsing dot)
- Editable fields
- "Save to Orbiter" button with success state
- Share functionality

---

### 5. ButtonGroup (Simple Buttons Only)

**When to use:** Quick yes/no or simple choice **without** image/description

**Backend response format:**
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

**Note:** Use `question_card` instead if you want images/descriptions for a richer visual experience.

---

## Example Interview Flow (Backend)

### Question 1: Region Selection (VISUAL)
```json
{
  "template": "question_card",
  "data": {
    "icon": "🏝️",
    "title": "Costa Rica Relocation",
    "description": "Which region interests you most?",
    "buttons": [
      { "label": "Pacific Coast", "value": "pacific", "emoji": "🏖️", "subtitle": "Beaches & surf towns" },
      { "label": "Central Valley", "value": "central", "emoji": "🏔️", "subtitle": "Mountains & cities" },
      { "label": "Caribbean Coast", "value": "caribbean", "emoji": "🌴", "subtitle": "Rainforest & culture" }
    ]
  }
}
```

### Interim: Show Analysis (VISUAL)
```json
{
  "template": "scanning_card",
  "data": {
    "title": "🔍 Finding Pacific Coast connections...",
    "total_connections": 847,
    "matches_found": 8,
    "status": "Ranking by relevance..."
  }
}
```

### Question 2: Purpose (VISUAL)
```json
{
  "template": "question_card",
  "data": {
    "icon": "🏠",
    "title": "What's your main purpose?",
    "buttons": [
      { "label": "Vacation Property", "value": "vacation", "emoji": "🏝️" },
      { "label": "Investment Rental", "value": "investment", "emoji": "💰" },
      { "label": "Full Relocation", "value": "relocate", "emoji": "🎯" }
    ]
  }
}
```

### Question 3: Budget (Simple)
```json
{
  "template": "button_group",
  "data": {
    "question": "What's your budget range?",
    "options": [
      { "label": "$200-300K", "value": "low", "emoji": "💵" },
      { "label": "$300-500K", "value": "mid", "emoji": "💰" },
      { "label": "$500K+", "value": "high", "emoji": "💎" },
      { "label": "Still researching", "value": "unsure", "emoji": "🤔" }
    ]
  }
}
```

### Final: Show Top Connections
```json
{
  "template": "contact_card",
  "data": {
    "name": "David Park",
    "title": "Real Estate Developer",
    "company": "Costa Rica Coastal Properties",
    "avatar": "https://...",
    "why_relevant": "Specializes in Pacific Coast properties for American expats",
    "actions": [
      { "label": "Get Warm Intro", "value": "intro" },
      { "label": "View Profile", "value": "profile" }
    ]
  }
}
```

### Summary Before Dispatch
```json
{
  "template": "outcome_card",
  "data": {
    "goal": "Buy vacation property in Pacific Coast, Costa Rica",
    "whyItMatters": "Building a retreat and investment property",
    "idealHelper": "Local realtors, expat community, legal advisors",
    "timeframe": "6 months",
    "contextToShare": "Budget $300-500K, prefer beachfront or ocean view",
    "matchStrength": "high"
  }
}
```

## Images & Assets

### For `image_url` field:

**Option 1: Unsplash (Free)**
```javascript
const getUnsplashImage = (query) => 
  `https://source.unsplash.com/800x400/?${query}`;

// Example:
"image_url": "https://source.unsplash.com/800x400/?costa-rica,beach"
```

**Option 2: Your own hosted images**
```javascript
"image_url": "https://cdn.orbiter.ai/images/costa-rica-pacific.jpg"
```

**Option 3: Use icons instead**
```javascript
"icon": "🏝️"  // Emoji as fallback, looks great!
```

### Recommended Images by Topic:

- **Real Estate:** 🏠 or beach/property images
- **Investment:** 💰 or business/finance images
- **Travel:** ✈️ or destination images
- **Networking:** 🤝 or connection/people images
- **Career:** 💼 or office/professional images

## When to Use Each Template

| Scenario | Template | Why |
|----------|----------|-----|
| Multiple choice with context | `question_card` | Rich visual, images, subtitles |
| Simple yes/no or quick choice | `button_group` | Lightweight, faster |
| AI "thinking" or processing | `scanning_card` | Visual feedback, keeps user engaged |
| Showing a person | `contact_card` | Profile-style card with actions |
| Outcome summary | `outcome_card` | Editable, saveable, polished |
| Final dispatch trigger | `submit_button` | Prominent CTA |

## Default Rule

**When in doubt, use `question_card`** - it's the most visual and engaging option.

Only use `button_group` for very simple binary choices where images would be overkill.

## Migration Path

**Current state (text responses):**
```
AI: "What region of Costa Rica interests you?"
[User has to type answer]
```

**New state (visual templates):**
```json
{
  "template": "question_card",
  "data": {
    "icon": "🏝️",
    "title": "Costa Rica Relocation",
    "description": "Which region interests you most?",
    "buttons": [...]
  }
}
```

**Result:** 
- ✅ Visual card with image/icon
- ✅ Clickable buttons (no typing!)
- ✅ Professional polish
- ✅ Smooth animations
- ✅ Auto-advances conversation

## Testing

Use the `/chat` endpoint and return template objects. The frontend will automatically render the appropriate visual card.

**Test endpoint:**
```bash
curl -X POST https://xnwv-v1z6-dvnr.n7c.xano.io/api:PB9UH7b9/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to buy a house in Costa Rica",
    "thread_id": "test-123"
  }'
```

**Expected response:**
```json
{
  "response": {
    "template": "question_card",
    "data": { ... }
  }
}
```

---

## Summary

✅ **Use visual templates** (`question_card`, `scanning_card`) instead of plain text
✅ **Add images** (Unsplash or icons) to every question card
✅ **Show progress** with scanning cards during analysis
✅ **Rich people cards** when showing connections
✅ **Professional outcome summaries** before dispatch

This transforms the experience from "basic chatbot" to "premium generative UI product" that Mark will love.
