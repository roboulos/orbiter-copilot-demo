"use client";

// TODO: Wire to real Xano endpoints: GET /collections, POST /collection, GET /collection/{id}, POST /collection/{id}/member, DELETE /collection/{id}/member/{my_person_id}

import { useState, useCallback, useEffect, useRef } from "react";
import { Avatar } from "./Avatar";
import { xanoFetch } from "../lib/xano";

interface CollectionMember {
  id: number;
  name: string;
  title: string;
  company: string;
  master_person_id: number;
}

interface Collection {
  id: number;
  name: string;
  description: string;
  color: string;
  members: CollectionMember[];
}

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

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 1,
    name: "Seed Round Targets",
    description: "VCs and angels for our $4M raise",
    color: "#6366f1",
    members: [
      { id: 1, name: "Adam Rothenberg", title: "Partner", company: "BoxGroup", master_person_id: 100 },
      { id: 2, name: "Amish Jani", title: "Founder & Partner", company: "FirstMark", master_person_id: 101 },
      { id: 3, name: "Anamitra Banerji", title: "Managing Partner", company: "Afore Capital", master_person_id: 102 },
    ],
  },
  {
    id: 2,
    name: "Enterprise Pilots",
    description: "Potential enterprise customers for Q1",
    color: "#10b981",
    members: [
      { id: 4, name: "Aaron Skonnard", title: "Co-Founder and CEO", company: "Pluralsight", master_person_id: 103 },
      { id: 5, name: "Aber Whitcomb", title: "President", company: "Salt AI", master_person_id: 104 },
    ],
  },
];

