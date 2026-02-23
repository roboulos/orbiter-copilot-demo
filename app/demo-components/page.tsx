"use client";

import { useState } from "react";
import { DispatchPromptBanner } from "../components/DispatchPromptBanner";
import { ProjectContextSelector } from "../components/ProjectContextSelector";
import { OutcomeCardEnhanced } from "../components/OutcomeCard";
import { WaitingRoom } from "../components/WaitingRoom";

/**
 * Demo page to showcase all new frontend components
 */
export default function DemoComponentsPage() {
  const [showDispatchPrompt, setShowDispatchPrompt] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(1);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#e8e8f0",
            marginBottom: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          Frontend Components Demo
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "40px",
            lineHeight: 1.6,
          }}
        >
          All new components built for the checklist completion
        </p>

        {/* Component 1: Dispatch Intent Banner */}
        <Section
          title="1. Dispatch Intent Detection"
          description="Auto-detects when user says 'show me', 'execute', 'let's do this', etc. and prompts to dispatch"
        >
          {showDispatchPrompt && (
            <DispatchPromptBanner
              onDispatch={() => {
                alert("Dispatch clicked!");
                setShowDispatchPrompt(false);
              }}
              onDismiss={() => setShowDispatchPrompt(false)}
              personName="Ray Deck"
            />
          )}
          {!showDispatchPrompt && (
            <button
              onClick={() => setShowDispatchPrompt(true)}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                color: "white",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Show Dispatch Banner Again
            </button>
          )}
        </Section>

        {/* Component 2: Project Context Selector */}
        <Section
          title="2. Project Context Selector"
          description="Allows user to select which project context applies to a meeting for targeted prep"
        >
          <ProjectContextSelector
            projects={[
              { id: "xano-snappy", name: "Xano.Snappy.ai", description: "SaaS product for Xano developers", color: "#6366f1" },
              { id: "snappy-consulting", name: "Snappy Consulting", description: "Developer productivity consulting", color: "#a78bfa" },
              { id: "orbiter", name: "Orbiter Copilot", description: "Network intelligence platform", color: "#34d399" },
              { id: "statechange", name: "StateChange", description: "Client project", color: "#f59e0b" },
            ]}
            selectedProjectId={selectedProject}
            onSelect={setSelectedProject}
            personName="Mark Pederson"
          />
        </Section>

        {/* Component 3: Enhanced Outcome Cards */}
        <Section
          title="3. Enhanced Outcome Cards"
          description="Premium fold-down panels with rich visual presentation, timeline, and actions"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <OutcomeCardEnhanced
              title="Leverage Network for Ray Deck"
              context="Ray Deck is moving to Costa Rica and needs recommendations for the Pacific coast. He's looking for investor connections and local tech community contacts. Use my network to find the best people to introduce him to."
              status="draft"
              createdAt={Date.now() - 1000 * 60 * 30}
              personName="Ray Deck"
              personTitle="Entrepreneur & Investor"
              personAvatar="https://avatar.iran.liara.run/public/42"
              isExpanded={expandedCard === 1}
              onToggleExpand={() => setExpandedCard(expandedCard === 1 ? null : 1)}
              onDispatch={() => alert("Dispatch!")}
              onArchive={() => alert("Archive!")}
            />

            <OutcomeCardEnhanced
              title="Meeting Prep: Mark Pederson at Orbiter"
              context="Preparing for Thursday integration meeting. Need talking points about copilot progress, demo flow, and Charles intro. Calendar shows Feb 27 @ 9 AM."
              status="processing"
              createdAt={Date.now() - 1000 * 60 * 60 * 2}
              dispatchedAt={Date.now() - 1000 * 60 * 45}
              personName="Mark Pederson"
              personTitle="CEO at Orbiter"
              personAvatar="https://avatar.iran.liara.run/public/55"
              isExpanded={expandedCard === 2}
              onToggleExpand={() => setExpandedCard(expandedCard === 2 ? null : 2)}
              onArchive={() => alert("Archive!")}
            />

            <OutcomeCardEnhanced
              title="Find Investor Connections for SaaS Launch"
              context="Looking for warm introductions to investors who focus on dev tools and B2B SaaS. Xano.Snappy.ai is ready for seed round."
              status="suggestion"
              createdAt={Date.now() - 1000 * 60 * 60 * 24}
              dispatchedAt={Date.now() - 1000 * 60 * 60 * 23}
              completedAt={Date.now() - 1000 * 60 * 30}
              resultText="Found 3 strong connections: Sarah Chen (dev tools investor at Accel), Mike Johnson (B2B SaaS specialist at Index), and Lisa Wong (technical founder turned VC). All have invested in similar tools. Recommended approach: Start with Sarah (strongest connection through mutual friend Alex)."
              personName="Investor Network"
              isExpanded={expandedCard === 3}
              onToggleExpand={() => setExpandedCard(expandedCard === 3 ? null : 3)}
              onArchive={() => alert("Archive!")}
            />
          </div>
        </Section>

        {/* Component 4: Waiting Room */}
        <Section
          title="4. Waiting Room (Long-Running Processes)"
          description="Premium status UI for 2-5+ minute agent processes with observability"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <WaitingRoom
              title="Analyzing Network for Ray Deck"
              description="Searching 1,247 contacts and 3,892 connections"
              status="running"
              progress={65}
              elapsedSeconds={142}
              estimatedSeconds={240}
              currentStep="Mapping second-degree connections in Pacific region"
              onCancel={() => alert("Cancelled!")}
            />

            <WaitingRoom
              title="Deep Research: Investor Connections"
              description="Comprehensive analysis of investment patterns and preferences"
              status="complete"
              progress={100}
              elapsedSeconds={318}
              onViewResults={() => alert("View results!")}
            />
          </div>
        </Section>

        {/* Send Icon Note */}
        <Section
          title="5. Send Icon Override"
          description="CSS override attempts to change CrayonChat send icon to up arrow (↑) like Claude"
        >
          <div
            style={{
              padding: "20px",
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.2)",
              borderRadius: "12px",
            }}
          >
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: "#fbbf24" }}>Note:</strong> Send icon CSS override added to globals.css.
              It attempts to replace the default email/send icon with an up arrow (↑) in CrayonChat composer.
              May require CrayonChat to be rendered to see the effect. Check the actual copilot modal.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <div
        style={{
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#e8e8f0",
            marginBottom: "6px",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, margin: 0 }}>
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
