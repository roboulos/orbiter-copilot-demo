"use client";

import { useState } from "react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  summary: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  dispatching?: boolean;
}

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  summary,
  title = "Ready to dispatch?",
  confirmText = "Proceed",
  cancelText = "Cancel",
  dispatching = false,
}: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dispatching ? undefined : onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 10000,
          animation: "backdropFadeIn 0.2s ease both",
          cursor: dispatching ? "default" : "pointer",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(480px, 90vw)",
          zIndex: 10001,
          animation: "modalSlideUp 0.28s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <div
          style={{
            background: "linear-gradient(160deg, #0d0d18 0%, #0a0a13 100%)",
            border: "1px solid rgba(99,102,241,0.22)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 32px 96px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top shimmer */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)",
          }} />

          {/* Header */}
          <div style={{
            padding: "24px 24px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            <h3 style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: "#e8e8f0",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              {dispatching ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite" }}>⚡</span>
                  Dispatching...
                </>
              ) : (
                <>
                  ⚡ {title}
                </>
              )}
            </h3>
          </div>

          {/* Body */}
          <div style={{
            padding: "20px 24px",
            maxHeight: "400px",
            overflowY: "auto",
          }}>
            {dispatching ? (
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "20px 0",
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "3px solid rgba(99,102,241,0.2)",
                  borderTopColor: "#6366f1",
                  animation: "spin 0.8s linear infinite",
                }} />
                <p style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "center",
                }}>
                  Agent working on your request...
                </p>
              </div>
            ) : (
              <div style={{
                background: "rgba(99,102,241,0.05)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: "12px",
                padding: "16px",
              }}>
                <p style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.75)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}>
                  {summary}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {!dispatching && (
            <div style={{
              padding: "16px 24px 24px",
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
            }}>
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s ease",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(99,102,241,0.55)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(99,102,241,0.4)";
                }}
              >
                {confirmText}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
