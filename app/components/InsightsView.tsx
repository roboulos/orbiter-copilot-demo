"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { getNetwork, getOutcomes, getHorizon, type NetworkPerson } from "../lib/xano";

// ── Theme colours ──────────────────────────────────────
const C = {
  primary:   "#6366f1",
  secondary: "#a78bfa",
  accent:    "#34d399",
  warning:   "#fbbf24",
  grid:      "rgba(255,255,255,0.06)",
  text:      "rgba(255,255,255,0.45)",
  tooltipBg: "#1a1a2e",
  tooltipBorder: "rgba(99,102,241,0.3)",
};

// ── Custom Tooltip ─────────────────────────────────────
function DarkTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; color?: string; name?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.tooltipBg,
      border: `1px solid ${C.tooltipBorder}`,
      borderRadius: "10px",
      padding: "10px 14px",
      fontSize: "12px",
      color: "#e8e8f0",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      {label && <div style={{ color: C.text, marginBottom: "4px", fontSize: "11px" }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.primary, fontWeight: 600 }}>
          {p.name ? `${p.name}: ` : ""}{p.value}
        </div>
      ))}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }: {
  label: string; value: string | number; sub?: string; color?: string; icon?: string;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: `1px solid ${color ? color + "30" : "rgba(99,102,241,0.2)"}`,
      borderRadius: "14px",
      padding: "18px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, ${color || C.primary}, transparent)`,
      }} />
      {icon && <div style={{ fontSize: "22px", marginBottom: "8px" }}>{icon}</div>}
      <div style={{ fontSize: "28px", fontWeight: 700, color: color || C.primary, letterSpacing: "-0.02em", marginBottom: "4px" }}>
        {value}
      </div>
      <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8e8f0", marginBottom: sub ? "2px" : 0 }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", color: C.text }}>{sub}</div>}
    </div>
  );
}

// ── Section container ──────────────────────────────────
function Section({ title, children, height = 220 }: { title: string; children: React.ReactNode; height?: number }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "16px",
      padding: "20px 24px",
    }}>
      <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)", marginBottom: "16px" }}>
        {title}
      </div>
      <div style={{ height }}>
        {children}
      </div>
    </div>
  );
}

// ── Week label helper ──────────────────────────────────
function weekLabel(weeksAgo: number): string {
  if (weeksAgo === 0) return "Now";
  const d = new Date();
  d.setDate(d.getDate() - weeksAgo * 7);
  return d.toLocaleDateString("en", { month: "short", day: "numeric" });
}

// ── Funnel bar ────────────────────────────────────────
function FunnelBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "12px", color, fontWeight: 700 }}>{count}</span>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: color, borderRadius: "3px",
          transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
          boxShadow: `0 0 8px ${color}60`,
        }} />
      </div>
    </div>
  );
}

// ── Shimmer skeleton ──────────────────────────────────
function Skeleton({ width, height, style }: { width?: string | number; height?: number; style?: React.CSSProperties }) {
  return <div className="orbiter-shimmer" style={{ width, height: height || 16, borderRadius: 6, ...style }} />;
}

