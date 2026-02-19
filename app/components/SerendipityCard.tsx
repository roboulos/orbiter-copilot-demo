"use client";

import { useState, useEffect } from "react";
import { Avatar } from "./Avatar";
import { createOutcome, searchPersons } from "../lib/xano";

interface SerendipityCardProps {
  personA: string;
  personARole: string;
  personACompany: string;
  personB: string;
  personBRole: string;
  personBCompany: string;
  whyTheyMatch: string;
  sharedContext: string[];
  suggestedIntro: string;
  confidence: "high" | "medium" | "speculative";
  masterPersonId?: number;
}

const confidenceConfig = {
  high:        { label: "High resonance", color: "#34d399", dot: "#10b981", glow: "rgba(52,211,153,0.35)", arcColor: "#34d399", pct: 92 },
  medium:      { label: "Good match",     color: "#fbbf24", dot: "#f59e0b", glow: "rgba(245,158,11,0.35)",  arcColor: "#fbbf24", pct: 68 },
  speculative: { label: "Moonshot match", color: "#a78bfa", dot: "#8b5cf6", glow: "rgba(139,92,246,0.40)",  arcColor: "#a78bfa", pct: 45 },
};

// Animated SVG connection arc between two avatars
function ConnectionArc({ color, pct }: { color: string; pct: number }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 120); return () => clearTimeout(t); }, []);

  // Arc path: horizontal spline with upward bow
  const W = 110, H = 40;
  const d = `M 10,${H} Q ${W / 2},4 ${W - 10},${H}`;
  const total = 200;
  const dash = animated ? total : 0;

  return (
    <div style={{ width: W, height: H, flexShrink: 0, position: "relative" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible">
        {/* Track */}
        <path d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Animated fill */}
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${total} ${total}`}
          strokeDashoffset={total - dash}
          style={{
            transition: animated ? "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)" : "none",
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />
        {/* Moving spark along the path */}
        {animated && (
          <circle r="3" fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }}>
            <animateMotion dur="3s" repeatCount="indefinite" path={d} />
          </circle>
        )}
      </svg>

      {/* Strength label below arc */}
      <div style={{
        position: "absolute",
        bottom: -14,
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: color,
        opacity: 0.75,
        whiteSpace: "nowrap",
      }}>
        {pct}% match
      </div>
    </div>
  );
}

// Floating spark particles in the connector zone
function SparkParticles({ color }: { color: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`orbiter-spark${i > 0 ? ` orbiter-spark-delay-${i}` : ""}`}
          style={{
            position: "absolute",
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}`,
            top: `${20 + i * 18}%`,
            left: `${30 + i * 15}%`,
          }}
        />
      ))}
    </div>
  );
}

