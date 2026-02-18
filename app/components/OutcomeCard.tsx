"use client";

interface OutcomeCardProps {
  goal: string;
  whyItMatters: string;
  idealHelper: string;
  timeframe: string;
  contextToShare: string;
  matchStrength?: "high" | "medium" | "building"; // optional signal strength
}

export function OutcomeCard({
  goal,
  whyItMatters,
  idealHelper,
  timeframe,
  contextToShare,
  matchStrength = "building",
}: OutcomeCardProps) {
  const strengthConfig = {
    high: { label: "Strong signals in your network", color: "#34d399", dot: "#10b981" },
    medium: { label: "Some signals detected", color: "#fbbf24", dot: "#f59e0b" },
    building: { label: "Scanning your network…", color: "#818cf8", dot: "#6366f1" },
  };
  const strength = strengthConfig[matchStrength] || strengthConfig.building;

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #0f0f1a 0%, #13131f 60%, #0f0f1a 100%)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        borderRadius: "16px",
        padding: "20px",
        margin: "4px 0",
        boxShadow: "0 4px 24px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.04)",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "8px",
              padding: "5px 12px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "white",
            }}
          >
            Outcome
          </div>
        </div>
        {/* Network scan status */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: strength.dot,
              boxShadow: `0 0 6px ${strength.dot}`,
            }}
          />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            {strength.label}
          </span>
        </div>
      </div>

      {/* Goal — the hero text */}
      <div style={{ marginBottom: "18px" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#e8e8f0",
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
          }}
        >
          {goal}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Field label="Why it matters" value={whyItMatters} accent="#818cf8" />
        <Field label="Ideal connector" value={idealHelper} accent="#818cf8" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <Field label="Timeframe" value={timeframe} accent="#818cf8" compact />
          <Field label="Context to share" value={contextToShare} accent="#818cf8" compact />
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
        <button
          style={{
            flex: 2,
            padding: "9px 0",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none",
            borderRadius: "9px",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}
        >
          ✓ Save Outcome
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
          Edit
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
          Share
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  accent,
  compact,
}: {
  label: string;
  value: string;
  accent: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: "10px",
        padding: compact ? "10px 12px" : "11px 14px",
        border: "1px solid rgba(255,255,255,0.05)",
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
      <div
        style={{
          fontSize: compact ? "12px" : "13px",
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1.55,
        }}
      >
        {value}
      </div>
    </div>
  );
}