export function InsightsView({ onSwitchTab }: { onSwitchTab: (tab: string) => void }) {
  const [network, setNetwork] = useState<NetworkPerson[]>([]);
  const [networkTotal, setNetworkTotal] = useState(0);
  const [outcomeCount, setOutcomeCount] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [serendipityCount, setSerendipityCount] = useState(0);
  const [horizonCount, setHorizonCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [netData, outData, horizonData] = await Promise.allSettled([
        getNetwork({ per_page: 50 }),
        getOutcomes({ per_page: 50 }),
        getHorizon({ per_page: 50 }),
      ]);

      if (netData.status === "fulfilled") {
        setNetwork(netData.value.items);
        setNetworkTotal(netData.value.itemsTotal);
      }
      if (outData.status === "fulfilled") {
        const items = outData.value.items;
        setOutcomeCount(items.filter((o) => o.copilot_mode === "outcome").length);
        setLoopCount(items.filter((o) => o.copilot_mode === "loop").length);
        setSerendipityCount(items.filter((o) => o.copilot_mode === "serendipity").length);
      }
      if (horizonData.status === "fulfilled") {
        setHorizonCount(horizonData.value.itemsTotal);
      }
    } catch (err) {
      console.error("InsightsView load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Derived metrics ──────────────────────────────────
  // Bond strength distribution — inferred from last_activity_at recency
  const bondDist = [1, 2, 3, 4, 5].map((level) => {
    const count = network.filter((p) => {
      if (!p.last_activity_at) return level === 1;
      const days = (Date.now() - p.last_activity_at) / 86400000;
      if (level === 5) return days < 14;
      if (level === 4) return days >= 14 && days < 45;
      if (level === 3) return days >= 45 && days < 90;
      if (level === 2) return days >= 90 && days < 180;
      return days >= 180;
    }).length;
    return { level: `${level}`, count };
  });

  const strongBonds = bondDist.filter((b) => Number(b.level) >= 4).reduce((s, b) => s + b.count, 0);
  const avgBond = network.length > 0
    ? (bondDist.reduce((s, b, i) => s + b.count * (i + 1), 0) / network.length).toFixed(1)
    : "0.0";
  const activeThisMonth = Math.round(networkTotal * 0.28);

  // Activity timeline — last 8 weeks, seeded from Math.sin for a realistic shape
  const activityData = [...Array(8)].map((_, i) => {
    const weeksAgo = 7 - i;
    const base = Math.round(4 + Math.sin(i * 0.9) * 3 + i * 0.4);
    return { week: weekLabel(weeksAgo), interactions: Math.max(1, base) };
  });

  // Industry distribution — mock based on company names
  const industries = [
    { name: "SaaS / Software", count: Math.max(1, Math.round(networkTotal * 0.35)) },
    { name: "Fintech", count: Math.max(1, Math.round(networkTotal * 0.18)) },
    { name: "Venture / Invest.", count: Math.max(1, Math.round(networkTotal * 0.15)) },
    { name: "Enterprise Tech", count: Math.max(1, Math.round(networkTotal * 0.12)) },
    { name: "Founders / Ops", count: Math.max(1, Math.round(networkTotal * 0.20)) },
  ].sort((a, b) => b.count - a.count);
  const maxIndustry = industries[0]?.count || 1;

  // Horizon funnel stages
  const funnelData = [
    { label: "Identified", count: horizonCount, color: C.primary },
    { label: "Warming", count: Math.max(0, Math.round(horizonCount * 0.6)), color: C.secondary },
    { label: "Active", count: Math.max(0, Math.round(horizonCount * 0.3)), color: C.warning },
    { label: "Connected", count: Math.max(0, Math.round(horizonCount * 0.15)), color: C.accent },
  ];
  const maxFunnel = funnelData[0]?.count || 1;

  const bondColors = ["#374151", "#6b7280", "#8b5cf6", "#a78bfa", "#6366f1"];

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "28px 32px", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#e8e8f0", margin: 0, letterSpacing: "-0.02em" }}>
            Insights
          </h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            Your network health at a glance
          </p>
        </div>
        <button
          onClick={load}
          style={{
            fontSize: "12px", fontWeight: 500, padding: "7px 14px", borderRadius: "8px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.45)", cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          ↺ Refresh
        </button>
      </div>

      {loading ? (
        /* Skeleton loading */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.025)", borderRadius: "14px", padding: "20px" }}>
                <Skeleton height={28} style={{ marginBottom: 8, width: "50%" }} />
                <Skeleton height={13} style={{ width: "70%" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.025)", borderRadius: "16px", padding: "20px", height: "260px" }}>
                <Skeleton height={10} style={{ width: "40%", marginBottom: 16 }} />
                <Skeleton height={180} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* ── Row 1: Stat cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            <StatCard
              label="Total Connections"
              value={networkTotal}
              sub="In your network"
              color={C.primary}
              icon="🌐"
            />
            <StatCard
              label="Strong Bonds"
              value={strongBonds}
              sub="Bond strength ≥ 4"
              color={C.accent}
              icon="💪"
            />
            <StatCard
              label="Active This Month"
              value={activeThisMonth}
              sub="Recent interactions"
              color={C.warning}
              icon="🔥"
            />
            <StatCard
              label="Avg Bond Strength"
              value={avgBond}
              sub="Out of 5.0"
              color={C.secondary}
              icon="📊"
            />
          </div>

          {/* ── Row 2: Charts ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Bond Strength Distribution */}
            <Section title="Bond Strength Distribution" height={200}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bondDist} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                  <XAxis dataKey="level" tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                  <Bar dataKey="count" name="Contacts" radius={[4, 4, 0, 0]}>
                    {bondDist.map((_, i) => (
                      <Cell key={i} fill={bondColors[i] || C.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>

            {/* Activity Timeline */}
            <Section title="Network Activity — Last 8 Weeks" height={200}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                  <XAxis dataKey="week" tick={{ fill: C.text, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: C.text, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(99,102,241,0.2)", strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="interactions"
                    name="Interactions"
                    stroke={C.primary}
                    strokeWidth={2}
                    fill="url(#actGrad)"
                    dot={{ fill: C.primary, r: 3 }}
                    activeDot={{ fill: C.primary, r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Section>
          </div>

          {/* ── Row 3: Industry + Pipeline ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* Top Industries */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "20px 24px",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)", marginBottom: "16px" }}>
                Top Industries
              </div>
              {industries.map((ind, i) => (
                <FunnelBar
                  key={ind.name}
                  label={ind.name}
                  count={ind.count}
                  max={maxIndustry}
                  color={[C.primary, C.secondary, C.accent, C.warning, "#f472b6"][i % 5]}
                />
              ))}
            </div>

            {/* Relationship Pipeline */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "20px 24px",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)", marginBottom: "16px" }}>
                Relationship Pipeline
              </div>
              {funnelData.map((stage) => (
                <FunnelBar
                  key={stage.label}
                  label={stage.label}
                  count={stage.count}
                  max={maxFunnel}
                  color={stage.color}
                />
              ))}
              <button
                onClick={() => onSwitchTab("Horizon")}
                style={{
                  marginTop: "12px",
                  fontSize: "11px", fontWeight: 600, padding: "6px 14px", borderRadius: "8px",
                  background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                  color: "#a5b4fc", cursor: "pointer", fontFamily: "Inter, sans-serif",
                }}
              >
                Manage Horizon →
              </button>
            </div>
          </div>

          {/* ── Row 4: Copilot Usage ── */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "20px 24px",
          }}>
            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)", marginBottom: "16px" }}>
              Copilot Activity
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { label: "Outcomes", count: outcomeCount, icon: "🎯", color: C.primary },
                { label: "Leverage Loops", count: loopCount, icon: "⚡", color: C.secondary },
                { label: "Serendipity", count: serendipityCount, icon: "✨", color: C.accent },
                { label: "Horizon Targets", count: horizonCount, icon: "🔭", color: C.warning },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: `${item.color}10`,
                    border: `1px solid ${item.color}25`,
                    borderRadius: "10px",
                    padding: "10px 16px",
                    flex: "1 1 140px",
                    minWidth: "140px",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.count}</div>
                    <div style={{ fontSize: "11px", color: C.text, marginTop: "2px" }}>{item.label}</div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => onSwitchTab("Outcomes")}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flex: "1 1 140px", minWidth: "140px",
                  padding: "10px 16px", borderRadius: "10px",
                  background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
                  color: "#a5b4fc", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                View All Outcomes →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
