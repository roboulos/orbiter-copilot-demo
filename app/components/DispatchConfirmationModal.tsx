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
  const [hovered, setHovered] = useState(false);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 1000,
          animation: "backdropFadeIn 0.2s ease both",
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
          maxWidth: "520px",
          background: "linear-gradient(145deg, rgba(20,20,30,0.98), rgba(15,15,25,0.98))",
          backdropFilter: "blur(40px)",
          borderRadius: "24px",
          border: "1px solid rgba(99,102,241,0.3)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.2)",
          animation: "modalSlideUp 0.3s ease both",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)",
          }}
        />

        {/* Content */}
        <div style={{ padding: "32px" }}>
          {/* Icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 12L21 3L12 21L9 13.5L3 12Z" />
            </svg>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#e8e8f0",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            Ready to dispatch{personName ? ` for ${personName}` : ""}?
          </h3>

          {/* Beautified description */}
          <div
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "16px",
              padding: "18px 20px",
              marginBottom: "24px",
            }}
          >
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>

          {/* Info text */}
          <p
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.45)",
              marginBottom: "24px",
              lineHeight: 1.5,
            }}
          >
            This will activate agents to analyze your network and generate suggestions. Results will appear in your Outcomes view.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={onClose}
              disabled={isDispatching}
              style={{
                flex: 1,
                padding: "14px 24px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isDispatching ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                opacity: isDispatching ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isDispatching) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
              }}
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDispatching}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                flex: 1,
                padding: "14px 24px",
                borderRadius: "12px",
                background: isDispatching
                  ? "rgba(99,102,241,0.5)"
                  : hovered
                  ? "linear-gradient(135deg, #7c3aed, #6366f1)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "1px solid rgba(99,102,241,0.4)",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: isDispatching ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                transform: hovered && !isDispatching ? "translateY(-1px)" : "translateY(0)",
                boxShadow: hovered && !isDispatching
                  ? "0 8px 24px rgba(99,102,241,0.5)"
                  : "0 4px 16px rgba(99,102,241,0.4)",
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
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Dispatching...
                </>
              ) : (
                "Dispatch"
              )}
            </button>
          </div>
        </div>

        <style>{`
          @keyframes backdropFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes modalSlideUp {
            from { 
              opacity: 0;
              transform: translate(-50%, -48%);
            }
            to { 
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
