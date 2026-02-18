"use client";

import { CrayonChat } from "@crayonai/react-ui";
import { ThemeProvider } from "@crayonai/react-ui";
import { OutcomeCard } from "./components/OutcomeCard";
import "@crayonai/react-ui/styles/index.css";

const templates = [
  {
    name: "outcome_card",
    Component: OutcomeCard,
  },
];

const STARTERS = [
  { displayText: "I want to meet a talent agent who works with celebrity brand partnerships", prompt: "I want to get introduced to a talent agent who works with celebrity brand partnerships" },
  { displayText: "Help me connect with a Series B founder in HR tech", prompt: "I need to meet a Series B founder in the HR tech space for a strategic conversation" },
  { displayText: "I'm looking for an investor who understands graph databases", prompt: "I want to find an angel investor who has backed graph database companies" },
  { displayText: "I need an intro to a VP of Partnerships at a SaaS company", prompt: "I need an introduction to a VP of Partnerships at a mid-market SaaS company" },
];

export default function Home() {
  return (
    <ThemeProvider>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0a0a0f" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: 600, color: "#e8e8f0", fontFamily: "Inter, sans-serif" }}>
            Orbiter Copilot
          </span>
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: "100px",
            }}
          >
            Outcomes
          </span>
          <span style={{ marginLeft: "auto", fontSize: "12px", color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif" }}>
            Define what you want to achieve through your network
          </span>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <CrayonChat
            processMessage={async ({ threadId, messages, abortController }) => {
              const lastMessage = messages[messages.length - 1];
              return fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  prompt: lastMessage?.message ?? "",
                  threadId,
                  messages,
                }),
                signal: abortController.signal,
              });
            }}
            agentName="Orbiter Copilot"
            responseTemplates={templates}
            welcomeMessage={{
              title: "What do you want to achieve?",
              description: "Tell me about a goal you want to unlock through your network — who you want to meet, what opportunity you're pursuing, or what introduction would change everything.",
            }}
            conversationStarters={{
              variant: "long",
              options: STARTERS,
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
