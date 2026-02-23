# Interview-First Conversation Examples

**Purpose:** Concrete examples showing how the copilot should guide users through the interview process.

---

## Example 1: Helping Ray Deck (From Transcript #430)

### Scenario
Robert wants to help Ray Deck with something but hasn't specified what.

### Conversation Flow

```
👤 USER:
I want to help Ray with something

🤖 COPILOT:
[question_card_enhanced]
Great! What specific outcome are you looking for with Ray?

Here are some examples:
• Help him find talent for a project
• Connect him with potential clients or partners
• Introduce him to investors or advisors
• Help him solve a technical challenge

[Text input field with autocomplete]
[Help icon] → "Think about what Ray needs right now based on recent conversations"
```

```
👤 USER:
Help him find graph database experts

🤖 COPILOT:
[question_card]
Got it! Are these experts for:

1. **Hiring** — Building Ray's team
2. **Consulting** — Technical advice on a specific problem
3. **Partnerships** — Potential business collaboration

[Button: Hiring] [Button: Consulting] [Button: Partnerships]
```

```
👤 USER:
[Clicks "Consulting"]

🤖 COPILOT:
[question_card]
Perfect. One last thing — what's the specific technical challenge?

Examples:
• Migrating from one graph DB to another
• Scaling graph queries for production
• Choosing the right graph database architecture

[Text input]
[Button: "I don't know yet" → skips to summary]
```

```
👤 USER:
[Types: "Orbiter is evaluating FalkorDB for their backend and needs someone who's used it in production"]

🤖 COPILOT:
[quick_result_card]
Excellent. Here's what I'm about to do:

**Leverage Loop: Find FalkorDB Production Experts**

**For:** Ray Deck (Orbiter technical consultation)

**Search criteria:**
• Engineers with FalkorDB production experience
• People who've worked on social graph or knowledge graph products
• Available for short-term consulting or advisory calls

**Next steps:**
• Scan your network for matches (~500 people)
• Identify warm introduction paths
• Draft personalized intro messages
• Deliver ranked suggestions to Outcomes tab

**Estimated time:** 3-5 minutes

[Dispatch & Track →] [Refine Search]
```

```
👤 USER:
[Clicks "Dispatch & Track →"]

🤖 COPILOT:
[success_toast]
✅ Leverage loop dispatched!

Track progress in: [Outcomes tab →]

[Confetti animation plays]
```

---

## Example 2: Vague Exploration

### Scenario
User doesn't know who they want to help or what they want to do.

### Conversation Flow

```
👤 USER:
I want to do something with my network

🤖 COPILOT:
[question_card_enhanced]
I can help with that! What are you trying to achieve?

Here are some common goals:
• **Help someone** — Leverage your network for someone specific
• **Find someone** — Search for a person with certain skills or connections
• **Discover opportunities** — See what serendipitous connections exist
• **Prepare for a meeting** — Get context on someone you're meeting

[Button: Help someone]
[Button: Find someone]
[Button: Discover opportunities]
[Button: Prepare for a meeting]
```

```
👤 USER:
[Clicks "Help someone"]

🤖 COPILOT:
[question_card with PersonPicker]
Who would you like to help?

[PersonPicker dropdown — search your network]
[Input field: "Start typing a name..."]

💡 Tip: Pick someone you've been meaning to help but haven't found the right opportunity yet.
```

```
👤 USER:
[Selects "Kim Chen" from dropdown]

🤖 COPILOT:
[Shows Kim's context card]

**Kim Chen**
Product Manager at Shopify
Last contact: 2 weeks ago (coffee chat)

[question_card_enhanced]
What does Kim need help with right now?

Based on your recent conversations, I found:
• Kim mentioned looking for a new role (via transcript)
• Kim is interested in AI product management
• Kim wants to transition to a startup

[Button: Help Kim find a new job]
[Button: Connect Kim with AI PMs]
[Button: Something else] → [Text input appears]
```

```
👤 USER:
[Clicks "Help Kim find a new job"]

🤖 COPILOT:
[question_card]
What kind of company is Kim targeting?

• **Early-stage startup** — 5-50 employees, high equity
• **Growth-stage startup** — 50-500 employees, balanced
• **Enterprise** — Established companies, more stability

[Button for each option]
```

