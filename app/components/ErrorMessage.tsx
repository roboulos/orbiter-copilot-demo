"use client";

import { useState } from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onRetry, onDismiss }: ErrorMessageProps) {
  const [hovered, setHovered] = useState<"retry" | "dismiss" | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        margin: "16px 0",
        background: "rgba(239,68,68,0.08)",
        border: "1px solid rgba(239,68,68,0.25)",
        borderRadius: "14px",
        animation: "fadeUp 0.3s ease both",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <div
          style={{
            fontSize: "18px",
            flexShrink: 0,
            marginTop: "2px",
          }}
        >
          ⚠️
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#fca5a5",
              marginBottom: "4px",
            }}
          >
            Something went wrong
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        </div>
      </div>

      {(onRetry || onDismiss) && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          {onDismiss && (
            <button
              onClick={onDismiss}
              onMouseEnter={() => setHovered("dismiss")}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background:
                  hovered === "dismiss"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.15s ease",
              }}
            >
              Dismiss
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              onMouseEnter={() => setHovered("retry")}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background:
                  hovered === "retry"
                    ? "rgba(239,68,68,0.25)"
                    : "rgba(239,68,68,0.18)",
                border: "1px solid rgba(239,68,68,0.35)",
                color: "#fca5a5",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                transition: "all 0.15s ease",
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
