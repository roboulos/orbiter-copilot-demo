"use client";

import { useState } from "react";
import { CheckBoxGroup, CheckBoxItem } from "@crayonai/react-ui";
import { Avatar } from "./Avatar";
import { createOutcome, searchPersons } from "../lib/xano";

interface ContactCardProps {
  name: string;
  role: string;
  company: string;
  relationshipContext: string;      // how you know them
  lastInteraction?: string;         // "3 months ago", "Last week"
  mutualConnections?: number;
  bondStrength: "strong" | "warm" | "cold" | "new";
  actionItems?: string[];           // checklist of suggested actions
  insight?: string;                 // AI insight about why they matter now
  linkedIn?: string;
  masterPersonId?: number;
}

const bondConfig = {
  strong: { label: "Strong bond", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
  warm:   { label: "Warm connection", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" },
  cold:   { label: "Fading — act soon", color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
  new:    { label: "New connection", color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.25)" },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = [
  ["#6366f1", "#8b5cf6"],
  ["#059669", "#10b981"],
  ["#dc2626", "#ef4444"],
  ["#0284c7", "#0ea5e9"],
  ["#7c3aed", "#a78bfa"],
];

function avatarGradient(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function ContactCard({
  name,
  role,
  company,
  relationshipContext,
  lastInteraction,
  mutualConnections,
  bondStrength = "warm",
  actionItems = [],
  insight,
  masterPersonId,
}: ContactCardProps) {
  const bond = bondConfig[bondStrength];
  const [checks, setChecks] = useState<boolean[]>(actionItems.map(() => false));
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [grads] = useState(() => avatarGradient(name));

  const handleAddToOutcome = async () => {
    if (adding || added) return;
    setAdding(true);
    try {
      let personId = masterPersonId;
      if (!personId) {
        const results = await searchPersons(name, 1);
        if (results.items.length > 0) {
          personId = results.items[0].master_person_id;
        }
      }
      await createOutcome({
        copilot_mode: "outcome",
        request_panel_title: `Connect with ${name} — ${role} at ${company}`,
        request_context: [relationshipContext, insight].filter(Boolean).join("\n"),
        ...(personId ? { master_person_id: personId } : {}),
      });
      setAdded(true);
    } catch (err) {
      console.error("Failed to add to outcome:", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #0f0f1a 0%, #13131f 100%)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
        borderRadius: "16px",
        padding: "20px",
        margin: "4px 0",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 4px 24px rgba(99,102,241,0.07)",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "16px" }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Avatar name={name} size={44} borderRadius="12px" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "12px",
              boxShadow: `0 4px 12px ${grads[0]}44`,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8f0", letterSpacing: "-0.01em" }}>
              {name}
            </span>
            <div
              style={{
                background: bond.bg,
                border: `1px solid ${bond.border}`,
                borderRadius: "100px",
                padding: "1px 8px",
                fontSize: "10px",
                fontWeight: 600,
                color: bond.color,
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >
              {bond.label}
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
            {role} · {company}
          </div>
          <div style={{ display: "flex", gap: "14px", marginTop: "6px" }}>
            {lastInteraction && (
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                🕐 {lastInteraction}
              </span>
            )}
            {mutualConnections !== undefined && (
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                🔗 {mutualConnections} mutual
              </span>
            )}
          </div>
        </div>
      </div>

      {/* How you know them */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px",
          padding: "11px 14px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: "rgba(129,140,248,0.75)",
            marginBottom: "5px",
          }}
        >
          🤝 Relationship context
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: 1.55 }}>
          {relationshipContext}
        </div>
      </div>

      {/* AI Insight */}
      {insight && (
        <div
          style={{
            background: "rgba(99,102,241,0.07)",
            borderLeft: "3px solid rgba(99,102,241,0.45)",
            borderRadius: "0 10px 10px 0",
            padding: "10px 12px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "rgba(129,140,248,0.65)",
              marginBottom: "4px",
            }}
          >
            ✨ Orbiter insight
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}>
            {insight}
          </div>
        </div>
      )}

      {/* Action checklist */}
      {actionItems.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "rgba(129,140,248,0.65)",
              marginBottom: "8px",
            }}
          >
            📋 Suggested actions
          </div>
          <CheckBoxGroup variant="clear" style={{ gap: "4px" }}>
            {actionItems.map((item, i) => (
              <CheckBoxItem
                key={i}
                label={item}
                checked={checks[i]}
                onChange={(v) => setChecks((prev) => prev.map((c, j) => j === i ? v : c))}
              />
            ))}
          </CheckBoxGroup>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          paddingTop: "12px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={handleAddToOutcome}
          disabled={adding}
          style={{
            flex: 2,
            padding: "8px 0",
            background: added
              ? "rgba(52,211,153,0.1)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: added ? "1px solid rgba(52,211,153,0.3)" : "none",
            borderRadius: "9px",
            color: added ? "#34d399" : "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: adding ? "wait" : "pointer",
            transition: "all 0.2s ease",
            opacity: adding ? 0.7 : 1,
          }}
        >
          {added ? "Added to Outcome" : adding ? "Adding..." : "+ Add to Outcome"}
        </button>
        <button
          style={{
            flex: 1,
            padding: "8px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Message
        </button>
        <button
          style={{
            flex: 1,
            padding: "8px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Schedule
        </button>
      </div>
    </div>
  );
}
