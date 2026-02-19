"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Avatar } from "./Avatar";
import {
  xanoFetch,
  getCollections,
  createCollection,
  getCollection,
  addCollectionMember,
  removeCollectionMember,
  type Collection,
  type CollectionDetail,
  type CollectionMember,
} from "../lib/xano";

interface SearchResult {
  master_person_id: number;
  full_name: string;
  master_person: {
    name: string;
    avatar: string | null;
    current_title: string | null;
    master_company?: { company_name: string } | null;
  };
}

const PRESET_COLORS = [
  { label: "Indigo",  value: "#6366f1" },
  { label: "Purple",  value: "#a855f7" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber",   value: "#f59e0b" },
  { label: "Pink",    value: "#ec4899" },
];

export function CollectionsView({ onSwitchTab }: { onSwitchTab: (tab: string) => void }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<CollectionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  // New collection form state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");

  // Panel state
  const [addMemberQuery, setAddMemberQuery] = useState("");
  const [addMemberResults, setAddMemberResults] = useState<SearchResult[]>([]);
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [addingMember, setAddingMember] = useState<number | null>(null);
  const [removingMember, setRemovingMember] = useState<number | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCollections = useCallback(async () => {
    setCollectionsLoading(true);
    try {
      const data = await getCollections();
      setCollections(data.items || []);
    } catch (err) {
      console.error("Failed to load collections:", err);
      setCollections([]);
    } finally {
      setCollectionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const openCollection = useCallback(async (col: Collection) => {
    setDetailLoading(true);
    setShowAddMember(false);
    setAddMemberQuery("");
    setAddMemberResults([]);
    try {
      const detail = await getCollection(col.id);
      setSelectedCollection(detail);
    } catch (err) {
      console.error("Failed to load collection detail:", err);
      // Fallback: show with empty members
      setSelectedCollection({ ...col, members: [] });
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closePanel = useCallback(() => {
    setSelectedCollection(null);
    setShowAddMember(false);
    setAddMemberResults([]);
    setAddMemberQuery("");
  }, []);

  const refreshDetail = useCallback(async (id: number) => {
    try {
      const detail = await getCollection(id);
      setSelectedCollection(detail);
      // Also update the member_count in the list
      setCollections((prev) =>
        prev.map((c) => c.id === id ? { ...c, member_count: detail.members.length } : c)
      );
    } catch (err) {
      console.error("Failed to refresh collection:", err);
    }
  }, []);

  // Add member search
  useEffect(() => {
    if (!addMemberQuery.trim()) { setAddMemberResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setAddMemberLoading(true);
      try {
        const data = await xanoFetch<{ items: SearchResult[] }>("/person-search", {
          params: { query: addMemberQuery, limit: "8" },
        });
        setAddMemberResults(data.items || []);
      } catch {
        setAddMemberResults([]);
      } finally {
        setAddMemberLoading(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [addMemberQuery]);

  const handleAddMember = useCallback(async (result: SearchResult) => {
    if (!selectedCollection) return;
    const alreadyIn = selectedCollection.members.some((m) => m.master_person_id === result.master_person_id);
    if (alreadyIn) return;
    setAddingMember(result.master_person_id);
    try {
      await addCollectionMember(selectedCollection.id, result.master_person_id);
      setAddMemberQuery("");
      setAddMemberResults([]);
      setShowAddMember(false);
      await refreshDetail(selectedCollection.id);
    } catch (err) {
      console.error("Failed to add member:", err);
    } finally {
      setAddingMember(null);
    }
  }, [selectedCollection, refreshDetail]);

  const handleRemoveMember = useCallback(async (member: CollectionMember) => {
    if (!selectedCollection) return;
    setRemovingMember(member.master_person_id);
    try {
      await removeCollectionMember(selectedCollection.id, member.master_person_id);
      await refreshDetail(selectedCollection.id);
    } catch (err) {
      console.error("Failed to remove member:", err);
    } finally {
      setRemovingMember(null);
    }
  }, [selectedCollection, refreshDetail]);

  const handleCreateCollection = useCallback(async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await createCollection({ name: newName.trim(), description: newDesc.trim() || undefined, color: newColor });
      setNewName(""); setNewDesc(""); setNewColor("#6366f1");
      setShowNewForm(false);
      await loadCollections();
    } catch (err) {
      console.error("Failed to create collection:", err);
    } finally {
      setCreating(false);
    }
  }, [newName, newDesc, newColor, loadCollections]);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e8e8f0", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Collections
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            {collectionsLoading ? "Loading…" : `${collections.length} collection${collections.length !== 1 ? "s" : ""}`}
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
        <div
          style={{
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "20px",
            animation: "fadeUp 0.2s ease both",
          }}
        >
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
            {/* Color picker */}
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
                disabled={!newName.trim() || creating}
                style={{
                  flex: 1, padding: "9px", borderRadius: "8px",
                  background: newName.trim() && !creating ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "rgba(255,255,255,0.05)",
                  border: "none", color: newName.trim() && !creating ? "white" : "rgba(255,255,255,0.25)",
                  fontSize: "12px", fontWeight: 600, cursor: newName.trim() && !creating ? "pointer" : "default",
                  fontFamily: "Inter, sans-serif",
                  opacity: creating ? 0.7 : 1,
                }}
              >
                {creating ? "Creating…" : "Create"}
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

      {/* Loading skeleton */}
      {collectionsLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "14px" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
              <div className="orbiter-shimmer" style={{ height: 16, width: "60%", borderRadius: 6, marginBottom: 8 }} />
              <div className="orbiter-shimmer" style={{ height: 12, width: "80%", borderRadius: 5, marginBottom: 20 }} />
              <div className="orbiter-shimmer" style={{ height: 32, borderRadius: 8 }} />
            </div>
          ))}
        </div>
      ) : (
        /* Collections Grid */
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

                {/* Member count */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "16px" }}>
                  <span
                    style={{
                      fontSize: "11px", fontWeight: 600,
                      color: col.color,
                      background: `${col.color}14`,
                      border: `1px solid ${col.color}30`,
                      borderRadius: "5px",
                      padding: "2px 8px",
                    }}
                  >
                    {col.member_count} member{col.member_count !== 1 ? "s" : ""}
                  </span>
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
                Group your contacts into collections. Add VCs, potential clients, or anyone you&apos;re actively working with.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Collection panel slide-over */}
      {(selectedCollection || detailLoading) && (
        <>
          <div
            onClick={closePanel}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, backdropFilter: "blur(4px)" }}
          />
          <div
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: "440px",
              background: "linear-gradient(180deg, #0f0f1a 0%, #0c0c18 100%)",
              borderLeft: `1px solid ${selectedCollection ? selectedCollection.color + "30" : "rgba(99,102,241,0.2)"}`,
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

            <button
              onClick={closePanel}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", color: "rgba(255,255,255,0.4)", cursor: "pointer",
                fontSize: "14px", padding: "4px 10px",
              }}
            >✕</button>

            {detailLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "8px" }}>
                <div className="orbiter-shimmer" style={{ height: 22, width: "55%", borderRadius: 7 }} />
                <div className="orbiter-shimmer" style={{ height: 14, width: "70%", borderRadius: 5 }} />
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 12 }}>
                    <div className="orbiter-shimmer" style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="orbiter-shimmer" style={{ height: 13, width: "50%", borderRadius: 5, marginBottom: 6 }} />
                      <div className="orbiter-shimmer" style={{ height: 10, width: "70%", borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedCollection ? (
              <>
                {/* Color accent stripe */}
                <div
                  style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                    background: `linear-gradient(90deg, ${selectedCollection.color}, transparent)`,
                  }}
                />

                {/* Collection name */}
                <div style={{ marginBottom: "8px", paddingTop: "8px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#e8e8f0", margin: 0 }}>
                    {selectedCollection.name}
                  </h3>
                </div>

                {/* Description */}
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
                  <button
                    onClick={() => setShowAddMember((v) => !v)}
                    style={{
                      fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px",
                      background: `${selectedCollection.color}14`,
                      border: `1px solid ${selectedCollection.color}30`,
                      color: selectedCollection.color, cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    + Add Member
                  </button>
                </div>

                {/* Add member search */}
                {showAddMember && (
                  <div style={{ marginBottom: "14px" }}>
                    <input
                      type="text"
                      autoFocus
                      value={addMemberQuery}
                      onChange={(e) => setAddMemberQuery(e.target.value)}
                      placeholder="Search to add…"
                      style={{
                        width: "100%", boxSizing: "border-box",
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "8px", padding: "8px 12px", color: "#e8e8f0",
                        fontSize: "12px", fontFamily: "Inter, sans-serif", outline: "none",
                        marginBottom: "8px",
                      }}
                    />
                    {addMemberLoading && (
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", padding: "4px 0" }}>Searching…</div>
                    )}
                    {addMemberResults.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {addMemberResults.map((r) => (
                          <button
                            key={r.master_person_id}
                            onClick={() => handleAddMember(r)}
                            disabled={addingMember === r.master_person_id}
                            style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              width: "100%", textAlign: "left",
                              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                              borderRadius: "8px", padding: "8px 10px", cursor: addingMember === r.master_person_id ? "wait" : "pointer",
                              fontFamily: "Inter, sans-serif",
                              transition: "background 0.15s ease",
                              opacity: addingMember === r.master_person_id ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.08)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
                          >
                            <Avatar name={r.full_name} size={28} borderRadius="7px" />
                            <div>
                              <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8e8f0" }}>{r.full_name}</div>
                              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
                                {r.master_person?.current_title || ""}
                                {r.master_person?.master_company?.company_name ? ` · ${r.master_person.master_company.company_name}` : ""}
                              </div>
                            </div>
                            <span style={{ marginLeft: "auto", fontSize: "10px", color: selectedCollection.color, fontWeight: 600 }}>
                              {addingMember === r.master_person_id ? "…" : "Add +"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

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
                      <button
                        onClick={() => handleRemoveMember(member)}
                        disabled={removingMember === member.master_person_id}
                        style={{
                          fontSize: "10px", padding: "3px 8px", borderRadius: "5px",
                          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                          color: "rgba(239,68,68,0.7)", cursor: removingMember === member.master_person_id ? "wait" : "pointer",
                          fontFamily: "Inter, sans-serif",
                          flexShrink: 0,
                          opacity: removingMember === member.master_person_id ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => { if (removingMember !== member.master_person_id) (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"; }}
                      >
                        {removingMember === member.master_person_id ? "…" : "Remove"}
                      </button>
                    </div>
                  ))}
                  {selectedCollection.members.length === 0 && (
                    <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
                      No members yet. Add some above.
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <button
                    onClick={() => { closePanel(); onSwitchTab("Copilot"); }}
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
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
