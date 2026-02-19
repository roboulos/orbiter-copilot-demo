"use client";

import { useState } from "react";

interface ButtonOption {
  label: string;
  value: string;
  emoji?: string;
}

interface ButtonGroupProps {
  question?: string;
  options: ButtonOption[];
  onSelect?: (value: string) => void;
}

export function ButtonGroup({ question, options, onSelect }: ButtonGroupProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    // Auto-send the selected value as a message
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      margin: "8px 0",
      animation: "fadeUp 0.3s ease both",
    }}>
      {question && (
        <div style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "4px",
          fontWeight: 500,
        }}>
          {question}
        </div>
      )}
      
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}>
        {options.map((option) => (
          <InterviewButton
            key={option.value}
            option={option}
            selected={selected === option.value}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
    </div>
  );
}

function InterviewButton({
  option,
  selected,
  onClick,
}: {
  option: ButtonOption;
  selected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={selected}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 16px",
        background: selected
          ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))"
          : hovered
          ? "rgba(99,102,241,0.08)"
          : "rgba(255,255,255,0.03)",
        border: selected
          ? "1px solid rgba(99,102,241,0.4)"
          : hovered
          ? "1px solid rgba(99,102,241,0.25)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        color: selected ? "#a5b4fc" : hovered ? "#e8e8f0" : "rgba(255,255,255,0.75)",
        fontSize: "13px",
        fontWeight: selected ? 600 : 500,
        cursor: selected ? "default" : "pointer",
        fontFamily: "Inter, sans-serif",
        transition: "all 0.15s ease",
        textAlign: "left",
        width: "100%",
        transform: hovered && !selected ? "translateX(2px)" : "translateX(0)",
        opacity: selected ? 0.7 : 1,
      }}
    >
      {option.emoji && (
        <span style={{ fontSize: "16px", flexShrink: 0 }}>
          {option.emoji}
        </span>
      )}
      <span style={{ flex: 1 }}>
        {option.label}
      </span>
      {selected && (
        <span style={{ fontSize: "14px", opacity: 0.7 }}>✓</span>
      )}
    </button>
  );
}
