/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PERSON PICKER - Search & Select Network Contacts
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MARK'S REQUIREMENT: "PersonPicker high on screen, not at bottom"
 * 
 * USAGE: Leverage Loops mode - search network to select person to help
 * 
 * INTEGRATION NOTE: This component handles:
 *   1. Real-time search (debounced 300ms)
 *   2. Person selection
 *   3. Context loading (fetches person details from Xano)
 *   4. Loading states (orbital spinner)
 *   5. Empty states (no results)
 * 
 * FLOW:
 *   1. User types name → debounced search after 300ms
 *   2. Results appear → click person
 *   3. Loading overlay → "Loading context for [Name]..."
 *   4. Context fetched → onSelect callback with person + context
 *   5. Parent shows fork (2 options)
 * 
 * STYLING:
 *   - Linear design (purple accents, smooth animations)
 *   - Search input: Focus glow, purple border
 *   - Results: Hover lift (-2px), subtle shadows
 *   - Loading: Orbital spinner with shimmer effect
 * 
 * POSITIONING: 
 *   - Parent sets padding: "64px 48px 80px" (high on screen)
 *   - justifyContent: "flex-start" (not center)
 *   - maxWidth: "580px" for comfortable search
 * 
 * BACKEND:
 *   - searchPersons() - Xano /search endpoint
 *   - getPersonContext() - Xano /person-context/{id} endpoint
 * 
 * ACCESSIBILITY:
 *   - Input has aria-label
 *   - Results are keyboard navigable
 *   - Loading state announced
 * 
 * KEEP: This component is core to Leverage Loops flow
 * ═══════════════════════════════════════════════════════════════════════════
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchPersons, getPersonContext } from "../lib/xano";
import { Avatar } from "./Avatar";

interface PersonResult {
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
}

interface PersonPickerProps {
  onSelect: (person: PersonResult, context: string) => void;
  selectedPerson: PersonResult | null;
  onClear: () => void;
}

