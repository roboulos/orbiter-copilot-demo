"use client";

import { useState } from "react";

interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
}

interface ProjectContextSelectorProps {
  projects: Project[];
  selectedProjectId?: string | null;
  onSelect: (projectId: string) => void;
  personName?: string;
}

// Default projects - in production these would come from backend
const DEFAULT_PROJECTS: Project[] = [
  { id: "xano-snappy", name: "Xano.Snappy.ai", description: "SaaS product for Xano developers", color: "#6366f1" },
  { id: "snappy-consulting", name: "Snappy Consulting", description: "Developer productivity consulting", color: "#a78bfa" },
  { id: "orbiter", name: "Orbiter Copilot", description: "Network intelligence platform", color: "#34d399" },
  { id: "statechange", name: "StateChange", description: "Client project", color: "#f59e0b" },
  { id: "general", name: "General Networking", description: "No specific project context", color: "rgba(255,255,255,0.3)" },
];

/**
 * Project context selector for meeting prep
 * Allows user to choose which project context applies to a meeting
 */
export function ProjectContextSelector({
  projects = DEFAULT_PROJECTS,
  selectedProjectId,
  onSelect,
  personName,
}: ProjectContextSelectorProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "14px" }}>
        <h4
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#e8e8f0",
            marginBottom: "4px",
            letterSpacing: "-0.01em",
          }}
        >
          Meeting Context{personName && ` with ${personName}`}
        </h4>
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Select which project or context applies to this meeting for targeted preparation
        </p>
      </div>

      {/* Project grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {projects.map((project) => {
          const isSelected = selectedProjectId === project.id;
          const isHovered = hovered === project.id;

          return (
            <button
              key={project.id}
              onClick={() => onSelect(project.id)}
              onMouseEnter={() => setHovered(project.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                padding: "14px 16px",
                background: isSelected
                  ? `linear-gradient(135deg, ${project.color}33, ${project.color}22)`
                  : isHovered
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(255,255,255,0.03)",
                border: isSelected
                  ? `2px solid ${project.color}`
                  : `1px solid ${isHovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isSelected
                  ? `0 4px 16px ${project.color}40`
                  : isHovered
                  ? "0 4px 12px rgba(0,0,0,0.15)"
                  : "none",
              }}
            >
              {/* Color indicator */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: project.color,
                  boxShadow: `0 0 8px ${project.color}`,
                }}
              />

              {/* Project name */}
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isSelected ? project.color : "#e8e8f0",
                  marginBottom: project.description ? "4px" : 0,
                  paddingRight: "16px",
                  lineHeight: 1.3,
                }}
              >
                {project.name}
              </div>

              {/* Description */}
              {project.description && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 1.4,
                  }}
                >
                  {project.description}
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "14px",
                    fontSize: "16px",
                    color: project.color,
                  }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
