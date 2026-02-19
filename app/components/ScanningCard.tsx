"use client";

import { useEffect, useState } from "react";

interface ScanningCardProps {
  title?: string;
  total_connections?: number;
  matches_found?: number;
  status?: string;
}

export function ScanningCard({
  title = "🔍 Scanning Your Network...",
  total_connections = 847,
  matches_found = 0,
  status = "Analyzing connections...",
}: ScanningCardProps) {
  const [animatedMatches, setAnimatedMatches] = useState(0);
  const [pulseScale, setPulseScale] = useState(1);

  // Animate the match counter
  useEffect(() => {
    if (matches_found > 0) {
      let current = 0;
      const increment = Math.ceil(matches_found / 20);
      const interval = setInterval(() => {
        current += increment;
        if (current >= matches_found) {
          setAnimatedMatches(matches_found);
          clearInterval(interval);
        } else {
          setAnimatedMatches(current);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [matches_found]);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale((prev) => (prev === 1 ? 1.1 : 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="orbiter-card-enter"
      style={{
        background: "linear-gradient(160deg, #0f0f1a 0%, #13131f 60%, #0d0d18 100%)",
        border: "1px solid rgba(99, 102, 241, 0.35)",
        borderRadius: "20px",
        padding: "32px",
        margin: "6px 0",
        boxShadow:
          "0 0 0 1px rgba(99,102,241,0.2), 0 8px 32px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
        maxWidth: "560px",
      }}
    >
      {/* Animated background gradient */}
      <div
        style={{
          position: "absolute",
          inset: -100,
          background:
            "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15), transparent 70%)",
          animation: "scanRotate 8s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)",
          animation: "glowPulse 2s ease-in-out infinite",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Title */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#e8e8f0",
            marginBottom: "24px",
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>

        {/* Radar Animation */}
        <div
          style={{
            width: "160px",
            height: "160px",
            margin: "0 auto 32px auto",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer ripples */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(99,102,241,0.3)",
              animation: "radarPulse 3s ease-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(99,102,241,0.2)",
              animation: "radarPulse 3s 0.5s ease-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid rgba(99,102,241,0.15)",
              animation: "radarPulse 3s 1s ease-out infinite",
            }}
          />

          {/* Center dot with pulse */}
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 0 24px rgba(99,102,241,0.6), 0 0 48px rgba(99,102,241,0.3)",
              transform: `scale(${pulseScale})`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
            }}
          >
            {/* Inner glow */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "white",
                opacity: 0.3,
                animation: "innerPulse 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Scanning line (rotating) */}
          <div
            style={{
              position: "absolute",
              width: "2px",
              height: "50%",
              background: "linear-gradient(to bottom, rgba(99,102,241,0.8), transparent)",
              top: "50%",
              left: "50%",
              transformOrigin: "top center",
              animation: "radarSweep 3s linear infinite",
            }}
          />
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Connections analyzed */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: "12px",
            }}
          >
            <span style={{ fontSize: "18px" }}>✓</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>
                Connections Analyzed
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#34d399" }}>
                {total_connections.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Matches found */}
          {matches_found > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: "12px",
                animation: "slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <span style={{ fontSize: "18px" }}>⭐</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>
                  Potential Matches
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#a78bfa" }}>
                  {animatedMatches}
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#6366f1",
                animation: "statusPulse 1.5s ease-in-out infinite",
              }}
            />
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
              {status}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes radarPulse {
          0% { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes innerPulse {
          0%, 100% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.1; }
        }

        @keyframes scanRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(99,102,241,0.7); }
          50% { opacity: 0.5; box-shadow: 0 0 0 4px rgba(99,102,241,0); }
        }

        @keyframes slideInUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
