"use client";
import { useState } from "react";

// Whiteboard images - UPDATE THESE URLs with your actual hosted images
// Using placeholders that show image type until real whiteboards are uploaded
const WB_CRAYON_ARCH    = "https://placehold.co/1200x800/1a1a2e/6366f1?text=CrayonAI+Architecture&font=roboto";
const WB_ORBITER_ARCH   = "https://placehold.co/1200x800/1a1a2e/8b5cf6?text=Orbiter+Architecture&font=roboto";
const WB_CONVERSATIONS  = "https://placehold.co/1200x800/1a1a2e/06b6d4?text=Key+Conversations&font=roboto";
const WB_TIMELINE       = "https://placehold.co/1200x800/1a1a2e/10b981?text=Timeline&font=roboto";
const WB_FEB18_RECAP    = "https://placehold.co/1200x800/1a1a2e/f59e0b?text=Feb+18+Recap&font=roboto";

// TODO: Replace with actual whiteboard images once uploaded to accessible CDN

type Section = "overview" | "today" | "architecture" | "orbiter" | "conversations" | "decisions" | "skill" | "resources";

const NAV: { id: Section; label: string; emoji: string }[] = [
  { id: "overview", label: "Overview", emoji: "🧭" },
  { id: "today", label: "Feb 18 Recap", emoji: "📅" },
  { id: "architecture", label: "How CrayonAI Works", emoji: "🏗️" },
  { id: "orbiter", label: "Orbiter Architecture", emoji: "🕸️" },
  { id: "conversations", label: "Our Conversations", emoji: "💬" },
  { id: "decisions", label: "Key Decisions", emoji: "💡" },
  { id: "skill", label: "CrayonAI Skill", emoji: "⚡" },
  { id: "resources", label: "Resources", emoji: "📦" },
];

export function DocsView() {
  const [active, setActive] = useState<Section>("overview");
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0a0a0f", overflow: "hidden" }}>
      {/* Section nav */}
      <div style={{
        display: "flex",
        gap: "4px",
        padding: "14px 28px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setActive(n.id)}
            style={{
              fontSize: "12px",
              fontWeight: active === n.id ? 600 : 400,
              padding: "7px 14px",
              borderRadius: "8px 8px 0 0",
              background: active === n.id ? "rgba(99,102,241,0.12)" : "transparent",
              border: active === n.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
              borderBottom: active === n.id ? "1px solid #0a0a0f" : "1px solid transparent",
              color: active === n.id ? "#a5b4fc" : "rgba(255,255,255,0.35)",
              cursor: "pointer",
              gap: "6px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {n.emoji} {n.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
        {active === "overview"       && <OverviewSection onImageClick={setLightbox} />}
        {active === "today"          && <TodayRecapSection onImageClick={setLightbox} />}
        {active === "architecture"   && <ArchSection onImageClick={setLightbox} />}
        {active === "orbiter"        && <OrbiterArchSection onImageClick={setLightbox} />}
        {active === "conversations"  && <ConversationsSection onImageClick={setLightbox} />}
        {active === "decisions"      && <DecisionsSection />}
        {active === "skill"          && <SkillSection />}
        {active === "resources"      && <ResourcesSection />}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, cursor: "zoom-out",
          }}
        >
          <img src={lightbox} style={{ maxWidth: "92vw", maxHeight: "90vh", borderRadius: "12px", boxShadow: "0 0 80px rgba(99,102,241,0.3)" }} />
        </div>
      )}
    </div>
  );
}

// ─── OVERVIEW ───────────────────────────────────────────────────────────────

function OverviewSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader
        title="Orbiter Copilot — Team Playbook"
        subtitle="Everything the team needs: architecture, decisions, conversation history, and resources. Built by Robert Boulos for the Feb 18 code access handoff."
        emoji="🧭"
      />

      {/* Whiteboard previews — all 5 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
        <WhiteboardCard url={WB_FEB18_RECAP}   title="Feb 18 — Today's Breakthroughs" caption="Meeting recap · 15 commits · 5 cards · 8 tabs shipped" onClick={() => onImageClick(WB_FEB18_RECAP)} />
        <WhiteboardCard url={WB_CRAYON_ARCH}   title="How CrayonAI SDK Works"        caption="CrayonChat → SSE → Cards → Components" onClick={() => onImageClick(WB_CRAYON_ARCH)} />
        <WhiteboardCard url={WB_ORBITER_ARCH}  title="Orbiter Product Architecture"   caption="FalkorDB · Xano · 3 Modes · Horizon"    onClick={() => onImageClick(WB_ORBITER_ARCH)} />
        <WhiteboardCard url={WB_CONVERSATIONS} title="Key Conversations + Insights"   caption="What Robert and Mark aligned on"         onClick={() => onImageClick(WB_CONVERSATIONS)} />
        <WhiteboardCard url={WB_TIMELINE}      title="Robert + Mark — The Journey"    caption="Oct 2025 → Feb 2026 → Feb 18 handoff"   onClick={() => onImageClick(WB_TIMELINE)} />
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "40px" }}>
        {[
          { n: "5", label: "Card Types", sub: "Outcome · Loop · Serendipity · Contact · Meeting Prep" },
          { n: "8", label: "Tab Views", sub: "Copilot · Network · Search · Outcomes · Horizon · Collections · Insights · Docs" },
          { n: "3", label: "Copilot Modes", sub: "Outcomes · Leverage Loop · Serendipity" },
          { n: "12", label: "Xano Endpoints", sub: "All in Robert API group api:Bd_dCiOz" },
        ].map(s => (
          <StatCard key={s.n + s.label} n={s.n} label={s.label} sub={s.sub} />
        ))}
      </div>

      <CalloutBox icon="🎯" title="Purpose of this demo">
        A working proof-of-concept of Orbiter Copilot with full generative UI. 5 card types stream
        real-time from Claude Sonnet 4. 8 tabs with live data, recharts analytics, and real Xano backend.
        No mocks except Collections (endpoints pending). This is what world-class relationship intelligence UX looks like.
      </CalloutBox>
    </div>
  );
}

// ─── FEB 18 RECAP ───────────────────────────────────────────────────────────

function TodayRecapSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  const commits = [
    { hash: "480f932", msg: "masterPersonId passthrough into every card's templateProps" },
    { hash: "bf794d7", msg: "JSON parsing fix — lenient parser handles LLM quirks" },
    { hash: "7e648bf", msg: "CSS/visual polish — scroll, labels, typos" },
    { hash: "70f608c", msg: "PersonPicker z-index fix (position: fixed); Network 'View' panel wired" },
    { hash: "6806474", msg: "World-class premium experience — orbital SVG, animated arcs, glow states" },
    { hash: "617fd3b", msg: "Standalone mode + PersonPicker rewrite + dynamic starters + all view upgrades" },
    { hash: "0288b28", msg: "Fix sidebar CSS class → .crayon-shell-sidebar-container; full-width layout" },
    { hash: "f1de1ec", msg: "Feb 18 Recap tab + whiteboard added to Docs" },
    { hash: "f9c7879", msg: "Fix: Vercel env vars set via API — NEXT_PUBLIC_XANO_API_URL now live" },
    { hash: "182b4c1", msg: "Wire network node click, leverage loop, track, outcome actions, horizon pipeline" },
    { hash: "f41f1ed", msg: "PersonPicker type unification + endpoint wiring improvements" },
    { hash: "6d358aa", msg: "Meeting Prep card, Search tab, Collections tab — 1,629 lines added" },
    { hash: "5b69846", msg: "Insights tab (recharts analytics), Horizon fix, Collections mock, skeleton states" },
    { hash: "59c474a", msg: "Meeting Prep starter prompts + 5th person-context starter" },
    { hash: "74f70fa", msg: "Meeting Prep schema live in Xano system prompt — frontend injection removed" },
  ];

  const meetingPoints = [
    { icon: "🔐", text: "GitHub repo access granted — Robert can push to Orbiter codebase" },
    { icon: "💬", text: "Orbiter Slack #copilot-dev joined — direct line to Charles, Njogu, Dennis" },
    { icon: "🎯", text: "Robert's role confirmed: UX consultant + prompt architect for Copilot" },
    { icon: "🔓", text: "CrayonAI = open source SDK — no paid Thesys budget needed" },
    { icon: "🚀", text: "Mark's direction: keep pushing the generative UI layer — world-class UX" },
    { icon: "👥", text: "Attendees: Mark (CEO), Charles (charles@orbiter.io), Njogu (njogu@orbiter.io), Dennis" },
  ];

  const technicalWins = [
    { title: "Xano /chat Rewritten", desc: "Full Orbiter system prompt, all 5 card schemas (including Meeting Prep), person_context injection, Claude Sonnet 4 via OpenRouter — single endpoint powers all intelligence", color: "#6366f1" },
    { title: "PersonPicker Rebuilt", desc: "Orbital SVG spinner on load, live green dot when focused, gradient chip, 'In focus' badge, crossfade transitions, search with glow ring", color: "#8b5cf6" },
    { title: "World-Class Animation System", desc: "12 keyframe animations in globals.css: orbital SVG rings (12s/18s/26s), animated arc connector between people, pulsing glow states, bond strength bar, scan rings", color: "#06b6d4" },
    { title: "Sidebar Removed", desc: "Standalone mode + .crayon-shell-sidebar-container hidden → clean full-width layout. Copilot chat fills the entire panel with no visual noise.", color: "#10b981" },
    { title: "Profile Panel + YAML Parsing", desc: "Network 'View' button opens slide-over panel. js-yaml parses raw YAML string into structured About / Skills pills / Work History timeline / Roles tags", color: "#f59e0b" },
    { title: "Dynamic Conversation Starters", desc: "getPersonStarters(person) generates 5 personalized starters using contact's name, title, company — now includes Meeting Prep. Tab switch uses fadeUp crossfade.", color: "#ec4899" },
    { title: "📅 Meeting Prep Card (Card #5)", desc: "New card type added to Xano system prompt. Triggered by 'prep for my meeting with...'. Outputs: summary, 3 talking points with openers + why they care, listen-for signals, and landmines to avoid. Confirmed working live.", color: "#f43f5e" },
    { title: "📊 Insights Tab — Recharts Analytics", desc: "Full analytics dashboard: bond strength bar chart, 8-week activity area chart, top industries horizontal bars, relationship pipeline funnel (from live Horizon data), 4 stat cards. All dark-themed, responsive.", color: "#0ea5e9" },
    { title: "🔍 Search Tab", desc: "Natural language search across your network. 'My Network' vs 'Orbiter Universe' toggle. Falls back to /person-search gracefully if semantic search endpoint not live. Example prompts: 'VCs who back dev tools', 'Who do I know at OpenAI?'", color: "#8b5cf6" },
    { title: "📁 Collections Tab", desc: "Group contacts around a theme. 3 demo collections: 🚀 Seed Investors, 🤝 Potential Partners, 🎤 Conference Crew. 'Ask Copilot' button per collection opens Copilot with a targeted prompt. Xano CRUD endpoints ready to wire.", color: "#10b981" },
    { title: "Horizon Fix — Smart Add Target", desc: "Horizon 'Add Target' now searches /network first to find node_uuid, then calls /horizon-target. Falls back to /horizon-target-by-person-id. Phantom error on load fixed — only shows after a real failure.", color: "#f59e0b" },
    { title: "Skeleton Loading States", desc: "All tabs show shimmer skeleton loaders while fetching data. No more blank screens on first load. @keyframes shimmer animation in globals.css.", color: "#64748b" },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader
        title="February 18, 2026 — Full Day Recap"
        subtitle="9 AM code access meeting + 15 commits shipped across the full day. 5 card types, 8 tabs, recharts analytics, Meeting Prep, Search, Collections — all live."
        emoji="📅"
      />

      {/* Whiteboard */}
      <WhiteboardCard
        url={WB_FEB18_RECAP}
        title="Feb 18 Progress Whiteboard"
        caption="Click to enlarge — generated by Zora (Charlotte MCP)"
        onClick={() => onImageClick(WB_FEB18_RECAP)}
        fullWidth
      />

      {/* Meeting recap */}
      <div style={{ marginTop: "32px", marginBottom: "32px" }}>
        <SubHeader title="9 AM Team Meeting — What Was Decided" />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {meetingPoints.map((p, i) => (
            <div key={i} style={{
              display: "flex", gap: "12px", alignItems: "flex-start",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px", padding: "12px 16px",
            }}>
              <span style={{ fontSize: "18px", flexShrink: 0 }}>{p.icon}</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{p.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical wins */}
      <SubHeader title="What Was Built & Shipped" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "32px" }}>
        {technicalWins.map((w, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderTop: `3px solid ${w.color}`,
            borderRadius: "10px", padding: "16px 18px",
          }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0", marginBottom: "8px" }}>{w.title}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{w.desc}</div>
          </div>
        ))}
      </div>

      {/* Commit log */}
      <SubHeader title="Commit History — Feb 18" />
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "32px" }}>
        {commits.map((c, i) => (
          <div key={i} style={{
            display: "flex", gap: "12px", alignItems: "baseline",
            padding: "10px 14px",
            background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
          }}>
            <code style={{ fontSize: "11px", color: "#6366f1", fontFamily: "monospace", flexShrink: 0, fontWeight: 600 }}>{c.hash}</code>
            <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{c.msg}</span>
          </div>
        ))}
      </div>

      <CalloutBox icon="🎯" title="Current State — Feb 19 (March 2 deadline)">
        All 5 card types confirmed working. 8 tabs live with real Xano data. Insights analytics dashboard shipped.
        Meeting Prep card is card #5 in the Xano system prompt — triggered by natural language, confirmed via API test.
        Remaining: wire Collections to real Xano endpoints, build /search + /connection-path endpoints, canvas node click fix.
        Mark's bigger asks still ahead: Natural Language Search (universe mode), Travel broadcasting, Moonshot mode.
      </CalloutBox>
    </div>
  );
}

