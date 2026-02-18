# CrayonAI / Thesys C1 — Skill Guide for Orbiter Team

> This skill was written specifically for the Orbiter Copilot codebase. It covers what we learned
> building this demo — including the non-obvious gotchas that cost hours to debug.
> **Read this before touching the Copilot UI or API route.**

---

## What is CrayonAI / Thesys C1?

Thesys C1 is a **Generative UI API** that turns LLM text output into live, interactive React
components. Instead of returning walls of text, your AI streams back UI cards — forms, tables,
custom components — in real time.

The stack has two layers:
- **@thesysai/genui-sdk** — the hosted C1 API + `C1Chat` and `C1Component` wrappers (requires Thesys API key, routes through their servers)
- **@crayonai/react-ui** + **@crayonai/stream** — the open-source React UI layer (MIT, no Thesys key needed, used in *this* demo)

**We use the open-source layer directly** — `CrayonChat` from `@crayonai/react-ui` wired to our
own Anthropic API route. This gives us full control, zero latency overhead, and no vendor lock-in.

---

## How We Use It (This Codebase)

### The Flow

```
User types in CrayonChat
  → processMessage callback fires
    → POST /api/chat (our route)
      → Anthropic Claude Sonnet
        → SSE stream back
          → CrayonChat renders text + card components
```

### The SSE Format CrayonChat Expects

There are exactly **two event types**:

```
# Text (word-by-word streaming)
event: text
data: Hello

event: text
data:  world

# Component (card injection — renders a React component)
event: tpl
data: {"name":"outcome_card","templateProps":{"title":"...","description":"...","contacts":[]}}
```

The `name` in `event: tpl` must match a key in your `responseTemplates` array.

### responseTemplates in CrayonChat

```tsx
const templates = [
  { name: "outcome_card",       Component: OutcomeCard },
  { name: "leverage_loop_card", Component: LeverageLoopCard },
  { name: "contact_card",       Component: ContactCard },
  { name: "serendipity_card",   Component: SerendipityCard },
];

<CrayonChat
  processMessage={async ({ messages, abortController }) => {
    return fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ prompt: messages.at(-1)?.message, messages: messages.slice(0,-1) }),
      signal: abortController.signal,
    });
  }}
  responseTemplates={templates}
  theme={{ mode: "dark" }}
  // ... other props
/>
```

### The API Route (Manual SSE)

We do NOT use `crayonStream` / `CrayonDataStreamTransformer`. They have a type mismatch:
`CrayonDataStreamTransformer` expects `ReadableStream<string>` but `Response` needs
`ReadableStream<Uint8Array>`. The result is an empty body.

**Instead we manually emit SSE bytes with `TextEncoder`:**

```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const { prompt, messages } = await req.json();
  const enc = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // 1. Call Anthropic and buffer the full response
      const anthropic = new Anthropic();
      let full = "";
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 2048,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
          { role: "user", content: prompt },
        ],
      });
      full = response.content[0].type === "text" ? response.content[0].text : "";

      // 2. Strip JSON fences (LLM sometimes wraps in ```json```)
      full = full.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

      // 3. Parse the LLM response
      let parsed: { response: Array<{ type: string; text?: string; name?: string; templateProps?: unknown }> };
      try {
        parsed = JSON.parse(full);
      } catch {
        // Plain text fallback
        for (const word of full.split(" ")) {
          controller.enqueue(enc.encode(`event: text\ndata: ${word} \n\n`));
        }
        controller.close();
        return;
      }

      // 4. Stream each part
      for (const item of parsed.response) {
        if (item.type === "text" && item.text) {
          for (const word of item.text.split(" ")) {
            controller.enqueue(enc.encode(`event: text\ndata: ${word} \n\n`));
          }
        } else if (item.name && item.templateProps) {
          const tplPayload = JSON.stringify({ name: item.name, templateProps: item.templateProps });
          controller.enqueue(enc.encode(`event: tpl\ndata: ${tplPayload}\n\n`));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
```

### The System Prompt Format

The LLM must output this exact JSON structure:

```json
{
  "response": [
    { "type": "text", "text": "Here's what I found..." },
    {
      "name": "outcome_card",
      "templateProps": {
        "title": "Close $4M Seed Round",
        "description": "...",
        "contacts": ["..."],
        "timeline": "60 days",
        "nextAction": "..."
      }
    }
  ]
}
```

**Critical system prompt prefix** to stop the LLM wrapping in markdown fences:
```
CRITICAL: Respond ONLY with raw JSON. No markdown, no ```json fences, no explanation outside JSON.
```

---

## Critical CSS Fixes (globals.css)

### 1. Textarea starts at height 0px

CrayonChat's thread composer textarea has no minimum height — it collapses to 0px on load,
making it impossible to click into.

```css
.crayon-shell-thread-composer__input,
.crayon-shell-desktop-welcome-composer__input {
  min-height: 24px !important;
  height: auto !important;
  color: #e8e8f0 !important;
  caret-color: #a5b4fc !important;
}
```

### 2. Tab switching destroys conversation state

**Wrong approach:** conditionally render CrayonChat:
```tsx
{activeTab === "Copilot" && <CrayonChat />}  // ❌ unmounts — loses history
```

**Right approach:** always mount, use CSS to show/hide:
```tsx
<div style={{ display: activeTab === "Copilot" ? "flex" : "none", flex: 1 }}>
  <CrayonChat />  {/* ✅ stays mounted — history preserved */}
