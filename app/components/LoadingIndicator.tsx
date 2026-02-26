"use client";

import { useThreadState } from "@crayonai/react-core";

export function LoadingIndicator() {
  const { isRunning, messages } = useThreadState();

  if (!isRunning) return null;

  const lastUserMessage = messages
    .filter(m => m.role === "user")
    .slice(-1)[0];

  const getLoadingMessage = () => {
    if (!lastUserMessage) return "Thinking";

    const msg = typeof lastUserMessage.message === "string"
      ? lastUserMessage.message.toLowerCase()
      : "";

    if (msg.includes("investor") || msg.includes("funding")) {
      return "Finding connections";
    }
    if (msg.includes("meeting") || msg.includes("prep")) {
      return "Preparing context";
    }

    return "Thinking";
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 18px",
        maxWidth: "280px",
        fontFamily: "Inter, -apple-system, sans-serif",
        animation: "fadeUp 0.25s ease both",
      }}
    >
      {/* Three pulsing dots */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "rgba(139,92,246,0.7)",
              animation: `typingDot 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <div style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.45)",
        fontWeight: 500,
        letterSpacing: "-0.01em",
      }}>
        {getLoadingMessage()}
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% {
            opacity: 0.3;
            transform: scale(0.85);
          }
          30% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