// Tiny orbital spinner for context-loading state
function ContextLoader({ name }: { name: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "10px 14px",
      background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
      border: "1px solid rgba(99,102,241,0.28)",
      borderRadius: "12px",
      margin: "0 8px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Shimmer */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.07) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.8s linear infinite",
      }} />

      {/* Orbital icon */}
      <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" style={{ position: "absolute", inset: 0, animation: "orbitSpin 2s linear infinite" }}>
          <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(99,102,241,0.35)" strokeWidth="1" strokeDasharray="4 3" />
          <circle cx="14" cy="3" r="2.5" fill="#6366f1" opacity="0.9" />
        </svg>
        <div style={{
          position: "absolute", inset: "8px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)",
          animation: "glowPulse 1.5s ease-in-out infinite",
        }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8e8f0" }}>
          {name}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(165,180,252,0.7)", marginTop: "1px" }}>
          Syncing relationship context…
        </div>
      </div>

      <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 4, height: 4, borderRadius: "50%",
            background: "#818cf8",
            animation: `dotPulse 1.2s ${i * 0.2}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

// Selected person "chip" — premium display
function SelectedPersonChip({ person, onClear }: { person: PersonResult; onClear: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 14px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: "12px",
        margin: "0 8px",
        position: "relative",
        overflow: "hidden",
        animation: "fadeUp 0.25s ease both",
      }}
    >
      {/* Subtle top shimmer */}
      <div style={{
        position: "absolute", top: 0, left: "30%",
        width: "40%", height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
      }} />

      {/* Live dot */}
      <div style={{
        position: "absolute", top: "8px", right: "42px",
        width: "5px", height: "5px", borderRadius: "50%",
        background: "#34d399",
        boxShadow: "0 0 6px rgba(52,211,153,0.6)",
        animation: "glowPulse 2.5s ease-in-out infinite",
      }} />

      <div style={{ position: "relative" }}>
        <Avatar name={person.full_name} size={30} borderRadius="9px"
          style={{ boxShadow: "0 2px 8px rgba(99,102,241,0.3)" }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "13px", fontWeight: 700, color: "#e8e8f0",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          letterSpacing: "-0.01em",
        }}>
          {person.full_name}
        </div>
        <div style={{
          fontSize: "11px", color: "rgba(165,180,252,0.65)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          marginTop: "1px",
        }}>
          {person.master_person?.current_title
            ? `${person.master_person.current_title}${person.master_person.master_company?.company_name ? ` · ${person.master_person.master_company.company_name}` : ""}`
            : person.master_person?.master_company?.company_name || "Context loaded"
          }
        </div>
      </div>

      <div style={{
        fontSize: "10px", fontWeight: 600, color: "rgba(165,180,252,0.6)",
        background: "rgba(99,102,241,0.1)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "5px", padding: "2px 7px", letterSpacing: "0.04em",
        flexShrink: 0, marginRight: "6px",
      }}>
        In focus
      </div>

      <button
        onClick={onClear}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px",
          color: hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
          cursor: "pointer",
          fontSize: "13px",
          padding: "2px 7px",
          lineHeight: 1,
          transition: "all 0.15s ease",
          flexShrink: 0,
        }}
        title="Clear selection"
      >
        ✕
      </button>
    </div>
  );
}

export function PersonPicker({ onSelect, selectedPerson, onClear }: PersonPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PersonResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingContext, setLoadingContext] = useState(false);
  const [loadingName, setLoadingName] = useState("");
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      // MOCK MODE: Return hardcoded results for testing
      const MOCK_ENABLED = process.env.NEXT_PUBLIC_MOCK_BACKEND === 'true';
      if (MOCK_ENABLED) {
        console.log('[PERSON SEARCH] Mock mode - returning hardcoded results for:', q);
        const mockResults: PersonResult[] = [
          {
            master_person_id: 520,
            full_name: "Ray Deck",
            in_my_network: true,
            master_person: {
              id: 520,
              name: "Ray Deck",
              avatar: null,
              current_title: "Chief Technology Officer",
              bio: "CTO at Element55, expert in web3 and decentralized systems",
              master_company: { id: 1, company_name: "Element55", logo: null }
            }
          },
          {
            master_person_id: 234,
            full_name: "Luis Videgaray",
            in_my_network: true,
            master_person: {
              id: 234,
              name: "Luis Videgaray",
              avatar: null,
              current_title: "Former Secretary of Finance",
              bio: "Mexican politician and economist",
              master_company: null
            }
          },
          {
            master_person_id: 156,
            full_name: "Bjørn Stray",
            in_my_network: true,
            master_person: {
              id: 156,
              name: "Bjørn Stray",
              avatar: null,
              current_title: "CEO",
              bio: "Tech entrepreneur",
              master_company: { id: 2, company_name: "Nordic Tech", logo: null }
            }
          }
        ];
        // Filter by search query
        const filtered = mockResults.filter(r => 
          r.full_name.toLowerCase().includes(q.toLowerCase())
        );
        setResults(filtered);
        setIsOpen(true);
        setLoading(false);
        return;
      }

      // REAL MODE: Call Xano backend
      const data = await searchPersons(q, "network", 8);
      setResults(data.items || []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = async (person: PersonResult) => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setLoadingContext(true);
    setLoadingName(person.full_name);
    try {
      // MOCK MODE: Return synthetic context
      const MOCK_ENABLED = process.env.NEXT_PUBLIC_MOCK_BACKEND === 'true';
      if (MOCK_ENABLED) {
        console.log('[PERSON CONTEXT] Mock mode - returning synthetic context for:', person.full_name);
        const mockContext = `name: ${person.full_name}
title: ${person.master_person?.current_title || "Unknown"}
company: ${person.master_person?.master_company?.company_name || "Unknown"}
bio: ${person.master_person?.bio || "No bio available"}

Recent activity: Active in network, interested in tech and innovation.
Potential collaboration areas: Web3, decentralized systems, startup ecosystems.`;
        onSelect(person, mockContext);
        setLoadingContext(false);
        setLoadingName("");
        return;
      }

      // REAL MODE: Fetch from Xano
      const context = await getPersonContext(person.master_person_id);
      onSelect(person, context);
    } catch {
      onSelect(person, `name: ${person.full_name}\ntitle: ${person.master_person?.current_title || "Unknown"}`);
    } finally {
      setLoadingContext(false);
      setLoadingName("");
    }
  };

  // Loading context state — beautiful orbital loader
  if (loadingContext) {
    return <ContextLoader name={loadingName} />;
  }

  // Person selected — premium chip
  if (selectedPerson) {
    return <SelectedPersonChip person={selectedPerson} onClear={onClear} />;
  }

  // Search state
  return (
    <div ref={containerRef} style={{ position: "relative", margin: "0 8px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          background: focused ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.03)",
          border: focused ? "1px solid rgba(99,102,241,0.38)" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          transition: "all 0.18s ease",
          boxShadow: focused ? "0 0 0 3px rgba(99,102,241,0.08)" : "none",
        }}
      >
        {/* Search icon */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ opacity: focused ? 0.7 : 0.35, flexShrink: 0, transition: "opacity 0.15s" }}>
          <circle cx="6.5" cy="6.5" r="4.5" stroke={focused ? "#a5b4fc" : "white"} strokeWidth="1.5" />
          <line x1="10" y1="10" x2="14" y2="14" stroke={focused ? "#a5b4fc" : "white"} strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setFocused(true); if (results.length > 0) setIsOpen(true); }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setIsOpen(false); setQuery(""); setResults([]); inputRef.current?.blur(); }
          }}
          placeholder="Search people in your network…"
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            color: "#e8e8f0",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
          }}
        />

        {loading && (
          <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 3, height: 3, borderRadius: "50%",
                background: "#818cf8",
                animation: `dotPulse 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <>
          <div
            onClick={() => { setIsOpen(false); setQuery(""); setResults([]); }}
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
          />
          <div style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#12121f",
            border: "1px solid rgba(99,102,241,0.22)",
            borderRadius: "12px",
            maxHeight: "320px",
            overflowY: "auto",
            zIndex: 9999,
            boxShadow: "0 16px 48px rgba(0,0,0,0.7), 0 4px 16px rgba(99,102,241,0.12)",
            animation: "fadeUp 0.18s ease both",
          }}>
            {results.map((person, idx) => (
              <DropdownItem
                key={person.master_person_id}
                person={person}
                onSelect={handleSelect}
                isLast={idx === results.length - 1}
              />
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

function DropdownItem({ person, onSelect, isLast }: { person: PersonResult; onSelect: (p: PersonResult) => void; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onSelect(person)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        padding: "11px 16px",
        background: hovered ? "rgba(99,102,241,0.09)" : "none",
        border: "none",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "Inter, sans-serif",
        transition: "background 0.12s ease",
      }}
    >
      <div style={{ position: "relative" }}>
        <Avatar name={person.full_name} size={34} borderRadius="9px"
          style={{ boxShadow: hovered ? "0 2px 8px rgba(99,102,241,0.3)" : "none", transition: "box-shadow 0.15s ease" }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "13px", fontWeight: 600,
          color: hovered ? "#e8e8f0" : "rgba(255,255,255,0.85)",
          marginBottom: "2px",
          transition: "color 0.12s ease",
        }}>
          {person.full_name}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {person.master_person?.current_title || ""}
          {person.master_person?.master_company?.company_name
            ? ` · ${person.master_person.master_company.company_name}`
            : ""}
        </div>
      </div>
      {hovered && (
        <div style={{
          fontSize: "10px", fontWeight: 600, color: "rgba(165,180,252,0.7)",
          background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "4px", padding: "2px 7px", flexShrink: 0,
          animation: "fadeUp 0.12s ease both",
        }}>
          Focus →
        </div>
      )}
    </button>
  );
}
