"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar } from "./Avatar";
import { NetworkGraph } from "./NetworkGraph";
import { getNetwork, getPersonContext, addHorizonTarget, type NetworkPerson } from "../lib/xano";

type SelectPersonPayload = {
  master_person_id: number;
  full_name: string;
  in_my_network?: boolean;
  master_person: {
    id?: number;
    name: string;
    avatar: string | null;
    current_title: string | null;
    bio?: string | null;
    master_company?: { id?: number; company_name: string; logo?: string | null } | null;
  } | null;
};

// Parse the YAML profile string into structured sections
function parseProfileYaml(raw: string): {
  name?: string;
  bio?: string;
  bio500?: string;
  currentTitle?: string;
  currentCompany?: string;
  workHistory?: Array<{ title: string; company: string; startYear?: string; endYear?: string }>;
  skills?: string[];
  roles?: string[];
} {
  try {
    const lines = raw.split("\n");
    const result: ReturnType<typeof parseProfileYaml> = {};
    let section = "";
    let bioLines: string[] = [];
    let inBio500 = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith("name:")) {
        result.name = trimmed.replace(/^name:\s*['"]?/, "").replace(/['"]$/, "").trim();
      } else if (trimmed.startsWith("bio:") && !trimmed.startsWith("bio_500")) {
        result.bio = trimmed.replace(/^bio:\s*['"]?/, "").replace(/['"]$/, "").trim();
        section = "bio";
      } else if (trimmed.startsWith("bio_500:")) {
        inBio500 = true;
        bioLines = [];
        section = "bio500";
      } else if (trimmed.startsWith("work_history:")) {
        inBio500 = false;
        if (bioLines.length > 0) result.bio500 = bioLines.join(" ").trim();
        section = "work_history";
      } else if (trimmed.startsWith("skills:")) {
        inBio500 = false;
        section = "skills";
        result.skills = [];
      } else if (trimmed.startsWith("roles:")) {
        inBio500 = false;
        section = "roles";
        result.roles = [];
      } else if (trimmed.startsWith("current_position:")) {
        inBio500 = false;
        section = "current_position";
      } else if (section === "bio500" && inBio500) {
        if (trimmed && !trimmed.startsWith("|-")) bioLines.push(trimmed);
      } else if (section === "work_history" && trimmed.startsWith("-")) {
        // Parse: - { title: '...', company_name: '...', start_year: '...', end_year: '...' }
        const titleMatch = trimmed.match(/title:\s*['"]([^'"]+)['"]/);
        const companyMatch = trimmed.match(/company_name:\s*['"]([^'"]+)['"]/);
        const startYearMatch = trimmed.match(/start_year:\s*['"]([^'"]+)['"]/);
        const endYearMatch = trimmed.match(/end_year:\s*['"]([^'"]+)['"]/);
        if (titleMatch || companyMatch) {
          if (!result.workHistory) result.workHistory = [];
          result.workHistory.push({
            title: titleMatch?.[1] || "",
            company: companyMatch?.[1] || "",
            startYear: startYearMatch?.[1],
            endYear: endYearMatch?.[1],
          });
        }
      } else if (section === "skills" && trimmed.startsWith("-")) {
        result.skills?.push(trimmed.replace(/^-\s*['"]?/, "").replace(/['"]$/, "").trim());
      } else if (section === "roles" && trimmed.startsWith("-")) {
        result.roles?.push(trimmed.replace(/^-\s*['"]?/, "").replace(/['"]$/, "").trim());
      } else if (section === "current_position") {
        if (trimmed.startsWith("title:")) {
          result.currentTitle = trimmed.replace(/^title:\s*['"]?/, "").replace(/['"]$/, "").trim();
        } else if (trimmed.startsWith("company:")) {
          result.currentCompany = trimmed.replace(/^company:\s*['"]?/, "").replace(/['"]$/, "").trim();
        }
      }
    }
    if (bioLines.length > 0 && !result.bio500) result.bio500 = bioLines.join(" ").trim();
    return result;
  } catch {
    return {};
  }
}

const FILTERS = ["All contacts", "Connected", "Has title", "Has company"];

function BondBar({ lastActivity }: { lastActivity: number | null }) {
  // Compute recency score: recent activity = higher score
  let score = 10; // default for no activity
  if (lastActivity) {
    const daysAgo = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
    if (daysAgo < 7) score = 90;
    else if (daysAgo < 30) score = 70;
    else if (daysAgo < 90) score = 50;
    else if (daysAgo < 180) score = 30;
    else score = 15;
  }
  const color = score >= 70 ? "#34d399" : score >= 50 ? "#a78bfa" : score >= 35 ? "#fbbf24" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          flex: 1,
          height: "3px",
          borderRadius: "2px",
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: color,
            borderRadius: "2px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontWeight: 500, minWidth: 24 }}>
        {score}
      </span>
    </div>
  );
}

function formatLastActivity(ts: number | null): string {
  if (!ts) return "No activity yet";
  const daysAgo = Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
  if (daysAgo < 365) return `${Math.floor(daysAgo / 30)} months ago`;
  return `${Math.floor(daysAgo / 365)}y ago`;
}

export function NetworkView({ onSwitchTab, onSelectPerson }: { onSwitchTab: (tab: string) => void; onSelectPerson?: (person: SelectPersonPayload) => void }) {
  const [contacts, setContacts] = useState<NetworkPerson[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All contacts");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);
  const [selectedContact, setSelectedContact] = useState<NetworkPerson | null>(null);
  const [profileContext, setProfileContext] = useState<string>("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [loopState, setLoopState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [trackState, setTrackState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleViewContact = useCallback(async (contact: NetworkPerson) => {
    setSelectedContact(contact);
    setProfileContext("");
    setProfileLoading(true);
    setLoopState("idle");
    setTrackState("idle");
    try {
      const ctx = await getPersonContext(contact.master_person_id);
      setProfileContext(ctx);
    } catch {
      setProfileContext("");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const handleNodeClick = useCallback((personId: number) => {
    const contact = contacts.find(c => c.id === personId);
    if (contact) handleViewContact(contact);
  }, [contacts, handleViewContact]);

  const handleLeverageLoop = useCallback(() => {
    if (!selectedContact) return;
    if (onSelectPerson) {
      onSelectPerson({
        master_person_id: selectedContact.master_person_id,
        full_name: selectedContact.full_name,
        in_my_network: true,
        master_person: {
          name: selectedContact.full_name,
          avatar: selectedContact.master_person?.avatar || null,
          current_title: selectedContact.master_person?.current_title || null,
          master_company: selectedContact.master_person?.master_company || null,
        },
      });
      // page.tsx handleSelectPersonFromView already switches to Copilot
    }
    setSelectedContact(null);
  }, [selectedContact, onSelectPerson]);

  const handleTrack = useCallback(async () => {
    if (!selectedContact) return;
    if (!selectedContact.node_uuid) {
      setTrackState("error");
      return;
    }
    setTrackState("loading");
    try {
      await addHorizonTarget(selectedContact.node_uuid);
      setTrackState("success");
      setTimeout(() => setTrackState("idle"), 2000);
    } catch {
      setTrackState("error");
    }
  }, [selectedContact]);

  const fetchContacts = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const data = await getNetwork({ query: q || undefined, page: p, per_page: 24 });
      setContacts(data.items);
      setTotal(data.itemsTotal);
      setPageTotal(data.pageTotal);
    } catch (err) {
      console.error("Failed to load network:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts(searchQuery, page);
  }, [searchQuery, page, fetchContacts]);

  const filtered =
    activeFilter === "Connected"
      ? contacts.filter((c) => c.status_connected === "connected")
      : activeFilter === "Has title"
      ? contacts.filter((c) => c.master_person?.current_title)
      : activeFilter === "Has company"
      ? contacts.filter((c) => c.master_person?.master_company?.company_name)
      : contacts;

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "28px 32px",
        background: "#0a0a0f",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#e8e8f0",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Your Network
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            {total} contacts{loading ? " · Loading..." : ""}
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "10px",
            padding: "8px 14px",
            minWidth: "220px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <line x1="10" y1="10" x2="14" y2="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search contacts…"
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "#e8e8f0",
              fontSize: "12px",
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
      </div>

      {/* Network Graph */}
      <NetworkGraph onNodeClick={handleNodeClick} />

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              fontSize: "11px",
              fontWeight: 500,
              padding: "5px 12px",
              borderRadius: "20px",
              border: activeFilter === f ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: activeFilter === f ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
              color: activeFilter === f ? "#a5b4fc" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "all 0.12s ease",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Contact grid */}
      {loading && contacts.length === 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "14px", padding: "18px 20px",
              animation: `fadeUp 0.4s ${i * 0.05}s ease both`,
            }}>
              <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                <div className="orbiter-shimmer" style={{ width: 40, height: 40, borderRadius: "10px", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="orbiter-shimmer" style={{ height: 14, borderRadius: 6, marginBottom: 6, width: "60%" }} />
                  <div className="orbiter-shimmer" style={{ height: 11, borderRadius: 6, width: "80%" }} />
                </div>
              </div>
              <div className="orbiter-shimmer" style={{ height: 22, borderRadius: 6, marginBottom: 14 }} />
              <div className="orbiter-shimmer" style={{ height: 3, borderRadius: 3, marginBottom: 14 }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="orbiter-shimmer" style={{ height: 20, borderRadius: 4, width: "45%" }} />
                <div className="orbiter-shimmer" style={{ height: 26, borderRadius: 7, width: "20%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "12px",
            }}
          >
            {filtered.map((c) => {
              const mp = c.master_person;
              const mc = mp?.master_company;
              const connected = c.status_connected === "connected";
              return (
                <div
                  key={c.id}
                  onMouseEnter={() => setHoveredId(c.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: hoveredId === c.id
                      ? (connected ? "rgba(52,211,153,0.04)" : "rgba(99,102,241,0.06)")
                      : "rgba(255,255,255,0.025)",
                    border: connected
                      ? `1px solid ${hoveredId === c.id ? "rgba(52,211,153,0.35)" : "rgba(52,211,153,0.18)"}`
                      : `1px solid ${hoveredId === c.id ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: "14px",
                    padding: "18px 20px",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    position: "relative",
                    transform: hoveredId === c.id ? "translateY(-2px)" : "none",
                    boxShadow: hoveredId === c.id
                      ? (connected ? "0 8px 24px rgba(52,211,153,0.12)" : "0 8px 24px rgba(99,102,241,0.12)")
                      : "none",
                  }}
                >
                  {connected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#34d399",
                        boxShadow: "0 0 6px #34d399",
                      }}
                    />
                  )}

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                    <Avatar name={c.full_name} size={40} borderRadius="10px" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0", marginBottom: "2px" }}>
                        {c.full_name}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {mp?.current_title || "No title"}{mc?.company_name ? ` · ${mc.company_name}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: connected ? "rgba(52,211,153,0.12)" : "rgba(99,102,241,0.12)",
                      border: connected ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(99,102,241,0.25)",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "11px",
                      fontWeight: 500,
                      color: connected ? "#34d399" : "#a5b4fc",
                      marginBottom: "14px",
                    }}
                  >
                    {connected ? "Connected" : c.status_connected === "connect_requested" ? "Pending" : "In Network"}
                  </div>

                  {/* Activity recency */}
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Last Touch</span>
                      <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{formatLastActivity(c.last_activity_at)}</span>
                    </div>
                    {c.last_activity_at ? (
                      <BondBar lastActivity={c.last_activity_at} />
                    ) : (
                      <div style={{ height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.06)" }} />
                    )}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {mp?.current_title && (
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(99,102,241,0.08)", color: "rgba(165,180,252,0.7)", fontWeight: 500, border: "1px solid rgba(99,102,241,0.12)" }}>
                          {mp.current_title.length > 22 ? mp.current_title.slice(0, 22) + "…" : mp.current_title}
                        </span>
                      )}
                      {mc?.company_name && (
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", fontWeight: 500, border: "1px solid rgba(255,255,255,0.07)" }}>
                          {mc.company_name.length > 18 ? mc.company_name.slice(0, 18) + "…" : mc.company_name}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleViewContact(c); }}
                      className="orbiter-btn"
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "5px 14px",
                        borderRadius: "7px",
                        background: connected
                          ? "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(16,185,129,0.1))"
                          : "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.12))",
                        border: connected ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(99,102,241,0.3)",
                        color: connected ? "#34d399" : "#a5b4fc",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        letterSpacing: "0.02em",
                      }}
                    >
                      View →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pageTotal > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                style={{
                  fontSize: "12px", padding: "6px 14px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: page <= 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
                  cursor: page <= 1 ? "default" : "pointer",
                }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", padding: "6px 10px" }}>
                Page {page} of {pageTotal}
              </span>
              <button
                onClick={() => setPage(Math.min(pageTotal, page + 1))}
                disabled={page >= pageTotal}
                style={{
                  fontSize: "12px", padding: "6px 14px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: page >= pageTotal ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
                  cursor: page >= pageTotal ? "default" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Profile slide-over panel */}
      {selectedContact && (
        <>
          <div
            onClick={() => setSelectedContact(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, backdropFilter: "blur(4px)" }}
          />
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: "420px",
            background: "linear-gradient(180deg, #0f0f1a 0%, #0c0c18 100%)",
            borderLeft: "1px solid rgba(99,102,241,0.2)",
            zIndex: 2001, overflowY: "auto", padding: "28px",
            boxShadow: "-16px 0 64px rgba(0,0,0,0.7), -4px 0 24px rgba(99,102,241,0.06)",
            animation: "slideInPanel 0.3s cubic-bezier(0.22,1,0.36,1) both",
          }}>
          <style>{`
            @keyframes slideInPanel {
              from { transform: translateX(40px); opacity: 0; }
              to   { transform: translateX(0);    opacity: 1; }
            }
          `}</style>
            <button onClick={() => setSelectedContact(null)} style={{
              position: "absolute", top: "16px", right: "16px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", color: "rgba(255,255,255,0.4)", cursor: "pointer",
              fontSize: "14px", padding: "4px 10px",
            }}>✕</button>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "20px" }}>
              <Avatar name={selectedContact.full_name} size={52} borderRadius="14px" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#e8e8f0", marginBottom: "4px" }}>
                  {selectedContact.full_name}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {selectedContact.master_person?.current_title || ""}
                  {selectedContact.master_person?.master_company?.company_name
                    ? ` · ${selectedContact.master_person.master_company.company_name}`
                    : ""}
                </div>
                <div style={{ marginTop: "8px" }}>
                  <span style={{
                    fontSize: "10px", fontWeight: 600, padding: "3px 9px", borderRadius: "5px",
                    background: selectedContact.status_connected === "connected" ? "rgba(52,211,153,0.12)" : "rgba(99,102,241,0.1)",
                    border: selectedContact.status_connected === "connected" ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(99,102,241,0.2)",
                    color: selectedContact.status_connected === "connected" ? "#34d399" : "#a5b4fc",
                  }}>
                    {selectedContact.status_connected === "connected" ? "Connected" : "In Network"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px", padding: "12px 14px", marginBottom: "16px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Last Touch</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                {formatLastActivity(selectedContact.last_activity_at)}
              </span>
            </div>

            {profileLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "4px 0" }}>
                {/* About section skeleton */}
                <div>
                  <div className="orbiter-shimmer" style={{ height: 10, width: "25%", borderRadius: 4, marginBottom: 10 }} />
                  <div className="orbiter-shimmer" style={{ height: 12, width: "100%", borderRadius: 6, marginBottom: 5 }} />
                  <div className="orbiter-shimmer" style={{ height: 12, width: "90%", borderRadius: 6, marginBottom: 5 }} />
                  <div className="orbiter-shimmer" style={{ height: 12, width: "70%", borderRadius: 6 }} />
                </div>
                {/* Skills skeleton */}
                <div>
                  <div className="orbiter-shimmer" style={{ height: 10, width: "20%", borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[65, 90, 55, 75, 80].map((w, i) => (
                      <div key={i} className="orbiter-shimmer" style={{ height: 22, width: w, borderRadius: 6 }} />
                    ))}
                  </div>
                </div>
                {/* Work history skeleton */}
                <div>
                  <div className="orbiter-shimmer" style={{ height: 10, width: "28%", borderRadius: 4, marginBottom: 10 }} />
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "12px", paddingLeft: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <div className="orbiter-shimmer" style={{ height: 13, width: "75%", borderRadius: 5, marginBottom: 4 }} />
                        <div className="orbiter-shimmer" style={{ height: 11, width: "55%", borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : profileContext ? (() => {
              const profile = parseProfileYaml(profileContext);
              const bio = profile.bio500 || profile.bio;
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Bio */}
                  {bio && (
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.5)", marginBottom: "8px" }}>About</div>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, margin: 0 }}>{bio}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.5)", marginBottom: "8px" }}>Skills</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {profile.skills.map((s, i) => (
                          <span key={i} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "6px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work history */}
                  {profile.workHistory && profile.workHistory.length > 0 && (
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.5)", marginBottom: "10px" }}>Experience</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {profile.workHistory.slice(0, 5).map((w, i) => (
                          <div key={i} style={{
                            display: "flex", gap: "12px", paddingBottom: "14px",
                            borderLeft: i < profile.workHistory!.length - 1 ? "1px solid rgba(99,102,241,0.15)" : "1px solid transparent",
                            marginLeft: "6px", paddingLeft: "16px", position: "relative",
                          }}>
                            <div style={{
                              position: "absolute", left: "-5px", top: "2px",
                              width: "9px", height: "9px", borderRadius: "50%",
                              background: i === 0 ? "#6366f1" : "rgba(99,102,241,0.3)",
                              border: "2px solid #0f0f1a",
                              boxShadow: i === 0 ? "0 0 6px rgba(99,102,241,0.5)" : "none",
                            }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0", marginBottom: "1px" }}>{w.title}</div>
                              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
                                {w.company}
                                {(w.startYear || w.endYear) && (
                                  <span style={{ marginLeft: "6px", fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
                                    {w.startYear}{w.endYear ? ` → ${w.endYear}` : " → Present"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Roles */}
                  {profile.roles && profile.roles.length > 0 && (
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.5)", marginBottom: "8px" }}>Roles</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {profile.roles.map((r, i) => (
                          <span key={i} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "6px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}>{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })() : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
                No additional profile data available.
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexDirection: "column" }}>
              {/* Ask Copilot CTA */}
              <button
                onClick={() => {
                  if (selectedContact && onSelectPerson) {
                    onSelectPerson({
                      master_person_id: selectedContact.master_person_id,
                      full_name: selectedContact.full_name,
                      in_my_network: true,
                      master_person: {
                        name: selectedContact.full_name,
                        avatar: selectedContact.master_person?.avatar || null,
                        current_title: selectedContact.master_person?.current_title || null,
                        master_company: selectedContact.master_person?.master_company || null,
                      },
                    });
                  } else {
                    onSwitchTab("Copilot");
                  }
                  setSelectedContact(null);
                }}
                style={{
                  width: "100%", padding: "10px", borderRadius: "10px",
                  background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.22)",
                  color: "#a5b4fc", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "Inter, sans-serif", marginBottom: "4px",
                }}
              >
                💬 Ask Copilot about {selectedContact?.full_name?.split(" ")[0] || "this person"} →
              </button>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="orbiter-btn orbiter-btn-primary"
                  onClick={handleLeverageLoop}
                  style={{
                    flex: 1, padding: "11px 0", borderRadius: "10px",
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    border: "none",
                    color: "white",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "Inter, sans-serif", boxShadow: "0 4px 16px rgba(79,70,229,0.3)",
                    opacity: 1,
                  }}
                >
                  ⚡ Leverage Loop
                </button>
                <button
                  className="orbiter-btn"
                  onClick={handleTrack}
                  disabled={trackState === "loading"}
                  style={{
                    flex: 1, padding: "11px 0", borderRadius: "10px",
                    background: trackState === "success" ? "rgba(52,211,153,0.1)" : "rgba(99,102,241,0.08)",
                    border: trackState === "success" ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(99,102,241,0.22)",
                    color: trackState === "success" ? "#34d399" : trackState === "error" ? "#fbbf24" : "#a5b4fc",
                    fontSize: "12px", fontWeight: 500, cursor: trackState === "loading" ? "wait" : "pointer",
                    fontFamily: "Inter, sans-serif",
                    opacity: trackState === "loading" ? 0.7 : 1,
                  }}
                >
                  {trackState === "loading" ? "Adding…" : trackState === "success" ? "🔭 Added to Horizon!" : trackState === "error" && !selectedContact?.node_uuid ? "⚠ Not in graph yet" : trackState === "error" ? "⚠ Failed" : "🔭 Track"}
                </button>
              </div>
              {loopState === "error" && (
                <div style={{ fontSize: "12px", color: "#ef4444", padding: "6px 0" }}>
                  Something went wrong. Please try again.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
