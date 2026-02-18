"use client";

import { useState } from "react";
import { Steps, StepsItem } from "@crayonai/react-ui";
import { Avatar } from "./Avatar";

interface SerendipityCardProps {
  personA: string;          // person in your network
  personARole: string;
  personACompany: string;
  personB: string;          // suggested connection for personA
  personBRole: string;
  personBCompany: string;
  whyTheyMatch: string;     // the serendipitous insight
  sharedContext: string[];  // 2-3 things they have in common
  suggestedIntro: string;   // draft intro message you could send
  confidence: "high" | "medium" | "speculative";
}

const confidenceConfig = {
  high:        { label: "High resonance", color: "#34d399", dot: "#10b981" },
  medium:      { label: "Good match", color: "#fbbf24", dot: "#f59e0b" },
  speculative: { label: "Moonshot match", color: "#a78bfa", dot: "#8b5cf6" },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function SerendipityCard({
  personA,
  personARole,
  personACompany,
  personB,
  personBRole,
  personBCompany,
  whyTheyMatch,
  sharedContext = [],
  suggestedIntro,
  confidence = "medium",
}: SerendipityCardProps) {
  const cfg = confidenceConfig[confidence];
  const [introMsg, setIntroMsg] = useState(suggestedIntro);
  const [editingIntro, setEditingIntro] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #0f0f1a 0%, #13131f 100%)",
        border: "1px solid rgba(139, 92, 246, 0.22)",
        borderRadius: "16px",
        padding: "20px",
        margin: "4px 0",
        fontFamily: "Inter, sans-serif",
        boxShadow: "0 4px 24px rgba(139,92,246,0.07)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "50%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              borderRadius: "7px",
              padding: "4px 11px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "white",
            }}
          >
            ✨ Serendipity
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: cfg.dot,
              boxShadow: `0 0 8px ${cfg.dot}`,
            }}
          />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* People matcher */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {/* Person A */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ margin: "0 auto 6px", width: 40, display: "flex", justifyContent: "center" }}>
            <Avatar name={personA} size={40} borderRadius="50%" style={{ boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }} />
          </div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8e8f0" }}>{personA}</div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>{personARole}</div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{personACompany}</div>
        </div>

        {/* Spark connector */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div style={{ fontSize: "20px" }}>✨</div>
          <div
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(139,92,246,0.6)",
            }}
          >
            Should meet
          </div>
        </div>

        {/* Person B */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ margin: "0 auto 6px", width: 40, display: "flex", justifyContent: "center" }}>
            <Avatar name={personB} size={40} borderRadius="50%" style={{ boxShadow: "0 4px 12px rgba(16,185,129,0.35)" }} />
          </div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8e8f0" }}>{personB}</div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>{personBRole}</div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{personBCompany}</div>
        </div>
      </div>

      {/* Why they match */}
      <div
        style={{
          background: "rgba(139,92,246,0.07)",
          borderLeft: "3px solid rgba(139,92,246,0.4)",
          borderRadius: "0 10px 10px 0",
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
            color: "rgba(167,139,250,0.7)",
            marginBottom: "5px",
          }}
        >
          Why Orbiter surfaced this
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>
          {whyTheyMatch}
        </div>
      </div>

      {/* Shared context steps */}
      {sharedContext.length > 0 && (
        <div style={{ marginBottom: "14px" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "rgba(167,139,250,0.65)",
              marginBottom: "10px",
            }}
          >
            What they share
          </div>
          <Steps>
            {sharedContext.map((point, i) => (
              <StepsItem key={i} title={point} details="" number={i + 1} />
            ))}
          </Steps>
        </div>
      )}

      {/* Draft intro message */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "10px",
          padding: "12px 14px",
          border: editingIntro ? "1px solid rgba(139,92,246,0.3)" : "1px solid rgba(255,255,255,0.06)",
          marginBottom: "14px",
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
              color: "rgba(167,139,250,0.65)",
            }}
          >
            💬 Draft intro you can send
          </div>
          <button
            onClick={() => setEditingIntro(!editingIntro)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(139,92,246,0.6)",
              fontSize: "11px",
              cursor: "pointer",
              padding: 0,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {editingIntro ? "Done" : "Edit"}
          </button>
        </div>

        {editingIntro ? (
          <textarea
            value={introMsg}
            onChange={(e) => setIntroMsg(e.target.value)}
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
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.65,
              fontStyle: "italic",
              borderLeft: "2px solid rgba(139,92,246,0.25)",
              paddingLeft: "10px",
            }}
          >
            "{introMsg}"
          </div>
        )}
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
          onClick={() => setSent(true)}
          style={{
            flex: 2,
            padding: "9px 0",
            background: sent
              ? "rgba(52,211,153,0.1)"
              : "linear-gradient(135deg, #7c3aed, #a855f7)",
            border: sent ? "1px solid rgba(52,211,153,0.3)" : "none",
            borderRadius: "9px",
            color: sent ? "#34d399" : "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {sent ? "✓ Intro Sent" : "✨ Make the Intro"}
        </button>
        <button
          onClick={() => {
            if (navigator.clipboard) navigator.clipboard.writeText(introMsg);
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
          Skip
        </button>
      </div>
    </div>
  );
}
