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
  const [sending, setSending] = useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    setSending(true);
    
    console.log('[ButtonGroup] Button clicked:', value);
    
    // Find the textarea
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    
    if (textarea) {
      // Set value using native setter to bypass React's synthetic event system
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;
      
      if (nativeSetter) {
        nativeSetter.call(textarea, value);
      } else {
        textarea.value = value;
      }
      
      // Trigger React onChange with real event
      const inputEvent = new Event('input', { bubbles: true });
      textarea.dispatchEvent(inputEvent);
      
      // Focus the textarea
      textarea.focus();
      
      // Wait a bit for React to process, then press Enter
      setTimeout(() => {
        console.log('[ButtonGroup] Pressing Enter to send');
        
        // Press Enter (this is what actually sends in Crayon)
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          which: 13,
          keyCode: 13,
          bubbles: true,
        });
        textarea.dispatchEvent(enterEvent);
        
        setSending(false);
      }, 150);
    } else {
      console.error('[ButtonGroup] Could not find textarea');
      setSending(false);
    }
    
    // Also call onSelect if provided
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
      opacity: sending ? 0.6 : 1,
      pointerEvents: sending ? "none" : "auto",
      transition: "opacity 0.2s ease",
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
            disabled={sending}
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
  disabled,
}: {
  option: ButtonOption;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={selected || disabled}
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
