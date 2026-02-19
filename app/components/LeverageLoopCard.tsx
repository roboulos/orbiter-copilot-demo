"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";
import { createLeverageLoop, dispatchLeverageLoop, searchPersons } from "../lib/xano";

interface LeverageLoopCardProps {
  trigger: string;
  opportunity: string;
  suggestedAction: string;
  suggestedMessage: string;
  targetPerson: string;
  urgency: "high" | "medium" | "low";
  masterPersonId?: number;
}

const urgencyConfig = {
  high: {
    bg: "rgba(239,68,68,0.07)",
    border: "rgba(239,68,68,0.28)",
    text: "#f87171",
    dot: "#ef4444",
    glow: "rgba(239,68,68,0.35)",
    label: "Act today",
    cardBorder: "rgba(239,68,68,0.22)",
    pulse: true,
    badgeBg: "rgba(239,68,68,0.1)",
  },
  medium: {
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.25)",
    text: "#fbbf24",
    dot: "#f59e0b",
    glow: "rgba(245,158,11,0.3)",
    label: "Act this week",
    cardBorder: "rgba(99,102,241,0.22)",
    pulse: false,
    badgeBg: "rgba(245,158,11,0.08)",
  },
  low: {
    bg: "rgba(99,102,241,0.07)",
    border: "rgba(99,102,241,0.25)",
    text: "#818cf8",
    dot: "#6366f1",
    glow: "rgba(99,102,241,0.3)",
    label: "Act this month",
    cardBorder: "rgba(99,102,241,0.18)",
    pulse: false,
    badgeBg: "rgba(99,102,241,0.08)",
  },
};

