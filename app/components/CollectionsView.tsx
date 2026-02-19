"use client";

import { useState, useCallback } from "react";
import { Avatar } from "./Avatar";
import { type Collection, type CollectionDetail, type CollectionMember } from "../lib/xano";

const MOCK_COLLECTIONS: CollectionDetail[] = [
  {
    id: 1,
    name: "🚀 Seed Investors",
    description: "VCs who back graph-native startups",
    color: "#6366f1",
    created_at: Date.now() - 86400000 * 10,
    member_count: 3,
    members: [
      { collection_node_id: 1, master_person_id: 1, name: "Mark", avatar: null, current_title: "CEO", company_name: "Orbiter", added_at: Date.now() - 86400000 * 2 },
      { collection_node_id: 2, master_person_id: 5, name: "Aaron Skonnard", avatar: null, current_title: "Founder", company_name: "Pluralsight", added_at: Date.now() - 86400000 * 5 },
      { collection_node_id: 3, master_person_id: 10, name: "Josh", avatar: null, current_title: "Co-founder", company_name: "Orbiter", added_at: Date.now() - 86400000 * 1 },
    ],
  },
  {
    id: 2,
    name: "🤝 Potential Partners",
    description: "Strategic partnership opportunities",
    color: "#10b981",
    created_at: Date.now() - 86400000 * 7,
    member_count: 2,
    members: [
      { collection_node_id: 4, master_person_id: 15, name: "Prakash", avatar: null, current_title: "CEO", company_name: "Xano", added_at: Date.now() - 86400000 * 3 },
      { collection_node_id: 5, master_person_id: 20, name: "Denis", avatar: null, current_title: "Engineer", company_name: "Orbiter", added_at: Date.now() - 86400000 * 7 },
    ],
  },
  {
    id: 3,
    name: "🎤 Conference Crew",
    description: "People to connect with at upcoming events",
    color: "#f59e0b",
    created_at: Date.now() - 86400000 * 3,
    member_count: 0,
    members: [],
  },
];

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

