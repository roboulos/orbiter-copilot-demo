"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";

type Stage = "Identified" | "Warming" | "Active" | "Connected";

const TARGETS = [
  {
    id: 1,
    name: "Priya Kapoor",
    role: "Partner",
    company: "NEA Ventures",
    why: "Backed 3 graph-native SaaS companies in the last 18 months. Fund just closed $2.1B. Active seed check writer ($500K–$2M). Already 2 hops away via David Lin.",
    nextAction: "Ask David Lin for a warm intro this week",
    stage: "Warming" as Stage,
    priority: "high",
    addedAt: "3 days ago",
    mutuals: 5,
    tags: ["Seed", "Graph DB", "VC"],
    progress: 40,
  },
  {
    id: 2,
    name: "Ryan Walsh",
    role: "VP of Engineering",
    company: "Lattice",
    why: "HR tech mid-market ICP. Lattice just announced Series D expansion. Evaluating AI-powered relationship tools for internal use. 3 mutual connections.",
    nextAction: "Share Orbiter's enterprise case study",
    stage: "Active" as Stage,
    priority: "high",
    addedAt: "5 days ago",
    mutuals: 3,
    tags: ["Enterprise", "HR Tech", "ICP"],
    progress: 65,
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    role: "Head of Enterprise Sales",
    company: "Notion",
    why: "Building Notion's enterprise integration roadmap. 22 mutual connections. Connected to 3 of our target VCs. High-leverage node in the graph.",
    nextAction: "Connect over Salesforce partnership angle",
    stage: "Identified" as Stage,
    priority: "medium",
    addedAt: "1 week ago",
    mutuals: 22,
    tags: ["SaaS", "Integrations"],
    progress: 15,
  },
  {
    id: 4,
    name: "Jennifer Tao",
    role: "Principal",
    company: "Sequoia Capital",
    why: "Sequoia Seed focus on relationship-intelligence and B2B network tools. Backed Clay in early stages. 1 hop via Sarah Chen.",
    nextAction: "Warm intro request via Sarah Chen",
    stage: "Identified" as Stage,
    priority: "high",
    addedAt: "2 days ago",
    mutuals: 1,
    tags: ["Seed", "VC", "Network Tools"],
    progress: 10,
  },
  {
    id: 5,
    name: "David Chen",
    role: "Head of Partnerships",
    company: "Apollo.io",
    why: "Apollo serves 100K+ GTM professionals — natural distribution partner. David has spoken publicly about investing in relationship-intelligence tooling.",
    nextAction: "Follow up after conference DM last week",
    stage: "Active" as Stage,
    priority: "medium",
    addedAt: "2 weeks ago",
    mutuals: 8,
    tags: ["GTM", "Partnerships", "Distribution"],
    progress: 55,
  },
  {
    id: 6,
    name: "Alicia Grant",
    role: "CTO",
    company: "Common Room",
    why: "Common Room is a direct comp / potential acqui-hire scenario. Alicia is vocal about graph-based community intelligence. Orbiter and Common Room have 40% feature overlap.",
    nextAction: "Strategic conversation — not a pitch",
    stage: "Connected" as Stage,
    priority: "low",
    addedAt: "1 month ago",
    mutuals: 11,
    tags: ["Strategic", "Graph", "M&A"],
    progress: 90,
  },
];

