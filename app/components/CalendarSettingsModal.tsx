"use client";

import CalendarSettings from "./CalendarSettings";
import type { CalendarConnection } from "@/app/lib/calendar";

interface CalendarSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (connection: CalendarConnection) => void;
}

export default function CalendarSettingsModal({
  isOpen,
  onClose,
  onSuccess,
}: CalendarSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 1000,
          animation: "fadeIn 0.2s ease both",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          zIndex: 1001,
          maxWidth: "640px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          animation: "scaleIn 0.2s ease both",
        }}
      >
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute",
              right: "16px",
              top: "16px",
              background: "rgba(0,0,0,0.05)",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#666",
              transition: "all 0.15s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = "#333";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.05)";
              (e.currentTarget as HTMLButtonElement).style.color = "#666";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <CalendarSettings
            onClose={onClose}
            onSuccess={(connection) => {
              if (onSuccess) {
                onSuccess(connection);
              }
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}
