"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  isCenter?: boolean;
  signal?: string;
}

interface Edge {
  source: string;
  target: string;
  strength: number; // 0-1
}

const INITIAL_NODES: Node[] = [
  { id: "you",     label: "Mark",           role: "You",                     x: 0,    y: 0,    vx: 0, vy: 0, color: "#6366f1", size: 20, isCenter: true },
  { id: "jw",      label: "James W.",       role: "VP · Salesforce",         x: 120,  y: -60,  vx: 0, vy: 0, color: "#34d399", size: 14, signal: "🚀" },
  { id: "sc",      label: "Sarah C.",       role: "VP · Salesforce",         x: 140,  y: 50,   vx: 0, vy: 0, color: "#34d399", size: 13, signal: "🚀" },
  { id: "mr",      label: "Marcus R.",      role: "Ent Sales · Notion",      x: -110, y: -80,  vx: 0, vy: 0, color: "#a78bfa", size: 13 },
  { id: "pk",      label: "Priya K.",       role: "Partner · NEA",           x: -130, y: 40,   vx: 0, vy: 0, color: "#60a5fa", size: 14, signal: "💼" },
  { id: "dl",      label: "David L.",       role: "CTO · Clay",              x: 20,   y: 140,  vx: 0, vy: 0, color: "#fb923c", size: 13 },
  { id: "rb",      label: "Rachel B.",      role: "Partnerships · Apollo",   x: -30,  y: -150, vx: 0, vy: 0, color: "#fbbf24", size: 12 },
  { id: "jt",      label: "Jennifer T.",    role: "Principal · Sequoia",     x: 80,   y: -140, vx: 0, vy: 0, color: "#60a5fa", size: 12, signal: "⚡" },
  // 2nd degree nodes
  { id: "sf1",     label: "Tom H.",         role: "Salesforce",              x: 220,  y: -90,  vx: 0, vy: 0, color: "#475569", size: 9 },
  { id: "nea1",    label: "Chris M.",       role: "NEA Portfolio",           x: -220, y: 70,   vx: 0, vy: 0, color: "#475569", size: 9 },
  { id: "clay1",   label: "Alex W.",        role: "Clay",                    x: 60,   y: 220,  vx: 0, vy: 0, color: "#475569", size: 9 },
  { id: "notion1", label: "Kat B.",         role: "Notion",                  x: -200, y: -100, vx: 0, vy: 0, color: "#475569", size: 9 },
];

const EDGES: Edge[] = [
  { source: "you", target: "jw",      strength: 0.75 },
  { source: "you", target: "sc",      strength: 0.55 },
  { source: "you", target: "mr",      strength: 0.65 },
  { source: "you", target: "pk",      strength: 0.40 },
  { source: "you", target: "dl",      strength: 0.70 },
  { source: "you", target: "rb",      strength: 0.35 },
  { source: "you", target: "jt",      strength: 0.30 },
  { source: "jw",  target: "sc",      strength: 0.60 },
  { source: "jw",  target: "sf1",     strength: 0.85 },
  { source: "sc",  target: "sf1",     strength: 0.80 },
  { source: "pk",  target: "nea1",    strength: 0.90 },
  { source: "pk",  target: "jt",      strength: 0.45 },
  { source: "dl",  target: "clay1",   strength: 0.88 },
  { source: "mr",  target: "notion1", strength: 0.82 },
  { source: "rb",  target: "dl",      strength: 0.40 },
  { source: "jt",  target: "pk",      strength: 0.35 },
];

