"use client";

import { useState } from "react";
import { CrayonChat } from "@crayonai/react-ui";
import { OutcomeCard } from "./components/OutcomeCard";
import { LeverageLoopCard } from "./components/LeverageLoopCard";
import { ContactCard } from "./components/ContactCard";
import { SerendipityCard } from "./components/SerendipityCard";
import { NetworkView } from "./components/NetworkView";
import { OutcomesView } from "./components/OutcomesView";
import { HorizonView } from "./components/HorizonView";
import { DocsView } from "./components/DocsView";
import "@crayonai/react-ui/styles/index.css";

const templates = [
  { name: "outcome_card", Component: OutcomeCard },
  { name: "leverage_loop_card", Component: LeverageLoopCard },
  { name: "contact_card", Component: ContactCard },
  { name: "serendipity_card", Component: SerendipityCard },
];

const STARTERS = [
  {
    displayText: "🎯 Outcome — I'm raising a $4M seed, find VCs in my network who back graph tech",
    prompt: "I'm raising a $4M seed round for Orbiter, a relationship intelligence platform built on a graph database. I need warm introductions to seed-stage investors who have backed graph databases, network intelligence tools, or relationship-driven SaaS in the last 2 years. We're 60 days from target close.",
  },
  {
    displayText: "⚡ Leverage Loop — My contact James just became VP at Salesforce",
    prompt: "My contact James Whitfield just got promoted to VP of Platform Partnerships at Salesforce. We worked together 3 years ago at a Series B startup. This is a leverage loop — what's my move and draft me a message to send today.",
  },
  {
    displayText: "✨ Serendipity — Who in my network should meet our fractional CFO Caitlin?",
    prompt: "Serendipity match: We just brought on a fractional CFO named Caitlin who specializes in SaaS Series A financials. She needs deal flow. Find the best person in my network to introduce her to right now.",
  },
  {
    displayText: "👤 Contact Profile — Pull up James Whitfield at Salesforce",
    prompt: "Pull up the contact profile for James Whitfield, VP of Platform Partnerships at Salesforce. We worked together 3 years ago at a Series B startup called Relay. Show me our relationship context, bond strength, and what I should do next.",
  },
];

type Tab = "Copilot" | "Network" | "Outcomes" | "Horizon" | "Docs";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Copilot");

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
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,10,15,0.98)",
          backdropFilter: "blur(16px)",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" stroke="white" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>

        <span style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0", letterSpacing: "-0.01em" }}>
          Orbiter
        </span>

        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />

        {/* Mode tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {(["Copilot", "Network", "Outcomes", "Horizon", "Docs"] as Tab[]).map((tab) => (
            <ModeTab
              key={tab}
              label={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>

        {/* Right */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 8px #34d399",
              }}
            />
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
              Network scanning
            </span>
          </div>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "white",
            }}
          >
            M
          </div>
        </div>
      </header>

      {/* Tab content */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {/* CrayonChat: always mounted, hidden via display:none when not active — no overflow/clip wrapping */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: activeTab === "Copilot" ? "flex" : "none",
          flexDirection: "column",
        }}>
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
              title: "What do you want to make happen?",
              description:
                "Tell me a goal, share a signal from your network, or ask for a serendipity match — I'll use your graph to find the right move.",
            }}
            conversationStarters={{
              variant: "long",
              options: STARTERS,
            }}
          />
        </div>
        {activeTab === "Network" && <NetworkView />}
        {activeTab === "Outcomes" && <OutcomesView />}
        {activeTab === "Horizon" && <HorizonView />}
        {activeTab === "Docs" && <DocsView />}
      </div>
    </div>
  );
}

function ModeTab({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: "12px",
        fontWeight: active ? 600 : 400,
        padding: "5px 12px",
        borderRadius: "8px",
        background: active ? "rgba(99,102,241,0.14)" : "transparent",
        border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent",
        color: active ? "#a5b4fc" : "rgba(255,255,255,0.3)",
        cursor: "pointer",
        transition: "all 0.12s ease",
        letterSpacing: "0.01em",
      }}
    >
      {label}
    </button>
  );
}
