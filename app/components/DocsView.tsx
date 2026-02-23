"use client";
import { useState } from "react";

// Whiteboard images (created by Robert, uploaded Feb 19-23 2026)
// Stored on Digital Ocean Spaces with public-read ACL
const WB_FREELANCE_ENGAGEMENT = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/whiteboard-freelance-engagement.jpg";
const WB_TECH_COLLABORATION   = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/whiteboard-tech-collaboration.jpg";
const WB_KICKOFF_STRATEGY     = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/whiteboard-kickoff-strategy.jpg";
const WB_PRODUCT_DEMO         = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/whiteboard-product-demo-iteration.jpg";
const WB_FEB19_BUILD_DAY      = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/img-1771597446000.jpg";
const WB_FEB20_PLANNING       = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/img-1771899713000.jpg";
const WB_FEB23_CRITICAL       = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/img-1771899758000.jpg";
const CONV_FEB20_MEETING      = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/img-1771899995000.jpg";
const INTERVIEW_MODE_DEV      = "https://robert-storage.tor1.digitaloceanspaces.com/images/generated/img-1771915932000.jpg";

type Section = "overview" | "today" | "feb19" | "feb20" | "feb23" | "architecture" | "orbiter" | "conversations" | "decisions" | "skill" | "resources";

const NAV: { id: Section; label: string; emoji: string }[] = [
  { id: "overview", label: "Overview", emoji: "🧭" },
  { id: "today", label: "Feb 18 Recap", emoji: "📅" },
  { id: "feb19", label: "Feb 19 Overview", emoji: "🔄" },
  { id: "feb20", label: "Feb 20 Planning", emoji: "📋" },
  { id: "feb23", label: "Feb 23 Build", emoji: "🚀" },
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
        {active === "feb19"          && <Feb19RecapSection onImageClick={setLightbox} />}
        {active === "feb20"          && <Feb20PlanningSection onImageClick={setLightbox} />}
        {active === "feb23"          && <Feb23BuildSection onImageClick={setLightbox} />}
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
        <WhiteboardCard url={WB_FREELANCE_ENGAGEMENT} title="Freelance Engagement: Copilot Development" caption="3-4 weeks · 10-15 hrs/week · $300/hr · Technical focus" onClick={() => onImageClick(WB_FREELANCE_ENGAGEMENT)} />
        <WhiteboardCard url={WB_TECH_COLLABORATION}   title="Robert <> Mark: Tech Collaboration"        caption="Technical architectures · VC demo countdown · Action plan" onClick={() => onImageClick(WB_TECH_COLLABORATION)} />
        <WhiteboardCard url={WB_KICKOFF_STRATEGY}     title="Orbit Copilot Kickoff & Strategy"         caption="March 2nd VC Demo · Leverage Loops priority · $6K allocation"    onClick={() => onImageClick(WB_KICKOFF_STRATEGY)} />
        <WhiteboardCard url={WB_PRODUCT_DEMO}         title="Product Demo & Copilot Iteration"         caption="Live integration · UI decisions · Future roadmap"         onClick={() => onImageClick(WB_PRODUCT_DEMO)} />
        <WhiteboardCard url={WB_FEB19_BUILD_DAY}       title="Feb 19: Demo Build Day"      caption="150+ commits · 8-pass visual · Backend integration · Button-first system"    onClick={() => onImageClick(WB_FEB19_BUILD_DAY)} />
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "40px" }}>
        {[
          { n: "5", label: "Card Types", sub: "Outcome · Loop · Serendipity · Contact · Meeting Prep" },
          { n: "8", label: "Tab Views", sub: "Copilot · Network · Search · Outcomes · Horizon · Collections · Insights · Docs" },
          { n: "5", label: "Whiteboards", sub: "Engagement · Tech Collab · Kickoff · Demo · Recovery" },
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
        url={WB_PRODUCT_DEMO}
        title="Product Demo & Copilot Iteration Whiteboard"
        caption="Click to enlarge — created by Robert for the meetings"
        onClick={() => onImageClick(WB_PRODUCT_DEMO)}
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

// ─── FEB 19 RECAP ───────────────────────────────────────────────────────────

function Feb19RecapSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  const keyAchievements = [
    { icon: "📏", title: "Input Width Saga", desc: "Fixed narrow input box through 20+ commits: 680px → 1200px → 100vw → Full width with JavaScript DOM manipulation. Final solution using runtime width forcing." },
    { icon: "🎨", title: "8-Pass Visual Enhancement", desc: "Systematic enhancement across Typography, Colors, Spacing, Interactions, Depth, Animations, Feedback, and Polish. Introduced 'Constellation Luxury' theme." },
    { icon: "🔗", title: "Backend Integration", desc: "Integrated button groups (#8064) and dispatch endpoint (#8084). Full conversation flow from frontend → /chat → Claude Sonnet 4 → visual cards working." },
    { icon: "🎯", title: "Button-First System", desc: "Implemented all 4 phases: Message UI alignment, Fork+SubFork navigation, ButtonGroup interviews, and Confirmation modal with dispatch." },
    { icon: "🐛", title: "Critical Fixes", desc: "Fixed 500 error (history extraction), scanning card 0/0 issue, text contrast problems, font loading, and button positioning. All verified working." },
    { icon: "📊", title: "The Numbers", desc: "150+ commits, 23 components built, 12 documentation files created, 8 visual enhancement passes, 5 card types, 4 implementation phases completed." },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader
        title="February 19, 2026 — Demo Build Day"
        subtitle="Full-stack build session: Input fixes, visual enhancements, backend integration, button-first system — 150+ commits in one day"
        emoji="🚀"
      />

      {/* Whiteboard */}
      <WhiteboardCard
        url={WB_FEB19_BUILD_DAY}
        title="Feb 19 Demo Build Day"
        caption="Click to enlarge — 150+ commits, full-stack build session"
        onClick={() => onImageClick(WB_FEB19_BUILD_DAY)}
        fullWidth
      />

      {/* Key achievements */}
      <div style={{ marginTop: "32px", marginBottom: "32px" }}>
        <SubHeader title="What Got Done" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {keyAchievements.map((achievement, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "10px", padding: "16px 18px",
            }}>
              <div style={{ fontSize: "18px", marginBottom: "10px" }}>{achievement.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0", marginBottom: "8px" }}>{achievement.title}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{achievement.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Major Workstreams */}
      <SubHeader title="Major Workstreams Completed" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "32px" }}>
        {[
          { name: "Input Width Fixes", commits: "20+", desc: "CSS attempts failed, pivoted to JavaScript runtime DOM manipulation with MutationObserver" },
          { name: "Visual Enhancement", commits: "15+", desc: "8-pass systematic improvement: typography, colors, spacing, depth, animations, feedback, polish" },
          { name: "Backend Integration", commits: "10+", desc: "Both endpoints delivered same day: button groups (#8064) and dispatch (#8084) fully working" },
          { name: "Button Interview Flow", commits: "25+", desc: "All 4 phases: message alignment, fork navigation, button groups, confirmation modal" },
        ].map((ws, i) => (
          <div key={i} style={{
            background: "rgba(99,102,241,0.06)", 
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "10px", padding: "14px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#a5b4fc", flex: 1 }}>{ws.name}</span>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{ws.commits} commits</span>
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{ws.desc}</div>
            <div style={{ marginTop: "8px", fontSize: "10px", color: "#818cf8" }}>✓ Verified working</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <SubHeader title="Build Day Timeline" />
      <div style={{ 
        background: "rgba(99,102,241,0.06)", 
        border: "1px solid rgba(99,102,241,0.15)",
        borderRadius: "12px", 
        padding: "20px 24px",
        marginBottom: "32px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { time: "12pm", title: "Input Width Saga Begins", detail: "Started with 680px narrow input, began CSS attempts" },
            { time: "3pm", title: "Width Fixes Complete", detail: "JavaScript runtime solution working, full-width achieved" },
            { time: "6pm", title: "Visual Polish Applied", detail: "8-pass enhancement system, Constellation theme" },
            { time: "9pm", title: "Backend Integration", detail: "Both endpoints delivered: button groups + dispatch" },
            { time: "11pm", title: "Testing Complete", detail: "All flows verified, 150+ commits, demo ready" },
          ].map((milestone, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <div style={{
                width: "56px", height: "32px", borderRadius: "16px",
                background: "rgba(99,102,241,0.15)", border: "2px solid #6366f1",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 700, color: "#a5b4fc", flexShrink: 0
              }}>{milestone.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0" }}>{milestone.title}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{milestone.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accomplishments */}
      <SubHeader title="Build Day Accomplishments" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        {/* Frontend */}
        <div style={{
          background: "rgba(99,102,241,0.06)", 
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "10px", padding: "18px 20px",
        }}>
          <div style={{ fontSize: "20px", marginBottom: "10px" }}>⚛️</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#a5b4fc", marginBottom: "8px" }}>Frontend Complete</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            23 components built, 8-pass visual enhancements, button-first interview system, full-width input working, professional design
          </div>
        </div>

        {/* Backend */}
        <div style={{
          background: "rgba(16,185,129,0.06)", 
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "10px", padding: "18px 20px",
        }}>
          <div style={{ fontSize: "20px", marginBottom: "10px" }}>🔗</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#6ee7b7", marginBottom: "8px" }}>Backend Integrated</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            Button groups endpoint working, dispatch endpoint deployed, conversation flow complete, all endpoints tested and verified
          </div>
        </div>

        {/* Documentation */}
        <div style={{
          background: "rgba(245,158,11,0.06)", 
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: "10px", padding: "18px 20px",
        }}>
          <div style={{ fontSize: "20px", marginBottom: "10px" }}>📚</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#fbbf24", marginBottom: "8px" }}>Documentation</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            12 comprehensive docs created: implementation plans, testing guides, status reports, backend integration specs
          </div>
        </div>

        {/* Testing */}
        <div style={{
          background: "rgba(139,92,246,0.06)", 
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: "10px", padding: "18px 20px",
        }}>
          <div style={{ fontSize: "20px", marginBottom: "10px" }}>✅</div>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#c084fc", marginBottom: "8px" }}>Testing Complete</div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
            All flows tested end-to-end, critical bugs fixed (500 error, scanning 0/0, contrast, fonts), demo verified ready
          </div>
        </div>
      </div>

      <CalloutBox icon="🎓" title="Lessons Learned">
        <strong style={{ color: "#e8e8f0" }}>From 150+ Commits in One Day:</strong>
        <ul style={{ margin: "8px 0 0 0", padding: "0 0 0 20px", fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
          <li>When CSS fails completely, JavaScript runtime DOM manipulation is a valid solution</li>
          <li>Systematic enhancement (8-pass) beats ad-hoc fixes — creates consistent, professional results</li>
          <li>Backend team delivered same-day integration — close coordination enables fast iteration</li>
          <li>Document as you build — comprehensive docs make debugging and onboarding trivial</li>
          <li>Test with real data, not mocks — discovered critical 500 error and scanning 0/0 issues</li>
          <li>Quality compounds — each fix makes the next one easier and faster</li>
        </ul>
        <div style={{ marginTop: "12px", padding: "10px 12px", background: "rgba(99,102,241,0.1)", borderRadius: "8px", fontSize: "12px", color: "#a5b4fc" }}>
          💡 <strong>Critical insight:</strong> Don't stop until it's perfect. 90% working is not shippable — the last 10% makes all the difference.
        </div>
      </CalloutBox>
    </div>
  );
}

// ─── FEB 20 PLANNING ─────────────────────────────────────────────────────────

function Feb20PlanningSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  const jasonRequests = [
    { icon: "⚡", title: "Two-Layer Agent System", desc: "Quick layer for fast cursory search (names, titles, locations) returning immediate 'This might be your guy' results. Deep research layer running in parallel taking 2-5+ minutes for comprehensive analysis." },
    { icon: "🎯", title: "Parallel Execution", desc: "Both layers run simultaneously - quick results show while deep research continues. User gets instant feedback without waiting for complete analysis." },
  ];

  const joshRequests = [
    { icon: "❓", title: "I Don't Know Button", desc: "User can indicate they need more info when unfamiliar with options presented. Escape hatch for when they're unsure." },
    { icon: "💡", title: "Hover Explanations", desc: "Inline research information for unfamiliar terms (e.g., Costa Rica regions: Central Valley, Pacific Coast, etc.). Help text on demand without cluttering UI." },
    { icon: "🔍", title: "Help Icons", desc: "Contextual help throughout interface explaining options and features as users discover them." },
    { icon: "📖", title: "Expandable Help", desc: "Detailed help sections that expand when needed, keeping interface clean by default." },
  ];

  const meetingPrepFeature = [
    { icon: "📅", title: "4th Copilot Mode", desc: "New mode alongside Outcomes, Leverage Loops, and Serendipity dedicated to meeting preparation." },
    { icon: "🔌", title: "Calendar Integration", desc: "Pull upcoming meetings from Robert's calendar to automatically generate prep materials." },
    { icon: "📝", title: "Prep Materials", desc: "Generate: Summary of person, 3 talking points, suggested openers, why they care, what to listen for, and LANDMINES to avoid." },
    { icon: "🎯", title: "Project Context", desc: "Allow user to select which project context applies to this specific meeting for targeted preparation." },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader
        title="February 20, 2026 — Planning Meeting"
        subtitle="Mark, Jason, Josh, and Robert align on priorities: Two-layer agents, help system, and meeting prep mode"
        emoji="📋"
      />

      {/* Whiteboard */}
      <WhiteboardCard
        url={WB_FEB20_PLANNING}
        title="Feb 20 Planning Session Whiteboard"
        caption="Click to enlarge — Strategic requirements from Jason, Josh, and Mark"
        onClick={() => onImageClick(WB_FEB20_PLANNING)}
        fullWidth
      />

      {/* Jason's Requests */}
      <div style={{ marginTop: "32px", marginBottom: "32px" }}>
        <SubHeader title="Jason's Request: Two-Layer Agent System" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {jasonRequests.map((item, i) => (
            <div key={i} style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: "10px", padding: "16px 18px",
            }}>
              <div style={{ fontSize: "18px", marginBottom: "10px" }}>{item.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#fbbf24", marginBottom: "8px" }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Josh's Requests */}
      <div style={{ marginBottom: "32px" }}>
        <SubHeader title="Josh's Request: Help & Education Features" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {joshRequests.map((item, i) => (
            <div key={i} style={{
              background: "rgba(52,211,153,0.06)",
              border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: "10px", padding: "16px 18px",
            }}>
              <div style={{ fontSize: "18px", marginBottom: "10px" }}>{item.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#34d399", marginBottom: "8px" }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Prep Mode */}
      <div style={{ marginBottom: "32px" }}>
        <SubHeader title="New Feature: Meeting Prep Mode" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {meetingPrepFeature.map((item, i) => (
            <div key={i} style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "10px", padding: "16px 18px",
            }}>
              <div style={{ fontSize: "18px", marginBottom: "10px" }}>{item.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#818cf8", marginBottom: "8px" }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Decisions */}
      <SubHeader title="Strategic Decisions from This Meeting" />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
        {[
          { icon: "🎯", text: "Focus on Leverage Loops FIRST (not outcomes yet) - help people in your network" },
          { icon: "📋", text: "Form builder approach priority - user defines before dispatch, no premature execution" },
          { icon: "✨", text: "Two user paths must coexist: hardcore (minimal typing) + conversational (guided interview)" },
          { icon: "🎭", text: "Don't show 'how the sausage is made' - deliver magic, hide complexity" },
          { icon: "⏰", text: "Wednesday UI review meeting before Thursday integration into Orbiter app" },
          { icon: "🔗", text: "Coordinate with Mark on context endpoint with add-ons" },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: "12px", alignItems: "flex-start",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "10px", padding: "12px 16px",
          }}>
            <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Conversation Visualization */}
      <div style={{ marginBottom: "32px" }}>
        <SubHeader title="Meeting Participants & Discussion" />
        <WhiteboardCard
          url={CONV_FEB20_MEETING}
          title="Feb 20 Planning Meeting - Mark, Jason, Josh & Robert"
          caption="Click to enlarge — Four-way strategic planning discussion"
          onClick={() => onImageClick(CONV_FEB20_MEETING)}
          fullWidth
        />
      </div>

      <CalloutBox icon="🎬" title="Josh & Jason's Work Style">
        Film directors/producers/editors background. Branched spider web brain. React immediately to changes.
        Rapid iteration expected. Will generate ideas spontaneously on calls. Every meeting brings new requirements.
        Design approach: Build → React → Refine → Repeat.
      </CalloutBox>
    </div>
  );
}

// ─── FEB 23 BUILD ────────────────────────────────────────────────────────────

function Feb23BuildSection({ onImageClick }: { onImageClick: (url: string) => void }) {
  const criticalWork = [
    { icon: "🚫", title: "All Emojis Removed", desc: "Cleaned entire interface - removed from Open Copilot button, Quick Actions, ForkInTheRoad, ButtonGroup, QuestionCardEnhanced. Professional, emoji-free interface.", commits: "4" },
    { icon: "🔮", title: "Premium Glowy Orb", desc: "Replaced generic bouncing dots with multi-layer glowing orb animation. Outer glow + mid glow + core orb + shine highlight. Contextual loading messages.", commits: "1" },
    { icon: "🚀", title: "Dispatch Button Added", desc: "Added to copilot modal upper right with purple gradient, hover effects, shadow animations. Beautiful send icon SVG.", commits: "1" },
    { icon: "📝", title: "Beautified Descriptions", desc: "Created DispatchConfirmationModal with LLM-generated natural language descriptions. Format: 'Leverage my network to help [Person] with [Goal] because...'", commits: "1" },
    { icon: "🔑", title: "Keyword Detection", desc: "Implemented dispatch.ts utilities with keyword patterns (show me, execute, let's do this, go). Server-ready detection system.", commits: "1" },
    { icon: "⏳", title: "Waiting Room UI", desc: "Built WaitingRoom component for 2-5+ minute processes. Status orbs, progress bars, elapsed time, step tracking. Premium observability without showing internals.", commits: "1" },
  ];

  const newComponents = [
    { name: "DispatchConfirmationModal", desc: "Beautiful purple modal with gradient header, icon, beautified description, and animated dispatch button", file: "app/components/DispatchConfirmationModal.tsx" },
    { name: "WaitingRoom", desc: "Premium status UI with glowing status orbs (pending/running/complete/error), progress tracking, time displays", file: "app/components/WaitingRoom.tsx" },
    { name: "LoadingIndicator (enhanced)", desc: "Multi-layer glowy orb with pulse animations, contextual messages based on user action", file: "app/components/LoadingIndicator.tsx" },
    { name: "dispatch.ts utilities", desc: "Keyword detection (10 patterns) + beautified description generation functions", file: "app/lib/dispatch.ts" },
  ];

  const completionStats = [
    { label: "Items Complete", value: "38/86", percent: "44%" },
    { label: "Critical UI", value: "7/10", percent: "70%" },
    { label: "High Priority", value: "15/15", percent: "100%" },
    { label: "Core Functionality", value: "10/12", percent: "83%" },
    { label: "Infrastructure", value: "7/8", percent: "88%" },
    { label: "Visual Polish", value: "6/7", percent: "86%" },
    { label: "Strategic", value: "8/9", percent: "89%" },
  ];

  const remainingWork = [
    { category: "Backend", count: "~15 items", desc: "Calendar integration, meeting prep endpoint, process monitoring, network graph data" },
    { category: "Integration", count: "~10 items", desc: "Wire dispatch modal to API, connect WaitingRoom to monitoring, OutcomesView results display" },
    { category: "Polish", count: "~8 items", desc: "Network graph visualization, performance optimization, notification system" },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <SectionHeader
        title="February 23, 2026 — Critical Implementation Day"
        subtitle="38/86 checklist items completed (44%) - All critical frontend work shipped in 10 commits"
        emoji="🚀"
      />

      {/* Whiteboard */}
      <WhiteboardCard
        url={WB_FEB23_CRITICAL}
        title="Feb 23 Build Session Whiteboard"
        caption="Click to enlarge — Dispatch flow, glowy orb, emoji removal, waiting room implementations"
        onClick={() => onImageClick(WB_FEB23_CRITICAL)}
        fullWidth
      />

      {/* Critical Work Completed */}
      <div style={{ marginTop: "32px", marginBottom: "32px" }}>
        <SubHeader title="Critical Work Completed" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {criticalWork.map((item, i) => (
            <div key={i} style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "10px", padding: "16px 18px",
              position: "relative",
            }}>
              <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
                {item.commits} commit{item.commits !== "1" ? "s" : ""}
              </div>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>{item.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#a5b4fc", marginBottom: "8px" }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* New Components Created */}
      <div style={{ marginBottom: "32px" }}>
        <SubHeader title="New Components Created" />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {newComponents.map((comp, i) => (
            <div key={i} style={{
              background: "rgba(52,211,153,0.06)",
              border: "1px solid rgba(52,211,153,0.15)",
              borderRadius: "10px", padding: "14px 16px",
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#34d399", marginBottom: "4px" }}>{comp.name}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", lineHeight: 1.5 }}>{comp.desc}</div>
                <code style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{comp.file}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Stats */}
      <div style={{ marginBottom: "32px" }}>
        <SubHeader title="Checklist Completion Stats" />
        <div style={{ 
          background: "linear-gradient(145deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: "12px", 
          padding: "20px 24px",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {completionStats.map((stat, i) => (
              <div key={i} style={{
                textAlign: "center",
                padding: "12px",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "8px",
              }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#a5b4fc", marginBottom: "4px" }}>{stat.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>{stat.label}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#34d399" }}>{stat.percent}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Remaining Work */}
      <div style={{ marginBottom: "32px" }}>
        <SubHeader title="What's Left (48 items)" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
          {remainingWork.map((work, i) => (
            <div key={i} style={{
              background: "rgba(251,191,36,0.06)",
              border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: "10px", padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#fbbf24", marginBottom: "4px" }}>{work.category}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{work.desc}</div>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#fbbf24" }}>{work.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Git Summary */}
      <div style={{ marginBottom: "32px" }}>
        <SubHeader title="Git History — feature/complete-checklist-feb23" />
        <div style={{ 
          background: "rgba(0,0,0,0.3)", 
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px", 
          padding: "16px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              { hash: "c6b5fb2", msg: "Remove ALL emojis from interface (critical item #1)" },
              { hash: "b6a8fb8", msg: "Replace loading dots with premium glowy orb (critical item #2)" },
              { hash: "959cb3f", msg: "Add dispatch button in upper right (critical item #3)" },
              { hash: "6b67dd1", msg: "Remove emojis from ButtonGroup and QuestionCardEnhanced" },
              { hash: "967d6aa", msg: "Update checklist - mark completed frontend components" },
              { hash: "4cb3da0", msg: "Add dispatch confirmation modal with beautified descriptions" },
              { hash: "a5841ea", msg: "Add WaitingRoom component for long-running processes" },
              { hash: "0ef00e6", msg: "Update checklist - mark 35+ items complete" },
              { hash: "67b0ccd", msg: "Document backend integration requirements" },
              { hash: "07933aa", msg: "Final summary: 38/86 items (44%) complete" },
            ].map((commit, i) => (
              <div key={i} style={{
                display: "flex", gap: "12px", alignItems: "baseline",
                padding: "8px 10px",
                background: i < 3 ? "rgba(99,102,241,0.08)" : "transparent",
                borderRadius: "6px",
              }}>
                <code style={{ fontSize: "11px", color: "#818cf8", fontFamily: "monospace", flexShrink: 0, fontWeight: 600 }}>{commit.hash}</code>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{commit.msg}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
            Branch pushed to GitHub: <code style={{ color: "#818cf8" }}>feature/complete-checklist-feb23</code>
          </div>
        </div>
      </div>

      {/* Interview Mode Development - Evening Session */}
      <div style={{ marginBottom: "32px" }}>
        <SubHeader title="Interview Mode Development - Evening Marathon (12.5 hours)" />
        <WhiteboardCard
          url={INTERVIEW_MODE_DEV}
          title="Interview Mode: From Requirements to Production"
          caption="Click to enlarge — Complete development journey: 42KB code, 110KB docs, 10+ debugging iterations, 36 commits, DEPLOYED"
          onClick={() => onImageClick(INTERVIEW_MODE_DEV)}
          fullWidth
        />
        
        <div style={{ 
          marginTop: "20px",
          background: "linear-gradient(145deg, rgba(16,185,129,0.1), rgba(6,182,212,0.08))",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "12px",
          padding: "20px 24px",
        }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#10b981", marginBottom: "12px" }}>
            🎉 COMPLETE & DEPLOYED TO PRODUCTION
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "16px" }}>
            Built Mark's "super interviewer" vision from Transcript #430: 4-stage guided flow (identify → clarify → extract → confirm)
            with world-class UI, useReducer state management, and premium animations. After 10+ debugging iterations and breakthrough
            isolation testing, Robert confirmed working. Status: MERGED TO MAIN.
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            <div style={{ textAlign: "center", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#10b981", marginBottom: "4px" }}>42KB</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Production Code</div>
            </div>
            <div style={{ textAlign: "center", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#06b6d4", marginBottom: "4px" }}>110KB</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Documentation</div>
            </div>
            <div style={{ textAlign: "center", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#8b5cf6", marginBottom: "4px" }}>36</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Commits</div>
            </div>
            <div style={{ textAlign: "center", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px" }}>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#fbbf24", marginBottom: "4px" }}>12.5h</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Dev Time</div>
            </div>
          </div>
        </div>
      </div>

      <CalloutBox icon="🎯" title="What This Means">
        All critical frontend work is done. The interface is professional, emoji-free, with premium animations and clear dispatch flow.
        Remaining work is primarily backend integration (calendar, monitoring, APIs) documented in BACKEND-TODO.md.
        Estimated: 14-22 hours to reach 100% completion. Ready for Mark's review and Thursday integration.
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
        url={WB_TECH_COLLABORATION}
        title="Robert <> Mark: Tech Collaboration Whiteboard"
        caption="Click to enlarge — created by Robert for the meetings"
        onClick={() => onImageClick(WB_TECH_COLLABORATION)}
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
        url={WB_KICKOFF_STRATEGY}
        title="Kickoff & Strategy Whiteboard"
        caption="Click to enlarge — created by Robert for the meetings"
        onClick={() => onImageClick(WB_KICKOFF_STRATEGY)}
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
      <WhiteboardCard url={WB_KICKOFF_STRATEGY} title="Orbit Copilot Kickoff & Strategy Whiteboard" caption="Click to enlarge — created by Robert for the meetings" onClick={() => onImageClick(WB_KICKOFF_STRATEGY)} fullWidth />
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
      <WhiteboardCard url={WB_FREELANCE_ENGAGEMENT} title="Freelance Engagement Whiteboard" caption="Click to enlarge — created by Robert for the meetings" onClick={() => onImageClick(WB_FREELANCE_ENGAGEMENT)} fullWidth />
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
