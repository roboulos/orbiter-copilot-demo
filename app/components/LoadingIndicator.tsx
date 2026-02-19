"use client";

import { useThreadState } from "@crayonai/react-core";

export function LoadingIndicator() {
  const { isRunning, messages } = useThreadState();

  if (!isRunning) return null;

  // Determine what kind of loading message to show based on context
  const lastUserMessage = messages
    .filter(m => m.role === "user")
    .slice(-1)[0];

  const getLoadingMessage = () => {
    if (!lastUserMessage) return "Thinking...";

    const msg = typeof lastUserMessage.message === "string" 
      ? lastUserMessage.message.toLowerCase()
      : "";

    if (msg.includes("costa rica") || msg.includes("pacific") || msg.includes("region")) {
      return "Scanning your network for connections...";
    }
    if (msg.includes("investor") || msg.includes("funding")) {
      return "Finding warm introductions to investors...";
    }
    if (msg.includes("budget") || msg.includes("price")) {
      return "Analyzing market opportunities...";
    }
    
    return "Thinking...";
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 20px",
        background: "rgba(99,102,241,0.08)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "14px",
        margin: "6px 0",
        fontFamily: "Inter, sans-serif",
        maxWidth: "400px",
      }}
    >
      {/* Animated dots */}
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <div style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 500,
      }}>
        {getLoadingMessage()}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
