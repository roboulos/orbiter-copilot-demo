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
        gap: "16px",
        padding: "18px 22px",
        background: "rgba(99,102,241,0.06)",
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: "16px",
        margin: "8px 0",
        fontFamily: "Inter, sans-serif",
        maxWidth: "420px",
      }}
    >
      {/* Premium glowy orb */}
      <div style={{ position: "relative", width: "32px", height: "32px", flexShrink: 0 }}>
        {/* Outer glow ring */}
        <div
          style={{
            position: "absolute",
            inset: "-8px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}
        />
        {/* Mid glow ring */}
        <div
          style={{
            position: "absolute",
            inset: "-4px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)",
            animation: "pulseGlow 2s ease-in-out 0.3s infinite",
          }}
        />
        {/* Core orb */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
            boxShadow: "0 0 20px rgba(99,102,241,0.6), inset 0 0 10px rgba(255,255,255,0.2)",
            animation: "pulseOrb 2s ease-in-out infinite",
          }}
        />
        {/* Shine highlight */}
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "8px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
            animation: "shimmer 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Loading text */}
      <div style={{
        fontSize: "14px",
        color: "rgba(255,255,255,0.75)",
        fontWeight: 500,
        letterSpacing: "-0.01em",
      }}>
        {getLoadingMessage()}
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.15);
          }
        }

        @keyframes pulseOrb {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }

        @keyframes shimmer {
          0%, 100% { 
            opacity: 0.4; 
          }
          50% { 
            opacity: 0.9; 
          }
        }
      `}</style>
    </div>
  );
}
