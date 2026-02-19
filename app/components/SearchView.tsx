"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar } from "./Avatar";
import { xanoFetch, getPersonContext, createLeverageLoop, addHorizonTarget } from "../lib/xano";

interface SearchPerson {
  master_person_id: number;
  full_name: string;
  master_person: {
    name: string;
    avatar: string | null;
    current_title: string | null;
    master_company?: { company_name: string } | null;
  };
  node_uuid?: string | null;
  status_connected?: string;
}

interface ProfilePanelPerson extends SearchPerson {
  last_activity_at?: number | null;
}

const EXAMPLE_CHIPS = [
  "VCs who back developer tools",
  "Founders in fintech I haven't talked to in 6 months",
  "Who do I know at OpenAI?",
];

type SearchMode = "network" | "universe";

function SkeletonCard() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "14px",
        padding: "18px 20px",
      }}
    >
      <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
        <div
          className="orbiter-shimmer"
          style={{ width: 44, height: 44, borderRadius: "10px", flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div className="orbiter-shimmer" style={{ height: 14, borderRadius: 6, marginBottom: 6, width: "60%" }} />
          <div className="orbiter-shimmer" style={{ height: 11, borderRadius: 6, width: "80%" }} />
        </div>
      </div>
      <div className="orbiter-shimmer" style={{ height: 22, borderRadius: 6, marginBottom: 14 }} />
      <div style={{ display: "flex", gap: "6px" }}>
        <div className="orbiter-shimmer" style={{ height: 28, borderRadius: 8, flex: 1 }} />
        <div className="orbiter-shimmer" style={{ height: 28, borderRadius: 8, flex: 1 }} />
        <div className="orbiter-shimmer" style={{ height: 28, borderRadius: 8, flex: 1 }} />
      </div>
    </div>
  );
}