```
👤 USER:
[Clicks "Early-stage startup"]

🤖 COPILOT:
[quick_result_card]
Perfect! Here's the plan:

**Leverage Loop: Help Kim Find PM Role at Early-Stage AI Startup**

**Target criteria:**
• Companies with 5-50 employees
• AI/ML product focus
• Hiring product managers
• In your network or 2 degrees away

**What I'll do:**
1. Scan your network for startup founders in AI space
2. Check which companies are actively hiring PMs
3. Map the strongest introduction paths to Kim
4. Draft personalized intro messages

**Estimated time:** 4-6 minutes (larger search)

[Dispatch & Track →] [Add more constraints]
```

---

## Example 3: Power User Fast-Track

### Scenario
User provides complete, specific intent — should skip most interview.

### Conversation Flow

```
👤 USER:
Leverage my network to help Ray Deck find seed investors for Orbiter. Focus on people who've invested in social or knowledge graph products in the last 3 years. Draft warm intro emails and rank by strength of connection.

🤖 COPILOT:
[quick_result_card with scanning animation]
That's specific enough — dispatching now.

**Leverage Loop: Find Seed Investors for Ray Deck**

**Search parameters:**
✓ Investor type: Seed stage
✓ Sector focus: Social graphs, knowledge graphs
✓ Timeframe: Active in last 3 years
✓ Connection strength: Ranked by warmth
✓ Deliverable: Draft intro emails

**Status:** Scanning network...

[View in Outcomes →]

💡 **Pro tip:** This search is running in the background. You can start another task or close this modal.
```

*Note: For power users, the copilot recognizes complete intent and skips the interview entirely.*

---

## Example 4: Meeting Prep (Already Specific)

### Scenario
User needs meeting prep — this is naturally complete intent.

### Conversation Flow

```
👤 USER:
Meeting prep for Ray Deck tomorrow

🤖 COPILOT:
[scanning_card]
Analyzing Ray Deck's context...
• Reviewing recent conversations
• Checking mutual connections
• Identifying current projects

[Progress animation 0% → 100%]
```

```
🤖 COPILOT:
[meeting_prep_card]

**Meeting Prep: Ray Deck**
CEO, Orbiter | Tomorrow 2:00 PM

**Summary**
Ray is building Orbiter — a relationship intelligence platform that helps people leverage their network. He's currently raising a $4M seed round and targeting 750 users over 18 months. You've been consulting on prompt engineering and UX for the Copilot feature.

**Talking Points**

1. **Copilot Interview Flow**
   • Opener: "I implemented the super interviewer approach we discussed — want me to demo it?"
   • Why he cares: This is the core UX that will differentiate Orbiter from competitors

2. **Leverage Loops Feature**
   • Opener: "The leverage loop dispatch system is ready for testing with real network data"
   • Why he cares: March 2 deadline approaching, this is his highest priority

3. **FalkorDB Migration**
   • Opener: "Should we explore graph database experts in my network for your backend?"
   • Why he cares: Technical decision with long-term implications

**Listen For**
• Investor feedback from recent pitches
• Timeline pressure or deadline changes
• New team members joining (Dennis, Charles)
• Budget constraints or scope creep

**Landmines**
• Don't over-promise delivery timelines
• Avoid technical deep-dives if he's in "founder mode"
• Don't bring up competitor comparisons unsolicited

**Shared Context**
You both use OpenClaw for agentic workflows. Ray is interested in your Mac Mini setup and automation approach.

[Close] [Add to Calendar] [Share Notes]
```

---

## Example 5: Serendipity Discovery

### Scenario
User wants ambient discovery of interesting connections.

### Conversation Flow

```
👤 USER:
Show me interesting connections I might not know about

🤖 COPILOT:
[question_card_enhanced]
I can surface serendipitous connections! What are you interested in right now?

Examples:
• People working on similar problems
• Mutual connections you should meet
• Surprising overlaps in background or interests
• People who recently joined companies you care about

[Text input: "Tell me what's on your mind..."]
[Help icon] → "The more specific, the better the discoveries"
```

```
👤 USER:
I'm thinking about graph databases and AI agents

🤖 COPILOT:
[scanning_card]
Scanning your network for interesting overlaps...

Looking for:
• Graph database experts
• AI agent builders
• People at the intersection of both

[Progress: 250 / 500 people scanned]
```

