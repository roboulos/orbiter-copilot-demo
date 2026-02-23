"use client";

import { useState, useEffect } from "react";

interface WaitingRoomProps {
  title: string;
  description?: string;
  status: "pending" | "running" | "complete" | "error";
  progress?: number; // 0-100
  elapsedSeconds?: number;
  estimatedSeconds?: number;
  currentStep?: string;
  onCancel?: () => void;
  onViewResults?: () => void;
}

/**
 * WaitingRoom - For long-running agent processes (2-5+ minutes)
 * Shows observability into what's happening without "showing how sausage is made"
 */
export function WaitingRoom({
  title,
  description,
  status,
  progress = 0,
  elapsedSeconds = 0,
  estimatedSeconds,
  currentStep,
  onCancel,
  onViewResults,
}: WaitingRoomProps) {
  const [elapsed, setElapsed] = useState(elapsedSeconds);

  useEffect(() => {
    if (status === "running") {
      const interval = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const statusConfig = {
    pending: {
      color: "rgba(251,191,36,0.8)",
      glow: "rgba(251,191,36,0.4)",
      bgColor: "rgba(251,191,36,0.08)",
      label: "Queued",
    },
    running: {
      color: "rgba(99,102,241,0.9)",
      glow: "rgba(99,102,241,0.5)",
      bgColor: "rgba(99,102,241,0.08)",
      label: "Running",
    },
    complete: {
      color: "rgba(52,211,153,0.9)",
      glow: "rgba(52,211,153,0.5)",
      bgColor: "rgba(52,211,153,0.08)",
      label: "Complete",
    },
    error: {
      color: "rgba(248,113,113,0.9)",
      glow: "rgba(248,113,113,0.5)",
      bgColor: "rgba(248,113,113,0.08)",
      label: "Error",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      style={{
        maxWidth: "540px",
        margin: "0 auto",
        padding: "28px",
        background: "linear-gradient(145deg, rgba(20,20,30,0.95), rgba(15,15,25,0.95))",
        backdropFilter: "blur(32px)",
        border: `1px solid ${config.color.replace("0.9", "0.3").replace("0.8", "0.3")}`,
        borderRadius: "20px",
        boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 24px ${config.glow}`,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "24px" }}>
        {/* Status indicator orb */}
        <div style={{ position: "relative", width: "48px", height: "48px", flexShrink: 0 }}>
          <div
            style={{
              position: "absolute",
              inset: "-6px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
              animation: status === "running" ? "pulseGlow 2s ease-in-out infinite" : "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${config.color}, ${config.color.replace("0.9", "0.7").replace("0.8", "0.6")})`,
              boxShadow: `0 4px 16px ${config.glow}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            {status === "running" && "⚙️"}
            {status === "pending" && "⏳"}
            {status === "complete" && "✓"}
            {status === "error" && "!"}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#e8e8f0",
              marginBottom: "6px",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h3>
          {description && (
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, margin: 0 }}>
              {description}
            </p>
          )}
        </div>

        {/* Status badge */}
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            background: config.bgColor,
            border: `1px solid ${config.color.replace("0.9", "0.3").replace("0.8", "0.3")}`,
            fontSize: "11px",
            fontWeight: 600,
            color: config.color,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {config.label}
        </div>
      </div>

      {/* Progress bar */}
      {status === "running" && progress > 0 && (
        <div
          style={{
            height: "6px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "3px",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${config.color}, ${config.color.replace("0.9", "0.7")})`,
              borderRadius: "3px",
              transition: "width 0.3s ease",
              boxShadow: `0 0 8px ${config.glow}`,
            }}
          />
        </div>
      )}

      {/* Current step */}
      {currentStep && status === "running" && (
        <div
          style={{
            padding: "14px 16px",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Current Step
          </div>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
            {currentStep}
          </div>
        </div>
      )}

      {/* Time display */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
            Elapsed
          </div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#e8e8f0", fontVariantNumeric: "tabular-nums" }}>
            {formatTime(elapsed)}
          </div>
        </div>
        {estimatedSeconds && (
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>
              Estimated
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
              {formatTime(estimatedSeconds)}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px" }}>
        {status === "complete" && onViewResults && (
          <button
            onClick={onViewResults}
            style={{
              flex: 1,
              padding: "12px 20px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #52d396, #34d399)",
              border: "1px solid rgba(52,211,153,0.4)",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            View Results
          </button>
        )}
        
        {status === "running" && onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
