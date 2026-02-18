"use client";

interface OutcomeCardProps {
  goal: string;
  whyItMatters: string;
  idealHelper: string;
  timeframe: string;
  contextToShare: string;
}

export function OutcomeCard({
  goal,
  whyItMatters,
  idealHelper,
  timeframe,
  contextToShare,
}: OutcomeCardProps) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #13131a 0%, #1a1a2e 100%)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        borderRadius: "16px",
        padding: "20px",
        margin: "8px 0",
        boxShadow: "0 4px 24px rgba(99,102,241,0.1)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "white",
          }}
        >
          Outcome
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
          Ready for network matching
        </div>
      </div>

      {/* Goal */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#e8e8f0",
            lineHeight: 1.4,
          }}
        >
          {goal}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Field label="Why it matters" value={whyItMatters} />
        <Field label="Ideal helper" value={idealHelper} />
        <Field label="Timeframe" value={timeframe} />
        <Field label="Context to share" value={contextToShare} />
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "16px",
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
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ✓ Save Outcome
        </button>
        <button
          style={{
            flex: 1,
            padding: "8px 0",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.6)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: "8px",
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(99,102,241,0.8)",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  );
}
