"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar } from "./Avatar";
import { getOutcomes, createOutcome, type OutcomeItem } from "../lib/xano";

type CopilotMode = "outcome" | "loop" | "serendipity";
type Status = "draft" | "processing" | "suggestion" | "submitted" | "archived";

const STATUS_CONFIG: Record<Status, { color: string; bg: string; border: string; dot: string }> = {
  draft: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)", dot: "#60a5fa" },
  processing: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)", dot: "#a78bfa" },
  suggestion: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)", dot: "#34d399" },
  submitted: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)", dot: "#fbbf24" },
  archived: { color: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", dot: "rgba(255,255,255,0.3)" },
};

const MODE_LABELS: Record<CopilotMode, { icon: string; label: string; plural: string; color: string }> = {
  outcome: { icon: "🎯", label: "Outcome", plural: "Outcomes", color: "#6366f1" },
  loop: { icon: "⚡", label: "Leverage Loop", plural: "Leverage Loops", color: "#a78bfa" },
  serendipity: { icon: "✨", label: "Serendipity", plural: "Serendipity", color: "#10b981" },
};

const FILTERS = ["All", "outcome", "loop", "serendipity"];

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return d.toLocaleDateString();
}

export function OutcomesView() {
  const [items, setItems] = useState<OutcomeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContext, setNewContext] = useState("");

  const fetchItems = useCallback(async (mode: string) => {
    setLoading(true);
    try {
      const data = await getOutcomes({
        copilot_mode: mode === "All" ? undefined : mode,
        per_page: 50,
      });
      setItems(data.items);
      setTotal(data.itemsTotal);
    } catch (err) {
      console.error("Failed to load outcomes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(activeFilter);
  }, [activeFilter, fetchItems]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      await createOutcome({
        request_panel_title: newTitle.trim(),
        request_context: newContext.trim() || undefined,
      });
      setNewTitle("");
      setNewContext("");
      setCreating(false);
      fetchItems(activeFilter);
    } catch (err) {
      console.error("Failed to create outcome:", err);
    }
  };

  const counts = {
    outcome: items.filter((o) => o.copilot_mode === "outcome").length,
    loop: items.filter((o) => o.copilot_mode === "loop").length,
    serendipity: items.filter((o) => o.copilot_mode === "serendipity").length,
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e8e8f0", margin: 0, letterSpacing: "-0.02em" }}>
            Suggestions & Outcomes
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            {total} items{loading ? " · Loading..." : ""}
          </p>
        </div>

        <button
          onClick={() => setCreating(!creating)}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "10px",
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)",
            color: "#a5b4fc", cursor: "pointer",
          }}
        >
          <span>+</span> New Outcome
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div style={{
          background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "12px", padding: "18px", marginBottom: "20px",
        }}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What do you want to achieve?"
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "10px 12px", color: "#e8e8f0", fontSize: "13px",
              fontFamily: "Inter, sans-serif", outline: "none", marginBottom: "8px", boxSizing: "border-box",
            }}
          />
          <textarea
            value={newContext}
            onChange={(e) => setNewContext(e.target.value)}
            placeholder="Why does this matter? (optional)"
            rows={2}
            style={{
              width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "10px 12px", color: "#e8e8f0", fontSize: "13px",
              fontFamily: "Inter, sans-serif", outline: "none", resize: "vertical", marginBottom: "10px", boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleCreate} style={{
              fontSize: "12px", fontWeight: 600, padding: "8px 20px", borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none",
              color: "white", cursor: "pointer",
            }}>
              Save Outcome
            </button>
            <button onClick={() => setCreating(false)} style={{
              fontSize: "12px", padding: "8px 16px", borderRadius: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)", cursor: "pointer",
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "24px" }}>
        {(["outcome", "loop", "serendipity"] as CopilotMode[]).map((mode) => {
          const ml = MODE_LABELS[mode];
          return (
            <div key={mode} style={{
              background: "rgba(255,255,255,0.03)", border: `1px solid ${ml.color}40`,
              borderRadius: "12px", padding: "14px 16px",
            }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: ml.color, marginBottom: "2px" }}>
                {counts[mode]}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                {ml.icon} {ml.plural}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {FILTERS.map((f) => {
          const ml = f !== "All" ? MODE_LABELS[f as CopilotMode] : null;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: "11px", fontWeight: 500, padding: "5px 12px", borderRadius: "20px",
                border: activeFilter === f ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
                background: activeFilter === f ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
                color: activeFilter === f ? "#a5b4fc" : "rgba(255,255,255,0.4)",
                cursor: "pointer", transition: "all 0.12s ease",
              }}
            >
              {ml ? `${ml.icon} ${ml.plural}` : "All"}
            </button>
          );
        })}
      </div>

      {/* Items list */}
      {loading && items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
          Loading...
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
          No items yet. Create an outcome or use the Copilot to generate suggestions.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((o) => {
            const cfg = STATUS_CONFIG[o.status] || STATUS_CONFIG.draft;
            const ml = MODE_LABELS[o.copilot_mode] || MODE_LABELS.outcome;
            const expanded = expandedId === o.id;
            const mp = o.master_person;
            return (
              <div
                key={o.id}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${o.status === "suggestion" ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "14px", padding: "18px 20px", cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onClick={() => setExpandedId(expanded ? null : o.id)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  {/* Status dot */}
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    background: cfg.dot,
                    boxShadow: o.status === "suggestion" ? `0 0 6px ${cfg.dot}` : "none",
                    flexShrink: 0, marginTop: "5px",
                  }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "5px",
                        background: `${ml.color}22`, border: `1px solid ${ml.color}44`,
                        color: ml.color, letterSpacing: "0.04em",
                      }}>
                        {ml.icon} {ml.label}
                      </span>
                      <span style={{
                        fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "5px",
                        background: cfg.bg, border: `1px solid ${cfg.border}`,
                        color: cfg.color, letterSpacing: "0.04em", textTransform: "uppercase",
                      }}>
                        {o.status}
                      </span>

                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>
                        {formatDate(o.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <p style={{
                      fontSize: "13px", fontWeight: 500, color: o.status === "archived" ? "rgba(255,255,255,0.4)" : "#e8e8f0",
                      margin: "0 0 10px", lineHeight: "1.5",
                      textDecoration: o.status === "archived" ? "line-through" : "none",
                    }}>
                      {o.request_panel_title}
                    </p>

                    {/* Person + tags */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {mp && (
                          <>
                            <Avatar name={mp.name} size={20} borderRadius="5px" />
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                              {mp.name}{mp.master_company?.company_name ? ` · ${mp.master_company.company_name}` : ""}
                            </span>
                          </>
                        )}
                      </div>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                        {expanded ? "▲ Less" : "▼ More"}
                      </span>
                    </div>

                    {/* Expanded: context */}
                    {expanded && o.request_context && (
                      <div style={{
                        marginTop: "14px", paddingTop: "14px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                      }}>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Context
                        </p>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: "1.6" }}>
                          {o.request_context}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
