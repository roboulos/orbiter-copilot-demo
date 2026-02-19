"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchPersons, getPersonContext } from "../lib/xano";
import { Avatar } from "./Avatar";

interface PersonResult {
  master_person_id: number;
  full_name: string;
  master_person: {
    name: string;
    avatar: string | null;
    current_title: string | null;
    master_company?: { company_name: string } | null;
  };
}

interface PersonPickerProps {
  onSelect: (person: PersonResult, context: string) => void;
  selectedPerson: PersonResult | null;
  onClear: () => void;
}

export function PersonPicker({ onSelect, selectedPerson, onClear }: PersonPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PersonResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingContext, setLoadingContext] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await searchPersons(q, 8);
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
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Close dropdown on outside click
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
    setLoadingContext(true);
    try {
      const context = await getPersonContext(person.master_person_id);
      onSelect(person, context);
    } catch {
      onSelect(person, `name: ${person.full_name}\ntitle: ${person.master_person.current_title || "Unknown"}`);
    } finally {
      setLoadingContext(false);
    }
  };

  if (selectedPerson) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 14px",
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "10px",
          margin: "0 16px",
        }}
      >
        <Avatar name={selectedPerson.full_name} size={28} borderRadius="8px" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedPerson.full_name}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {selectedPerson.master_person.current_title}
            {selectedPerson.master_person.master_company?.company_name
              ? ` at ${selectedPerson.master_person.master_company.company_name}`
              : ""}
          </div>
        </div>
        <button
          onClick={onClear}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.3)",
            cursor: "pointer",
            fontSize: "16px",
            padding: "2px 6px",
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative", margin: "0 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px",
        }}
      >
        <span style={{ fontSize: "14px", opacity: 0.4 }}>👤</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={(e) => { if (e.key === "Escape") { setIsOpen(false); setQuery(""); setResults([]); } }}
          placeholder={loadingContext ? "Loading context..." : "Search your network..."}
          disabled={loadingContext}
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
        {(loading || loadingContext) && (
          <span style={{ fontSize: "11px", color: "rgba(99,102,241,0.6)" }}>
            {loadingContext ? "⏳" : "..."}
          </span>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            onClick={() => { setIsOpen(false); setQuery(""); setResults([]); }}
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
          />
          <div
          style={{
            position: "fixed",
            top: containerRef.current
              ? containerRef.current.getBoundingClientRect().bottom + 4
              : 0,
            left: containerRef.current
              ? containerRef.current.getBoundingClientRect().left
              : 0,
            width: containerRef.current
              ? containerRef.current.getBoundingClientRect().width
              : "auto",
            background: "#13131f",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "10px",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {results.map((person) => (
            <button
              key={person.master_person_id}
              onClick={() => handleSelect(person)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                padding: "10px 14px",
                background: "none",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <Avatar name={person.full_name} size={32} borderRadius="8px" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "#e8e8f0" }}>
                  {person.full_name}
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
                  {person.master_person.current_title || ""}
                  {person.master_person.master_company?.company_name
                    ? ` · ${person.master_person.master_company.company_name}`
                    : ""}
                </div>
              </div>
            </button>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
