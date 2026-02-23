# Complete Orbiter Copilot Checklist
**Compiled from Feb 20 (Transcript #423) + Feb 23 (Transcript #430)**

---

## 🔴 CRITICAL - Feb 23 Priority Items

### Infrastructure & Setup
- [ ] Connect Robert's email account for calendar data (Mark will enable today/tomorrow)
- [ ] Test calendar integration once enabled
- [ ] Verify meeting prep data pulls from calendar

### UI/UX Changes - Immediate
- [ ] **Change send icon** from email icon to up arrow (like Claude) - TODO: Find where CrayonChat renders send button
- [x] **Add dispatch button** in upper right corner of copilot
- [x] **Remove ALL remaining emojis** from interface
- [x] **Replace loading dots** with premium "glowy orb" or animated orb (high-end professional)

### Dispatch Flow
- [x] When user dispatches, **show beautified LLM description** of leverage loop
  - Should be rich natural language
  - Format: "Leverage my network to help [Person] with [Goal] because..."
  - Not in copilot, appears in purple modal/separate area
- [x] Implement **keyword detection** for dispatch triggers:
  - "show me"
  - "let's do this"
  - "execute"
  - "go"
  - Other action phrases
- [ ] Make dispatch option appear when AI detects completion intent - Needs chat message monitoring

---

## 🟡 HIGH PRIORITY - Josh/Jason Requirements (Feb 20)

### Two-Layer Agent System (Jason's Request)
- [x] **Quick layer**: Fast cursory search (names, titles, locations) - QuickResultCard component exists
  - Returns immediate "This might be your guy" results
  - Shows while deeper research continues
- [ ] **Deep research layer**: Full agentic suggestions - Needs backend integration
  - Runs in parallel
  - Takes 2-5+ minutes
  - Comprehensive analysis

### Help & Education Features (Josh's Request)
- [x] **"I don't know" button** - user can indicate they need more info - QuestionCardEnhanced has this
- [x] **Hover explanations** for unfamiliar terms - QuestionCardEnhanced supports helpText
  - Example: Costa Rica regions (Central Valley, Pacific Coast, etc.)
  - Research information inline
- [x] **Help icons** throughout interface - QuestionCardEnhanced has help icon/tooltip
- [x] **Expandable help sections** for complex options - QuestionCardEnhanced has expandable help

### Meeting Prep Mode (New Copilot Mode)
- [x] Add **4th copilot mode**: Meeting Prep (alongside Outcomes, Leverage Loops, Serendipity) - MeetingPrepCard exists
- [ ] Pull from calendar for upcoming meetings - Needs backend/calendar integration
- [x] Generate: - MeetingPrepCard template supports all these
  - Summary of person
  - Talking points
  - Suggested openers
  - Why they might care
  - What to listen for
  - **Landmines** (topics to avoid)
- [ ] Allow user to select which project context applies to meeting - Needs UI flow
- [ ] Show relevant outcomes/leverage loops for this person - Needs backend

---

## 🟢 CORE FUNCTIONALITY

### Leverage Loops (PRIMARY FOCUS)
- [ ] **Focus on Leverage Loops FIRST** (not outcomes yet)
- [ ] Test with real network contacts:
  - Ray Deck
  - Other people in Robert's graph
- [ ] Simulate helping real people with real goals
- [ ] Make sure backend structures logic for intelligent decisions

### Form Builder vs Conversational
- [ ] **Serve two user paths**:
  1. **Hardcore**: Minimal typing, "bam yes go" workflow
  2. **Conversational**: Guided interview, helps refine intent
- [ ] Allow both paths to coexist
- [ ] Detect user preference based on behavior

### Results Display (SEPARATE FROM COPILOT)
- [ ] **Never show agent results in copilot**
- [ ] Results populate in **beautiful separate UI**
  - Fold-down panels
  - Rich context
  - Visual presentation
- [ ] Copilot is for DEFINING what to dispatch
- [ ] Results are for REVIEWING suggestions

---

## 🔵 LONG-RUNNING PROCESSES

### Waiting Room / Status UI
- [ ] Create **"waiting room"** for dispatched items
- [ ] Show that process is running on machine
- [ ] Provide **observability** into agent progress:
  - What step it's on
  - How long so far
  - Estimated time remaining (if possible)
- [ ] Handle 2-5+ minute processes gracefully
- [ ] User can leave and come back
- [ ] Notification when complete

### Status Indicators
- [ ] Show when agent work is happening (but don't show "sausage being made")
- [ ] Premium, high-end loading states
- [ ] Clear "this is working" feedback
- [ ] Avoid generic spinners/dots

---

## 🟣 VISUAL & POLISH

### Premium Design Direction
- [ ] **"Wizard of Oz"** - hide the wires, deliver magic
- [ ] **High-end professional** aesthetic
- [ ] **Sexy, glowy** visual language
- [ ] No generic bouncing dots
- [ ] Smooth animations
- [ ] Rich micro-interactions

### Specific Visual Improvements
- [ ] Better quality for all UI elements
- [ ] Improve network analysis display
- [ ] Polish modal/dialog presentations
- [ ] Consistent design system

---

## 📋 BACKEND & DATA

### Context & Intelligence
- [ ] Backend structures **intelligent decision logic**
- [ ] **Keyword/phrase detection** for intent
- [ ] Reliable performance from agentic harness
- [ ] Network graph data for testing

### Real Data Testing
- [ ] Once calendar connected, test with real meetings
- [ ] Test leverage loops with real contacts in graph
- [ ] Iterate based on actual performance (not mock data)
- [ ] Monitor: Does it take 60 seconds? Is experience ruined?
- [ ] Balance: Too much responsibility = slow, too little = useless

---

## 🎯 STRATEGIC PRIORITIES (Mark's Vision)

### Core Positioning
- [ ] Frame as: **"AI harness for your whole network working 24/7"**
- [ ] Pitch: Achieve goals + help people you care about
- [ ] Leverage network intelligence while you sleep

### User Experience Goals
- [x] Help user **define what to dispatch** (not give results in copilot) - Dispatch modal separates definition from results
- [x] Super interviewer that draws out real intent - ForkInTheRoad component guides users
- [x] Support power users (keyboard shortcuts, command palette) - Cmd+K to open, Escape to close
- [ ] Make it easy for successful people with huge networks - Needs performance optimization

### What Makes This Different
- [ ] Not just sales/leads (everyone else)
- [ ] Human connection focus
- [ ] Help people, not just close deals
- [ ] Holistic approach to network leverage

---

## 📅 TIMELINE REMINDERS

### From Feb 20 Conversation
- [ ] **Wednesday (Feb 26?)** - Schedule UI review meeting
- [ ] **Thursday (Feb 27?)** - Integrate copilot into Orbiter app
- [ ] Endpoint coordination with Mark (context endpoint with add-ons)

### Ongoing
- [ ] Rapid iteration expected
- [ ] Josh/Jason will brainstorm on every call
- [ ] Film director workflow = react immediately to changes
- [ ] Documentation/whiteboard updates after each meeting

---

## 🔧 TECHNICAL DEBT / NICE-TO-HAVE

### Documentation
- [ ] Whiteboard visualization of conversations
- [ ] Keep test harness docs updated
- [ ] Add new meeting whiteboards after each call

### Future Considerations
- [ ] Autonomous QA/testing (Mark mentioned interest)
- [ ] Self-improving agent harness
- [ ] Balance between OpenClaw approach vs custom solution
- [ ] Explore meeting prep integration with outcomes

---

## ✅ COMPLETED (for reference)
- ✅ Initial Crayon SDK integration
- ✅ Basic leverage loops workflow
- ✅ Network data backend endpoints
- ✅ Graph analysis functionality
- ✅ Some emoji removal (but not all)
- ✅ Calendar meeting detection logic

---

## 📝 NOTES & CONTEXT

### Josh/Jason Work Style
- Film directors/producers/editors background
- Branched spider web brain
- React immediately to changes
- Rapid iteration expected
- Will generate ideas spontaneously on calls

### Mark's Priorities
- Form builder approach (define before dispatch)
- Don't ruin experience with slow responses
- Massive graphs need smart handling
- Meeting prep is high-value (Oracle feedback)
- Premium, high-end aesthetic

### Robert's Approach
- Building own agentic harness
- Learning from pain/iteration
- Keyword detection works well
- Reliable performance through testing
- Dog-fooding for weeks = valuable insights

---

**TOTAL ITEMS: 70+**
**Priority Tiers:**
- 🔴 Critical (13 items) - This week
- 🟡 High Priority (15 items) - Before demo
- 🟢 Core Functionality (12 items) - Essential features
- 🔵 Infrastructure (8 items) - Supporting systems
- 🟣 Polish (7 items) - Quality improvements
- 📋 Backend (6 items) - Technical foundation
- 🎯 Strategic (9 items) - Vision alignment