export function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>(INITIAL_NODES.map(n => ({ ...n })));
  const animFrameRef = useRef<number>(0);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 300 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ w: rect.width, h: Math.max(280, rect.height) });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = dimensions.w / 2;
    const cy = dimensions.h / 2;

    // Set canvas resolution for retina
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    canvas.style.width = `${dimensions.w}px`;
    canvas.style.height = `${dimensions.h}px`;
    ctx.scale(dpr, dpr);

    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, dimensions.w, dimensions.h);
      tick++;

      const nodes = nodesRef.current;

      // Gentle floating animation
      nodes.forEach((node) => {
        if (!node.isCenter) {
          node.x += Math.sin(tick * 0.008 + node.id.charCodeAt(0)) * 0.15;
          node.y += Math.cos(tick * 0.008 + node.id.charCodeAt(1) || 0) * 0.15;
        }
      });

      // Build node map
      const nodeMap: Record<string, Node> = {};
      nodes.forEach(n => nodeMap[n.id] = n);

      // Draw edges
      EDGES.forEach(edge => {
        const s = nodeMap[edge.source];
        const t = nodeMap[edge.target];
        if (!s || !t) return;

        const opacity = edge.strength * 0.4;
        const isActive = edge.strength > 0.6;

        if (isActive) {
          // Animated pulse on strong edges
          const pulseOpacity = opacity + Math.sin(tick * 0.04 + edge.strength * 10) * 0.08;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${pulseOpacity})`;
          ctx.lineWidth = edge.strength * 1.5;
          ctx.setLineDash([]);
          ctx.moveTo(cx + s.x, cy + s.y);
          ctx.lineTo(cx + t.x, cy + t.y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(148,163,184,${opacity * 0.5})`;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([3, 4]);
          ctx.moveTo(cx + s.x, cy + s.y);
          ctx.lineTo(cx + t.x, cy + t.y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      });

      // Draw nodes
      nodes.forEach(node => {
        const x = cx + node.x;
        const y = cy + node.y;
        const r = node.size;

        // Glow
        if (node.isCenter || node.signal) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
          glow.addColorStop(0, node.color + "40");
          glow.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.fillStyle = glow;
          ctx.arc(x, y, r * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Node circle
        const pulse = node.isCenter ? 1 + Math.sin(tick * 0.04) * 0.05 : 1;
        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.arc(x - r * 0.2, y - r * 0.25, r * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Signal badge
        if (node.signal) {
          ctx.font = `${r * 0.9}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.signal, x + r * 0.85, y - r * 0.85);
        }

        // Label
        if (node.size >= 12) {
          ctx.font = `${node.isCenter ? 600 : 500} ${node.isCenter ? 11 : 9}px Inter, sans-serif`;
          ctx.fillStyle = node.isCenter ? "#e8e8f0" : "rgba(255,255,255,0.65)";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(node.label, x, y + r + 4);
        }
      });

      animFrameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dimensions]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left - dimensions.w / 2;
    const my = e.clientY - rect.top - dimensions.h / 2;
    const hit = nodesRef.current.find(n => Math.hypot(n.x - mx, n.y - my) < n.size + 6);
    setHoveredNode(hit || null);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "300px",
        position: "relative",
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "24px",
      }}
    >
      {/* Graph label */}
      <div style={{
        position: "absolute", top: "12px", left: "16px", zIndex: 2,
        fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
      }}>
        ◉ Live graph · {INITIAL_NODES.length} nodes · {EDGES.length} edges
      </div>

      {/* Legend */}
      <div style={{
        position: "absolute", top: "12px", right: "16px", zIndex: 2,
        display: "flex", gap: "12px", alignItems: "center",
      }}>
        {[["#34d399","Signal"], ["#6366f1","You"], ["#60a5fa","VC"], ["#a78bfa","SaaS"]].map(([c, l]) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{l}</span>
          </div>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        style={{ display: "block", cursor: hoveredNode ? "pointer" : "default" }}
      />

      {/* Hover tooltip */}
      {hoveredNode && !hoveredNode.isCenter && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(15,15,26,0.95)",
          border: `1px solid ${hoveredNode.color}40`,
          borderRadius: "10px",
          padding: "10px 14px",
          pointerEvents: "none",
          zIndex: 10,
          minWidth: "140px",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8e8f0", marginBottom: "2px" }}>
            {hoveredNode.label}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{hoveredNode.role}</div>
        </div>
      )}
    </div>
  );
}
