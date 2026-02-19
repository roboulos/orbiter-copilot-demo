"use client";

import { useThreadActions, useThreadState } from "@crayonai/react-core";

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorCard({
  title = "Something went wrong",
  message,
  onRetry,
  onDismiss,
}: ErrorCardProps) {
  const { processMessage, setMessages } = useThreadActions();
  const { error, messages } = useThreadState();

  const displayMessage = message || error?.message || "An unexpected error occurred. Please try again.";

  const handleRetry = async () => {
    if (onRetry) {
      onRetry();
      return;
    }

    // Default retry: re-send last user message
    const lastUserMessage = messages
      .filter(m => m.role === "user")
      .slice(-1)[0];

    if (lastUserMessage && typeof lastUserMessage.message === "string") {
      await processMessage({ message: lastUserMessage.message });
    }
  };

  const handleStartOver = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      // Clear all messages and start fresh
      setMessages([]);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #1a0f0f 0%, #1f1313 60%, #180d0d 100%)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "16px",
        padding: "20px",
        margin: "6px 0",
        fontFamily: "Inter, sans-serif",
        maxWidth: "500px",
      }}
    >
      {/* Icon */}
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "12px",
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        marginBottom: "16px",
      }}>
        ⚠️
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: "16px",
        fontWeight: 700,
        color: "#ef4444",
        marginBottom: "8px",
        letterSpacing: "-0.01em",
      }}>
        {title}
      </h3>

      {/* Message */}
      <p style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.6)",
        lineHeight: 1.6,
        marginBottom: "20px",
      }}>
        {displayMessage}
      </p>

      {/* Actions */}
      <div style={{
        display: "flex",
        gap: "8px",
      }}>
        <button
          onClick={handleRetry}
          style={{
            flex: 1,
            padding: "10px 16px",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "transform 0.2s ease",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Try Again
        </button>

        <button
          onClick={handleStartOver}
          style={{
            padding: "10px 16px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.6)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "transform 0.2s ease",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