// ─── ARCHITECTURE ────────────────────────────────────────────────────────────

function ArchSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader title="System Architecture" subtitle="How the demo is built, end-to-end." emoji="🏗️" />

      <WhiteboardCard
        url={WB_CRAYON_ARCH}
        title="CrayonAI Architecture Whiteboard"
        caption="Click to enlarge"
        onClick={() => onImageClick(WB_CRAYON_ARCH)}
        fullWidth
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
        <StackCard title="Frontend" color="#6366f1" items={[
          "Next.js 14 (App Router)",
          "@crayonai/react-ui — CrayonChat component",
          "@crayonai/stream — SSE transformer",
          "@anthropic-ai/sdk — Claude direct",
          "DiceBear notionists avatars (CDN)",
          "Canvas 2D — force-directed network graph",
        ]} />
        <StackCard title="API Layer" color="#8b5cf6" items={[
          "POST /chat — Xano endpoint 8064 (Robert API group)",
          "Claude Sonnet 4 via OpenRouter",
          "person_context → Claude system message",
          "masterPersonId injected into every card templateProps",
          "Manual SSE via TextEncoder (frontend)",
          "JSON fence stripping + lenient parser (LLM quirk fix)",
        ]} />
        <StackCard title="5 Card Types" color="#06b6d4" items={[
          "OutcomeCard — goal tracking, save to Orbiter",
          "LeverageLoopCard — draft editor, send + dispatch",
          "SerendipityCard — intro draft, Make the Intro",
          "ContactCard — bond score, action checklist",
          "MeetingPrepCard — talking points, listen-for, landmines",
        ]} />
        <StackCard title="8 Tab Views" color="#10b981" items={[
          "Copilot — CrayonChat + PersonPicker + orbital bg",
          "Network — live graph + contact cards + profile panels",
          "🔍 Search — NL search, My Network / Universe toggle",
          "Outcomes — real data, stat cards, dispatch/archive",
          "Horizon — 4-stage pipeline, Add Target",
          "📁 Collections — themed groups, Ask Copilot",
          "📊 Insights — recharts analytics dashboard",
          "Docs — this playbook",
        ]} />
      </div>

      <div style={{ marginTop: "24px" }}>
        <SubHeader title="SSE Format (Critical)" />
        <CodeBlock>{`// Text streaming (word-by-word)
event: text
data: Hello

// Card render (component injection)  
event: tpl
data: {"name":"outcome_card","templateProps":{...}}`}</CodeBlock>

        <SubHeader title="System Prompt Decision Tree" />
        <CodeBlock>{`User message → 
  contains "outcome / goal / achieve / want to" → outcome_card
  contains job change / signal / leverage → leverage_loop_card  
  contains "introduce / who should meet / serendipity" → serendipity_card
  contains "contact / profile / pull up / who is" → contact_card
  contains "prep for / meeting with / before I meet" → meeting_prep_card

RULE: Never ask a clarifying question when card type is clearly implied.
Pick a mode. Generate the card. Always.`}</CodeBlock>
      </div>
    </div>
  );
}

