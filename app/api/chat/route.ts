import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { crayonStream } from "@crayonai/stream";

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
- Always output valid JSON — no markdown, no prose outside the JSON
- Be specific, not generic. "Meet a Series B SaaS founder in HR tech" beats "expand your network"
- One clarifying question max if needed — never a list of questions
- Keep your tone warm, efficient, and smart — like a brilliant chief of staff

EXAMPLES of good goals:
- "Get introduced to the head of partnerships at a Series B SaaS company that sells to mid-market HR teams"
- "Connect with an angel investor who has backed graph database companies at the seed stage"
- "Meet a talent agent at UTA or WME who represents celebrities doing brand deals"`;

export async function POST(req: NextRequest) {
  const { prompt, threadId, messages = [] } = await req.json();

  // Build message history
  const history = messages
    .filter((m: any) => m.role === "user" || m.role === "assistant")
    .map((m: any) => ({
      role: m.role as "user" | "assistant",
      content:
        m.role === "assistant"
          ? JSON.stringify({ response: [{ type: "text", text: m.message || "" }] })
          : m.message || "",
    }));

  // Add current user message
  const currentMessage = typeof prompt === "string" ? prompt : prompt?.content || "";

  const { stream, onText, onEnd, onError } = crayonStream();

  (async () => {
    try {
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
          onText(event.delta.text);
        }
      }
      onEnd();
    } catch (err) {
      onError(err as Error);
    }
  })();

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
