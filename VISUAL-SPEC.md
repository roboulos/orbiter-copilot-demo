# Visual Specification - Orbiter Copilot Demo

## The Problem Robert Just Identified

We built:
- ✅ Beautiful card components with rich visuals
- ✅ Button system with gradients/animations
- ✅ Backend integration

We're MISSING:
- ❌ AI actually using the visual templates during conversation
- ❌ Rich generative UI showing throughout the flow
- ❌ The "wow factor" visual experience Mark expects

## What Mark's Demo Actually Needs

### 1. Visual Interview Flow (Button-First)

**Current state:** Text bubbles
**Should be:** Rich cards with images

Example flow for "Buy house in Costa Rica":

```
[AI CARD with map/image of Costa Rica]
┌────────────────────────────────────┐
│  🏝️ Costa Rica Relocation         │
│  [Beautiful map visual]            │
│                                     │
│  Let's find you the perfect region │
│                                     │
│  [🏖️ Pacific Coast]                │
│  [🏔️ Central Valley]               │
│  [🌴 Caribbean Coast]               │
│  [🗺️ Still exploring]               │
└────────────────────────────────────┘

User clicks [🏖️ Pacific Coast]

[AI CARD with beach villa image]
┌────────────────────────────────────┐
│  🏠 Pacific Coast Properties       │
│  [Villa lifestyle image]           │
│                                     │
│  What's your main purpose?         │
│                                     │
│  [🏝️ Vacation Property]            │
│  [💰 Investment Rental]             │
│  [🎯 Full Relocation]               │
│  [🤔 Exploring Options]             │
└────────────────────────────────────┘
```

### 2. People Cards (Not Text)

When AI mentions people from network:

```
[CONTACT CARD]
┌────────────────────────────────────┐
│  [Avatar] Sarah Chen               │
│           VP Engineering, Stripe   │
│                                     │
│  💡 Why this connection matters:   │
│  "Sarah relocated to Costa Rica    │
│   last year and knows the market"  │
│                                     │
│  [📧 Get Intro] [📅 Quick Call]    │
└────────────────────────────────────┘
```

### 3. Outcome Summary (Visual, Not Text)

Instead of text summary before dispatch:

```
[OUTCOME CARD - Visual Summary]
┌────────────────────────────────────────┐
│  🎯 Your Outcome                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  🏠 Buy house in Costa Rica            │
│     Pacific Coast · Relocation         │
│                                         │
│  💰 Budget: $300-500K                  │
│  ⏱️ Timeline: 6 months                 │
│                                         │
│  🎯 What You Need:                     │
│  → Realtor specializing in expats     │
│  → Recent relocators to interview     │
│  → Legal/tax advisor                  │
│                                         │
│  🌟 Top 3 Connections Found:           │
│  [Avatar] David Park                   │
│  [Avatar] Maria Santos                 │
│  [Avatar] James Wilson                 │
│                                         │
│  [⚡ Activate Network] [✏️ Edit]       │
└────────────────────────────────────────┘
```

### 4. Progress Indicators (Visual Feedback)

When AI is "thinking" or "scanning network":

```
[SCANNING CARD]
┌────────────────────────────────────┐
│  🔍 Scanning Your Network...       │
│                                     │
│  [Animated radar/ripple effect]    │
│                                     │
│  ✓ 847 connections analyzed        │
│  ✓ 12 potential matches found      │
│  ⏳ Finding best connectors...      │
└────────────────────────────────────┘
```

## What Needs to Happen

### Backend Changes (Priority 1)

**Current:** Returns plain text responses
**Needs:** Return Crayon template format

Example backend response for button question:
```json
{
  "template": "question_card",
  "data": {
    "image_url": "https://cdn.orbiter.ai/costa-rica-map.jpg",
    "title": "🏝️ Costa Rica Relocation",
    "description": "Let's find you the perfect region",
    "buttons": [
      { "label": "🏖️ Pacific Coast", "value": "pacific", "subtitle": "Guanacaste, Manuel Antonio" },
      { "label": "🏔️ Central Valley", "value": "central", "subtitle": "San José, Escazú" },
      { "label": "🌴 Caribbean Coast", "value": "caribbean", "subtitle": "Puerto Viejo, Limón" },
      { "label": "🗺️ Still exploring", "value": "exploring", "subtitle": "Show me all options" }
    ]
  }
}
```

### Frontend Components Needed (Priority 2)

**New components to build:**
1. **QuestionCard** - Rich visual card for each interview question
   - Image/illustration
   - Title + description
   - Button group (already have this)
   - Animations

2. **PeopleStack** - Show multiple people visually
   - Stacked avatars
   - Hover to expand
   - Click to see full card

3. **ScanningCard** - Network analysis visual
   - Animated radar/ripple
   - Real-time count updates
   - Progress indicators

4. **OutcomeSummaryCard** - Enhanced version of OutcomeCard
   - Images/icons for context
   - Visual connection map
   - Action buttons prominent

### Asset Requirements (Priority 3)

**Images needed:**
- Costa Rica regions (Pacific, Central, Caribbean)
- Generic business/meeting visuals
- Network/connection illustrations
- Success state illustrations

**Placeholder solution:**
- Use Unsplash API for now
- AI-generated illustrations via DALL-E/Midjourney
- Icon libraries (Lucide, Heroicons)

## Implementation Plan

### Phase 1: Question Cards (2-3 hours)
- [ ] Create QuestionCard component
- [ ] Add image support
- [ ] Style with gradients/animations
- [ ] Wire up to button system
- [ ] Test with Costa Rica example

### Phase 2: Backend Integration (1-2 hours)
- [ ] Update backend to return question_card format
- [ ] Add image URLs to responses
- [ ] Test full flow with visual cards

### Phase 3: People Visuals (2 hours)
- [ ] Enhance ContactCard with images
- [ ] Create PeopleStack component
- [ ] Add avatar support
- [ ] Test with network data

### Phase 4: Outcome Polish (1-2 hours)
- [ ] Enhance OutcomeCard with visuals
- [ ] Add connection preview
- [ ] Improve summary layout
- [ ] Test dispatch flow

### Phase 5: Loading States (1 hour)
- [ ] Create ScanningCard
- [ ] Add progress animations
- [ ] Wire up to backend loading states

**Total estimate:** 7-10 hours to transform from "basic chat" to "generative UI showcase"

## Success Criteria

✅ Every AI response shows a visual card (not just text)
✅ Images/illustrations throughout
✅ Smooth animations between states
✅ Clear visual hierarchy
✅ "Wow factor" when demoed to Mark
✅ Looks like a premium product, not a prototype

## The Gap We Need to Close

**What we have now:**
- Text bubbles with buttons
- Basic message alignment
- Backend wired up

**What Mark expects to see:**
- Rich visual cards throughout
- Images and illustrations
- Smooth generative UI experience
- Feels like a premium product

**Robert's right:** We built the plumbing but forgot the design.
