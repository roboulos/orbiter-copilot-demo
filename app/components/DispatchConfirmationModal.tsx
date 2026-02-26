"use client";

import { useState } from "react";

interface DispatchConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  description: string;
  personName?: string;
  isDispatching?: boolean;
}

export function DispatchConfirmationModal({
  open,
  onClose,
  onConfirm,
  description,
  personName,
  isDispatching = false,
}: DispatchConfirmationModalProps) {
  const [hoveredBtn, setHoveredBtn] = useState<"cancel" | "dispatch" | null>(null);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 1000,
          animation: "backdropFadeIn 0.15s ease both",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          width: "90%",
          maxWidth: "480px",
          background: "linear-gradient(160deg, rgba(18,18,28,0.98), rgba(12,12,20,0.98))",
          backdropFilter: "blur(40px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          animation: "modalSlideUp 0.25s cubic-bezier(0.22,1,0.36,1) both",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
          }}
        />

        {/* Content */}
        <div style={{ padding: "28px" }}>
          {/* Icon */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
              marginBottom: "10px",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            Ready to dispatch{personName ? ` for ${personName}` : ""}?
          </h3>

          {/* Description box */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px",
              padding: "16px 18px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
                margin: 0,
                letterSpacing: "-0.005em",
              }}
            >
              {description}
            </p>
          </div>

          {/* Info text */}
          <p
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "22px",
              lineHeight: 1.5,
            }}
          >
            Agents will analyze your network and generate suggestions. Results appear in Outcomes.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={onClose}
              disabled={isDispatching}
              onMouseEnter={() => setHoveredBtn("cancel")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "12px",
                background: hoveredBtn === "cancel"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: hoveredBtn === "cancel"
                  ? "rgba(255,255,255,0.8)"
                  : "rgba(255,255,255,0.55)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: isDispatching ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
                opacity: isDispatching ? 0.5 : 1,
              }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDispatching}
              onMouseEnter={() => setHoveredBtn("dispatch")}
              onMouseLeave={() => setHoveredBtn(null)}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: "12px",
                background: isDispatching
                  ? "rgba(99,102,241,0.3)"
                  : hoveredBtn === "dispatch"
                  ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                  : "linear-gradient(135deg, #6366f1, #7c3aed)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isDispatching ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
                transform: hoveredBtn === "dispatch" && !isDispatching
                  ? "translateY(-1px)"
                  : "translateY(0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isDispatching ? (
                <>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  Dispatching
                </>
              ) : (
                "Dispatch"
              )}
            </button>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