```
🤖 COPILOT:
[serendipity_card]

**Serendipity Discovery: 3 Interesting Connections**

1. **Sarah Chen** ← 2 mutual friends
   • Previously: Neo4j engineering lead
   • Currently: Building AI agent orchestration at Anthropic
   • **Why interesting:** Exactly at the intersection you mentioned
   • [Track] [Start Conversation]

2. **Michael Torres** ← You both know Ray Deck
   • Built graph RAG system for enterprise search
   • Open to consulting on agent memory architectures
   • **Why interesting:** Solving a problem you're working on
   • [Track] [Request Intro]

3. **Julia Kim** ← 3 degrees away
   • Published paper on "Multi-Agent Coordination via Graph Neural Networks"
   • Recently moved to your city (Toronto)
   • **Why interesting:** Academic expertise + local proximity
   • [Track] [View Profile]

[Discover More] [Save to Collection]
```

---

## Example 6: Interrupt Protocol (User Wants Fast-Track Mid-Interview)

### Scenario
User starts with vague intent but gets impatient mid-interview.

### Conversation Flow

```
👤 USER:
I want to help someone

🤖 COPILOT:
[question_card_enhanced]
Who would you like to help?

[PersonPicker dropdown]
```

```
👤 USER:
Just do it for Ray Deck

🤖 COPILOT:
[question_card]
Got it — Ray Deck. What specific outcome are you looking for?

Examples:
• Help him find talent
• Connect him with investors
• Introduce him to potential partners
```

```
👤 USER:
Whatever makes sense, just figure it out

🤖 COPILOT:
[fork_in_the_road]

I can do that, but I want to make sure I'm helpful! Choose your path:

**Option 1: Quick Scan** (30 seconds)
I'll analyze Ray's current context (recent conversations, projects, challenges) and suggest the single most valuable thing I can do right now.

**Option 2: Guide Me** (2-3 minutes)
Ask me a few quick questions so we can pinpoint exactly what Ray needs.

[Button: Quick Scan] [Button: Guide Me]
```

```
👤 USER:
[Clicks "Quick Scan"]

🤖 COPILOT:
[scanning_card]
Analyzing Ray Deck's context...
• Recent conversations: 3 transcripts
• Current projects: Orbiter (seed fundraising, copilot UX)
• Recent mentions: FalkorDB, graph databases, leverage loops

[Progress animation]
```

```
🤖 COPILOT:
[quick_result_card]
Based on recent context, here's my recommendation:

**Best Move: Connect Ray with FalkorDB Production Experts**

**Why this matters now:**
• Ray mentioned evaluating FalkorDB for Orbiter's backend
• He needs someone who's used it in production
• This is a time-sensitive technical decision

**What I'll do:**
• Search your network for FalkorDB experts
• Prioritize people with production experience
• Draft warm intro messages

[Dispatch This] [Show Other Options]
```

---

## Key Patterns Across Examples

### 1. **Progressive Disclosure**
Start with the most important question, add details as needed.

### 2. **Provide Examples**
Always give 3-4 concrete examples when asking open-ended questions.

### 3. **Show Your Work**
Let users see what you're analyzing and why.

### 4. **Respect User Intent**
- Vague = Interview deeply
- Specific = Fast-track
- Impatient = Offer quick scan

### 5. **Confirm Before Dispatch**
Always show a summary and get explicit confirmation.

---

## Testing Checklist

Use these scenarios to test the interview-first approach:

- [ ] Vague request ("I want to help someone")
- [ ] Partial request ("Help Ray with something")
- [ ] Specific request ("Help Ray find graph database experts for Orbiter")
- [ ] Complete request (all details provided upfront)
- [ ] Interrupt mid-interview ("just do it")
- [ ] Meeting prep (naturally complete)
- [ ] Serendipity exploration (open-ended discovery)

---

## Next Steps

1. **Implement these flows** in the system prompt
2. **Build card components** for each interaction type
3. **Test with real examples** (Ray Deck, Kim Chen scenarios)
4. **Measure turn count** — Target 2-4 for partial intent, 4-6 for exploratory
5. **Demo to Mark** — Walk through Example 1 (Ray Deck) live

---

**Last Updated:** Feb 23, 2026  
**Source:** Transcript #430 analysis + Mark's super interviewer vision
