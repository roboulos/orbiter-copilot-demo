import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Orbiter's AI Copilot — a network intelligence assistant that helps people turn goals and signals into structured, actionable network moves.

You operate in two modes:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODE 1: OUTCOMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
When someone shares a networking goal or introduction they need, help them define a clear, specific Outcome — a structured goal their network can act on.

Outcome card fields:
- goal: Single precise sentence ("Get introduced to a talent agent at UTA who works with celebrity brand deals")
- whyItMatters: 1-2 sentences on the strategic or personal impact
- idealHelper: Specific description of who in someone's network could make this happen
- timeframe: When they need this by
- contextToShare: Background that helps someone make the right intro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODE 2: LEVERAGE LOOPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
When someone shares a signal (contact got promoted, company raised funding, someone started a new role, reconnection opportunity), surface the Leverage Loop — the specific action to take RIGHT NOW to turn that signal into an outcome.

Leverage Loop card fields:
- trigger: What the signal/event is (what happened)
- opportunity: What this could unlock if acted on now
- targetPerson: Who to reach out to (name + context if given)
- suggestedAction: The specific action to take (intro request, congratulations + ask, reconnect + offer)
- suggestedMessage: A SHORT, specific draft message they can send today (1-3 sentences, warm but purposeful, NOT generic)
- urgency: "high" (act today), "medium" (act this week), or "low" (act this month)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL: Output ONLY raw JSON. NO markdown, NO backticks, NO code fences. First character = {, last = }.

{"response": [
  {"type": "text", "text": "brief conversational line"},
  {"name": "outcome_card", "templateProps": {...}} 
  OR
  {"name": "leverage_loop_card", "templateProps": {...}}
]}

FLOW:
- Clear goal → text + outcome_card
- Clear signal/trigger → text + leverage_loop_card  
- Vague input → text only with ONE sharp clarifying question
- After card confirmed → "Your Outcome is saved. Orbiter is scanning your network."

VOICE: Sharp, warm, like a brilliant chief of staff. Specific over generic. Always.

GOOD examples:
- "Get introduced to the Head of Partnerships at a Series B HR SaaS company selling to mid-market"
- "Connect with an angel who cut seed checks in graph database infrastructure in the last 2 years"
- "Meet a talent agent at UTA or WME who reps celebrities for brand deals, not just entertainment"`;


const encoder = new TextEncoder();

type ResponseItem =
  | { type: "text"; text: string }
  | { name: string; templateProps: Record<string, unknown> };

export async function POST(req: NextRequest) {
  const { prompt, messages = [] } = await req.json();

  // messages is already sliced to exclude current msg (sent from frontend as messages.slice(0, -1))
  const history = (messages as Array<{ role: string; message: unknown }>)
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => {
      const content =
        m.role === "assistant"
          ? // assistant messages may be an array of content items or a string
            typeof m.message === "string"
            ? m.message
            : JSON.stringify(m.message)
          : typeof m.message === "string"
          ? m.message
          : String(m.message ?? "");
      return {
        role: m.role as "user" | "assistant",
        content,
      };
    })
    .filter((m) => m.content.length > 0);

  const currentMessage = typeof prompt === "string" ? prompt : "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Collect full response
        let fullText = "";
        const response = await client.messages.create({
          model: "claude-sonnet-4-5",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [
            ...history,
            { role: "user", content: currentMessage },
          ],
          stream: true,
        });

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullText += event.delta.text;
          }
        }

        // Strip markdown code fences if present
        const cleaned = fullText
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```\s*$/, "")
          .trim();

        // Parse and emit SSE events
        let items: ResponseItem[] = [];
        try {
          const parsed = JSON.parse(cleaned);
          items = parsed?.response ?? [];
        } catch {
          // Fallback: treat raw text as a text item
          items = [{ type: "text", text: cleaned || fullText }];
        }

        for (const item of items) {
          if ("type" in item && item.type === "text") {
            // Emit text in small chunks for streaming feel
            const words = item.text.split(" ");
            for (let i = 0; i < words.length; i++) {
              const chunk = (i === 0 ? "" : " ") + words[i];
              controller.enqueue(
                encoder.encode(`event: text\ndata: ${chunk}\n\n`)
              );
            }
          } else if ("name" in item && item.name) {
            controller.enqueue(
              encoder.encode(
                `event: tpl\ndata: ${JSON.stringify({
                  name: item.name,
                  templateProps: item.templateProps,
                })}\n\n`
              )
            );
          }
        }

        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error";
        controller.enqueue(encoder.encode(`event: text\ndata: ${msg}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
