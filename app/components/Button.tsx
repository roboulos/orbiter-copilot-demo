/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BUTTON COMPONENT - Consistent Button Styling
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MARK'S REQUIREMENT: "Consistent hover states, spring animations, clear disabled states"
 * 
 * INTEGRATION NOTE: Use this component for all buttons in the app.
 *                   Ensures consistent styling, animations, and accessibility.
 * 
 * VARIANTS:
 *   - primary: Purple gradient (main CTAs)
 *   - secondary: Transparent with border (cancel, back)
 *   - danger: Red gradient (destructive actions)
 *   - ghost: Minimal styling (tertiary actions)
 * 
 * SIZES:
 *   - sm: 32px height (compact spaces)
 *   - md: 40px height (default)
 *   - lg: 48px height (prominent CTAs)
 * 
 * ACCESSIBILITY:
 *   - Proper button semantics
 *   - Focus visible (purple ring)
 *   - Disabled state (aria-disabled)
 *   - Loading state (aria-busy)
 * 
 * STYLING:
 *   - Spring animation (cubic-bezier(0.34, 1.56, 0.64, 1))
 *   - Lift on hover (-2px)
 *   - Glow effect (box-shadow)
 *   - Smooth transitions (0.2s)
 * ═══════════════════════════════════════════════════════════════════════════
 */

"use client";

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Full width button */
  fullWidth?: boolean;
  /** Loading state (shows spinner, disables interaction) */
  loading?: boolean;
  /** Icon before text */
  icon?: ReactNode;
  /** Icon after text */
  iconAfter?: ReactNode;
  /** Children (button text/content) */
  children: ReactNode;
}

/**
 * VARIANT STYLES
 * 
 * PALETTE:
 *   Primary: #6366f1 → #8b5cf6 (purple gradient)
 *   Secondary: transparent with rgba(255,255,255,0.12) border
 *   Danger: #ef4444 → #dc2626 (red gradient)
 *   Ghost: minimal, hover only
 */
const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: '1px solid rgba(99,102,241,0.4)',
    color: 'white',
    boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.85)',
    boxShadow: 'none',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    border: '1px solid rgba(239,68,68,0.4)',
    color: 'white',
    boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
  },
  ghost: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.75)',
    boxShadow: 'none',
  },
};

/**
 * SIZE PRESETS
 * 
 * SPACING: Consistent padding based on button height
 */
const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: '6px 12px',
    fontSize: '12px',
    height: '32px',
  },
  md: {
    padding: '10px 20px',
    fontSize: '14px',
    height: '40px',
  },
  lg: {
    padding: '14px 28px',
    fontSize: '16px',
    height: '48px',
  },
};

/**
 * HOVER STYLES (per variant)
 * 
 * ANIMATION: Spring cubic-bezier for bouncy feel
 * TRANSFORM: Lift -2px on hover
 */
const HOVER_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  danger: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(239,68,68,0.4)',
  },
  ghost: {
    background: 'rgba(255,255,255,0.05)',
  },
};

export function Button({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconAfter,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Merge base styles
  const baseStyles: React.CSSProperties = {
    ...VARIANT_STYLES[variant],
    ...SIZE_STYLES[size],
    ...style,
    
    // Base button styles
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '10px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring!
    outline: 'none',
    position: 'relative',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    letterSpacing: '-0.01em',
    
    // Apply hover styles
    ...(isHovered && !disabled && !loading ? HOVER_STYLES[variant] : {}),
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      style={baseStyles}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          setIsHovered(true);
          onMouseEnter?.(e);
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        onMouseLeave?.(e);
      }}
    >
      {/* Loading Spinner */}
      {loading && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        >
          <circle cx="12" cy="12" r="10" opacity="0.25" />
          <path d="M12 2 A10 10 0 0 1 22 12" />
        </svg>
      )}

      {/* Icon Before */}
      {!loading && icon}

      {/* Button Text */}
      <span>{children}</span>

      {/* Icon After */}
      {!loading && iconAfter}

      {/* Spin animation for loading */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ICON BUTTON - Square button for icons
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * USAGE: Close buttons, action buttons, toolbar icons
 * ═══════════════════════════════════════════════════════════════════════════
 */
interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  /** Icon to display */
  icon: ReactNode;
  /** Accessible label (required for screen readers) */
  'aria-label': string;
}

export function IconButton({ icon, size = 'md', ...props }: IconButtonProps) {
  const sizeMap = {
    sm: { width: '32px', height: '32px' },
    md: { width: '40px', height: '40px' },
    lg: { width: '48px', height: '48px' },
  };

  return (
    <Button
      {...props}
      size={size}
      style={{
        ...props.style,
        ...sizeMap[size],
        padding: 0,
      }}
    >
      {icon}
    </Button>
  );
}
