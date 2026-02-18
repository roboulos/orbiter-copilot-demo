"use client";

interface LeverageLoopCardProps {
  trigger: string;          // what happened / the signal
  opportunity: string;      // what this could unlock
  suggestedAction: string;  // the specific action to take
  suggestedMessage: string; // draft message to send
  targetPerson: string;     // who to reach out to
  urgency: "high" | "medium" | "low";
}

const urgencyColors = {
  high: { bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.3)", text: "#f87171" },
  medium: { bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.3)", text: "#fbbf24" },
  low: { bg: "rgba(99, 102, 241, 0.1)", border: "rgba(99, 102, 241, 0.3)", text: "#818cf8" },
};

export function LeverageLoopCard({
  trigger,
  opportunity,
  suggestedAction,
  suggestedMessage,
  targetPerson,
  urgency = "medium",
}: LeverageLoopCardProps) {
  const colors = urgencyColors[urgency] || urgencyColors.medium;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #13131f 100%)",
        border: "1px solid rgba(99, 102, 241, 0.25)",
        borderRadius: "16px",
        padding: "20px",
        margin: "8px 0",
        boxShadow: "0 4px 32px rgba(99,102,241,0.08)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "white",
          }}
        >
          ⚡ Leverage Loop
        </div>
        <div
          style={{
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: "100px",
            padding: "3px 10px",
            fontSize: "11px",
            fontWeight: 600,
            color: colors.text,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {urgency} urgency
        </div>
      </div>

      {/* Trigger Signal */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: "6px" }}>
          🔔 Signal Detected
        </div>
        <div style={{ fontSize: "14px", color: "#e8e8f0", lineHeight: 1.5, fontWeight: 500 }}>
          {trigger}
        </div>
      </div>

      {/* Opportunity */}
      <div
        style={{
          background: "rgba(99,102,241,0.08)",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "14px",
          borderLeft: "3px solid rgba(99,102,241,0.5)",
        }}
      >
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: "4px" }}>
          What this could unlock
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
          {opportunity}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
        <LoopField label="Reach out to" value={targetPerson} icon="👤" />
        <LoopField label="Suggested action" value={suggestedAction} icon="🎯" />
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: "10px",
            padding: "12px 14px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: "6px" }}>
            💬 Draft message
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.6,
              fontStyle: "italic",
              borderLeft: "2px solid rgba(99,102,241,0.3)",
              paddingLeft: "10px",
            }}
          >
            "{suggestedMessage}"
          </div>
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
          style={{
            flex: 1,
            padding: "8px 0",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ⚡ Take Action
        </button>
        <button
          style={{
            flex: 1,
            padding: "8px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
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

function LoopField({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: "8px",
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: "4px" }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  );
}