const PRESET_COLORS = [
  { label: "Indigo", value: "#6366f1" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
];

export function CollectionsView({ onSwitchTab }: { onSwitchTab: (tab: string) => void }) {
  const [collections, setCollections] = useState<CollectionDetail[]>(MOCK_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState<CollectionDetail | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");
  const [copiedPrompt, setCopiedPrompt] = useState<number | null>(null);

  const openCollection = useCallback((col: CollectionDetail) => {
    setSelectedCollection(col);
  }, []);

  const closePanel = useCallback(() => {
    setSelectedCollection(null);
  }, []);

  const handleCreateCollection = useCallback(() => {
    if (!newName.trim()) return;
    const newCol: CollectionDetail = {
      id: Date.now(),
      name: newName.trim(),
      description: newDesc.trim() || null,
      color: newColor,
      created_at: Date.now(),
      member_count: 0,
      members: [],
    };
    setCollections((prev) => [...prev, newCol]);
    setNewName("");
    setNewDesc("");
    setNewColor("#6366f1");
    setShowNewForm(false);
  }, [newName, newDesc, newColor]);

  const handleRemoveMember = useCallback((member: CollectionMember) => {
    if (!selectedCollection) return;
    const updated = {
      ...selectedCollection,
      members: selectedCollection.members.filter((m) => m.collection_node_id !== member.collection_node_id),
      member_count: selectedCollection.member_count - 1,
    };
    setSelectedCollection(updated);
    setCollections((prev) => prev.map((c) => c.id === updated.id ? updated : c));
  }, [selectedCollection]);

  const handleCopilotPrompt = useCallback((col: CollectionDetail, e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt = `Tell me about my "${col.name}" collection — who should I prioritize reaching out to this week, and what's the best move for each person?`;
    navigator.clipboard?.writeText(prompt);
    setCopiedPrompt(col.id);
    setTimeout(() => setCopiedPrompt(null), 2000);
    onSwitchTab("Copilot");
  }, [onSwitchTab]);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e8e8f0", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Collections
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            {collections.length} collection{collections.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowNewForm((v) => !v)}
          style={{
            fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "10px",
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            border: "none", color: "white", cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
          }}
        >
          + New Collection
        </button>
      </div>

      {/* New Collection Form */}
      {showNewForm && (
        <div style={{
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "20px",
          animation: "fadeUp 0.2s ease both",
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(99,102,241,0.7)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>
            New Collection
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Collection name…"
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "9px 12px", color: "#e8e8f0",
                fontSize: "13px", fontFamily: "Inter, sans-serif", outline: "none",
              }}
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description…"
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", padding: "9px 12px", color: "#e8e8f0",
                fontSize: "13px", fontFamily: "Inter, sans-serif", outline: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Color</span>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setNewColor(c.value)}
                  title={c.label}
                  style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: c.value, border: newColor === c.value ? "2px solid white" : "2px solid transparent",
                    cursor: "pointer", padding: 0,
                    boxShadow: newColor === c.value ? `0 0 8px ${c.value}` : "none",
                    transition: "all 0.15s ease",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleCreateCollection}
                disabled={!newName.trim()}
                style={{
                  flex: 1, padding: "9px", borderRadius: "8px",
                  background: newName.trim() ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "rgba(255,255,255,0.05)",
                  border: "none", color: newName.trim() ? "white" : "rgba(255,255,255,0.25)",
                  fontSize: "12px", fontWeight: 600, cursor: newName.trim() ? "pointer" : "default",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Create
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                style={{
                  padding: "9px 16px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collections Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "14px" }}>
        {collections.map((col) => {
          const hovered = hoveredId === col.id;
          return (
            <div
              key={col.id}
              onMouseEnter={() => setHoveredId(col.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: hovered ? `${col.color}08` : "rgba(255,255,255,0.025)",
                border: `1px solid ${hovered ? `${col.color}45` : "rgba(255,255,255,0.07)"}`,
                borderLeft: `4px solid ${col.color}`,
                borderRadius: "14px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.18s ease",
                transform: hovered ? "translateY(-2px)" : "none",
                boxShadow: hovered ? `0 8px 24px ${col.color}18` : "none",
                animation: "fadeUp 0.3s ease both",
              }}
            >
              {/* Name + description */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8f0", marginBottom: "4px" }}>
                  {col.name}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                  {col.description || ""}
                </div>
              </div>

              {/* Member avatars */}
              {col.members.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {col.members.slice(0, 4).map((m, i) => (
                      <div key={m.collection_node_id} style={{
                        marginLeft: i > 0 ? "-8px" : 0,
                        zIndex: col.members.length - i,
                        border: "2px solid #0a0a0f",
                        borderRadius: "50%",
                      }}>
                        <Avatar name={m.name} size={28} borderRadius="50%" />
                      </div>
                    ))}
                  </div>
                  {col.members.length > 4 && (
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginLeft: "4px" }}>
                      +{col.members.length - 4} more
                    </span>
                  )}
                </div>
              )}

              {/* Member count badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 600,
                  color: col.color,
                  background: `${col.color}14`,
                  border: `1px solid ${col.color}30`,
                  borderRadius: "5px",
                  padding: "2px 8px",
                }}>
                  {col.member_count} member{col.member_count !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={(e) => handleCopilotPrompt(col, e)}
                  style={{
                    fontSize: "10px", fontWeight: 600, padding: "3px 9px", borderRadius: "6px",
                    background: copiedPrompt === col.id ? "rgba(52,211,153,0.12)" : "rgba(99,102,241,0.08)",
                    border: copiedPrompt === col.id ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(99,102,241,0.2)",
                    color: copiedPrompt === col.id ? "#34d399" : "rgba(99,102,241,0.7)",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    transition: "all 0.15s ease",
                  }}
                >
                  {copiedPrompt === col.id ? "✓ Prompt copied!" : "💬 Ask Copilot"}
                </button>
              </div>

              {/* Open button */}
              <button
                onClick={() => openCollection(col)}
                style={{
                  width: "100%", padding: "8px",
                  borderRadius: "8px",
                  background: `${col.color}14`,
                  border: `1px solid ${col.color}30`,
                  color: col.color,
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${col.color}24`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${col.color}14`;
                }}
              >
                Open →
              </button>
            </div>
          );
        })}

        {collections.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "64px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📁</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#e8e8f0", margin: "0 0 8px" }}>No collections yet</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0, maxWidth: "360px", display: "inline-block", lineHeight: 1.6 }}>
              Group your contacts into collections — VCs, potential clients, or anyone you&apos;re actively working with.
            </p>
          </div>
        )}
      </div>

      {/* Collection panel slide-over */}
      {selectedCollection && (
        <>
          <div
            onClick={closePanel}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, backdropFilter: "blur(4px)" }}
          />
          <div
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: "440px",
              background: "linear-gradient(180deg, #0f0f1a 0%, #0c0c18 100%)",
              borderLeft: `1px solid ${selectedCollection.color}30`,
              zIndex: 2001, overflowY: "auto", padding: "28px",
              boxShadow: "-16px 0 64px rgba(0,0,0,0.7)",
              animation: "slideInPanel 0.3s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <style>{`
              @keyframes slideInPanel {
                from { transform: translateX(40px); opacity: 0; }
                to   { transform: translateX(0);    opacity: 1; }
              }
            `}</style>

            {/* Color accent stripe */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: `linear-gradient(90deg, ${selectedCollection.color}, transparent)`,
            }} />

            <button
              onClick={closePanel}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", color: "rgba(255,255,255,0.4)", cursor: "pointer",
                fontSize: "14px", padding: "4px 10px",
              }}
            >✕</button>

            {/* Collection name */}
            <div style={{ marginBottom: "8px", paddingTop: "8px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#e8e8f0", margin: 0 }}>
                {selectedCollection.name}
              </h3>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                {selectedCollection.description || "No description"}
              </span>
            </div>

            {/* Members header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: `${selectedCollection.color}80` }}>
                Members ({selectedCollection.members.length})
              </div>
              <span style={{
                fontSize: "10px", padding: "2px 8px", borderRadius: "5px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.3)", fontWeight: 500,
              }}>
                Coming soon: Add members
              </span>
            </div>

            {/* Member list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selectedCollection.members.map((member) => (
                <div
                  key={member.collection_node_id}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px", padding: "10px 12px",
                  }}
                >
                  <Avatar name={member.name} size={36} borderRadius="9px" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0", marginBottom: "1px" }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {member.current_title || ""}{member.company_name ? ` · ${member.company_name}` : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                    <span style={{
                      fontSize: "9px", padding: "2px 6px", borderRadius: "4px",
                      background: `${selectedCollection.color}14`,
                      border: `1px solid ${selectedCollection.color}25`,
                      color: selectedCollection.color, fontWeight: 500,
                    }}>
                      {formatDate(member.added_at)}
                    </span>
                    <button
                      onClick={() => handleRemoveMember(member)}
                      style={{
                        fontSize: "10px", padding: "2px 7px", borderRadius: "5px",
                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "rgba(239,68,68,0.7)", cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {selectedCollection.members.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "32px 0",
                  border: "1px dashed rgba(255,255,255,0.08)", borderRadius: "12px",
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>👥</div>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>No members yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={() => {
                  const prompt = `Tell me about my "${selectedCollection.name}" collection — who should I prioritize reaching out to this week?`;
                  navigator.clipboard?.writeText(prompt);
                  closePanel();
                  onSwitchTab("Copilot");
                }}
                style={{
                  width: "100%", padding: "11px",
                  borderRadius: "10px",
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  color: "#a5b4fc",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.18)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.1)"; }}
              >
                💬 Ask Copilot about this collection
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
