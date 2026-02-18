"use client";

import { CrayonChat } from "@crayonai/react-ui";
import { OutcomeCard } from "./components/OutcomeCard";
import { LeverageLoopCard } from "./components/LeverageLoopCard";
import "@crayonai/react-ui/styles/index.css";

const templates = [
  { name: "outcome_card", Component: OutcomeCard },
  { name: "leverage_loop_card", Component: LeverageLoopCard },
];

const STARTERS = [
  {
    displayText: "I want to meet a talent agent who works with celebrity brand partnerships",
    prompt: "I want to get introduced to a talent agent at UTA or WME who works with celebrity brand partnerships. I'm pitching a brand deal next month.",
  },
  {
    displayText: "Help me connect with a Series B founder in HR tech",
    prompt: "I need to meet a Series B founder in the HR tech space — specifically someone who has built a product for mid-market companies and is thinking about enterprise expansion.",
  },
  {
    displayText: "I'm looking for an investor who understands graph databases",
    prompt: "I want to find an angel investor who has backed graph database companies at the seed stage in the last 3 years. I'm raising a pre-seed round.",
  },
  {
    displayText: "Show me a Leverage Loop — my contact just got promoted",
    prompt: "Show me a leverage loop example: my contact Sarah Chen just got promoted to VP of Product at Salesforce. She was my colleague 3 years ago. I'm currently looking to land enterprise pilots for my B2B SaaS product.",
  },
];

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0f",
        fontFamily: "Inter, -apple-system, sans-serif",
      }}
    >
      {/* Custom Orbiter Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "13px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(10,10,15,0.98)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#e8e8f0" }}>
            Orbiter Copilot
          </span>
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: "100px",
            }}
          >
            Beta
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
          <ModeChip label="Outcomes" active />
          <ModeChip label="Leverage Loops" />
        </div>
        <span style={{ marginLeft: "auto", fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>
          Network intelligence by Orbiter
        </span>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        <CrayonChat
          processMessage={async ({ messages, abortController }) => {
            const lastMessage = messages[messages.length - 1];
            return fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prompt: lastMessage?.message ?? "",
                messages: messages.slice(0, -1),
              }),
              signal: abortController.signal,
            });
          }}
          agentName="Orbiter Copilot"
          responseTemplates={templates}
          theme={{ mode: "dark" }}
          welcomeMessage={{
            title: "What do you want to achieve?",
            description:
              "Tell me your goal, and I'll turn it into a structured Outcome your network can act on — or show me a signal and I'll find the Leverage Loop.",
          }}
          conversationStarters={{
            variant: "long",
            options: STARTERS,
          }}
        />
      </div>
    </div>
  );
}

function ModeChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      style={{
        fontSize: "12px",
        fontWeight: active ? 600 : 400,
        padding: "4px 12px",
        borderRadius: "100px",
        background: active ? "rgba(99,102,241,0.15)" : "transparent",
        border: active ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)",
        color: active ? "#a5b4fc" : "rgba(255,255,255,0.35)",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {label}
    </span>
  );
}
