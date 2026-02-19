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
  { name: "outcome_card",      Component: OutcomeCard      },
  { name: "leverage_loop_card", Component: LeverageLoopCard },
  { name: "contact_card",      Component: ContactCard      },
  { name: "serendipity_card",  Component: SerendipityCard  },
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

// Animated orbital SVG — ambient background for welcome screen
function OrbitalBackground() {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 0,
    }}>
      {/* Radial glow center */}
      <div style={{
        position: "absolute",
        top: "35%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
      }} />

      {/* Orbital SVG rings */}
      <svg
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -55%)" }}
        width="520" height="520" viewBox="-260 -260 520 520"
        opacity="0.45"
      >
        {/* Orbit ring 1 */}
        <ellipse cx="0" cy="0" rx="100" ry="38" fill="none"
          stroke="rgba(99,102,241,0.18)" strokeWidth="0.8"
          transform="rotate(-20)"
        />
        {/* Orbit ring 2 */}
        <ellipse cx="0" cy="0" rx="155" ry="60" fill="none"
          stroke="rgba(139,92,246,0.14)" strokeWidth="0.8"
          transform="rotate(15)"
        />
        {/* Orbit ring 3 */}
        <ellipse cx="0" cy="0" rx="220" ry="85" fill="none"
          stroke="rgba(99,102,241,0.09)" strokeWidth="0.8"
          transform="rotate(-8)"
        />

        {/* Node on ring 1 */}
        <circle r="3.5" fill="#6366f1" opacity="0.7">
          <animateMotion
            dur="12s"
            repeatCount="indefinite"
            path="M 0,0 m -100,0 a 100,38 0 1,1 0.001,0"
            rotate="auto"
            additive="sum"
          />
        </circle>

        {/* Node on ring 2 */}
        <circle r="2.5" fill="#a855f7" opacity="0.6">
          <animateMotion
            dur="18s"
            repeatCount="indefinite"
            path="M 0,0 m -155,0 a 155,60 0 1,0 0.001,0"
            rotate="auto"
            additive="sum"
          />
        </circle>

        {/* Node on ring 3 (slower) */}
        <circle r="2" fill="#818cf8" opacity="0.5">
          <animateMotion
            dur="26s"
            repeatCount="indefinite"
            path="M 0,0 m -220,0 a 220,85 0 1,1 0.001,0"
            rotate="auto"
            additive="sum"
          />
        </circle>

        {/* Center node */}
        <circle cx="0" cy="0" r="5" fill="#6366f1" opacity="0.5">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="0.8">
          <animate attributeName="r" values="10;16;10" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("Copilot");
  const [selectedPerson, setSelectedPerson] = useState<SelectedPerson | null>(null);
  const personContextRef  = useRef<string>("");
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

  const processMessage = useCallback(
    async ({ messages, abortController }: {
      threadId: string;
      messages: Array<{ role: string; message?: unknown }>;
      abortController: AbortController;
    }) => {
      const lastMessage = messages[messages.length - 1];
      const prompt = typeof lastMessage?.message === "string"
        ? lastMessage.message
        : String(lastMessage?.message ?? "");

      const history = messages
        .slice(0, -1)
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role,
          content: typeof m.message === "string" ? m.message : JSON.stringify(m.message),
        }))
        .filter((m) => m.content.length > 0);

      const data = await chat(
        prompt,
        personContextRef.current || undefined,
        history.length > 0 ? history : undefined,
        masterPersonIdRef.current
      );

      let raw = data.raw || "";
      const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/, "")
        .trim();

      const sanitized = cleaned
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");

      type ResponseItem =
        | { type: "text"; text: string }
        | { name: string; templateProps: Record<string, unknown> };

      let items: ResponseItem[] = [];
      try {
        let parsed;
        try { parsed = JSON.parse(cleaned); }
        catch { parsed = JSON.parse(sanitized); }
        items = parsed?.response ?? [];
      } catch {
        items = [{ type: "text", text: cleaned || raw }];
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          if (abortController.signal.aborted) { controller.close(); return; }

          for (const item of items) {
            if ("type" in item && item.type === "text" && item.text) {
              const words = item.text.split(" ");
              for (let i = 0; i < words.length; i++) {
                const chunk = (i === 0 ? "" : " ") + words[i];
                controller.enqueue(encoder.encode(`event: text\ndata: ${chunk}\n\n`));
              }
            } else if ("name" in item && item.name) {
              controller.enqueue(encoder.encode(
                `event: tpl\ndata: ${JSON.stringify({
                  name: item.name,
                  templateProps: (item as { templateProps: Record<string, unknown> }).templateProps,
                })}\n\n`
              ));
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

  // Dynamic welcome content based on selected person
  const welcomeTitle = selectedPerson
    ? `What do you want to do with ${selectedPerson.master_person.name || selectedPerson.full_name}?`
    : "Your network is full of doors. Which one do you want to open?";

  const welcomeDescription = selectedPerson
    ? `${selectedPerson.master_person.current_title || ""}${
        selectedPerson.master_person.master_company?.company_name
          ? ` at ${selectedPerson.master_person.master_company.company_name}`
          : ""
      } — explore their profile, create a leverage loop, or find a serendipity match.`
    : "Pick someone above or describe what you want to make happen. Orbiter surfaces the right people, right timing, and right message.";

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
      {/* ─── Header ─────────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(10,10,15,0.98)",
          backdropFilter: "blur(20px)",
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        {/* Logo mark */}
        <div style={{
          width: "28px", height: "28px", borderRadius: "9px",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 2px 12px rgba(79,70,229,0.45)",
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" fill="white" />
            <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2.5 2" />
            <circle cx="8" cy="8" r="7.5" stroke="white" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="1.5 3" />
          </svg>
        </div>

        <span style={{
          fontSize: "14px", fontWeight: 700, color: "#e8e8f0",
          letterSpacing: "-0.02em",
        }}>
          Orbiter
        </span>

        <span style={{
          fontSize: "10px", fontWeight: 600,
          color: "rgba(99,102,241,0.7)",
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "5px",
          padding: "1px 6px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          Copilot
        </span>

        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

        {/* Nav tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {(["Copilot", "Network", "Outcomes", "Horizon", "Docs"] as Tab[]).map((tab) => (
            <ModeTab key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
          ))}
        </div>

        {/* Right side — status + avatar */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#34d399",
              boxShadow: "0 0 8px rgba(52,211,153,0.6)",
              animation: "glowPulse 3s ease-in-out infinite",
            }} />
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>
              Live
            </span>
          </div>

          {/* User avatar */}
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 700, color: "white",
            boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
            flexShrink: 0,
          }}>
            R
          </div>
        </div>
      </header>

      {/* ─── Person picker ────────────────────────────── */}
      {activeTab === "Copilot" && (
        <div style={{
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1200,
          background: "rgba(10,10,15,0.6)",
          backdropFilter: "blur(8px)",
        }}>
          <PersonPicker
            onSelect={handlePersonSelect}
            selectedPerson={selectedPerson}
            onClear={handlePersonClear}
          />
        </div>
      )}

      {/* ─── Tab content ─────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative" }}>

        {/* Copilot tab — CrayonChat with orbital bg overlay */}
        <div style={{
          flex: 1, minHeight: 0,
          display: activeTab === "Copilot" ? "flex" : "none",
          flexDirection: "column",
          position: "relative",
        }}>
          {/* Orbital ambient background — only on welcome screen (fades behind messages) */}
          <OrbitalBackground />

          <div style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}>
            <CrayonChat
              processMessage={processMessage}
              agentName="Orbiter Copilot"
              responseTemplates={templates}
              theme={{ mode: "dark" }}
              welcomeMessage={{
                title: welcomeTitle,
                description: welcomeDescription,
              }}
              conversationStarters={{
                variant: "long",
                options: STARTERS,
              }}
            />
          </div>
        </div>

        {activeTab === "Network"  && <NetworkView />}
        {activeTab === "Outcomes" && <OutcomesView />}
        {activeTab === "Horizon"  && <HorizonView />}
        {activeTab === "Docs"     && <DocsView />}
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
        padding: "5px 11px",
        borderRadius: "8px",
        background: active ? "rgba(99,102,241,0.14)" : "transparent",
        border: active ? "1px solid rgba(99,102,241,0.32)" : "1px solid transparent",
        color: active ? "#a5b4fc" : "rgba(255,255,255,0.32)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        letterSpacing: "0.01em",
        fontFamily: "Inter, sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.32)";
        }
      }}
    >
      {label}
    </button>
  );
}
