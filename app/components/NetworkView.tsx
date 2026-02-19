"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar } from "./Avatar";
import { NetworkGraph } from "./NetworkGraph";
import { getNetwork, type NetworkPerson } from "../lib/xano";

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

export function NetworkView() {
  const [contacts, setContacts] = useState<NetworkPerson[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All contacts");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageTotal, setPageTotal] = useState(1);

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
      <NetworkGraph />

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
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>
          Loading your network...
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
                    background: hoveredId === c.id ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.025)",
                    border: connected
                      ? "1px solid rgba(52,211,153,0.2)"
                      : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "14px",
                    padding: "18px 20px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    position: "relative",
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
                    {connected ? "🔗 Connected" : c.status_connected === "connect_requested" ? "⏳ Pending" : "👤 In network"}
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
                    <div style={{ display: "flex", gap: "5px" }}>
                      {mp?.current_title && (
                        <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                          {mp.current_title.split(" ").slice(0, 2).join(" ")}
                        </span>
                      )}
                      {mc?.company_name && (
                        <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                          {mc.company_name}
                        </span>
                      )}
                    </div>
                    <button
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "5px 12px",
                        borderRadius: "7px",
                        background: connected ? "rgba(52,211,153,0.12)" : "rgba(99,102,241,0.1)",
                        border: connected ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(99,102,241,0.2)",
                        color: connected ? "#34d399" : "#a5b4fc",
                        cursor: "pointer",
                      }}
                    >
                      View
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
    </div>
  );
}
