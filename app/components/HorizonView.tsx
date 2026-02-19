"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar } from "./Avatar";
import { getHorizon, addHorizonTarget, type HorizonTarget } from "../lib/xano";
import { PersonPicker } from "./PersonPicker";

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

export function HorizonView() {
  const [targets, setTargets] = useState<HorizonTarget[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [addingTarget, setAddingTarget] = useState(false);

  const fetchTargets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getHorizon({ per_page: 50 });
      setTargets(data.items);
      setTotal(data.itemsTotal);
    } catch (err) {
      console.error("Failed to load horizon:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  const handleAddTarget = async (person: { master_person_id: number; full_name: string; master_person: { name: string; avatar: string | null; current_title: string | null; master_company?: { company_name: string } | null } }, _context: string) => {
    setAddingTarget(true);
    try {
      const { getNetwork } = await import("../lib/xano");
      const network = await getNetwork({ query: person.full_name, per_page: 5 });
      const match = network.items.find(p => p.master_person_id === person.master_person_id);
      if (!match?.node_uuid) {
        console.error("Could not find node_uuid for person");
        return;
      }
      await addHorizonTarget(match.node_uuid);
      setAdding(false);
      fetchTargets();
    } catch (err) {
      console.error("Failed to add horizon target:", err);
    } finally {
      setAddingTarget(false);
    }
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e8e8f0", margin: 0, letterSpacing: "-0.02em" }}>
            Horizon
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            {total} targets tracked{loading ? " · Loading..." : ""}
          </p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "10px",
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)",
            color: "#a5b4fc", cursor: "pointer",
          }}
        >
          <span>+</span> Add Target
        </button>
      </div>

      {/* Add target form */}
      {adding && (
        <div style={{
          background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "12px", padding: "18px", marginBottom: "20px",
        }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", margin: "0 0 12px" }}>
            Search for a person to add to your Horizon targets:
          </p>
          <PersonPicker
            onSelect={handleAddTarget}
            selectedPerson={null}
            onClear={() => {}}
          />
          {addingTarget && (
            <p style={{ fontSize: "12px", color: "#a5b4fc", margin: "10px 0 0" }}>
              Adding target...
            </p>
          )}
          <button
            onClick={() => setAdding(false)}
            style={{
              fontSize: "12px", padding: "8px 16px", borderRadius: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)", cursor: "pointer", marginTop: "10px",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "24px",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "12px", padding: "14px 16px",
        }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#6366f1", marginBottom: "2px" }}>
            {total}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
            Total Targets
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(52,211,153,0.25)",
          borderRadius: "12px", padding: "14px 16px",
        }}>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#34d399", marginBottom: "2px" }}>
            {targets.filter(t => t.master_person?.current_title).length}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
            With Title
          </div>
        </div>
      </div>

      {/* Target list */}
      {loading && targets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
          Loading...
        </div>
      ) : targets.length === 0 ? (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "80px 32px", textAlign: "center",
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))",
            border: "1px solid rgba(99,102,241,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "32px", marginBottom: "20px",
          }}>
            🔭
          </div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#e8e8f0", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            No targets on your radar yet
          </h3>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "0 0 24px", maxWidth: "320px", lineHeight: "1.6" }}>
            Horizon tracks people you want to connect with. Add founders, investors, or potential partners — Orbiter will surface the right moment to reach out.
          </p>
          <button
            onClick={() => setAdding(true)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontWeight: 600, padding: "10px 20px", borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none",
              color: "white", cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            }}
          >
            + Add your first target
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {targets.map((t) => {
            const mp = t.master_person;
            const mc = mp?.master_company;
            const expanded = expandedId === t.id;
            return (
              <div
                key={t.id}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: "14px", padding: "16px 18px", cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onClick={() => setExpandedId(expanded ? null : t.id)}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <Avatar name={mp?.name || "?"} size={40} borderRadius="10px" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0" }}>
                        {mp?.name || "Unknown"}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                        {mp?.current_title || "No title"}{mc?.company_name ? ` · ${mc.company_name}` : ""}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "auto" }}>
                        Added {formatDate(t.created_at)}
                      </span>
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: "5px" }}>
                        {mp?.current_title && (
                          <span style={{
                            fontSize: "10px", padding: "2px 7px", borderRadius: "4px",
                            background: "rgba(99,102,241,0.1)", color: "rgba(99,102,241,0.7)", fontWeight: 500,
                          }}>
                            {mp.current_title.split(" ").slice(0, 3).join(" ")}
                          </span>
                        )}
                        {mc?.company_name && (
                          <span style={{
                            fontSize: "10px", padding: "2px 7px", borderRadius: "4px",
                            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontWeight: 500,
                          }}>
                            {mc.company_name}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
                        {expanded ? "Less" : "More"}
                      </span>
                    </div>

                    {/* Expanded detail */}
                    {expanded && (
                      <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        {mp?.bio && (
                          <>
                            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(167,139,250,0.6)", margin: "0 0 6px" }}>
                              Bio
                            </p>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6", margin: "0 0 14px" }}>
                              {mp.bio}
                            </p>
                          </>
                        )}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={e => e.stopPropagation()} style={{
                            fontSize: "11px", fontWeight: 600, padding: "7px 14px", borderRadius: "8px",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none",
                            color: "white", cursor: "pointer",
                          }}>
                            Get intro path
                          </button>
                          <button onClick={e => e.stopPropagation()} style={{
                            fontSize: "11px", fontWeight: 500, padding: "7px 14px", borderRadius: "8px",
                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.4)", cursor: "pointer",
                          }}>
                            Remove
                          </button>
                        </div>
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
