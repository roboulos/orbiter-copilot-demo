"use client";

import { QuestionCard } from "../components/QuestionCard";
import { ScanningCard } from "../components/ScanningCard";
import { OutcomeCard } from "../components/OutcomeCard";
import { ContactCard } from "../components/ContactCard";

export default function TestVisualsPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0a0a12 0%, #12121d 100%)",
      padding: "40px 20px",
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "48px",
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#e8e8f0",
            marginBottom: "12px",
            letterSpacing: "-0.03em",
          }}>
            Visual Components Test
          </h1>
          <p style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
          }}>
            This is what the generative UI looks like
          </p>
        </div>

        {/* Section: Question Cards */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#a78bfa",
            marginBottom: "24px",
            letterSpacing: "-0.01em",
          }}>
            1. QuestionCard (Interview Questions)
          </h2>

          {/* Example 1: With icon */}
          <QuestionCard
            icon="🏝️"
            title="Costa Rica Relocation"
            description="Which region interests you most?"
            buttons={[
              {
                label: "Pacific Coast",
                value: "pacific",
                emoji: "🏖️",
                subtitle: "Guanacaste, Manuel Antonio",
              },
              {
                label: "Central Valley",
                value: "central",
                emoji: "🏔️",
                subtitle: "San José, Escazú",
              },
              {
                label: "Caribbean Coast",
                value: "caribbean",
                emoji: "🌴",
                subtitle: "Puerto Viejo, Limón",
              },
              {
                label: "Still exploring all regions",
                value: "exploring",
                emoji: "🗺️",
              },
            ]}
          />

          {/* Example 2: Different topic */}
          <div style={{ marginTop: "24px" }}>
            <QuestionCard
              icon="💰"
              title="Investment Budget"
              description="What range are you comfortable with?"
              buttons={[
                { label: "$200-300K", value: "low", emoji: "💵" },
                { label: "$300-500K", value: "mid", emoji: "💰" },
                { label: "$500K+", value: "high", emoji: "💎" },
                { label: "Still researching", value: "unsure", emoji: "🤔" },
              ]}
            />
          </div>
        </section>

        {/* Section: Scanning Card */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#34d399",
            marginBottom: "24px",
            letterSpacing: "-0.01em",
          }}>
            2. ScanningCard (Network Analysis)
          </h2>

          <ScanningCard
            title="🔍 Scanning Your Network..."
            total_connections={847}
            matches_found={12}
            status="Ranking connections by relevance..."
          />
        </section>

        {/* Section: Outcome Card */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#f59e0b",
            marginBottom: "24px",
            letterSpacing: "-0.01em",
          }}>
            3. OutcomeCard (Summary Before Dispatch)
          </h2>

          <OutcomeCard
            goal="Buy a vacation property in Pacific Coast, Costa Rica"
            whyItMatters="Building a retreat and investment property for future retirement"
            idealHelper="Local realtors specializing in expats, recent American relocators, legal advisors"
            timeframe="6 months"
            contextToShare="Budget $300-500K, prefer beachfront or ocean view, interested in rental income potential"
            matchStrength="high"
          />
        </section>

        {/* Section: Contact Card */}
        <section style={{ marginBottom: "64px" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#6366f1",
            marginBottom: "24px",
            letterSpacing: "-0.01em",
          }}>
            4. ContactCard (People from Network)
          </h2>

          <ContactCard
            name="David Park"
            title="Real Estate Developer"
            company="Costa Rica Coastal Properties"
            bio="Specializes in Pacific Coast properties for American expats. 15+ years experience."
            why_matters="David has helped 50+ Americans buy property in Guanacaste and knows all the local pitfalls"
          />

          <div style={{ marginTop: "16px" }}>
            <ContactCard
              name="Maria Santos"
              title="Expat Community Leader"
              company="Tamarindo Expat Network"
              bio="American expat living in Tamarindo for 8 years. Runs weekly meetups."
              why_matters="Maria can connect you with the expat community and share real-world relocation insights"
            />
          </div>
        </section>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          padding: "40px 0",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}>
          <p style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.4)",
          }}>
            These are the visual templates backend needs to return
          </p>
          <p style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.3)",
            marginTop: "8px",
          }}>
            See <code>BACKEND-VISUAL-TEMPLATES.md</code> for integration guide
          </p>
        </div>
      </div>
    </div>
  );
}
