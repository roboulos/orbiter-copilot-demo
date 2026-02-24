"use client";

import { useState } from "react";

/**
 * Final dispatch ready card - shows summary and triggers dispatch modal
 * This is what backend should return instead of interview_card at confirm stage
 */

interface DispatchReadyCardProps {
  summary: string;
  personName: string;
  personId: number;
  outcome: string;
  constraints?: string[];
  onDispatch: (data: {
    personId: number;
    personName: string;
    outcome: string;
    constraints?: string[];
    description: string;
  }) => void;
}

export function DispatchReadyCard({
  summary,
  personName,
  personId,
  outcome,
  constraints,
  onDispatch,
}: DispatchReadyCardProps) {
  const [isDispatching, setIsDispatching] = useState(false);

  const handleDispatch = () => {
    if (!isDispatching) {
      setIsDispatching(true);
      onDispatch({
        personId,
        personName,
        outcome,
        constraints,
        description: summary,
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.08))",
        border: "2px solid rgba(59,130,246,0.4)",
        borderRadius: "20px",
        padding: "32px",
        margin: "24px 0",
        boxShadow: "0 8px 32px rgba(59,130,246,0.2), 0 0 0 1px rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Icon + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
          }}
        >
          ✨
        </div>
        <div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
              marginBottom: "4px",
            }}
          >
            Ready to Dispatch
          </div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
            Review and confirm your request
          </div>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          color: "rgba(255,255,255,0.9)",
          marginBottom: "24px",
          padding: "20px",
          background: "rgba(0,0,0,0.2)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {summary}
      </div>

      {/* Details */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "12px",
          }}
        >
          Request Details
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>👤</span>
            <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.9)" }}>{personName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🎯</span>
            <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.9)" }}>{outcome}</span>
          </div>
          {constraints && constraints.length > 0 && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ fontSize: "16px", marginTop: "2px" }}>📋</span>
              <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.9)" }}>
                {constraints.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Button */}
      <button
        onClick={handleDispatch}
        disabled={isDispatching}
        style={{
          width: "100%",
          padding: "16px 24px",
          background: isDispatching
            ? "rgba(99,102,241,0.5)"
            : "linear-gradient(135deg, #3b82f6, #6366f1)",
          border: "none",
          borderRadius: "12px",
          color: "white",
          fontSize: "16px",
          fontWeight: 700,
          cursor: isDispatching ? "not-allowed" : "pointer",
          boxShadow: isDispatching
            ? "none"
            : "0 4px 16px rgba(59,130,246,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
          transition: "all 0.3s",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
        onMouseEnter={(e) => {
          if (!isDispatching) {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 8px 24px rgba(59,130,246,0.5), 0 0 0 1px rgba(255,255,255,0.15)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 16px rgba(59,130,246,0.4), 0 0 0 1px rgba(255,255,255,0.1)";
        }}
      >
        {isDispatching ? "Dispatching..." : "✓ Confirm & Dispatch"}
      </button>

      {/* Helper text */}
      <div
        style={{
          marginTop: "16px",
          fontSize: "13px",
          color: "rgba(255,255,255,0.5)",
          textAlign: "center",
        }}
      >
        This will analyze your network and take 2-5 minutes
      </div>
    </div>
  );
}
