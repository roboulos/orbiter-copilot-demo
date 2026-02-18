"use client";

import { CrayonChat } from "@crayonai/react-ui";
import { OutcomeCard } from "./components/OutcomeCard";
import "@crayonai/react-ui/styles/index.css";

const templates = [
  {
    name: "outcome_card",
    Component: OutcomeCard,
  },
];

const STARTERS = [
  {
    displayText: "I want to meet a talent agent who works with celebrity brand partnerships",
    prompt: "I want to get introduced to a talent agent who works with celebrity brand partnerships at UTA or WME",
  },
  {
    displayText: "Help me connect with a Series B founder in HR tech",
    prompt: "I need to meet a Series B founder in the HR tech space for a strategic conversation",
  },
  {
    displayText: "I'm looking for an investor who understands graph databases",
    prompt: "I want to find an angel investor who has backed graph database companies at the seed stage",
  },
  {
    displayText: "I need an intro to a VP of Partnerships at a SaaS company",
    prompt: "I need an introduction to a VP of Partnerships at a mid-market SaaS company",
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
          background: "rgba(10,10,15,0.95)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#e8e8f0",
          }}
        >
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
          Outcomes
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Define what you want to achieve through your network
        </span>
      </div>

      {/* Chat — fills remaining height */}
      <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        <CrayonChat
          processMessage={async ({ messages, abortController }) => {
            const lastMessage = messages[messages.length - 1];
            // Pass full history but API will handle deduplication
            return fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prompt: lastMessage?.message ?? "",
                messages: messages.slice(0, -1), // history without current msg
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
              "Tell me about a goal you want to unlock through your network — who you want to meet, what opportunity you're pursuing, or what introduction would change everything.",
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
