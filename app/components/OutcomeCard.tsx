"use client";

import { useState } from "react";

interface OutcomeCardEnhancedProps {
  title: string;
  context: string;
  status: string;
  createdAt: number;
  dispatchedAt?: number | null;
  completedAt?: number | null;
  resultText?: string | null;
  personName?: string;
  personTitle?: string;
  personAvatar?: string | null;
  onDispatch?: () => void;
  onArchive?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  draft: { bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)", text: "#60a5fa", dot: "#60a5fa" },
  processing: { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)", text: "#a78bfa", dot: "#a78bfa" },
  suggestion: { bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)", text: "#34d399", dot: "#34d399" },
  submitted: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", text: "#fbbf24", dot: "#fbbf24" },
  archived: { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.4)", dot: "rgba(255,255,255,0.3)" },
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

/**
 * Enhanced outcome card with premium fold-down panel and rich visual presentation
 */
export function OutcomeCardEnhanced({
  title,
  context,
  status,
  createdAt,
  dispatchedAt,
  completedAt,
  resultText,
  personName,
  personTitle,
  personAvatar,
  onDispatch,
  onArchive,
  isExpanded = false,
  onToggleExpand,
}: OutcomeCardEnhancedProps) {
  const [hovered, setHovered] = useState(false);
  const colors = STATUS_COLORS[status] || STATUS_COLORS.draft;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "16px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Card header */}
      <div
        onClick={onToggleExpand}
        style={{
          padding: "18px 20px",
          cursor: "pointer",
          background: isExpanded ? "rgba(255,255,255,0.02)" : "transparent",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          {/* Avatar */}
          {personAvatar && (
            <img
              src={personAvatar}
              alt={personName}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                flexShrink: 0,
              }}
            />
          )}

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              {/* Status dot */}
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: colors.dot,
                  boxShadow: `0 0 8px ${colors.dot}`,
                  flexShrink: 0,
                }}
              />
              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#e8e8f0",
                  margin: 0,
                  letterSpacing: "-0.01em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title}
              </h4>
            </div>

            {personName && (
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                {personName}
                {personTitle && ` • ${personTitle}`}
              </div>
            )}

            <div
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: isExpanded ? "unset" : 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {context}
            </div>
          </div>

          {/* Status badge + expand icon */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
            <div
              style={{
                padding: "5px 10px",
                borderRadius: "8px",
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                fontSize: "11px",
                fontWeight: 600,
                color: colors.text,
                textTransform: "capitalize",
              }}
            >
              {status}
            </div>
            <div style={{ fontSize: "20px", color: "rgba(255,255,255,0.3)", transition: "transform 0.2s ease", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "18px 20px",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          {/* Timeline */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Timeline
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <TimelineItem label="Created" time={createdAt} />
              {dispatchedAt && <TimelineItem label="Dispatched" time={dispatchedAt} />}
              {completedAt && <TimelineItem label="Completed" time={completedAt} />}
            </div>
          </div>

          {/* Result text */}
          {resultText && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Results
              </div>
              <div
                style={{
                  padding: "12px 14px",
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.6,
                }}
              >
                {resultText}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            {onDispatch && status === "draft" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDispatch();
                }}
                style={{
                  flex: 1,
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none",
                  color: "white",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Dispatch
              </button>
            )}
            {onArchive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive();
                }}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Archive
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineItem({ label, time }: { label: string; time: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(99,102,241,0.6)" }} />
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", flex: 1 }}>{label}</span>
      <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums" }}>
        {formatTime(time)}
      </span>
    </div>
  );
}