export function SerendipityCard({
  personA,
  personARole,
  personACompany,
  personB,
  personBRole,
  personBCompany,
  whyTheyMatch,
  sharedContext = [],
  suggestedIntro,
  confidence = "medium",
  masterPersonId,
}: SerendipityCardProps) {
  const cfg = confidenceConfig[confidence];
  const [introMsg, setIntroMsg] = useState(suggestedIntro);
  const [editingIntro, setEditingIntro] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMakeIntro = async () => {
    if (sending || sent) return;
    setSending(true);
    try {
      let personId = masterPersonId;
      if (!personId) {
        const results = await searchPersons(personA, 1);
        if (results.items.length > 0) personId = results.items[0].master_person_id;
      }
      await createOutcome({
        copilot_mode: "serendipity",
        request_panel_title: `Introduce ${personA} to ${personB}`,
        request_context: `${whyTheyMatch}\n\nShared context: ${sharedContext.join(", ")}\n\nDraft intro: ${introMsg}`,
        ...(personId ? { master_person_id: personId } : {}),
      });
      setSent(true);
    } catch (err) {
      console.error("Failed to create serendipity intro:", err);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(introMsg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="orbiter-card-enter"
      style={{
        background: "linear-gradient(160deg, #0e0e1b 0%, #13131f 55%, #0c0c18 100%)",
        border: `1px solid ${sent ? "rgba(52,211,153,0.3)" : "rgba(139,92,246,0.22)"}`,
        borderRadius: "18px",
        padding: "22px",
        margin: "6px 0",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.4s ease",
        boxShadow: sent
          ? "0 4px 32px rgba(52,211,153,0.12)"
          : "0 4px 32px rgba(139,92,246,0.09), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", top: -60, right: -40,
        width: 180, height: 180,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -40, left: -30,
        width: 120, height: 120,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Top glow line */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "55%", height: "1px",
        background: `linear-gradient(90deg, transparent, ${cfg.arcColor}66, transparent)`,
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{
          background: "linear-gradient(135deg, #5b21b6, #7c3aed, #a855f7)",
          borderRadius: "8px",
          padding: "4px 12px",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "white",
          boxShadow: "0 2px 12px rgba(124,58,237,0.35)",
        }}>
          ✨ Serendipity
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: cfg.dot,
            boxShadow: `0 0 10px ${cfg.glow}`,
            animation: "glowPulse 2.4s ease-in-out infinite",
          }} />
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.40)", fontWeight: 500 }}>
            {cfg.label}
          </span>
        </div>
      </div>

      {/* ─── CONNECTION VISUALIZATION ─────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0",
        marginBottom: "28px",
        position: "relative",
        padding: "4px 0",
      }}>
        {/* Person A */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{
            margin: "0 auto 8px",
            width: 48,
            display: "flex",
            justifyContent: "center",
          }}>
            <div style={{ position: "relative" }}>
              <Avatar name={personA} size={48} borderRadius="50%"
                style={{ boxShadow: "0 4px 20px rgba(99,102,241,0.4)" }} />
              {/* Ring */}
              <div style={{
                position: "absolute", inset: -3,
                borderRadius: "50%",
                border: "1px solid rgba(99,102,241,0.3)",
                pointerEvents: "none",
              }} />
            </div>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8e8f0", letterSpacing: "-0.01em" }}>
            {personA}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.42)", marginTop: "2px", lineHeight: 1.4 }}>
            {personARole}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}>
            {personACompany}
          </div>
        </div>

        {/* Arc connector */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "4px",
          gap: "16px",
          position: "relative",
          flexShrink: 0,
        }}>
          <ConnectionArc color={cfg.arcColor} pct={cfg.pct} />
        </div>

        {/* Person B */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{
            margin: "0 auto 8px",
            width: 48,
            display: "flex",
            justifyContent: "center",
          }}>
            <div style={{ position: "relative" }}>
              <Avatar name={personB} size={48} borderRadius="50%"
                style={{ boxShadow: `0 4px 20px ${cfg.glow}` }} />
              <div style={{
                position: "absolute", inset: -3,
                borderRadius: "50%",
                border: `1px solid ${cfg.arcColor}55`,
                pointerEvents: "none",
              }} />
            </div>
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8e8f0", letterSpacing: "-0.01em" }}>
            {personB}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.42)", marginTop: "2px", lineHeight: 1.4 }}>
            {personBRole}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}>
            {personBCompany}
          </div>
        </div>
      </div>

      {/* Why they match */}
      <div style={{
        background: "rgba(139,92,246,0.07)",
        borderLeft: "3px solid rgba(139,92,246,0.45)",
        borderRadius: "0 12px 12px 0",
        padding: "12px 16px",
        marginBottom: "16px",
      }}>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "rgba(167,139,250,0.7)",
          marginBottom: "6px",
        }}>
          Why Orbiter surfaced this
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.80)", lineHeight: 1.6 }}>
          {whyTheyMatch}
        </div>
      </div>

      {/* Shared context — pill tags */}
      {sharedContext.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.09em",
            textTransform: "uppercase", color: "rgba(167,139,250,0.65)",
            marginBottom: "10px",
          }}>
            What they share
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {sharedContext.map((point, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(139,92,246,0.09)",
                  border: "1px solid rgba(139,92,246,0.22)",
                  borderRadius: "100px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  color: "rgba(167,139,250,0.85)",
                  fontWeight: 500,
                  animation: `fadeUp 0.35s ${0.05 * i}s ease both`,
                }}
              >
                <span style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: cfg.dot, flexShrink: 0,
                  boxShadow: `0 0 5px ${cfg.dot}`,
                }} />
                {point}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft intro message */}
      <div style={{
        background: "rgba(255,255,255,0.025)",
        borderRadius: "12px",
        padding: "14px 16px",
        border: editingIntro
          ? "1px solid rgba(139,92,246,0.35)"
          : "1px solid rgba(255,255,255,0.06)",
        marginBottom: "16px",
        transition: "border-color 0.18s ease",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "10px",
        }}>
          <div style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.09em",
            textTransform: "uppercase", color: "rgba(167,139,250,0.65)",
          }}>
            💬 Draft intro
          </div>
          <button
            onClick={() => setEditingIntro(!editingIntro)}
            style={{
              background: editingIntro ? "rgba(139,92,246,0.12)" : "none",
              border: editingIntro ? "1px solid rgba(139,92,246,0.3)" : "none",
              color: "rgba(139,92,246,0.7)",
              fontSize: "11px",
              fontWeight: 500,
              cursor: "pointer",
              padding: editingIntro ? "2px 8px" : "0",
              borderRadius: "6px",
              fontFamily: "Inter, sans-serif",
              transition: "all 0.15s ease",
            }}
          >
            {editingIntro ? "Done" : "Edit"}
          </button>
        </div>

        {editingIntro ? (
          <textarea
            value={introMsg}
            onChange={(e) => setIntroMsg(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              fontSize: "13px",
              color: "rgba(255,255,255,0.82)",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "Inter, sans-serif",
              resize: "vertical",
              lineHeight: 1.65,
              padding: 0,
              boxSizing: "border-box",
            }}
          />
        ) : (
          <div style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.68)",
            lineHeight: 1.7,
            borderLeft: "2px solid rgba(139,92,246,0.3)",
            paddingLeft: "12px",
            fontStyle: "italic",
          }}>
            "{introMsg}"
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{
        paddingTop: "14px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        gap: "8px",
      }}>
        <button
          onClick={handleMakeIntro}
          disabled={sending}
          className={sent ? "orbiter-success-pop" : "orbiter-btn orbiter-btn-primary"}
          style={{
            flex: 2,
            padding: "10px 0",
            background: sent
              ? "rgba(52,211,153,0.1)"
              : "linear-gradient(135deg, #7c3aed, #a855f7)",
            border: sent ? "1px solid rgba(52,211,153,0.3)" : "none",
            borderRadius: "10px",
            color: sent ? "#34d399" : "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: sending ? "wait" : "pointer",
            opacity: sending ? 0.7 : 1,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          {sent ? "✓ Intro Queued" : sending ? "Sending…" : "Make the Intro"}
        </button>
        <button
          onClick={handleCopy}
          className="orbiter-btn"
          style={{
            flex: 1,
            padding: "10px 0",
            background: copied ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.09)"}`,
            borderRadius: "10px",
            color: copied ? "#34d399" : "rgba(255,255,255,0.5)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          className="orbiter-btn"
          style={{
            flex: 1,
            padding: "10px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.4)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