</div>
```

### 3. Layout containment for CrayonChat in a flex parent

Without this, CrayonChat won't fill its parent properly:

```css
.crayon-shell-container { height: 100% !important; }
```

And the wrapper div needs:
```tsx
style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, flex: 1 }}
```

---

## CrayonChat Shell Class Names

Discovered via Playwright DOM inspection. Useful for CSS targeting:

| Class | Purpose |
|-------|---------|
| `crayon-shell-container` | Root container |
| `crayon-shell-thread-wrapper` | Thread area wrapper |
| `crayon-shell-thread-scroll-area` | Scrollable message list |
| `crayon-shell-thread-composer` | Bottom input area (thread mode) |
| `crayon-shell-thread-composer__input` | The textarea (thread mode) |
| `crayon-shell-welcome-screen` | Initial welcome screen |
| `crayon-shell-desktop-welcome-composer` | Input bar on welcome screen |
| `crayon-shell-desktop-welcome-composer__input` | The textarea (welcome mode) |
| `crayon-shell-conversation-starter-item-long` | Conversation starter buttons |

---

## Building Custom Card Components

Cards are standard React components. They receive `templateProps` as their props.

```tsx
// app/components/OutcomeCard.tsx
interface OutcomeCardProps {
  title: string;
  description: string;
  contacts: string[];
  timeline: string;
  nextAction: string;
}

export function OutcomeCard({ title, description, contacts, timeline, nextAction }: OutcomeCardProps) {
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <div style={{ background: "rgba(99,102,241,0.08)", borderRadius: "16px", padding: "20px" }}>
      {/* Your card UI */}
    </div>
  );
}
```

**The LLM decides which card to render.** Add routing logic to your system prompt:
```
- User mentions a goal / outcome / want to achieve → use outcome_card
- User shares a job change or network signal → use leverage_loop_card
- User asks for intro or who should meet who → use serendipity_card
- User asks about a specific contact / pull up / who is → use contact_card
- NEVER ask a clarifying question when the card type is clearly implied. Pick one. Render it.
```

---

## Available Crayon UI Primitive Components

These come from `@crayonai/react-ui` and can be used inside custom cards:

| Component | Use Case |
|-----------|----------|
| `Accordion` | Collapsible sections |
| `Card` | Bordered content container |
| `Carousel` | Swipeable item list |
| `CheckBoxGroup` | Multi-select action items |
| `Steps` | Numbered step-by-step guides |
| `Table` | Tabular data |
| `Tabs` | Tabbed navigation |
| `ListBlock` | Bullet list with icons |
| `Slider` | Range input |
| `SwitchGroup` | Toggle options |
| `RadioGroup` | Single-select options |
| `ImageGallery` | Photo grid |

---

## Thesys Hosted API (Alternative Path)

If you want to use the Thesys-hosted C1 API instead of our direct approach:

```tsx
// Uses C1Chat (requires THESYS_API_KEY)
import { C1Chat } from "@thesysai/genui-sdk";

<C1Chat
  apiUrl="/api/chat"
  agentName="Orbiter Copilot"
  theme={{ mode: "dark" }}
/>
```

With the Thesys API, use their OpenAI-compatible endpoint:
```typescript
const client = new OpenAI({
  baseURL: "https://api.thesys.dev/v1/embed",
  apiKey: process.env.THESYS_API_KEY,
});
const response = await client.chat.completions.create({
  model: "c1/anthropic/claude-sonnet-4/v-20250930",
  messages: [...],
  stream: true,
});
```

The tradeoff: Thesys API adds latency + cost but handles the streaming format automatically.
Our approach: Anthropic direct + manual SSE = faster, cheaper, full control.

---

## Model Pricing (via Thesys if you switch)

| Model | Input | Output |
|-------|-------|--------|
| Claude Sonnet 4 (c1/...) | $6.00/M | $18.00/M |
| GPT 5 (c1/...) | $2.50/M | $12.50/M |
| Claude 3.5 Haiku (exp) | $1.60/M | $5.00/M |

---

## Quick Debug Checklist

- ☐ Cards not rendering? Check `event: tpl` format — `name` must exactly match responseTemplates
- ☐ Input not clickable? Check `min-height: 24px` on `.crayon-shell-thread-composer__input`
- ☐ Chat history lost on tab switch? Switch to `display: none` strategy (don't unmount)
- ☐ Empty responses? LLM is probably returning markdown-fenced JSON — add JSON fence stripping
- ☐ Layout broken? Wrap with `display: flex; flex-direction: column; height: 100%` and add `height: 100%` to `.crayon-shell-container`
- ☐ Dark theme not applying? Pass `theme={{ mode: "dark" }}` to `CrayonChat`

---

## Resources

- **CrayonAI npm**: `@crayonai/react-ui`, `@crayonai/stream`, `@crayonai/react-core`
- **Thesys Docs**: https://docs.thesys.dev
- **Thesys Playground**: https://console.thesys.dev/playground
- **This repo**: https://github.com/roboulos/orbiter-copilot-demo
- **Live demo**: https://orbiter-copilot-demo.vercel.app

---

*Written by Robert Boulos for the Orbiter team — Feb 18, 2026*
*Based on hard-won lessons building the Copilot demo overnight.*
