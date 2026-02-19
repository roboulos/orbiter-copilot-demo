"use client";

import { useState, useRef, useCallback } from "react";
import { CrayonChat } from "@crayonai/react-ui";
import { OutcomeCard } from "./components/OutcomeCard";
import { LeverageLoopCard } from "./components/LeverageLoopCard";
import { ContactCard } from "./components/ContactCard";
import { SerendipityCard } from "./components/SerendipityCard";
import { NetworkView } from "./components/NetworkView";
import { OutcomesView } from "./components/OutcomesView";
import { HorizonView } from "./components/HorizonView";
import { DocsView } from "./components/DocsView";
import { PersonPicker } from "./components/PersonPicker";
import { chat } from "./lib/xano";
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
    displayText: "⚡ Leverage Loop — My contact just became VP at Salesforce",
    prompt: "My contact just got promoted to VP of Platform Partnerships at Salesforce. We worked together 3 years ago at a Series B startup. This is a leverage loop — what's my move and draft me a message to send today.",
  },
  {
    displayText: "✨ Serendipity — Who in my network should meet our fractional CFO?",
    prompt: "Serendipity match: We just brought on a fractional CFO who specializes in SaaS Series A financials. She needs deal flow. Find the best person in my network to introduce her to right now.",
  },
  {
    displayText: "👤 Contact Profile — Pull up the selected person",
    prompt: "Pull up the contact profile for the person I've selected. Show me our relationship context, bond strength, and what I should do next.",
  },
];

type Tab = "Copilot" | "Network" | "Outcomes" | "Horizon" | "Docs";

interface SelectedPerson {
  master_person_id: number;
  full_name: string;
  master_person: {
    name: string;
    avatar: string | null;
    current_title: string | null;
    master_company?: { company_name: string } | null;
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Copilot");
  const [selectedPerson, setSelectedPerson] = useState<SelectedPerson | null>(null);
  const personContextRef = useRef<string>("");
  const masterPersonIdRef = useRef<number | undefined>(undefined);

  const handlePersonSelect = useCallback((person: SelectedPerson, context: string) => {
    setSelectedPerson(person);
    personContextRef.current = context;
    masterPersonIdRef.current = person.master_person_id;
  }, []);

  const handlePersonClear = useCallback(() => {
    setSelectedPerson(null);
    personContextRef.current = "";
    masterPersonIdRef.current = undefined;
  }, []);

  // processMessage: calls Xano /chat, converts JSON response to SSE stream for CrayonChat
  const processMessage = useCallback(
    async ({ messages, abortController }: { threadId: string; messages: Array<{ role: string; message?: unknown }>; abortController: AbortController }) => {
      const lastMessage = messages[messages.length - 1];
      const prompt = typeof lastMessage?.message === "string" ? lastMessage.message : String(lastMessage?.message ?? "");

      // Build history from previous messages
      const history = messages
        .slice(0, -1)
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role,
          content: typeof m.message === "string" ? m.message : JSON.stringify(m.message),
        }))
        .filter((m) => m.content.length > 0);

      // Call Xano /chat directly
      const data = await chat(
        prompt,
        personContextRef.current || undefined,
        history.length > 0 ? history : undefined,
        masterPersonIdRef.current
      );

      // Parse the raw LLM response
      let raw = data.raw || "";
      const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();

      // Fix unescaped newlines inside JSON string values — LLMs sometimes
      // output literal newlines that break JSON.parse
      const sanitized = cleaned.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");

      type ResponseItem =
        | { type: "text"; text: string }
        | { name: string; templateProps: Record<string, unknown> };

      let items: ResponseItem[] = [];
      try {
        // Try clean version first, fall back to sanitized
        let parsed;
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          parsed = JSON.parse(sanitized);
        }
        items = parsed?.response ?? [];
      } catch {
        items = [{ type: "text", text: cleaned || raw }];
      }

      // Convert to SSE stream that CrayonChat expects
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          if (abortController.signal.aborted) {
            controller.close();
            return;
          }

          for (const item of items) {
            if ("type" in item && item.type === "text" && item.text) {
              const words = item.text.split(" ");
              for (let i = 0; i < words.length; i++) {
                const chunk = (i === 0 ? "" : " ") + words[i];
                controller.enqueue(encoder.encode(`event: text\ndata: ${chunk}\n\n`));
              }
            } else if ("name" in item && item.name) {
              controller.enqueue(
                encoder.encode(
                  `event: tpl\ndata: ${JSON.stringify({ name: item.name, templateProps: (item as { templateProps: Record<string, unknown> }).templateProps })}\n\n`
                )
              );
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
    },
    []
  );

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

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {(["Copilot", "Network", "Outcomes", "Horizon", "Docs"] as Tab[]).map((tab) => (
            <ModeTab key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
          ))}
        </div>

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
              Live — Xano + OpenRouter
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
            R
          </div>
        </div>
      </header>

      {/* Person picker — shown when Copilot tab is active */}
      {activeTab === "Copilot" && (
        <div style={{ padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)", flexShrink: 0, position: "relative", zIndex: 500 }}>
          <PersonPicker
            onSelect={handlePersonSelect}
            selectedPerson={selectedPerson}
            onClear={handlePersonClear}
          />
        </div>
      )}

      {/* Tab content */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: activeTab === "Copilot" ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <CrayonChat
            processMessage={processMessage}
            agentName="Orbiter Copilot"
            responseTemplates={templates}
            theme={{ mode: "dark" }}
            welcomeMessage={{
              title: selectedPerson
                ? `What do you want to do with ${selectedPerson.full_name}?`
                : "What do you want to make happen?",
              description: selectedPerson
                ? `${selectedPerson.master_person.current_title || ""}${selectedPerson.master_person.master_company?.company_name ? ` at ${selectedPerson.master_person.master_company.company_name}` : ""} — Ask about this contact, create a leverage loop, or explore outcomes.`
                : "Search your network above, then tell me a goal, share a signal, or ask for a serendipity match.",
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
