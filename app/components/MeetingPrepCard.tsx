"use client";

import { Avatar } from "./Avatar";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MEETING PREP CARD - Charlotte's Backend Integration
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * UPDATED: Feb 27, 2026 to match Charlotte's actual response structure
 * 
 * Charlotte's response has prep.talking_points with:
 *   - topic
 *   - opener
 *   - why_they_care (snake_case, NOT camelCase!)
 * 
 * Backend endpoint: POST /meeting-prep
 * ═══════════════════════════════════════════════════════════════════════════
 */

interface TalkingPoint {
  topic: string;
  opener: string;
  why_they_care: string; // Charlotte uses snake_case
}

interface MeetingPrepCardProps {
  personName: string;
  personTitle?: string;
  personCompany?: string;
  summary: string; // Maps to Charlotte's prep.person_summary
  talkingPoints: TalkingPoint[];
  listenFor: string[]; // Maps to Charlotte's prep.listen_for
  landmines: string[]; // Maps to Charlotte's prep.landmines
  sharedContext?: string;
  masterPersonId?: number;
}

function buildMarkdown(props: MeetingPrepCardProps): string {
  const { personName, personTitle, personCompany, summary, talkingPoints, listenFor, landmines, sharedContext } = props;
  const lines: string[] = [];
  lines.push(`# Meeting Prep: ${personName}`);
  if (personTitle || personCompany) {
    lines.push(`*${[personTitle, personCompany].filter(Boolean).join(" @ ")}*`);
  }
  lines.push("");
  lines.push("## Summary");
  lines.push(summary);
  lines.push("");
  lines.push("## Talking Points");
  for (const tp of talkingPoints) {
    lines.push(`### ${tp.topic}`);
    lines.push(`**Opener:** *${tp.opener}*`);
    lines.push(`**Why they care:** ${tp.why_they_care}`);
    lines.push("");
  }
  lines.push("## Listen For");
  for (const item of listenFor) lines.push(`- ✅ ${item}`);
  lines.push("");
  lines.push("## Landmines (Avoid)");
  for (const item of landmines) lines.push(`- ${item}`);
  if (sharedContext) {
    lines.push("");
    lines.push("## Shared Context");
    lines.push(sharedContext);
  }
  return lines.join("\n");
}

export function MeetingPrepCard(props: MeetingPrepCardProps) {
  const {
    personName,
    personTitle,
    personCompany,
    summary,
    talkingPoints = [],
    listenFor = [],
    landmines = [],
    sharedContext,
  } = props;

  const handleCopyBrief = () => {
    const md = buildMarkdown(props);
    navigator.clipboard.writeText(md).catch(console.error);
  };

  return (
    <div
      style={{
        background: "linear-gradient(160deg, #0f0f1a 0%, #0c0c18 100%)",
        border: "1px solid rgba(99,102,241,0.25)",
        borderLeft: "4px solid #6366f1",
        borderRadius: "14px",
        overflow: "hidden",
        fontFamily: "Inter, -apple-system, sans-serif",
        maxWidth: "620px",
      }}
    >
      {/* ─── Header ─────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "18px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Avatar name={personName} size={40} borderRadius="10px" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#e8e8f0", marginBottom: "2px" }}>
            {personName}
          </div>
          {(personTitle || personCompany) && (
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {[personTitle, personCompany].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
        {/* Badge */}
        <div
          style={{
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.35)",
            color: "#fbbf24",
            borderRadius: "6px",
            padding: "4px 9px",
            flexShrink: 0,
          }}
        >
          Meeting Prep
        </div>
      </div>

      {/* ─── Body ─────────────────────────────────────────── */}
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Summary */}
        <section>
          <SectionLabel>Summary</SectionLabel>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: 0 }}>
            {summary}
          </p>
        </section>

        {/* Talking Points */}
        {talkingPoints.length > 0 && (
          <section>
            <SectionLabel>Talking Points</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {talkingPoints.map((tp, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(99,102,241,0.06)",
                    border: "1px solid rgba(99,102,241,0.18)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                  }}
                >
                  {/* Topic pill */}
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      background: "rgba(99,102,241,0.2)",
                      border: "1px solid rgba(99,102,241,0.35)",
                      color: "#a5b4fc",
                      borderRadius: "5px",
                      padding: "2px 8px",
                      marginBottom: "8px",
                    }}
                  >
                    {tp.topic}
                  </span>
                  {/* Opener */}
                  <p
                    style={{
                      fontSize: "13px",
                      fontStyle: "italic",
                      color: "#e8e8f0",
                      margin: "0 0 6px",
                      lineHeight: 1.55,
                    }}
                  >
                    &ldquo;{tp.opener}&rdquo;
                  </p>
                  {/* Why they care */}
                  <p
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.42)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {tp.why_they_care}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Listen For */}
        {listenFor.length > 0 && (
          <section>
            <SectionLabel>Listen For</SectionLabel>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
              {listenFor.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ color: "#34d399", fontSize: "13px", lineHeight: 1.6, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Landmines */}
        {landmines.length > 0 && (
          <section>
            <SectionLabel color="rgba(239,68,68,0.6)">Landmines — Avoid These</SectionLabel>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
              {landmines.map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <span style={{ fontSize: "13px", lineHeight: 1.6, flexShrink: 0 }}>⚠</span>
                  <span style={{ fontSize: "13px", color: "rgba(239,68,68,0.8)", lineHeight: 1.6 }}>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Shared Context */}
        {sharedContext && (
          <section>
            <SectionLabel color="rgba(167,139,250,0.6)">Shared Context</SectionLabel>
            <div
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: "10px",
                padding: "12px 14px",
              }}
            >
              <p style={{ fontSize: "13px", color: "rgba(216,180,254,0.85)", lineHeight: 1.65, margin: 0 }}>
                {sharedContext}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* ─── Footer ─────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleCopyBrief}
          style={{
            fontSize: "12px",
            fontWeight: 600,
            padding: "7px 16px",
            borderRadius: "8px",
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#a5b4fc",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.22)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.12)";
          }}
        >
          Copy Brief
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children, color = "rgba(99,102,241,0.5)" }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color,
        marginBottom: "10px",
      }}
    >
      {children}
    </div>
  );
}
