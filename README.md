# Orbiter Copilot — Outcomes Mode Demo

Built by Robert Boulos for Mark Pederson @ Orbiter.

## What This Is

A working demo of what Orbiter's Outcomes Copilot mode could look like using Thesys C1 properly. The Copilot helps users define a concrete Outcome — a specific network-driven goal — then confirms it for Orbiter's agents to act on.

## Setup (5 minutes)

### 1. Get a Thesys API Key
Go to: https://console.thesys.dev/keys
Create a new key, copy it.

### 2. Add it to .env.local
```
THESYS_API_KEY=your_key_here
```

### 3. Install & Run
```bash
npm install
npm run dev
```

Open http://localhost:3000

## What It Demonstrates

- **Outcomes creation flow** — user describes a goal in natural language, Copilot generates a structured, interactive Outcome card
- **Thesys C1 generative UI** — uses `c1/anthropic/claude-sonnet-4` (Claude-powered, not generic GPT output)
- **Suggested prompts** — pre-loaded with Orbiter-relevant examples (talent agents, investors, founders)
- **Dark Orbiter aesthetic** — styled to match the product vibe

## The System Prompt

The real value is in `app/api/chat/route.ts` — the `OUTCOMES_SYSTEM_PROMPT` constant.

This is what transforms a generic chatbot into an Orbiter-specific Outcome creation flow. It:
- Defines what an Outcome IS in Orbiter's context
- Specifies the interactive card structure
- Sets the tone (warm, smart, efficient — like a brilliant chief of staff)
- Gives concrete examples of well-formed Outcomes

## Stack

- Next.js 15 (App Router)
- Thesys C1 (`c1/anthropic/claude-sonnet-4/v-20251230`)
- `@thesysai/genui-sdk` + `@crayonai/react-ui` for rendering
- Tailwind CSS

## To Drop Into Orbiter's Codebase

1. Copy `app/api/chat/route.ts` → create a new route for Outcomes mode
2. Replace `THESYS_API_KEY` → they may already have this configured
3. Use `<C1Chat apiUrl="/api/chat/outcomes" />` in their Copilot component
4. Adjust the system prompt based on their actual data schema (Falkor DB entities, etc.)