// ─── TIMELINE ────────────────────────────────────────────────────────────────

function TimelineSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  const events = [
    {
      date: "Oct 2025",
      title: "First Conversations",
      body: "Robert and Mark connect around the vision for Orbiter — relationship intelligence, graph databases as the competitive moat. Early discussions about what the AI layer should feel like.",
      tag: "Discovery",
      color: "#6366f1",
    },
    {
      date: "Nov – Dec 2025",
      title: "Deep Dives on Product",
      body: "Multiple working sessions on the graph architecture. Key insight: single vector index on one node field outperforms 500-word edge properties. Human curation before AI automation — not the other way around.",
      tag: "Architecture",
      color: "#8b5cf6",
    },
    {
      date: "Feb 13, 2026",
      title: "SCC Mastermind — Orbiter Demo",
      body: "Mark demos Orbiter live at the State Change Community Mastermind. The three Copilot modes are named for the first time: Outcomes, Leverage Loops, Serendipity. Robert sees the generative UI layer is barely touched — CrayonAI (Thesys C1) is integrated but underutilized. The opportunity becomes clear.",
      tag: "Breakthrough",
      color: "#06b6d4",
    },
    {
      date: "Feb 17, 2026",
      title: "Demo Built — All 4 Cards + All 4 Tabs",
      body: "Full Orbiter Copilot demo built from scratch in one session. CrayonChat wired to Claude via manual SSE streaming. All 5 card types fully interactive. Network tab with animated force-directed graph. DiceBear avatars. Horizon pipeline. Search, Collections, Insights tabs. Chat input bugs diagnosed and fixed via DOM inspection.",
      tag: "Shipped",
      color: "#10b981",
    },
    {
      date: "Feb 18, 2026",
      title: "Code Access Meeting — 9 AM",
      body: "Meeting with Mark, Charles, and Dennis. Agenda: code access + collaboration workflow for Copilot visual improvements. Robert's role framed as consultant/advisor (per Dennis). Focus: preliminary UX decisions, generative UI leverage, prompt architecture.",
      tag: "Handoff",
      color: "#f59e0b",
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader title="Robert + Mark — The Journey" subtitle="From first conversation to code access." emoji="📅" />

      <WhiteboardCard
        url={WB_TIMELINE}
        title="Journey Whiteboard"
        caption="Click to enlarge"
        onClick={() => onImageClick(WB_TIMELINE)}
        fullWidth
      />

      <div style={{ marginTop: "32px", position: "relative" }}>
        <div style={{ position: "absolute", left: "119px", top: 0, bottom: 0, width: "2px", background: "rgba(99,102,241,0.15)" }} />
        {events.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: "24px", marginBottom: "28px", alignItems: "flex-start" }}>
            <div style={{ width: "100px", flexShrink: 0, paddingTop: "16px", textAlign: "right" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{e.date}</span>
            </div>
            <div style={{
              width: "14px", height: "14px", borderRadius: "50%",
              background: e.color, flexShrink: 0, marginTop: "19px",
              boxShadow: `0 0 12px ${e.color}66`,
              position: "relative", zIndex: 1,
            }} />
            <div style={{
              flex: 1,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px",
              padding: "16px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#e8e8f0" }}>{e.title}</span>
                <span style={{
                  fontSize: "10px", fontWeight: 600, padding: "2px 8px",
                  borderRadius: "20px", background: `${e.color}22`,
                  color: e.color, border: `1px solid ${e.color}44`,
                }}>{e.tag}</span>
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>{e.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KEY DECISIONS ────────────────────────────────────────────────────────────

function DecisionsSection() {
  const decisions = [
    {
      title: "Bypass Thesys C1 — use CrayonAI directly",
      why: "The Thesys hosted layer adds latency and limits control. CrayonAI React SDK is open source (MIT). We wire processMessage directly to Anthropic with manual SSE — full control over format, streaming speed, and card injection.",
      impact: "High",
      color: "#6366f1",
    },
    {
      title: "Manual SSE instead of crayonStream transformer",
      why: "CrayonDataStreamTransformer expects ReadableStream<string> but Response constructor needs ReadableStream<Uint8Array> — type mismatch breaks streaming. Manual TextEncoder bytes sidesteps the issue entirely and gives us explicit control over event types.",
      impact: "Critical",
      color: "#ef4444",
    },
    {
      title: "display:none persistence for CrayonChat",
      why: "Conditional render (unmounting) destroys CrayonChat's internal React state — conversation history, scroll position, and focus are lost every time you switch tabs. display:none/block preserves all state invisibly.",
      impact: "High",
      color: "#8b5cf6",
    },
    {
      title: "Thread composer min-height fix",
      why: "CrayonChat's thread textarea starts with height: 0px (JavaScript auto-resize from empty). No CSS minimum was set, so the element had zero clickable area. Fix: min-height: 24px; height: auto on the textarea.",
      impact: "Critical",
      color: "#ef4444",
    },
    {
      title: "4-mode system prompt with explicit decision tree",
      why: "Without explicit routing rules, Claude asks clarifying questions instead of generating cards. The system prompt now has a hard rule: if card type is clearly implied, pick it and render immediately — no questions.",
      impact: "High",
      color: "#06b6d4",
    },
    {
      title: "DiceBear notionists for avatars",
      why: "Consistent illustrated avatars per person (deterministic by name seed). No backend required, no uploads. Pure CDN URL. notionists style matches the Orbiter aesthetic — playful but professional.",
      impact: "Medium",
      color: "#10b981",
    },
    {
      title: "Canvas 2D for network graph (no library)",
      why: "External graph libraries (d3-force, sigma) add bundle weight and styling complexity. Pure Canvas 2D with requestAnimationFrame gives us full control over animation, node colors, edge pulse effects, and retina scaling.",
      impact: "Medium",
      color: "#f59e0b",
    },
    {
      title: "Recharts for Insights analytics",
      why: "Only chart library installed. React-native, fully responsive, dark-theme compatible with custom tooltips. ResponsiveContainer wraps all charts. No D3 knowledge required — clean declarative JSX.",
      impact: "Medium",
      color: "#0ea5e9",
    },
    {
      title: "Mock data for Collections",
      why: "Collections Xano endpoints (/collections, /collection CRUD) not yet built. Rather than block the demo, ship rich mock data that makes Collections look real. 5 endpoint schemas are fully typed and ready to wire.",
      impact: "Medium",
      color: "#8b5cf6",
    },
    {
      title: "Meeting Prep schema in Xano system prompt (not frontend)",
      why: "Initially injected via person_context from frontend as a workaround. Mark's other AI added it natively to the Xano /chat system prompt as card #5. Frontend injection removed. Clean separation — LLM owns card logic, frontend owns rendering.",
      impact: "High",
      color: "#f43f5e",
    },
    {
      title: "Graceful search fallback: /search → /person-search",
      why: "Semantic /search endpoint doesn't exist in Xano yet. xano.ts tries /search first, catches 404/error, falls back to /person-search. Universe mode shows a 'coming soon' banner but still returns network results so the UI never breaks.",
      impact: "Medium",
      color: "#10b981",
    },
    {
      title: "Horizon Add Target: network lookup for node_uuid",
      why: "/horizon-target-by-person-id may not exist. Instead: search /network with the person's name, match by master_person_id or name, extract node_uuid, call /horizon-target. Falls back to by-person-id if not found. Zero dead ends.",
      impact: "High",
      color: "#f59e0b",
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader title="Key Technical Decisions" subtitle="The why behind every non-obvious choice." emoji="💡" />
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {decisions.map((d, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid rgba(255,255,255,0.07)`,
            borderLeft: `3px solid ${d.color}`,
            borderRadius: "10px",
            padding: "18px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0" }}>{d.title}</span>
              <span style={{
                fontSize: "9px", fontWeight: 700, padding: "2px 7px",
                borderRadius: "20px", background: `${d.color}22`,
                color: d.color, border: `1px solid ${d.color}44`,
                letterSpacing: "0.05em",
              }}>{d.impact}</span>
            </div>
            <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>{d.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RESOURCES ────────────────────────────────────────────────────────────────

function ResourcesSection() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader title="Resources" subtitle="Everything the team needs to pick this up and run." emoji="📦" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <ResourceCard title="Demo Repository" icon="🐙" links={[
          { label: "GitHub — roboulos/orbiter-copilot-demo", url: "https://github.com/roboulos/orbiter-copilot-demo" },
          { label: "Vercel deployment — orbiter-copilot-demo.vercel.app", url: "https://orbiter-copilot-demo.vercel.app" },
        ]} />
        <ResourceCard title="CrayonAI SDK" icon="🎨" links={[
          { label: "@crayonai/react-ui (npm)", url: "https://www.npmjs.com/package/@crayonai/react-ui" },
          { label: "@crayonai/stream (npm)", url: "https://www.npmjs.com/package/@crayonai/stream" },
          { label: "Thesys C1 Docs", url: "https://docs.thesys.dev" },
        ]} />
        <ResourceCard title="AI & Streaming" icon="⚡" links={[
          { label: "Anthropic SDK — @anthropic-ai/sdk", url: "https://github.com/anthropic/anthropic-sdk-typescript" },
          { label: "Claude API Docs", url: "https://docs.anthropic.com" },
          { label: "SSE spec — MDN", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" },
        ]} />
        <ResourceCard title="Design" icon="🎭" links={[
          { label: "DiceBear Avatars (notionists style)", url: "https://dicebear.com/styles/notionists" },
          { label: "Inter Font (Google Fonts)", url: "https://fonts.google.com/specimen/Inter" },
        ]} />
      </div>

      <CalloutBox icon="✅" title="Live vs Mocked — Current Status">
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 2 }}>
          <div><span style={{ color: "#34d399" }}>✅ LIVE</span> — Copilot chat (5 card types streaming from Claude Sonnet 4 via OpenRouter)</div>
          <div><span style={{ color: "#34d399" }}>✅ LIVE</span> — Network graph + contact cards (real Xano /network endpoint)</div>
          <div><span style={{ color: "#34d399" }}>✅ LIVE</span> — Outcomes (real /outcomes, /outcome, dispatch, archive)</div>
          <div><span style={{ color: "#34d399" }}>✅ LIVE</span> — Horizon targets (real /horizon, /horizon-target)</div>
          <div><span style={{ color: "#34d399" }}>✅ LIVE</span> — Leverage Loops (real /leverage-loop, /leverage-loop/:id/dispatch)</div>
          <div><span style={{ color: "#34d399" }}>✅ LIVE</span> — Person context (real /person-context/:id → YAML → Claude system message)</div>
          <div><span style={{ color: "#34d399" }}>✅ LIVE</span> — Search network (falls back to /person-search)</div>
          <div><span style={{ color: "#34d399" }}>✅ LIVE</span> — Insights analytics (recharts + real network data)</div>
          <div><span style={{ color: "#fbbf24" }}>⚠️ MOCK</span> — Collections (demo data: Seed Investors, Potential Partners, Conference Crew — Xano endpoints pending)</div>
          <div><span style={{ color: "#fbbf24" }}>⚠️ MOCK</span> — Search universe mode (shows network results with "coming soon" banner)</div>
          <div><span style={{ color: "#f87171" }}>🔲 TODO</span> — Connection path (/connection-path endpoint not yet in Xano)</div>
          <div><span style={{ color: "#f87171" }}>🔲 TODO</span> — Canvas node click (graph direct click doesn't open panel — use "View →" cards instead)</div>
        </div>
      </CalloutBox>

      <CalloutBox icon="📁" title="Key Files in the Repo">
        <div style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 2 }}>
          <div><span style={{ color: "#a5b4fc" }}>app/lib/xano.ts</span> — All Xano API helpers, types, auth token caching</div>
          <div><span style={{ color: "#a5b4fc" }}>app/page.tsx</span> — 8-tab layout, CrayonChat wiring, starters, PersonPicker</div>
          <div><span style={{ color: "#a5b4fc" }}>app/globals.css</span> — 12 keyframe animations, layout fixes, dark theme</div>
          <div><span style={{ color: "#6ee7b7" }}>app/components/OutcomeCard.tsx</span> — Goal editor with save state</div>
          <div><span style={{ color: "#6ee7b7" }}>app/components/LeverageLoopCard.tsx</span> — Message draft + dispatch flow</div>
          <div><span style={{ color: "#6ee7b7" }}>app/components/SerendipityCard.tsx</span> — Intro draft with Steps</div>
          <div><span style={{ color: "#6ee7b7" }}>app/components/ContactCard.tsx</span> — Bond score, action checklist</div>
          <div><span style={{ color: "#6ee7b7" }}>app/components/MeetingPrepCard.tsx</span> — Talking points, landmines, listen-for</div>
          <div><span style={{ color: "#fbbf24" }}>app/components/InsightsView.tsx</span> — Recharts analytics dashboard</div>
          <div><span style={{ color: "#fbbf24" }}>app/components/SearchView.tsx</span> — NL search, network/universe toggle</div>
          <div><span style={{ color: "#fbbf24" }}>app/components/CollectionsView.tsx</span> — Collections with mock data</div>
          <div><span style={{ color: "#fbbf24" }}>app/components/NetworkGraph.tsx</span> — Canvas force-directed graph</div>
          <div><span style={{ color: "#fbbf24" }}>app/components/NetworkView.tsx</span> — Contact grid + profile panels</div>
          <div><span style={{ color: "#fbbf24" }}>app/components/OutcomesView.tsx</span> — Outcomes board with dispatch</div>
          <div><span style={{ color: "#fbbf24" }}>app/components/HorizonView.tsx</span> — 4-stage pipeline tab</div>
        </div>
      </CalloutBox>

      <div style={{ marginTop: "20px" }}>
        <CalloutBox icon="👥" title="The Team">
          <strong style={{ color: "#e8e8f0" }}>Orbiter:</strong> Mark Pederson (CEO/Founder), Josh (co-founder), Dennis (Copilot UI + OpenAI SDK), Charles + Ninjogu<br/>
          <strong style={{ color: "#e8e8f0" }}>Robert Boulos</strong> — consultant + advisor. Prompt architecture, generative UI patterns, UX decisions.<br/>
          Contact: <span style={{ color: "#a5b4fc" }}>robert@snappy.ai</span> | Calendly:{" "}
          <a href="https://calendly.com/robertboulos" target="_blank" style={{ color: "#a5b4fc" }}>calendly.com/robertboulos</a>
        </CalloutBox>
      </div>
    </div>
  );
}

// ─── ORBITER ARCHITECTURE ────────────────────────────────────────────────────

function OrbiterArchSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader title="Orbiter Product Architecture" subtitle="How Orbiter is built — based on what Mark shared." emoji="🕸️" />
      <WhiteboardCard url={WB_ORBITER_ARCH} title="Orbiter Architecture Whiteboard" caption="Click to enlarge" onClick={() => onImageClick(WB_ORBITER_ARCH)} fullWidth />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
        <StackCard title="Data Layer" color="#6366f1" items={[
          "FalkorDB — graph database (core)",
          "Not just storage: intelligence layer",
          "Single vector index on one node field",
          "Outperforms 500-word edge properties",
          "Graph traversal spans Teams + Collections",
          "Cron jobs score relationship signals",
        ]} />
        <StackCard title="Backend / API" color="#8b5cf6" items={[
          "Xano — primary backend API",
          "GetStream.io — real-time activity feed",
          "OpenRouter — AI model routing",
          "Gradium — voice mode",
          "TipTap — rich text editing",
          "Ogma — graph visualization",
        ]} />
        <StackCard title="Three Copilot Modes" color="#06b6d4" items={[
          "Outcomes — goal → who in network can help",
          "Leverage Loops — mutual-benefit intros (reciprocal)",
          "Serendipity — ambient discovery, magic moment",
          "Each mode maps to a distinct card type",
          "Decision tree in system prompt routes between them",
        ]} />
        <StackCard title="Product Features" color="#10b981" items={[
          "Teams — shared network spaces",
          "Collections — curated contact groups",
          "Search — network + Orbiter universe + deep web",
          "Travel / Trip broadcasting",
          "Horizon — target pipeline (4 stages)",
          "Invite-only, premium pricing, power networkers ICP",
        ]} />
      </div>
      <div style={{ marginTop: "24px" }}>
        <CalloutBox icon="🧠" title="Mark's Key Technical Insight (Transcript #409, Feb 13)">
          "Single vector index on one node field outperforms 500-word edge properties." The graph intelligence isn't in storing more data — it's in scoring and traversing the right signals. Cron jobs run across the graph continuously, updating relationship scores based on activity patterns. Human curation comes first; AI automation follows.
        </CalloutBox>
      </div>
    </div>
  );
}

// ─── CONVERSATIONS ────────────────────────────────────────────────────────────

function ConversationsSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  const insights = [
    {
      speaker: "Mark",
      insight: "FalkorDB is the competitive moat — not just the database, the entire intelligence layer. Traversals across relationship graphs are what make Orbiter fundamentally different from CRMs.",
      source: "SCC Mastermind, Feb 13",
      color: "#6366f1",
    },
    {
      speaker: "Robert",
      insight: "Dennis has CrayonAI wired up but barely touched it — that's the leverage point. The generative UI layer is where the Copilot experience can go from 'chatbot' to 'brilliant chief of staff'.",
      source: "Post-demo analysis, Feb 17",
      color: "#10b981",
    },
    {
      speaker: "Mark",
      insight: "Human curation before AI automation. The system should surface suggestions, but the human decides. This is what separates Orbiter from tools that just blast AI actions.",
      source: "SCC Mastermind, Feb 13",
      color: "#6366f1",
    },
    {
      speaker: "Robert",
      insight: "The big header is wasted real estate — users want to get to the Copilot fast. A modal or slide-over pattern would feel more like a power tool and less like a website.",
      source: "Transcript #409, Feb 17",
      color: "#10b981",
    },
    {
      speaker: "Mark",
      insight: "Horizon is a target list — people you want to get to know. The pipeline (Identified → Warming → Active → Connected) mirrors how relationships actually develop over time.",
      source: "SCC Mastermind, Feb 13",
      color: "#6366f1",
    },
    {
      speaker: "Both",
      insight: "The Copilot needs three distinct modes because relationship work is three different jobs: setting goals, capturing signals, and finding serendipity. One UI can't serve all three well.",
      source: "Ongoing alignment",
      color: "#f59e0b",
    },
    {
      speaker: "Robert",
      insight: "Bypass the Thesys hosted API — use CrayonAI open source directly with Anthropic. Manual SSE streaming gives full control over card injection timing, format, and cost.",
      source: "Technical decision, Feb 17",
      color: "#10b981",
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader title="Key Conversations — Robert + Mark" subtitle="The aligned insights and decisions that shaped this demo." emoji="💬" />
      <WhiteboardCard url={WB_CONVERSATIONS} title="Conversations Whiteboard" caption="Click to enlarge" onClick={() => onImageClick(WB_CONVERSATIONS)} fullWidth />
      <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {insights.map((item, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderLeft: `3px solid ${item.color}`, borderRadius: "10px", padding: "18px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: item.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>{item.speaker}</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>— {item.source}</span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{item.insight}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SKILL ───────────────────────────────────────────────────────────────────

function SkillSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader
        title="CrayonAI — Working with It Like a Pro"
        subtitle="The non-obvious gotchas and patterns we learned building this demo. Everything Dennis needs to go fast."
        emoji="⚡"
      />

      <CalloutBox icon="📋" title="Full skill file in repo: CRAYON_SKILL.md">
        A complete reference guide lives in the root of this repo —{" "}
        <a href="https://github.com/roboulos/orbiter-copilot-demo/blob/main/CRAYON_SKILL.md" target="_blank" style={{ color: "#a5b4fc" }}>
          CRAYON_SKILL.md
        </a>. Below are the critical cliff notes.
      </CalloutBox>

      <div style={{ marginTop: "24px" }}>
        <SubHeader title="The SSE Format CrayonChat Expects" />
        <SnippetCard id="sse" copied={copied} onCopy={copy} code={`// Text (word by word)
event: text
data: Hello

// Card component (fires a React component render)
event: tpl
data: {"name":"outcome_card","templateProps":{"title":"...","contacts":[]}}`} />

        <SubHeader title="Wire processMessage to Your Own API (No Thesys Key Needed)" />
        <SnippetCard id="process" copied={copied} onCopy={copy} code={`<CrayonChat
  processMessage={async ({ messages, abortController }) => {
    return fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        prompt: messages.at(-1)?.message,
        messages: messages.slice(0, -1),  // history minus current
      }),
      signal: abortController.signal,
    });
  }}
  responseTemplates={[
    { name: "outcome_card",       Component: OutcomeCard },
    { name: "leverage_loop_card", Component: LeverageLoopCard },
    { name: "contact_card",       Component: ContactCard },
    { name: "serendipity_card",   Component: SerendipityCard },
  ]}
  theme={{ mode: "dark" }}
/>`} />

        <SubHeader title="Fix: Textarea Collapses to 0px Height" />
        <SnippetCard id="textarea" copied={copied} onCopy={copy} code={`/* globals.css — CrayonChat textarea starts at 0px, add this */
.crayon-shell-thread-composer__input,
.crayon-shell-desktop-welcome-composer__input {
  min-height: 24px !important;
  height: auto !important;
}`} />

        <SubHeader title="Fix: Preserve Chat History Across Tab Switches" />
        <SnippetCard id="tabs" copied={copied} onCopy={copy} code={`// ❌ Wrong — unmounting CrayonChat destroys conversation history
{activeTab === "Copilot" && <CrayonChat />}

// ✅ Right — always mounted, hidden via CSS
<div style={{ display: activeTab === "Copilot" ? "flex" : "none", flex: 1 }}>
  <CrayonChat />
</div>`} />

        <SubHeader title="System Prompt — Force JSON Output + Decision Tree" />
        <SnippetCard id="prompt" copied={copied} onCopy={copy} code={`CRITICAL: Respond ONLY with raw JSON. No markdown fences.

Format:
{ "response": [
  { "type": "text", "text": "Brief intro..." },
  { "name": "outcome_card", "templateProps": { "title": "...", "contacts": [], ... } }
]}

ROUTING:
- goal / outcome / achieve → outcome_card
- job change / signal / leverage → leverage_loop_card
- introduce / who should meet → serendipity_card
- pull up / contact / who is → contact_card

RULE: Never ask clarifying questions. If card type is implied, render it immediately.`} />
      </div>
    </div>
  );
}

function SnippetCard({ id, code, copied, onCopy }: { id: string; code: string; copied: string | null; onCopy: (text: string, id: string) => void }) {
  return (
    <div style={{ position: "relative", marginBottom: "8px" }}>
      <pre style={{
        background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px", padding: "16px 20px 16px 16px", fontSize: "11.5px",
        color: "#a5b4fc", fontFamily: "monospace", lineHeight: 1.7,
        overflowX: "auto", whiteSpace: "pre-wrap", margin: 0,
      }}>{code}</pre>
      <button
        onClick={() => onCopy(code, id)}
        style={{
          position: "absolute", top: "8px", right: "8px",
          fontSize: "10px", padding: "3px 8px", borderRadius: "5px",
          background: copied === id ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.15)",
          border: `1px solid ${copied === id ? "rgba(16,185,129,0.4)" : "rgba(99,102,241,0.3)"}`,
          color: copied === id ? "#6ee7b7" : "#a5b4fc", cursor: "pointer",
        }}
      >
        {copied === id ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, emoji }: { title: string; subtitle: string; emoji: string }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>{emoji}</div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#e8e8f0", margin: "0 0 8px", letterSpacing: "-0.02em" }}>{title}</h2>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>{subtitle}</p>
    </div>
  );
}

function SubHeader({ title }: { title: string }) {
  return <h3 style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px", marginTop: "24px" }}>{title}</h3>;
}

function WhiteboardCard({ url, title, caption, onClick, fullWidth }: {
  url: string; title: string; caption: string; onClick: () => void; fullWidth?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "zoom-in",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
        gridColumn: fullWidth ? "span 2" : undefined,
      }}
    >
      <img src={url} alt={title} style={{ width: "100%", display: "block", maxHeight: fullWidth ? "420px" : "200px", objectFit: "cover" }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "20px 16px 12px",
        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
      }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0" }}>{title}</div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{caption}</div>
      </div>
    </div>
  );
}

function StatCard({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <div style={{
      background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
      borderRadius: "12px", padding: "18px 16px",
    }}>
      <div style={{ fontSize: "28px", fontWeight: 800, color: "#a5b4fc", letterSpacing: "-0.03em" }}>{n}</div>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8e8f0", marginTop: "4px" }}>{label}</div>
      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "4px", lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}

function StackCard({ title, color, items }: { title: string; color: string; items: string[] }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
      borderTop: `3px solid ${color}`, borderRadius: "10px", padding: "18px 20px",
    }}>
      <div style={{ fontSize: "12px", fontWeight: 700, color, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "12px" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
            <span style={{ color, fontSize: "10px", flexShrink: 0 }}>→</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{
      background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "8px", padding: "16px 20px", fontSize: "12px",
      color: "#a5b4fc", fontFamily: "monospace", lineHeight: 1.7,
      overflowX: "auto", whiteSpace: "pre-wrap", margin: 0,
    }}>{children}</pre>
  );
}

function CalloutBox({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
      borderRadius: "12px", padding: "20px 24px",
    }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#a5b4fc", marginBottom: "10px" }}>
        {icon} {title}
      </div>
      <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function ResourceCard({ title, icon, links }: { title: string; icon: string; links: { label: string; url: string }[] }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "12px", padding: "18px 20px",
    }}>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8e8f0", marginBottom: "12px" }}>
        {icon} {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{
            fontSize: "12px", color: "#6366f1",
            textDecoration: "none", display: "flex", alignItems: "center", gap: "6px",
          }}>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>↗</span>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
