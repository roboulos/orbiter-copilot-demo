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
    bg: "rgba(239, 68, 68, 0.08)",
    border: "rgba(239, 68, 68, 0.28)",
    text: "#f87171",
    dot: "#ef4444",
    label: "Act today",
    icon: "🔴",
  },
  medium: {
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.28)",
    text: "#fbbf24",
    dot: "#f59e0b",
    label: "Act this week",
    icon: "🟡",
  },
  low: {
    bg: "rgba(99, 102, 241, 0.08)",
    border: "rgba(99, 102, 241, 0.28)",
    text: "#818cf8",
    dot: "#6366f1",
    label: "Act this month",
    icon: "🟢",
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

  const handleSend = async () => {
    if (sending || sent) return;
    setSending(true);
    try {
      let personId = masterPersonId;
      if (!personId) {
        const name = targetPerson.split("—")[0].trim();
        const results = await searchPersons(name, 1);
        if (results.items.length > 0) {
          personId = results.items[0].master_person_id;
        }
      }
      if (!personId) {
        console.error("Could not resolve person for leverage loop");
        setSending(false);
        return;
      }
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

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)",
        border: `1px solid ${sent ? "rgba(52,211,153,0.3)" : "rgba(99, 102, 241, 0.22)"}`,
        borderRadius: "16px",
        padding: "20px",
        margin: "8px 0",
        boxShadow: "0 4px 32px rgba(99,102,241,0.07)",
        fontFamily: "Inter, sans-serif",
        transition: "border-color 0.3s ease",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              borderRadius: "7px",
              padding: "4px 11px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "white",
            }}
          >
            ⚡ Leverage Loop
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: "100px",
            padding: "3px 10px",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: cfg.dot,
              boxShadow: `0 0 6px ${cfg.dot}`,
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: cfg.text,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Signal Detected */}
      <div style={{ marginBottom: "14px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(99,102,241,0.65)",
            marginBottom: "6px",
          }}
        >
          🔔 Signal from your network
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#e8e8f0",
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          {trigger}
        </div>
      </div>

      {/* Opportunity callout */}
      <div
        style={{
          background: "rgba(99,102,241,0.07)",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "14px",
          borderLeft: "3px solid rgba(99,102,241,0.45)",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(99,102,241,0.65)",
            marginBottom: "5px",
          }}
        >
          What this unlocks
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>
          {opportunity}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar name={targetPerson.split("—")[0].trim()} size={28} borderRadius="8px" />
          <div style={{ flex: 1 }}>
            <LoopField label="Reach out to" value={targetPerson} icon="👤" />
          </div>
        </div>
        <LoopField label="Suggested action" value={suggestedAction} icon="🎯" />

        {/* Draft message — editable */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "10px",
            padding: "12px 14px",
            border: editingMsg ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)",
            transition: "border-color 0.15s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgba(99,102,241,0.65)",
              }}
            >
              💬 Draft message
            </div>
            <button
              onClick={() => setEditingMsg(!editingMsg)}
              style={{
                background: "none",
                border: "none",
                color: "rgba(99,102,241,0.6)",
                fontSize: "11px",
                cursor: "pointer",
                padding: "0",
                fontFamily: "Inter, sans-serif",
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
                color: "rgba(255,255,255,0.78)",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                resize: "vertical",
                lineHeight: 1.6,
                padding: 0,
                boxSizing: "border-box",
              }}
            />
          ) : (
            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.65,
                fontStyle: "italic",
                borderLeft: "2px solid rgba(99,102,241,0.25)",
                paddingLeft: "10px",
              }}
            >
              "{message}"
            </div>
          )}
        </div>
      </div>

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
          onClick={handleSend}
          disabled={sending}
          style={{
            flex: 2,
            padding: "9px 0",
            background: sent
              ? "rgba(52,211,153,0.1)"
              : "linear-gradient(135deg, #4f46e5, #7c3aed)",
            border: sent ? "1px solid rgba(52,211,153,0.3)" : "none",
            borderRadius: "9px",
            color: sent ? "#34d399" : "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: sending ? "wait" : "pointer",
            transition: "all 0.2s ease",
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sent ? "Sent via Orbiter" : sending ? "Sending..." : "Send Message"}
        </button>
        <button
          onClick={() => {
            if (navigator.clipboard) navigator.clipboard.writeText(message);
          }}
          style={{
            flex: 1,
            padding: "9px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Copy
        </button>
        <button
          style={{
            flex: 1,
            padding: "9px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Snooze
        </button>
      </div>
    </div>
  );
}

function LoopField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "9px",
        padding: "10px 12px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(99,102,241,0.65)",
          marginBottom: "5px",
        }}
      >
        {icon} {label}
      </div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  );
}