export function SearchView({ onSwitchTab }: { onSwitchTab: (tab: string) => void }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("network");
  const [results, setResults] = useState<SearchPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<ProfilePanelPerson | null>(null);
  const [profileContext, setProfileContext] = useState<string>("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [loopStates, setLoopStates] = useState<Record<number, "idle" | "loading" | "success" | "error">>({});
  const [trackStates, setTrackStates] = useState<Record<number, "idle" | "loading" | "success" | "error">>({});
  const [panelLoopState, setPanelLoopState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [panelTrackState, setPanelTrackState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await xanoFetch<{
        itemsReceived: number;
        items: SearchPerson[];
      }>("/person-search", { params: { query: q, limit: "20" } });
      setResults(data.items || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  const handleChipClick = (chip: string) => {
    setQuery(chip);
    inputRef.current?.focus();
  };

  const handleViewProfile = useCallback(async (person: SearchPerson) => {
    setSelectedPerson(person as ProfilePanelPerson);
    setProfileContext("");
    setProfileLoading(true);
    setPanelLoopState("idle");
    setPanelTrackState("idle");
    try {
      const ctx = await getPersonContext(person.master_person_id);
      setProfileContext(ctx);
    } catch {
      setProfileContext("");
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const handleLeverageLoop = useCallback(async (person: SearchPerson) => {
    setLoopStates((s) => ({ ...s, [person.master_person_id]: "loading" }));
    try {
      await createLeverageLoop({
        master_person_id: person.master_person_id,
        request_panel_title: `Leverage Loop: ${person.full_name}`,
        request_context: "Run a leverage loop for this contact — who in my network should I introduce them to and why?",
      });
      setLoopStates((s) => ({ ...s, [person.master_person_id]: "success" }));
    } catch {
      setLoopStates((s) => ({ ...s, [person.master_person_id]: "error" }));
    }
  }, []);

  const handleTrack = useCallback(async (person: SearchPerson) => {
    if (!person.node_uuid) {
      setTrackStates((s) => ({ ...s, [person.master_person_id]: "error" }));
      return;
    }
    setTrackStates((s) => ({ ...s, [person.master_person_id]: "loading" }));
    try {
      await addHorizonTarget(person.node_uuid);
      setTrackStates((s) => ({ ...s, [person.master_person_id]: "success" }));
      setTimeout(() => setTrackStates((s) => ({ ...s, [person.master_person_id]: "idle" })), 2000);
    } catch {
      setTrackStates((s) => ({ ...s, [person.master_person_id]: "error" }));
    }
  }, []);

  const handlePanelLeverageLoop = useCallback(async () => {
    if (!selectedPerson) return;
    setPanelLoopState("loading");
    try {
      await createLeverageLoop({
        master_person_id: selectedPerson.master_person_id,
        request_panel_title: `Leverage Loop: ${selectedPerson.full_name}`,
        request_context: "Run a leverage loop for this contact.",
      });
      setPanelLoopState("success");
    } catch {
      setPanelLoopState("error");
    }
  }, [selectedPerson]);

  const handlePanelTrack = useCallback(async () => {
    if (!selectedPerson || !selectedPerson.node_uuid) {
      setPanelTrackState("error");
      return;
    }
    setPanelTrackState("loading");
    try {
      await addHorizonTarget(selectedPerson.node_uuid);
      setPanelTrackState("success");
      setTimeout(() => setPanelTrackState("idle"), 2000);
    } catch {
      setPanelTrackState("error");
    }
  }, [selectedPerson]);

  const isUniverse = mode === "universe";

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e8e8f0", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Search
        </h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
          Natural language search across your network
        </p>
      </div>

      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "14px",
          boxShadow: "0 0 0 3px rgba(99,102,241,0.06)",
          transition: "border-color 0.2s ease",
        }}
      >
        <span style={{ fontSize: "20px", flexShrink: 0 }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your network in plain English…"
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "#e8e8f0",
            fontSize: "15px",
            fontFamily: "Inter, sans-serif",
            letterSpacing: "-0.01em",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              cursor: "pointer",
              fontSize: "16px",
              padding: "0 4px",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
        {(["network", "universe"] as SearchMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              fontSize: "12px",
              fontWeight: 600,
              padding: "6px 16px",
              borderRadius: "20px",
              border: mode === m ? "1px solid rgba(99,102,241,0.45)" : "1px solid rgba(255,255,255,0.08)",
              background: mode === m ? "rgba(99,102,241,0.14)" : "rgba(255,255,255,0.04)",
              color: mode === m ? "#a5b4fc" : "rgba(255,255,255,0.38)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {m === "network" ? "👤 My Network" : "🌐 Orbiter Universe"}
          </button>
        ))}
      </div>

      {/* Content area */}
      {!hasSearched && !loading ? (
        /* Empty state */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "48px", gap: "20px" }}>
          <div
            style={{
              width: "64px", height: "64px", borderRadius: "18px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
            }}
          >
            🔍
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#e8e8f0", margin: "0 0 6px" }}>
              Your entire network, searchable in plain English
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
              Ask anything. Find anyone.
            </p>
          </div>
          {/* Example chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "560px" }}>
            {EXAMPLE_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "7px 15px",
                  borderRadius: "20px",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "#a5b4fc",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "Inter, sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.16)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.2)";
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : loading ? (
        /* Skeleton loading */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length === 0 ? (
        /* No results */
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔭</div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#e8e8f0", margin: "0 0 6px" }}>No results found</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            Try different keywords or switch to Orbiter Universe
          </p>
        </div>
      ) : (
        /* Results grid */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
          {results.map((person) => {
            const mp = person.master_person;
            const mc = mp?.master_company;
            const loopState = loopStates[person.master_person_id] || "idle";
            const trackState = trackStates[person.master_person_id] || "idle";
            const hovered = hoveredId === person.master_person_id;

            return (
              <div
                key={person.master_person_id}
                onClick={() => handleViewProfile(person)}
                onMouseEnter={() => setHoveredId(person.master_person_id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: hovered ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${hovered ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: "14px",
                  padding: "18px 20px",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  transform: hovered ? "translateY(-2px)" : "none",
                  boxShadow: hovered ? "0 8px 24px rgba(99,102,241,0.12)" : "none",
                }}
              >
                {/* Top row: avatar + name */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                  <Avatar name={person.full_name} size={44} borderRadius="10px" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0", marginBottom: "2px" }}>
                      {person.full_name}
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {mp?.current_title || ""}
                      {mc?.company_name ? ` · ${mc.company_name}` : ""}
                    </div>
                  </div>
                  {/* Connection badge */}
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "5px",
                      background: isUniverse
                        ? "rgba(14,165,233,0.1)"
                        : "rgba(99,102,241,0.1)",
                      border: isUniverse
                        ? "1px solid rgba(14,165,233,0.25)"
                        : "1px solid rgba(99,102,241,0.22)",
                      color: isUniverse ? "#38bdf8" : "#a5b4fc",
                      flexShrink: 0,
                    }}
                  >
                    {isUniverse ? "🌐 Universe" : "👤 In network"}
                  </span>
                </div>

                {/* Action buttons */}
                <div
                  style={{ display: "flex", gap: "6px" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleLeverageLoop(person)}
                    disabled={loopState === "loading"}
                    style={{
                      flex: 1,
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "6px 8px",
                      borderRadius: "7px",
                      background: loopState === "success" ? "rgba(52,211,153,0.12)" : "rgba(99,102,241,0.1)",
                      border: loopState === "success" ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(99,102,241,0.22)",
                      color: loopState === "success" ? "#34d399" : loopState === "error" ? "#ef4444" : "#a5b4fc",
                      cursor: loopState === "loading" ? "wait" : "pointer",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {loopState === "loading" ? "…" : loopState === "success" ? "✓ Done" : loopState === "error" ? "⚠ Err" : "⚡ Loop"}
                  </button>
                  <button
                    onClick={() => handleTrack(person)}
                    disabled={trackState === "loading"}
                    style={{
                      flex: 1,
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "6px 8px",
                      borderRadius: "7px",
                      background: trackState === "success" ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.05)",
                      border: trackState === "success" ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.09)",
                      color: trackState === "success" ? "#34d399" : trackState === "error" ? "#fbbf24" : "rgba(255,255,255,0.5)",
                      cursor: trackState === "loading" ? "wait" : "pointer",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {trackState === "loading" ? "…" : trackState === "success" ? "✓ Added" : "🔭 Track"}
                  </button>
                  <button
                    onClick={() => onSwitchTab("Copilot")}
                    style={{
                      flex: 1,
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "6px 8px",
                      borderRadius: "7px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    💬 Copilot
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile slide-over panel */}
      {selectedPerson && (
        <>
          <div
            onClick={() => setSelectedPerson(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, backdropFilter: "blur(4px)" }}
          />
          <div
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, width: "400px",
              background: "linear-gradient(180deg, #0f0f1a 0%, #0c0c18 100%)",
              borderLeft: "1px solid rgba(99,102,241,0.2)",
              zIndex: 2001, overflowY: "auto", padding: "28px",
              boxShadow: "-16px 0 64px rgba(0,0,0,0.7), -4px 0 24px rgba(99,102,241,0.06)",
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
              onClick={() => setSelectedPerson(null)}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px", color: "rgba(255,255,255,0.4)", cursor: "pointer",
                fontSize: "14px", padding: "4px 10px",
              }}
            >✕</button>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "20px" }}>
              <Avatar name={selectedPerson.full_name} size={52} borderRadius="14px" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#e8e8f0", marginBottom: "4px" }}>
                  {selectedPerson.full_name}
                </div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {selectedPerson.master_person?.current_title || ""}
                  {selectedPerson.master_person?.master_company?.company_name
                    ? ` · ${selectedPerson.master_person.master_company.company_name}`
                    : ""}
                </div>
                <div style={{ marginTop: "8px" }}>
                  <span
                    style={{
                      fontSize: "10px", fontWeight: 600, padding: "3px 9px", borderRadius: "5px",
                      background: isUniverse ? "rgba(14,165,233,0.1)" : "rgba(99,102,241,0.1)",
                      border: isUniverse ? "1px solid rgba(14,165,233,0.25)" : "1px solid rgba(99,102,241,0.2)",
                      color: isUniverse ? "#38bdf8" : "#a5b4fc",
                    }}
                  >
                    {isUniverse ? "🌐 Universe" : "👤 In network"}
                  </span>
                </div>
              </div>
            </div>

            {profileLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                {[100, 80, 90, 70].map((w, i) => (
                  <div key={i} className="orbiter-shimmer" style={{ height: 13, borderRadius: 6, width: `${w}%` }} />
                ))}
              </div>
            ) : profileContext ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px", padding: "14px", marginTop: "4px",
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.5)", marginBottom: "8px" }}>Profile</div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap", maxHeight: "300px", overflow: "auto" }}>
                  {profileContext.slice(0, 800)}{profileContext.length > 800 ? "…" : ""}
                </p>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.2)", fontSize: "13px" }}>
                No additional profile data available.
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                onClick={handlePanelLeverageLoop}
                disabled={panelLoopState === "loading"}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: "10px",
                  background: panelLoopState === "success" ? "rgba(52,211,153,0.15)" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  border: panelLoopState === "success" ? "1px solid rgba(52,211,153,0.35)" : "none",
                  color: panelLoopState === "success" ? "#34d399" : "white",
                  fontSize: "12px", fontWeight: 600, cursor: panelLoopState === "loading" ? "wait" : "pointer",
                  fontFamily: "Inter, sans-serif",
                  boxShadow: panelLoopState === "success" ? "none" : "0 4px 16px rgba(79,70,229,0.3)",
                  opacity: panelLoopState === "loading" ? 0.7 : 1,
                }}
              >
                {panelLoopState === "loading" ? "Creating…" : panelLoopState === "success" ? "✓ Loop Created!" : "⚡ Leverage Loop"}
              </button>
              <button
                onClick={handlePanelTrack}
                disabled={panelTrackState === "loading"}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: "10px",
                  background: panelTrackState === "success" ? "rgba(52,211,153,0.1)" : "rgba(99,102,241,0.08)",
                  border: panelTrackState === "success" ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(99,102,241,0.22)",
                  color: panelTrackState === "success" ? "#34d399" : panelTrackState === "error" ? "#fbbf24" : "#a5b4fc",
                  fontSize: "12px", fontWeight: 500, cursor: panelTrackState === "loading" ? "wait" : "pointer",
                  fontFamily: "Inter, sans-serif",
                  opacity: panelTrackState === "loading" ? 0.7 : 1,
                }}
              >
                {panelTrackState === "loading" ? "Adding…" : panelTrackState === "success" ? "🔭 Tracked!" : "🔭 Track"}
              </button>
            </div>
            {panelLoopState === "success" && (
              <button
                onClick={() => { setSelectedPerson(null); onSwitchTab("Outcomes"); }}
                style={{
                  width: "100%", marginTop: "8px", padding: "8px",
                  borderRadius: "8px", background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.2)", color: "#34d399",
                  fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif",
                }}
              >
                View in Outcomes →
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
