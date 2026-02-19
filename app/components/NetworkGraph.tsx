"use client";

import { useEffect, useRef, useState } from "react";
import { getNetwork, type NetworkPerson } from "../lib/xano";

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
  strength: number;
}

const NODE_COLORS = ["#34d399", "#a78bfa", "#60a5fa", "#fb923c", "#fbbf24", "#f87171", "#818cf8", "#2dd4bf"];

function buildGraphData(contacts: NetworkPerson[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    { id: "you", label: "You", role: "Center", x: 0, y: 0, vx: 0, vy: 0, color: "#6366f1", size: 20, isCenter: true },
  ];
  const edges: Edge[] = [];

  // Take up to 20 contacts for the visualization
  const shown = contacts.slice(0, 20);
  const angleStep = (2 * Math.PI) / shown.length;

  shown.forEach((c, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const connected = c.status_connected === "connected";
    const hasActivity = !!c.last_activity_at;

    // Compute distance: connected = closer, recent activity = closer
    let radius = 140;
    if (connected) radius = 90 + Math.random() * 40;
    else if (hasActivity) radius = 110 + Math.random() * 50;
    else radius = 140 + Math.random() * 40;

    // Compute strength from recency
    let strength = 0.2;
    if (c.last_activity_at) {
      const daysAgo = (Date.now() - c.last_activity_at) / (1000 * 60 * 60 * 24);
      if (daysAgo < 7) strength = 0.85;
      else if (daysAgo < 30) strength = 0.65;
      else if (daysAgo < 90) strength = 0.45;
      else strength = 0.25;
    }

    const colorIdx = i % NODE_COLORS.length;
    const name = c.full_name.split(" ").map(n => n[0] + ".").join(" ").replace(/\.\s*$/, "");
    const shortName = c.full_name.split(" ")[0] + " " + (c.full_name.split(" ")[1]?.[0] || "") + ".";

    nodes.push({
      id: `c${c.id}`,
      label: shortName,
      role: c.master_person?.current_title
        ? `${c.master_person.current_title.split(" ").slice(0, 3).join(" ")}${c.master_person.master_company?.company_name ? ` · ${c.master_person.master_company.company_name}` : ""}`
        : c.master_person?.master_company?.company_name || "",
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      color: connected ? "#34d399" : NODE_COLORS[colorIdx],
      size: connected ? 14 : strength > 0.5 ? 12 : 10,
      signal: connected && strength > 0.6 ? "🔗" : undefined,
    });

    edges.push({
      source: "you",
      target: `c${c.id}`,
      strength,
    });
  });

  return { nodes, edges };
}

export function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const animFrameRef = useRef<number>(0);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 300 });
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
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

  // Fetch real network data
  useEffect(() => {
    (async () => {
      try {
        const data = await getNetwork({ per_page: 20 });
        const { nodes, edges } = buildGraphData(data.items);
        nodesRef.current = nodes;
        edgesRef.current = edges;
        setNodeCount(nodes.length);
        setEdgeCount(edges.length);
      } catch (err) {
        console.error("Failed to load network for graph:", err);
      }
    })();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || nodeCount === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = dimensions.w / 2;
    const cy = dimensions.h / 2;

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
      const edges = edgesRef.current;

      // Gentle floating animation
      nodes.forEach((node) => {
        if (!node.isCenter) {
          node.x += Math.sin(tick * 0.008 + node.id.charCodeAt(1)) * 0.15;
          node.y += Math.cos(tick * 0.008 + node.id.charCodeAt(2) || 0) * 0.15;
        }
      });

      const nodeMap: Record<string, Node> = {};
      nodes.forEach(n => nodeMap[n.id] = n);

      // Draw edges
      edges.forEach(edge => {
        const s = nodeMap[edge.source];
        const t = nodeMap[edge.target];
        if (!s || !t) return;

        const opacity = edge.strength * 0.4;
        const isActive = edge.strength > 0.5;

        if (isActive) {
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
        if (node.size >= 10) {
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
  }, [dimensions, nodeCount]);

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
      <div style={{
        position: "absolute", top: "12px", left: "16px", zIndex: 2,
        fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
      }}>
        {nodeCount > 0 ? `Live graph · ${nodeCount} nodes · ${edgeCount} edges` : "Loading graph..."}
      </div>

      <div style={{
        position: "absolute", top: "12px", right: "16px", zIndex: 2,
        display: "flex", gap: "12px", alignItems: "center",
      }}>
        {[["#34d399","Connected"], ["#6366f1","You"], ["#60a5fa","Contact"]].map(([c, l]) => (
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
