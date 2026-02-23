"use client";

interface DispatchPromptBannerProps {
  onDispatch: () => void;
  onDismiss: () => void;
  personName?: string;
}

/**
 * Floating banner that appears when dispatch intent is detected
 * Prompts user to dispatch the current conversation
 */
export function DispatchPromptBanner({ onDispatch, onDismiss, personName }: DispatchPromptBannerProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        maxWidth: "380px",
        background: "linear-gradient(145deg, rgba(99,102,241,0.95), rgba(139,92,246,0.95))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "16px",
        padding: "18px 20px",
        boxShadow: "0 12px 40px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
        zIndex: 9998,
        animation: "slideInUp 0.3s ease-out",
      }}
    >
      {/* Close button */}
      <button
        onClick={onDismiss}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
        }}
      >
        ×
      </button>

      {/* Icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M3 12L21 3L12 21L9 13.5L3 12Z" />
        </svg>
      </div>

      {/* Content */}
      <div style={{ marginBottom: "14px", paddingRight: "20px" }}>
        <h4
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "white",
            marginBottom: "6px",
            letterSpacing: "-0.01em",
          }}
        >
          Ready to dispatch{personName ? ` for ${personName}` : ""}?
        </h4>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          I detected you're ready to move forward. Click below to dispatch and activate your network.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onDispatch}
          style={{
            flex: 1,
            padding: "10px 18px",
            borderRadius: "10px",
            background: "white",
            border: "none",
            color: "#6366f1",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
          }}
        >
          Dispatch Now
        </button>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
