"use client";

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function BackButton({ onClick, disabled = false }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        color: disabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)",
        fontSize: "13px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "Inter, sans-serif",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "rgba(255,255,255,0.08)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          e.currentTarget.style.color = "rgba(255,255,255,0.8)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.color = disabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)";
      }}
    >
      <span style={{ fontSize: "14px" }}>←</span>
      <span>Back</span>
    </button>
  );
}