export function LeverageLoopCard({
  trigger,
  opportunity,
  suggestedAction,
  suggestedMessage: initialMessage,
  targetPerson,
  urgency = "medium",
  masterPersonId,
}: LeverageLoopCardProps) {
  const cfg = urgencyConfig[urgency] || urgencyConfig.medium;
  const [message, setMessage] = useState(initialMessage);
  const [editingMsg, setEditingMsg] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    if (sending || sent) return;
    setSending(true);
    try {
      let personId = masterPersonId;
      if (!personId) {
        const name = targetPerson.split("—")[0].trim();
        const results = await searchPersons(name, 1);
        if (results.items.length > 0) personId = results.items[0].master_person_id;
      }
      if (!personId) { setSending(false); return; }
      const loop = await createLeverageLoop({
        master_person_id: personId,
        request_panel_title: trigger,
        request_context: `${opportunity}\n\nSuggested action: ${suggestedAction}\n\nDraft message: ${message}`,
      });
      await dispatchLeverageLoop(loop.id);
      setSent(true);
    } catch (err) {
      console.error("Failed to send leverage loop:", err);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`orbiter-card-enter${cfg.pulse && !sent ? " orbiter-urgent" : ""}`}
      style={{
        background: sent
          ? "linear-gradient(160deg, #0c1a14 0%, #0f1f17 100%)"
          : "linear-gradient(160deg, #0f0f1a 0%, #13131f 55%, #0c0c18 100%)",
        border: `1px solid ${sent ? "rgba(52,211,153,0.3)" : cfg.cardBorder}`,
        borderRadius: "18px",
        padding: "22px",
        margin: "6px 0",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.4s ease, background 0.4s ease",
        boxShadow: sent
          ? "0 4px 32px rgba(52,211,153,0.1)"
          : "0 4px 32px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Ambient glow — top right */}
      <div style={{
        position: "absolute", top: -50, right: -30,
        width: 160, height: 160, borderRadius: "50%",
        background: sent
          ? "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)"
          : `radial-gradient(circle, ${cfg.glow.replace("0.35", "0.1")} 0%, transparent 70%)`,
        pointerEvents: "none",
        transition: "background 0.4s ease",
      }} />

      {/* Top shimmer line */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "50%", height: "1px",
        background: sent
          ? "linear-gradient(90deg, transparent, rgba(52,211,153,0.5), transparent)"
          : "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
        transition: "background 0.4s ease",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div style={{
          background: sent
            ? "linear-gradient(135deg, #059669, #10b981)"
            : "linear-gradient(135deg, #3730a3, #4f46e5, #6d28d9)",
          borderRadius: "8px",
          padding: "4px 12px",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "white",
          boxShadow: sent
            ? "0 2px 10px rgba(16,185,129,0.3)"
            : "0 2px 12px rgba(79,70,229,0.4)",
          transition: "all 0.3s ease",
        }}>
          {sent ? "✓ Sent via Orbiter" : "⚡ Leverage Loop"}
        </div>

        {!sent && (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: cfg.badgeBg,
            border: `1px solid ${cfg.border}`,
            borderRadius: "100px",
            padding: "4px 10px",
          }}>
            <div style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: cfg.dot,
              boxShadow: `0 0 8px ${cfg.glow}`,
              animation: cfg.pulse ? "glowPulse 1.8s ease-in-out infinite" : "glowPulse 3s ease-in-out infinite",
            }} />
            <span style={{
              fontSize: "10px", fontWeight: 700,
              color: cfg.text,
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              {cfg.label}
            </span>
          </div>
        )}
      </div>

      {/* Signal detected */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "rgba(99,102,241,0.6)",
          marginBottom: "7px",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <div style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "#6366f1",
            boxShadow: "0 0 6px rgba(99,102,241,0.6)",
            animation: "glowPulse 2.5s ease-in-out infinite",
          }} />
          Signal from your network
        </div>
        <div style={{
          fontSize: "14px", fontWeight: 600,
          color: "#e8e8f0", lineHeight: 1.5,
          letterSpacing: "-0.01em",
        }}>
          {trigger}
        </div>
      </div>

      {/* Opportunity */}
      <div style={{
        background: "rgba(99,102,241,0.07)",
        borderLeft: "3px solid rgba(99,102,241,0.45)",
        borderRadius: "0 12px 12px 0",
        padding: "12px 16px",
        marginBottom: "16px",
      }}>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "rgba(99,102,241,0.65)",
          marginBottom: "5px",
        }}>
          What this unlocks
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.80)", lineHeight: 1.6 }}>
          {opportunity}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
        {/* Target person */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(255,255,255,0.025)",
          borderRadius: "10px",
          padding: "10px 12px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          <Avatar name={targetPerson.split("—")[0].trim()} size={30} borderRadius="8px" />
          <div>
            <div style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "rgba(99,102,241,0.65)",
              marginBottom: "3px",
            }}>
              👤 Reach out to
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.80)", lineHeight: 1.4 }}>
              {targetPerson}
            </div>
          </div>
        </div>

        {/* Suggested action */}
        <div style={{
          background: "rgba(255,255,255,0.025)",
          borderRadius: "10px",
          padding: "10px 12px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "rgba(99,102,241,0.65)",
            marginBottom: "5px",
          }}>
            🎯 Suggested action
          </div>
          <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.80)", lineHeight: 1.5 }}>
            {suggestedAction}
          </div>
        </div>

        {/* Draft message — editable */}
        <div style={{
          background: "rgba(255,255,255,0.025)",
          borderRadius: "10px",
          padding: "12px 14px",
          border: editingMsg
            ? "1px solid rgba(99,102,241,0.35)"
            : "1px solid rgba(255,255,255,0.05)",
          transition: "border-color 0.18s ease",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "8px",
          }}>
            <div style={{
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "rgba(99,102,241,0.65)",
            }}>
              💬 Draft message
            </div>
            <button
              onClick={() => setEditingMsg(!editingMsg)}
              style={{
                background: editingMsg ? "rgba(99,102,241,0.12)" : "none",
                border: editingMsg ? "1px solid rgba(99,102,241,0.25)" : "none",
                color: "rgba(99,102,241,0.7)",
                fontSize: "11px",
                fontWeight: 500,
                cursor: "pointer",
                padding: editingMsg ? "2px 8px" : "0",
                borderRadius: "6px",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.15s ease",
              }}
            >
              {editingMsg ? "Done" : "Edit"}
            </button>
          </div>

          {editingMsg ? (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                fontSize: "13px",
                color: "rgba(255,255,255,0.82)",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                resize: "vertical",
                lineHeight: 1.65,
                padding: 0,
                boxSizing: "border-box",
              }}
            />
          ) : (
            <div style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.68)",
              lineHeight: 1.7,
              fontStyle: "italic",
              borderLeft: "2px solid rgba(99,102,241,0.28)",
              paddingLeft: "11px",
            }}>
              "{message}"
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        paddingTop: "14px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        gap: "8px",
      }}>
        <button
          onClick={handleSend}
          disabled={sending}
          className={sent ? "orbiter-success-pop" : "orbiter-btn orbiter-btn-primary"}
          style={{
            flex: 2,
            padding: "10px 0",
            background: sent
              ? "rgba(52,211,153,0.1)"
              : "linear-gradient(135deg, #4f46e5, #7c3aed)",
            border: sent ? "1px solid rgba(52,211,153,0.3)" : "none",
            borderRadius: "10px",
            color: sent ? "#34d399" : "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: sending ? "wait" : "pointer",
            opacity: sending ? 0.7 : 1,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {sent ? "✓ Sent via Orbiter" : sending ? "Sending…" : "Send Message"}
        </button>
        <button
          onClick={handleCopy}
          className="orbiter-btn"
          style={{
            flex: 1,
            padding: "10px 0",
            background: copied ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.09)"}`,
            borderRadius: "10px",
            color: copied ? "#34d399" : "rgba(255,255,255,0.5)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          className="orbiter-btn"
          style={{
            flex: 1,
            padding: "10px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Snooze
        </button>
      </div>
    </div>
  );
}
