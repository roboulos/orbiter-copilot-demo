"use client";

import { useThreadActions, useThreadState } from "@crayonai/react-core";

export function CancelButton() {
  const { onCancel } = useThreadActions();
  const { isRunning } = useThreadState();

  if (!isRunning) return null;

  return (
    <button
      onClick={onCancel}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        padding: "12px 20px",
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "12px",
        color: "#ef4444",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s ease",
        zIndex: 1000,
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        backdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.15)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.1)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span style={{ fontSize: "16px" }}>⏹</span>
      <span>Cancel</span>
    </button>
  );
}
