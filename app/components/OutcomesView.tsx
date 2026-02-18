"use client";

import { useState } from "react";

type OutcomeStatus = "Scanning" | "Matched" | "In Progress" | "Completed";

const OUTCOMES = [
  {
    id: 1,
    goal: "Get warm intros to 3-5 seed-stage VCs who have backed graph-database-native or relationship-intelligence B2B SaaS in the last 24 months",
    whyItMatters: "Raising $4M seed for Orbiter — need partners who understand graph tech, not generalist VCs",
    timeframe: "Next 45 days",
    status: "Scanning" as OutcomeStatus,
    matches: 3,
    createdAt: "Today",
    tags: ["Fundraising", "VC"],
  },
  {
    id: 2,
    goal: "Land a warm intro to VP of Engineering or CTO at a mid-market HR tech company actively evaluating relationship intelligence tools",
    whyItMatters: "Enterprise HR tech is our ICP — one design partner here unlocks the whole vertical",
    timeframe: "Next 30 days",
    status: "Matched" as OutcomeStatus,
    matches: 2,
    createdAt: "2 days ago",
    tags: ["Enterprise", "HR Tech"],
  },
  {
    id: 3,
    goal: "Connect with 2-3 power users who have 2,000+ LinkedIn connections and are active in VC-backed startup ecosystems",
    whyItMatters: "Early beta users with large networks seed our graph — one power user brings 200+ relevant contacts",
    timeframe: "Next 2 weeks",
    status: "In Progress" as OutcomeStatus,
    matches: 5,
    createdAt: "4 days ago",
    tags: ["User Acquisition", "Beta"],
  },
  {
    id: 4,
    goal: "Find a senior full-stack engineer with graph database experience (Neo4j, FalkorDB, or similar) for a contract role",
    whyItMatters: "Need graph expertise to scale our intelligence layer — this is the bottleneck",
    timeframe: "Next 3 weeks",
    status: "Scanning" as OutcomeStatus,
    matches: 1,
    createdAt: "1 week ago",
    tags: ["Hiring", "Graph DB"],
  },
  {
    id: 5,
    goal: "Secure a 30-min intro call with someone from Ryan Reynolds' team about Orbiter brand partnership potential",
    whyItMatters: "Celebrity co-sign could 10x waitlist growth overnight — one connection in our graph is 2 hops away",
    timeframe: "Next 6 weeks",
    status: "Completed" as OutcomeStatus,
    matches: 1,
    createdAt: "2 weeks ago",
    tags: ["Partnerships", "BD"],
  },
];

const STATUS_CONFIG: Record<OutcomeStatus, { color: string; bg: string; border: string; dot: string }> = {
  Scanning: {
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.25)",
    dot: "#60a5fa",
  },
  Matched: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
    dot: "#34d399",
  },
  "In Progress": {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.25)",
    dot: "#a78bfa",
  },
  Completed: {
    color: "rgba(255,255,255,0.35)",
    bg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.12)",
    dot: "rgba(255,255,255,0.3)",
  },
};

const FILTERS = ["All", "Scanning", "Matched", "In Progress", "Completed"];

export function OutcomesView() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered =
    activeFilter === "All"
      ? OUTCOMES
      : OUTCOMES.filter((o) => o.status === activeFilter);

  const counts = {
    Scanning: OUTCOMES.filter((o) => o.status === "Scanning").length,
    Matched: OUTCOMES.filter((o) => o.status === "Matched").length,
    "In Progress": OUTCOMES.filter((o) => o.status === "In Progress").length,
    Completed: OUTCOMES.filter((o) => o.status === "Completed").length,
  };

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "28px 32px",
        background: "#0a0a0f",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#e8e8f0",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Saved Outcomes
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            {OUTCOMES.length} goals · Orbiter is scanning your graph for matches
          </p>
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 600,
            padding: "8px 16px",
            borderRadius: "10px",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.35)",
            color: "#a5b4fc",
            cursor: "pointer",
          }}
        >
          <span>+</span>
          New Outcome
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        {(["Scanning", "Matched", "In Progress", "Completed"] as OutcomeStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          return (
            <div
              key={s}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${cfg.border}`,
                borderRadius: "12px",
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 700, color: cfg.color, marginBottom: "2px" }}>
                {counts[s]}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s}</div>
            </div>
          );
        })}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              fontSize: "11px",
              fontWeight: 500,
              padding: "5px 12px",
              borderRadius: "20px",
              border: activeFilter === f ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: activeFilter === f ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
              color: activeFilter === f ? "#a5b4fc" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "all 0.12s ease",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Outcomes list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((o) => {
          const cfg = STATUS_CONFIG[o.status];
          const expanded = expandedId === o.id;
          return (
            <div
              key={o.id}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: `1px solid ${o.status === "Matched" ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "14px",
                padding: "18px 20px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onClick={() => setExpandedId(expanded ? null : o.id)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                {/* Status dot */}
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: cfg.dot,
                    boxShadow: o.status === "Matched" ? `0 0 6px ${cfg.dot}` : "none",
                    flexShrink: 0,
                    marginTop: "5px",
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        padding: "3px 8px",
                        borderRadius: "5px",
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        color: cfg.color,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {o.status === "Scanning" ? "⟳ " : o.status === "Matched" ? "✓ " : o.status === "In Progress" ? "→ " : "✓ "}
                      {o.status}
                    </span>

                    {o.matches > 0 && (
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                        {o.matches} match{o.matches !== 1 ? "es" : ""} found
                      </span>
                    )}

                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>
                      {o.createdAt} · {o.timeframe}
                    </span>
                  </div>

                  {/* Goal */}
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: o.status === "Completed" ? "rgba(255,255,255,0.4)" : "#e8e8f0",
                      margin: "0 0 10px",
                      lineHeight: "1.5",
                      textDecoration: o.status === "Completed" ? "line-through" : "none",
                    }}
                  >
                    {o.goal}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {o.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: "10px",
                            padding: "2px 7px",
                            borderRadius: "4px",
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.3)",
                            fontWeight: 500,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                      {expanded ? "▲ Less" : "▼ More"}
                    </span>
                  </div>

                  {/* Expanded: why it matters */}
                  {expanded && (
                    <div
                      style={{
                        marginTop: "14px",
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "0 0 12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Why it matters
                      </p>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 14px", lineHeight: "1.6" }}>
                        {o.whyItMatters}
                      </p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "7px 14px",
                            borderRadius: "8px",
                            background: "rgba(99,102,241,0.15)",
                            border: "1px solid rgba(99,102,241,0.3)",
                            color: "#a5b4fc",
                            cursor: "pointer",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Find matches
                        </button>
                        <button
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            padding: "7px 14px",
                            borderRadius: "8px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.4)",
                            cursor: "pointer",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
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