const PRESET_COLORS = [
  { label: "Indigo",  value: "#6366f1" },
  { label: "Purple",  value: "#a855f7" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber",   value: "#f59e0b" },
  { label: "Pink",    value: "#ec4899" },
];

export function CollectionsView({ onSwitchTab }: { onSwitchTab: (tab: string) => void }) {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // New collection form state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");

  // Panel state
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [panelName, setPanelName] = useState("");
  const [panelDesc, setPanelDesc] = useState("");
  const [addMemberQuery, setAddMemberQuery] = useState("");
  const [addMemberResults, setAddMemberResults] = useState<SearchResult[]>([]);
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCollection = useCallback((col: Collection) => {
    setSelectedCollection(col);
    setPanelName(col.name);
    setPanelDesc(col.description);
    setEditingName(false);
    setEditingDesc(false);
    setAddMemberQuery("");
    setAddMemberResults([]);
    setShowAddMember(false);
  }, []);

  const closePanel = useCallback(() => {
    setSelectedCollection(null);
    setEditingName(false);
    setEditingDesc(false);
    setShowAddMember(false);
    setAddMemberResults([]);
    setAddMemberQuery("");
  }, []);

  // Sync panel edits back to collection list
  const savePanelName = useCallback(() => {
    if (!selectedCollection || !panelName.trim()) return;
    setCollections((prev) =>
      prev.map((c) => c.id === selectedCollection.id ? { ...c, name: panelName.trim() } : c)
    );
    setSelectedCollection((prev) => prev ? { ...prev, name: panelName.trim() } : prev);
    setEditingName(false);
  }, [selectedCollection, panelName]);

  const savePanelDesc = useCallback(() => {
    if (!selectedCollection) return;
    setCollections((prev) =>
      prev.map((c) => c.id === selectedCollection.id ? { ...c, description: panelDesc } : c)
    );
    setSelectedCollection((prev) => prev ? { ...prev, description: panelDesc } : prev);
    setEditingDesc(false);
  }, [selectedCollection, panelDesc]);

  const handleRemoveMember = useCallback((memberId: number) => {
    if (!selectedCollection) return;
    const updated = { ...selectedCollection, members: selectedCollection.members.filter((m) => m.id !== memberId) };
    setSelectedCollection(updated);
    setCollections((prev) => prev.map((c) => c.id === selectedCollection.id ? updated : c));
  }, [selectedCollection]);

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

  const handleAddMember = useCallback((result: SearchResult) => {
    if (!selectedCollection) return;
    const alreadyIn = selectedCollection.members.some((m) => m.master_person_id === result.master_person_id);
    if (alreadyIn) return;
    const newMember: CollectionMember = {
      id: Date.now(),
      name: result.full_name,
      title: result.master_person?.current_title || "",
      company: result.master_person?.master_company?.company_name || "",
      master_person_id: result.master_person_id,
    };
    const updated = { ...selectedCollection, members: [...selectedCollection.members, newMember] };
    setSelectedCollection(updated);
    setCollections((prev) => prev.map((c) => c.id === selectedCollection.id ? updated : c));
    setAddMemberQuery("");
    setAddMemberResults([]);
    setShowAddMember(false);
  }, [selectedCollection]);

  const handleCreateCollection = useCallback(() => {
    if (!newName.trim()) return;
    const newCol: Collection = {
      id: Date.now(),
      name: newName.trim(),
      description: newDesc.trim(),
      color: newColor,
      members: [],
    };
    setCollections((prev) => [newCol, ...prev]);
    setNewName(""); setNewDesc(""); setNewColor("#6366f1");
    setShowNewForm(false);
  }, [newName, newDesc, newColor]);

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
          const displayMembers = col.members.slice(0, 4);
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
                  {col.description}
                </div>
              </div>

              {/* Member count + avatars */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {displayMembers.map((m, i) => (
                    <div
                      key={m.id}
                      title={m.name}
                      style={{
                        marginLeft: i > 0 ? "-8px" : "0",
                        borderRadius: "50%",
                        border: "2px solid #0a0a0f",
                        overflow: "hidden",
                        flexShrink: 0,
                        width: 28, height: 28,
                      }}
                    >
                      <Avatar name={m.name} size={28} borderRadius="50%" />
                    </div>
                  ))}
                  {col.members.length > 4 && (
                    <div
                      style={{
                        marginLeft: "-8px",
                        width: 28, height: 28,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        border: "2px solid #0a0a0f",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "9px", color: "rgba(255,255,255,0.5)", fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      +{col.members.length - 4}
                    </div>
                  )}
                </div>
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
                  {col.members.length} member{col.members.length !== 1 ? "s" : ""}
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
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "64px 0", color: "rgba(255,255,255,0.2)" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📁</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#e8e8f0", margin: "0 0 6px" }}>No collections yet</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>Create your first collection to group contacts</p>
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

            <button
              onClick={closePanel}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", color: "rgba(255,255,255,0.4)", cursor: "pointer",
                fontSize: "14px", padding: "4px 10px",
              }}
            >✕</button>

            {/* Color accent stripe */}
            <div
              style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                background: `linear-gradient(90deg, ${selectedCollection.color}, transparent)`,
              }}
            />

            {/* Collection name (editable) */}
            <div style={{ marginBottom: "8px", paddingTop: "8px" }}>
              {editingName ? (
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    autoFocus
                    value={panelName}
                    onChange={(e) => setPanelName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") savePanelName(); if (e.key === "Escape") setEditingName(false); }}
                    style={{
                      flex: 1, fontSize: "18px", fontWeight: 700, background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${selectedCollection.color}50`,
                      borderRadius: "8px", padding: "6px 10px", color: "#e8e8f0",
                      fontFamily: "Inter, sans-serif", outline: "none",
                    }}
                  />
                  <button onClick={savePanelName} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "6px", background: `${selectedCollection.color}20`, border: `1px solid ${selectedCollection.color}40`, color: selectedCollection.color, cursor: "pointer" }}>Save</button>
                </div>
              ) : (
                <div
                  onClick={() => setEditingName(true)}
                  title="Click to edit"
                  style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "text" }}
                >
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#e8e8f0", margin: 0 }}>
                    {selectedCollection.name}
                  </h3>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>✏</span>
                </div>
              )}
            </div>

            {/* Description (editable) */}
            <div style={{ marginBottom: "20px" }}>
              {editingDesc ? (
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    autoFocus
                    value={panelDesc}
                    onChange={(e) => setPanelDesc(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") savePanelDesc(); if (e.key === "Escape") setEditingDesc(false); }}
                    style={{
                      flex: 1, fontSize: "12px", background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px",
                      padding: "5px 10px", color: "#e8e8f0", fontFamily: "Inter, sans-serif", outline: "none",
                    }}
                  />
                  <button onClick={savePanelDesc} style={{ fontSize: "11px", padding: "4px 8px", borderRadius: "6px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>OK</button>
                </div>
              ) : (
                <div
                  onClick={() => setEditingDesc(true)}
                  title="Click to edit"
                  style={{ cursor: "text", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                    {selectedCollection.description || "Add a description…"}
                  </span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.15)" }}>✏</span>
                </div>
              )}
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
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          width: "100%", textAlign: "left",
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "8px", padding: "8px 10px", cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          transition: "background 0.15s ease",
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
                        <span style={{ marginLeft: "auto", fontSize: "10px", color: selectedCollection.color, fontWeight: 600 }}>Add +</span>
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
                  key={member.id}
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
                      {member.title}{member.company ? ` · ${member.company}` : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    style={{
                      fontSize: "10px", padding: "3px 8px", borderRadius: "5px",
                      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                      color: "rgba(239,68,68,0.7)", cursor: "pointer", fontFamily: "Inter, sans-serif",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"; }}
                  >
                    Remove
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
          </div>
        </>
      )}
    </div>
  );
}
