"use client";

import { useState } from "react";

interface QuickResultCardProps {
  matches: Array<{
    name: string;
    title: string;
    company: string;
    avatar?: string;
    reason: string; // Why this person matches
    confidence: "high" | "medium" | "low";
    masterPersonId?: number; // Link to person profile
  }>;
  stillSearching?: boolean; // Show if deep research is ongoing
}

/**
 * QuickResultCard - Jason's Two-Layer System
 * 
 * From Transcript #423:
 * Jason: "Can it kick off a low level agent (quick look) AND deep research agent?
 * Low level just doing cursory look at names and titles to say 'that's your guy'.
 * It comes back quickly while still looking deeper."
 * 
 * This shows DURING the interview while questions are being asked.
 * Quick matches based on simple keyword/title matching.
 * Deep research continues in background and surfaces after dispatch.
 */
export function QuickResultCard({ matches, stillSearching = true }: QuickResultCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (matches.length === 0) return null;

  const topMatch = matches[0];
  const hasMore = matches.length > 1;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "var(--space-md) 0",
        padding: "var(--space-lg)",
        background: "linear-gradient(135deg, rgba(52, 211, 153, 0.08), rgba(34, 197, 94, 0.05))",
        border: "1px solid rgba(52, 211, 153, 0.25)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "0 4px 20px rgba(52, 211, 153, 0.15)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#34d399",
          boxShadow: "0 0 12px rgba(52, 211, 153, 0.8)",
          animation: "pulse 2s ease-in-out infinite",
        }} />
        <span style={{
          fontSize: "var(--text-sm)",
          fontWeight: "var(--weight-semibold)",
          color: "#34d399",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          Quick Match Found
        </span>
        {stillSearching && (
          <span style={{
            fontSize: "var(--text-xs)",
            color: "var(--text-tertiary)",
            marginLeft: "auto",
          }}>
            Still searching...
          </span>
        )}
      </div>

      {/* Top Match */}
      <div 
        style={{
          display: "flex",
          gap: "var(--space-md)",
          padding: "var(--space-md)",
          background: "rgba(255, 255, 255, 0.03)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          cursor: topMatch.masterPersonId ? "pointer" : "default",
          transition: "all 0.2s",
        }}
        onClick={() => {
          if (topMatch.masterPersonId) {
            console.log(`[QuickResultCard] Navigate to person ${topMatch.masterPersonId}`);
            // TODO: Implement person profile navigation
          }
        }}
        onMouseEnter={(e) => {
          if (topMatch.masterPersonId) {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.3)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        }}
      >
        {/* Avatar */}
        {topMatch.avatar ? (
          <img
            src={topMatch.avatar}
            alt={topMatch.name}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "var(--text-lg)",
            fontWeight: "var(--weight-bold)",
            color: "white",
            flexShrink: 0,
          }}>
            {topMatch.name[0]}
          </div>
        )}

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "var(--text-base)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--text-primary)",
            marginBottom: "2px",
          }}>
            {topMatch.name}
          </div>
          <div style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-secondary)",
            marginBottom: "var(--space-xs)",
          }}>
            {topMatch.title} at {topMatch.company}
          </div>
          <div style={{
            fontSize: "var(--text-sm)",
            color: "var(--text-tertiary)",
            fontStyle: "italic",
          }}>
            💡 {topMatch.reason}
          </div>
        </div>

        {/* Confidence Badge */}
        <div style={{
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "var(--text-xs)",
          fontWeight: "var(--weight-medium)",
          background: topMatch.confidence === "high"
            ? "rgba(52, 211, 153, 0.2)"
            : topMatch.confidence === "medium"
            ? "rgba(251, 191, 36, 0.2)"
            : "rgba(156, 163, 175, 0.2)",
          color: topMatch.confidence === "high"
            ? "#34d399"
            : topMatch.confidence === "medium"
            ? "#fbbf24"
            : "#9ca3af",
          border: `1px solid ${
            topMatch.confidence === "high"
              ? "rgba(52, 211, 153, 0.4)"
              : topMatch.confidence === "medium"
              ? "rgba(251, 191, 36, 0.4)"
              : "rgba(156, 163, 175, 0.4)"
          }`,
          alignSelf: "flex-start",
          whiteSpace: "nowrap",
        }}>
          {topMatch.confidence === "high" ? "High" : topMatch.confidence === "medium" ? "Medium" : "Low"} match
        </div>
      </div>

      {/* More matches */}
      {hasMore && (
        <div style={{ marginTop: "var(--space-sm)" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: "100%",
              padding: "var(--space-sm)",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-secondary)",
              fontSize: "var(--text-sm)",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 255, 255, 0.03)";
            }}
          >
            {expanded ? "▼" : "▶"} {matches.length - 1} more {matches.length === 2 ? "match" : "matches"}
          </button>

          {expanded && (
            <div style={{
              marginTop: "var(--space-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}>
              {matches.slice(1).map((match, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "var(--space-sm) var(--space-md)",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: "var(--weight-medium)",
                    color: "var(--text-primary)",
                  }}>
                    {match.name}
                  </div>
                  <div style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-tertiary)",
                  }}>
                    {match.title} • {match.reason}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom note */}
      {stillSearching && (
        <div style={{
          marginTop: "var(--space-md)",
          padding: "var(--space-sm)",
          background: "rgba(99, 102, 241, 0.05)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)",
          color: "var(--text-tertiary)",
          textAlign: "center",
        }}>
          🔍 Deep research continues in background. Full results after dispatch.
        </div>
      )}
    </div>
  );
}