const STAGE_CONFIG: Record<Stage, { color: string; bg: string; border: string; barColor: string }> = {
  Identified: { color: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", barColor: "rgba(255,255,255,0.2)" },
  Warming:    { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)", barColor: "#60a5fa" },
  Active:     { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)", barColor: "#a78bfa" },
  Connected:  { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)", barColor: "#34d399" },
};

const STAGES: Stage[] = ["Identified", "Warming", "Active", "Connected"];

export function HorizonView() {
  const [activeStage, setActiveStage] = useState<Stage | "All">("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeStage === "All" ? TARGETS : TARGETS.filter(t => t.stage === activeStage);
  const highPriority = TARGETS.filter(t => t.priority === "high" && t.stage !== "Connected").length;

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px", background: "#0a0a0f" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e8e8f0", margin: 0, letterSpacing: "-0.02em" }}>
            Horizon
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            {TARGETS.length} targets tracked · {highPriority} high priority · Orbiter is warming your paths
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "10px",
          background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)",
          color: "#a5b4fc", cursor: "pointer",
        }}>
          + Add Target
        </button>
      </div>

      {/* Pipeline stages overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "24px" }}>
        {STAGES.map(s => {
          const cfg = STAGE_CONFIG[s];
          const count = TARGETS.filter(t => t.stage === s).length;
          return (
            <div key={s}
              onClick={() => setActiveStage(activeStage === s ? "All" : s)}
              style={{
                background: activeStage === s ? cfg.bg : "rgba(255,255,255,0.025)",
                border: `1px solid ${activeStage === s ? cfg.border : "rgba(255,255,255,0.07)"}`,
                borderRadius: "12px", padding: "14px 16px", cursor: "pointer",
                transition: "all 0.15s ease",
              }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: cfg.color, marginBottom: "2px" }}>{count}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s}</div>
              {/* mini progress bar */}
              <div style={{ marginTop: "8px", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" }}>
                <div style={{ width: `${(count / TARGETS.length) * 100}%`, height: "100%", background: cfg.barColor, borderRadius: "2px" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Target list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map(t => {
          const cfg = STAGE_CONFIG[t.stage];
          const expanded = expandedId === t.id;
          return (
            <div key={t.id}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${t.priority === "high" ? cfg.border : "rgba(255,255,255,0.07)"}`,
                borderRadius: "14px", padding: "16px 18px", cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onClick={() => setExpandedId(expanded ? null : t.id)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <Avatar name={t.name} size={40} borderRadius="10px" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0" }}>{t.name}</span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{t.role} · {t.company}</span>
                    <div style={{
                      marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px",
                      background: cfg.bg, border: `1px solid ${cfg.border}`,
                      borderRadius: "6px", padding: "2px 8px",
                      fontSize: "10px", fontWeight: 600, color: cfg.color, letterSpacing: "0.04em",
                    }}>
                      {t.stage}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{
                        width: `${t.progress}%`, height: "100%",
                        background: cfg.barColor, borderRadius: "2px",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                  </div>

                  {/* Next action */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>→</span>
                      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>{t.nextAction}</span>
                    </div>
                    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                      {t.tags.slice(0, 2).map(tag => (
                        <span key={tag} style={{
                          fontSize: "10px", padding: "2px 6px", borderRadius: "4px",
                          background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)",
                        }}>{tag}</span>
                      ))}
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginLeft: "4px" }}>
                        {t.mutuals} mutual
                      </span>
                    </div>
                  </div>

                  {/* Expanded */}
                  {expanded && (
                    <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(167,139,250,0.6)", margin: "0 0 6px" }}>
                        Why they're on Horizon
                      </p>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6", margin: "0 0 14px" }}>
                        {t.why}
                      </p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={e => e.stopPropagation()} style={{
                          fontSize: "11px", fontWeight: 600, padding: "7px 14px", borderRadius: "8px",
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none",
                          color: "white", cursor: "pointer",
                        }}>
                          Get intro path
                        </button>
                        <button onClick={e => e.stopPropagation()} style={{
                          fontSize: "11px", fontWeight: 500, padding: "7px 14px", borderRadius: "8px",
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.4)", cursor: "pointer",
                        }}>
                          Move stage
                        </button>
                        <button onClick={e => e.stopPropagation()} style={{
                          fontSize: "11px", fontWeight: 500, padding: "7px 14px", borderRadius: "8px",
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.4)", cursor: "pointer",
                        }}>
                          Add note
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
