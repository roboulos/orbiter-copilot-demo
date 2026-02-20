"use client";

import { useEffect, useState } from "react";

interface ScanningCardProps {
  title?: string;
  subtitle?: string;
  connections_analyzed?: number;
  potential_matches?: number;
}

/**
 * ScanningCard - Premium Edition
 * Animated constellation radar with real-time stats
 * All 8 passes applied for premium feel
 */
export function ScanningCard({
  title = "Scanning Network",
  subtitle,
  connections_analyzed = 0,
  potential_matches = 0,
}: ScanningCardProps) {
  const [progress, setProgress] = useState(0);
  const [displayConnections, setDisplayConnections] = useState(0);
  const [displayMatches, setDisplayMatches] = useState(0);

  // Animate numbers counting up
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setDisplayConnections(Math.floor(connections_analyzed * progress));
      setDisplayMatches(Math.floor(potential_matches * progress));
      setProgress(progress * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayConnections(connections_analyzed);
        setDisplayMatches(potential_matches);
        setProgress(100);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [connections_analyzed, potential_matches]);

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "600px",
        margin: "var(--space-xl) 0",
        padding: "var(--space-2xl)",
        borderRadius: "var(--radius-2xl)",
        
        /* Pass 2: Premium glass surface */
        background: "linear-gradient(145deg, rgba(124, 58, 237, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(255, 255, 255, 0.04) 100%)",
        backdropFilter: "blur(32px) saturate(180%)",
        border: "1px solid rgba(124, 58, 237, 0.3)",
        
        /* Pass 5: Glowing shadow */
        boxShadow: `0 0 40px rgba(124, 58, 237, 0.2),
                    0 10px 30px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
        
        /* Pass 6: Entrance animation */
        animation: "constellation-appear 0.8s var(--ease-out-expo)",
        
        overflow: "hidden",
      }}
    >
      {/* Animated constellation radar (Pass 8: Premium visual) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          opacity: 0.3,
        }}
      >
        {/* Radar circles */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: `${i * 30}px`,
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "50%",
              /* Pass 6: Pulsing animation */
              animation: `glow-pulse ${2 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        
        {/* Scanning line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "50%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.8), rgba(124, 58, 237, 0))",
            transformOrigin: "0% 50%",
            /* Pass 6: Rotating scan */
            animation: "orbitSpin 4s linear infinite",
            filter: "blur(1px)",
          }}
        />
        
        {/* Center glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "12px",
            height: "12px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(124, 58, 237, 1) 0%, rgba(124, 58, 237, 0) 70%)",
            borderRadius: "50%",
            /* Pass 6: Subtle pulse */
            animation: "glow-pulse 2s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        {/* Pass 1: Typography */}
        <h3
          className="text-heading"
          style={{
            fontSize: "var(--text-2xl)",
            fontWeight: "var(--weight-bold)",
            color: "var(--text-primary)",
            marginBottom: "var(--space-sm)",
            letterSpacing: "var(--tracking-tight)",
          }}
        >
          {title}
        </h3>

        {subtitle && (
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--text-secondary)",
              marginBottom: "var(--space-xl)",
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Stats Grid (Pass 3: Spacing) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--space-lg)",
            marginTop: "var(--space-2xl)",
          }}
        >
          {/* Connections Stat */}
          <div
            style={{
              padding: "var(--space-lg)",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              /* Pass 8: Subtle lift on render */
              animation: "slide-up-fade 0.6s var(--ease-out-expo) 0.2s backwards",
            }}
          >
            <div
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-medium)",
                color: "var(--text-tertiary)",
                marginBottom: "var(--space-xs)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Connections Analyzed
            </div>
            <div
              className="text-display"
              style={{
                fontSize: "var(--text-3xl)",
                color: "var(--color-accent)",
                /* Pass 8: Tabular numbers for counting */
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {displayConnections}
            </div>
          </div>

          {/* Matches Stat */}
          <div
            style={{
              padding: "var(--space-lg)",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(99, 102, 241, 0.08))",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              /* Pass 8: Staggered entrance */
              animation: "slide-up-fade 0.6s var(--ease-out-expo) 0.3s backwards",
            }}
          >
            <div
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-medium)",
                color: "var(--text-tertiary)",
                marginBottom: "var(--space-xs)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-wide)",
              }}
            >
              Potential Matches
            </div>
            <div
              className="text-display"
              style={{
                fontSize: "var(--text-3xl)",
                color: "rgba(124, 58, 237, 1)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {displayMatches}
            </div>
          </div>
        </div>

        {/* Progress Bar (Pass 7: Loading state) */}
        <div
          style={{
            marginTop: "var(--space-xl)",
            height: "4px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "var(--radius-full)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, rgba(124, 58, 237, 1), rgba(99, 102, 241, 1))",
              transition: "width 100ms linear",
              boxShadow: "0 0 10px rgba(124, 58, 237, 0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
