"use client";

import { useState } from "react";
import { CheckBoxGroup, CheckBoxItem } from "@crayonai/react-ui";
import { Avatar } from "./Avatar";
import { createOutcome, searchPersons } from "../lib/xano";

interface ContactCardProps {
  name: string;
  role: string;
  company: string;
  relationshipContext: string;
  lastInteraction?: string;
  mutualConnections?: number;
  bondStrength: "strong" | "warm" | "cold" | "new";
  actionItems?: string[];
  insight?: string;
  linkedIn?: string;
  masterPersonId?: number;
}

const bondConfig = {
  strong: {
    label: "Strong bond",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.28)",
    glow: "rgba(52,211,153,0.3)",
    pct: 90,
    cardAccent: "rgba(52,211,153,0.12)",
  },
  warm: {
    label: "Warm connection",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.28)",
    glow: "rgba(251,191,36,0.3)",
    pct: 65,
    cardAccent: "rgba(251,191,36,0.06)",
  },
  cold: {
    label: "Fading — act soon",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.28)",
    glow: "rgba(248,113,113,0.3)",
    pct: 25,
    cardAccent: "rgba(248,113,113,0.05)",
  },
  new: {
    label: "New connection",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.1)",
    border: "rgba(129,140,248,0.28)",
    glow: "rgba(129,140,248,0.3)",
    pct: 40,
    cardAccent: "rgba(129,140,248,0.07)",
  },
};

// Animated bond strength bar
function BondBar({ color, pct, glow }: { color: string; pct: number; glow: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
      <div style={{
        flex: 1,
        height: "3px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: "100px",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: "100px",
          boxShadow: `0 0 8px ${glow}`,
          transition: "width 1s cubic-bezier(0.22,1,0.36,1)",
          animation: "bondGrow 1.2s cubic-bezier(0.22,1,0.36,1) forwards",
        }} />
      </div>
      <span style={{ fontSize: "10px", color: color, fontWeight: 600, minWidth: 28, textAlign: "right" }}>
        {pct}%
      </span>
      <style>{`
        @keyframes bondGrow {
          from { width: 0%; }
          to   { width: ${pct}%; }
        }
      `}</style>
    </div>
  );
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

  const handleAddToOutcome = async () => {
    if (adding || added) return;
    setAdding(true);
    try {
      let personId = masterPersonId;
      if (!personId) {
        const results = await searchPersons(name, "network", 1);
        if (results.items.length > 0) personId = results.items[0].master_person_id;
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

  const completedCount = checks.filter(Boolean).length;

  return (
    <div
      className="orbiter-card-enter"
      style={{
        background: "linear-gradient(160deg, #0f0f1a 0%, #13131f 55%, #0c0c18 100%)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "18px",
        padding: "22px",
        margin: "6px 0",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 4px 32px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.03)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow top-right */}
      <div style={{
        position: "absolute", top: -50, right: -30,
        width: 140, height: 140, borderRadius: "50%",
        background: `radial-gradient(circle, ${bond.cardAccent} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Top shimmer */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "45%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.45), transparent)",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "18px" }}>
        {/* Avatar with ring */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Avatar name={name} size={48} borderRadius="14px"
            style={{ boxShadow: `0 4px 16px ${bond.glow}` }} />
          {bondStrength === "strong" && (
            <div style={{
              position: "absolute", inset: -2,
              borderRadius: "16px",
              border: `1px solid ${bond.color}44`,
              pointerEvents: "none",
            }} />
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "3px" }}>
            <span style={{
              fontSize: "16px", fontWeight: 700, color: "#e8e8f0",
              letterSpacing: "-0.015em",
            }}>
              {name}
            </span>
            <div style={{
              background: bond.bg,
              border: `1px solid ${bond.border}`,
              borderRadius: "100px",
              padding: "2px 9px",
              fontSize: "10px",
              fontWeight: 600,
              color: bond.color,
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}>
              {bond.label}
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.48)", lineHeight: 1.4 }}>
            {role}
            {company && <span style={{ color: "rgba(255,255,255,0.28)" }}> · {company}</span>}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "5px", flexWrap: "wrap" }}>
            {lastInteraction && (
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ opacity: 0.6 }}>🕐</span> {lastInteraction}
              </span>
            )}
            {mutualConnections !== undefined && (
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ opacity: 0.6 }}>🔗</span> {mutualConnections} mutual
              </span>
            )}
          </div>

          {/* Bond strength bar */}
          <BondBar color={bond.color} pct={bond.pct} glow={bond.glow} />
        </div>
      </div>

      {/* Relationship context */}
      <div style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "12px 14px",
        marginBottom: "14px",
      }}>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.09em",
          textTransform: "uppercase", color: "rgba(129,140,248,0.75)",
          marginBottom: "6px",
        }}>
          🤝 Relationship context
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
          {relationshipContext}
        </div>
      </div>

      {/* AI Insight */}
      {insight && (
        <div style={{
          background: "rgba(99,102,241,0.07)",
          borderLeft: "3px solid rgba(99,102,241,0.45)",
          borderRadius: "0 12px 12px 0",
          padding: "11px 14px",
          marginBottom: "14px",
        }}>
          <div style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.09em",
            textTransform: "uppercase", color: "rgba(129,140,248,0.65)",
            marginBottom: "5px",
          }}>
            ✨ Orbiter insight
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
            {insight}
          </div>
        </div>
      )}

      {/* Action checklist with progress */}
      {actionItems.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "8px",
          }}>
            <div style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.09em",
              textTransform: "uppercase", color: "rgba(129,140,248,0.65)",
            }}>
              📋 Suggested actions
            </div>
            {completedCount > 0 && (
              <span style={{
                fontSize: "10px", fontWeight: 600,
                color: "#34d399",
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.2)",
                borderRadius: "100px",
                padding: "1px 8px",
                animation: "successPop 0.3s ease",
              }}>
                {completedCount}/{actionItems.length} done
              </span>
            )}
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
      <div style={{
        paddingTop: "14px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        gap: "8px",
      }}>
        <button
          onClick={handleAddToOutcome}
          disabled={adding}
          className={added ? "orbiter-success-pop" : "orbiter-btn orbiter-btn-primary"}
          style={{
            flex: 2,
            padding: "10px 0",
            background: added
              ? "rgba(52,211,153,0.1)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: added ? "1px solid rgba(52,211,153,0.3)" : "none",
            borderRadius: "10px",
            color: added ? "#34d399" : "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: adding ? "wait" : "pointer",
            opacity: adding ? 0.7 : 1,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {added ? "✓ Added to Outcome" : adding ? "Adding…" : "+ Add to Outcome"}
        </button>
        <button
          className="orbiter-btn"
          style={{
            flex: 1,
            padding: "10px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Message
        </button>
        <button
          className="orbiter-btn"
          style={{
            flex: 1,
            padding: "10px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Schedule
        </button>
      </div>
    </div>
  );
}
