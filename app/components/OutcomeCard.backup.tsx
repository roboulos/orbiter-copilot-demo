"use client";

import { useState } from "react";
import { createOutcome } from "../lib/xano";

interface OutcomeCardProps {
  goal: string;
  whyItMatters: string;
  idealHelper: string;
  timeframe: string;
  contextToShare: string;
  matchStrength?: "high" | "medium" | "building";
  masterPersonId?: number;
}

export function OutcomeCard({
  goal: initialGoal,
  whyItMatters: initialWhy,
  idealHelper: initialHelper,
  timeframe: initialTimeframe,
  contextToShare: initialContext,
  matchStrength = "building",
  masterPersonId,
}: OutcomeCardProps) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [goal, setGoal] = useState(initialGoal);
  const [whyItMatters, setWhyItMatters] = useState(initialWhy);
  const [idealHelper, setIdealHelper] = useState(initialHelper);
  const [timeframe, setTimeframe] = useState(initialTimeframe);
  const [contextToShare, setContextToShare] = useState(initialContext);

  const strengthConfig = {
    high: { label: "Strong matches found", color: "#34d399", dot: "#10b981", glow: "rgba(52,211,153,0.3)" },
    medium: { label: "Some signals detected", color: "#fbbf24", dot: "#f59e0b", glow: "rgba(251,191,36,0.2)" },
    building: { label: "Scanning your network…", color: "#818cf8", dot: "#6366f1", glow: "rgba(99,102,241,0.3)" },
  };
  const strength = strengthConfig[matchStrength] || strengthConfig.building;

  const handleSave = () => {
    setEditing(false);
  };

  const handleSaveToOrbiter = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      await createOutcome({
        copilot_mode: "outcome",
        request_panel_title: goal,
        request_context: [whyItMatters, `Ideal connector: ${idealHelper}`, `Timeframe: ${timeframe}`, contextToShare].filter(Boolean).join("\n"),
        ...(masterPersonId ? { master_person_id: masterPersonId } : {}),
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save outcome:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="orbiter-card-enter"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: saved
          ? "linear-gradient(160deg, #0c1a14 0%, #0f1f17 60%, #0b1812 100%)"
          : "linear-gradient(160deg, #0f0f1a 0%, #13131f 60%, #0d0d18 100%)",
        border: `1px solid ${saved ? "rgba(52,211,153,0.35)" : hovered ? "rgba(99,102,241,0.45)" : "rgba(99, 102, 241, 0.28)"}`,
        borderRadius: "18px",
        padding: "22px",
        margin: "6px 0",
        boxShadow: saved
          ? "0 4px 24px rgba(52,211,153,0.1), inset 0 1px 0 rgba(255,255,255,0.04)"
          : hovered
          ? "0 0 0 1px rgba(99,102,241,0.4), 0 8px 32px rgba(0,0,0,0.4)"
          : "0 4px 24px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s ease",
      }}
    >
      {/* Top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "55%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${saved ? "rgba(52,211,153,0.5)" : "rgba(99,102,241,0.6)"}, transparent)`,
          transition: "background 0.3s ease",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              background: saved
                ? "linear-gradient(135deg, #059669, #10b981)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "7px",
              padding: "4px 11px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "white",
              transition: "background 0.3s ease",
            }}
          >
            {saved ? "✓ Outcome Saved" : "Outcome"}
          </div>
        </div>

        {/* Network scan pulse */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ position: "relative", width: 10, height: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {matchStrength === "building" && (
              <>
                <div style={{
                  position: "absolute", inset: -4,
                  borderRadius: "50%",
                  border: `1px solid ${strength.dot}44`,
                  animation: "scanPulse 2s ease-out infinite",
                }} />
                <div style={{
                  position: "absolute", inset: -7,
                  borderRadius: "50%",
                  border: `1px solid ${strength.dot}22`,
                  animation: "scanPulse 2s 0.4s ease-out infinite",
                }} />
              </>
            )}
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: strength.dot,
              boxShadow: `0 0 10px ${strength.glow}`,
              animation: "glowPulse 2.2s ease-in-out infinite",
            }} />
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>
            {strength.label}
          </span>
          <style>{`
            @keyframes scanPulse {
              0%   { transform: scale(1);   opacity: 0.8; }
              100% { transform: scale(2.5); opacity: 0; }
            }
          `}</style>
        </div>
      </div>

      {/* Goal — hero text */}
      <div style={{ marginBottom: "16px" }}>
        {editing ? (
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            style={{
              width: "100%",
              fontSize: "15px",
              fontWeight: 600,
              color: "#e8e8f0",
              lineHeight: 1.45,
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "8px",
              padding: "10px 12px",
              resize: "vertical",
              outline: "none",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.01em",
              boxSizing: "border-box",
            }}
            rows={2}
          />
        ) : (
          <div
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#e8e8f0",
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
            }}
          >
            {goal}
          </div>
        )}
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <EditableField
          label="Why it matters"
          value={whyItMatters}
          editing={editing}
          onChange={setWhyItMatters}
          accent="#818cf8"
        />
        <EditableField
          label="Ideal connector"
          value={idealHelper}
          editing={editing}
          onChange={setIdealHelper}
          accent="#818cf8"
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <EditableField
            label="Timeframe"
            value={timeframe}
            editing={editing}
            onChange={setTimeframe}
            accent="#818cf8"
            compact
            singleLine
          />
          <EditableField
            label="Context to share"
            value={contextToShare}
            editing={editing}
            onChange={setContextToShare}
            accent="#818cf8"
            compact
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "16px",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          gap: "8px",
        }}
      >
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="orbiter-btn"
              style={{
                flex: 2, padding: "10px 0",
                background: "linear-gradient(135deg, #059669, #10b981)",
                border: "none", borderRadius: "10px",
                color: "white", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "Inter, sans-serif",
              }}
            >
              ✓ Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="orbiter-btn"
              style={{
                flex: 1, padding: "10px 0",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "10px",
                color: "rgba(255,255,255,0.5)", fontSize: "12px",
                fontWeight: 500, cursor: "pointer", fontFamily: "Inter, sans-serif",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSaveToOrbiter}
              disabled={saving}
              className={saved ? "orbiter-success-pop" : "orbiter-btn orbiter-btn-primary"}
              style={{
                flex: 2, padding: "10px 0",
                background: saved
                  ? "rgba(52,211,153,0.12)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
                borderRadius: "10px",
                color: saved ? "#34d399" : "white",
                fontSize: "13px", fontWeight: 600,
                cursor: saving ? "wait" : "pointer",
                opacity: saving ? 0.7 : 1,
                fontFamily: "Inter, sans-serif", letterSpacing: "0.01em",
              }}
            >
              {saved ? "✓ Saved to Orbiter" : saving ? "Saving…" : "Save to Orbiter"}
            </button>
            {saved && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("orbiter:switch-tab", { detail: { tab: "Outcomes" } }))}
                style={{
                  padding: "10px 10px",
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.25)",
                  borderRadius: "10px",
                  color: "#34d399",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                View →
              </button>
            )}
            <button
              onClick={() => setEditing(true)}
              className="orbiter-btn"
              style={{
                flex: 1, padding: "10px 0",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "10px",
                color: "rgba(255,255,255,0.5)", fontSize: "12px",
                fontWeight: 500, cursor: "pointer", fontFamily: "Inter, sans-serif",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(
                    `Goal: ${goal}\nWhy it matters: ${whyItMatters}\nIdeal connector: ${idealHelper}\nTimeframe: ${timeframe}\nContext: ${contextToShare}`
                  );
                }
              }}
              style={{
                flex: 1,
                padding: "9px 0",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "9px",
                color: "rgba(255,255,255,0.55)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Share
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}

function EditableField({
  label,
  value,
  editing,
  onChange,
  accent,
  compact,
  singleLine,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  accent: string;
  compact?: boolean;
  singleLine?: boolean;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "10px",
        padding: compact ? "10px 12px" : "11px 14px",
        border: editing ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(255,255,255,0.05)",
        transition: "border-color 0.15s ease",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: accent,
          opacity: 0.75,
          marginBottom: "5px",
        }}
      >
        {label}
      </div>
      {editing ? (
        singleLine ? (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: "100%",
              fontSize: compact ? "12px" : "13px",
              color: "rgba(255,255,255,0.85)",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "Inter, sans-serif",
              padding: 0,
              boxSizing: "border-box",
            }}
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
            style={{
              width: "100%",
              fontSize: compact ? "12px" : "13px",
              color: "rgba(255,255,255,0.85)",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "Inter, sans-serif",
              resize: "vertical",
              padding: 0,
              lineHeight: 1.5,
              boxSizing: "border-box",
            }}
          />
        )
      ) : (
        <div
          style={{
            fontSize: compact ? "12px" : "13px",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.55,
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}
