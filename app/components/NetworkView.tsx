"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { NetworkGraph } from "./NetworkGraph";

const CONTACTS = [
  {
    id: 1,
    initials: "JW",
    name: "James Whitfield",
    title: "VP of Platform Partnerships",
    company: "Salesforce",
    signal: "🚀 Just promoted",
    signalColor: "#34d399",
    signalBg: "rgba(52,211,153,0.12)",
    bond: 82,
    lastContact: "3 weeks ago",
    mutuals: 14,
    tags: ["Enterprise", "Partnerships"],
    alert: true,
  },
  {
    id: 2,
    initials: "MR",
    name: "Marcus Rodriguez",
    title: "Head of Enterprise Sales",
    company: "Notion",
    signal: "📈 Hiring actively",
    signalColor: "#a78bfa",
    signalBg: "rgba(167,139,250,0.12)",
    bond: 67,
    lastContact: "6 weeks ago",
    mutuals: 8,
    tags: ["SaaS", "Enterprise"],
    alert: false,
  },
  {
    id: 3,
    initials: "PK",
    name: "Priya Kapoor",
    title: "Partner",
    company: "NEA Ventures",
    signal: "💼 New fund closed",
    signalColor: "#60a5fa",
    signalBg: "rgba(96,165,250,0.12)",
    bond: 44,
    lastContact: "4 months ago",
    mutuals: 5,
    tags: ["VC", "Seed"],
    alert: true,
  },
  {
    id: 4,
    initials: "DL",
    name: "David Lin",
    title: "CTO",
    company: "Clay",
    signal: "🔗 Mutual connection added",
    signalColor: "#fb923c",
    signalBg: "rgba(251,146,60,0.12)",
    bond: 71,
    lastContact: "2 weeks ago",
    mutuals: 22,
    tags: ["Graph", "Data"],
    alert: false,
  },
  {
    id: 5,
    initials: "SC",
    name: "Sarah Chen",
    title: "VP of Partnerships",
    company: "Salesforce",
    signal: "🚀 Just promoted",
    signalColor: "#34d399",
    signalBg: "rgba(52,211,153,0.12)",
    bond: 58,
    lastContact: "5 weeks ago",
    mutuals: 11,
    tags: ["Enterprise", "SaaS"],
    alert: true,
  },
  {
    id: 6,
    initials: "RB",
    name: "Rachel Bloom",
    title: "Head of Partnerships",
    company: "Apollo.io",
    signal: "⚡ Engaged your content",
    signalColor: "#fbbf24",
    signalBg: "rgba(251,191,36,0.12)",
    bond: 39,
    lastContact: "8 weeks ago",
    mutuals: 6,
    tags: ["GTM", "Sales"],
    alert: false,
  },
];

const FILTERS = ["All signals", "Hot signals", "Fading bonds", "New connections", "VCs"];

function BondBar({ score }: { score: number }) {
  const color = score >= 70 ? "#34d399" : score >= 50 ? "#a78bfa" : score >= 35 ? "#fbbf24" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          flex: 1,
          height: "3px",
          borderRadius: "2px",
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: color,
            borderRadius: "2px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontWeight: 500, minWidth: 24 }}>
        {score}
      </span>
    </div>
  );
}

export function NetworkView() {
  const [activeFilter, setActiveFilter] = useState("All signals");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered =
    activeFilter === "Hot signals"
      ? CONTACTS.filter((c) => c.alert)
      : activeFilter === "Fading bonds"
      ? CONTACTS.filter((c) => c.bond < 50)
      : activeFilter === "VCs"
      ? CONTACTS.filter((c) => c.tags.includes("VC"))
      : CONTACTS;

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "28px 32px",
        background: "#0a0a0f",
      }}
    >
      {/* Header row */}
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
            Your Network
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            {CONTACTS.length} contacts · {CONTACTS.filter((c) => c.alert).length} active signals
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "8px 14px",
            minWidth: "220px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <line x1="10" y1="10" x2="14" y2="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>Search contacts…</span>
        </div>
      </div>

      {/* Network Graph */}
      <NetworkGraph />

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
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

      {/* Contact grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "12px",
        }}
      >
        {filtered.map((c) => (
          <div
            key={c.id}
            onMouseEnter={() => setHoveredId(c.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              background: hoveredId === c.id ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
              border: c.alert
                ? "1px solid rgba(52,211,153,0.2)"
                : "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px",
              padding: "18px 20px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              position: "relative",
            }}
          >
            {/* Alert dot */}
            {c.alert && (
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#34d399",
                  boxShadow: "0 0 6px #34d399",
                }}
              />
            )}

            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
              <Avatar name={c.name} size={40} borderRadius="10px" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0", marginBottom: "2px" }}>
                  {c.name}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.title} · {c.company}
                </div>
              </div>
            </div>

            {/* Signal badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: c.signalBg,
                border: `1px solid ${c.signalColor}30`,
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "11px",
                fontWeight: 500,
                color: c.signalColor,
                marginBottom: "14px",
              }}
            >
              {c.signal}
            </div>

            {/* Bond score */}
            <div style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Bond score</span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{c.mutuals} mutuals · {c.lastContact}</span>
              </div>
              <BondBar score={c.bond} />
            </div>

            {/* Tags + action */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "5px" }}>
                {c.tags.map((t) => (
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
              <button
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  padding: "5px 12px",
                  borderRadius: "7px",
                  background: c.alert ? "rgba(52,211,153,0.12)" : "rgba(99,102,241,0.1)",
                  border: c.alert ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(99,102,241,0.2)",
                  color: c.alert ? "#34d399" : "#a5b4fc",
                  cursor: "pointer",
                }}
              >
                {c.alert ? "Act now →" : "View"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
