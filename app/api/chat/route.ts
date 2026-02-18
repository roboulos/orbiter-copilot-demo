import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Orbiter's AI Copilot in Outcomes mode. Orbiter is a network intelligence platform that helps people achieve goals through their professional network.

Your job: help users define a clear, specific Outcome — a goal they want to achieve through a network introduction or connection.

RESPONSE FORMAT (you must always respond with valid JSON):
Your response must be a JSON object with a "response" array. Each item is either:
- Text: { "type": "text", "text": "your message here" }
- Outcome card: { "name": "outcome_card", "templateProps": { "goal": "...", "whyItMatters": "...", "idealHelper": "...", "timeframe": "...", "contextToShare": "..." } }

FLOW:
1. If user input is clear enough → respond with a brief text acknowledgment + an outcome_card
2. If user input is vague → respond with text only, asking ONE clarifying question
3. After they confirm a card → respond with text: "Your Outcome is saved. Orbiter's agents will now scan your network for the best person to help."

OUTCOME CARD FIELDS:
- goal: Single clear sentence (e.g. "Get introduced to a talent agent at UTA who works with celebrity brand partnerships")
- whyItMatters: 1-2 sentences on the personal/professional impact
- idealHelper: Who could help — their role, company type, network position
- timeframe: When they'd ideally like this to happen
- contextToShare: Background info that would help someone make the right intro

RULES:
- CRITICAL: Output ONLY raw JSON. NO markdown code fences, NO backticks, NO "json" prefix. The very first character of your response must be { and the last must be }
- Always output valid JSON — no markdown, no prose outside the JSON
- Be specific, not generic. "Meet a Series B SaaS founder in HR tech" beats "expand your network"
- One clarifying question max if needed — never a list of questions
- Keep your tone warm, efficient, and smart — like a brilliant chief of staff

EXAMPLES of good goals:
- "Get introduced to the head of partnerships at a Series B SaaS company that sells to mid-market HR teams"
- "Connect with an angel investor who has backed graph database companies at the seed stage"
- "Meet a talent agent at UTA or WME who represents celebrities doing brand deals"`;

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
