"use client";

import { useEffect } from "react";

interface SuccessToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export function SuccessToast({
  message,
  visible,
  onClose,
  duration = 4000,
}: SuccessToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 10002,
        animation: "slideInRight 0.3s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 20px",
          background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(22,163,74,0.12))",
          border: "1px solid rgba(34,197,94,0.35)",
          borderRadius: "14px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          minWidth: "320px",
          maxWidth: "480px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            flexShrink: 0,
          }}
        >
          ✅
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#86efac",
              marginBottom: "2px",
            }}
          >
            Success!
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.4,
            }}
          >
            {message}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.5)",
            fontSize: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: "inherit",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.15)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "rgba(255,255,255,0.5)";
          }}
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(34,197,94,0.2)",
          borderRadius: "0 0 14px 14px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #22c55e, #16a34a)",
            animation: `progressBar ${duration}ms linear`,
            transformOrigin: "left",
          }}
        />
      </div>

      <style>{`
        @keyframes progressBar {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}
