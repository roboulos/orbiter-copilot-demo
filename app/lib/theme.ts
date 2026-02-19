import type { ThemeProps } from "@crayonai/react-ui";

/**
 * Custom Orbiter brand theme for CrayonChat
 */
export const orbiterTheme: ThemeProps = {
  mode: "dark",
  colors: {
    // Primary brand colors
    primary: "#6366f1",        // Indigo
    secondary: "#8b5cf6",      // Purple
    
    // Backgrounds
    background: "#0a0a12",     // Deep dark blue
    surface: "#13131f",        // Slightly lighter surface
    
    // Text
    text: "#e8e8f0",           // Near white
    textSecondary: "rgba(255,255,255,0.6)",
    textTertiary: "rgba(255,255,255,0.4)",
    
    // Semantic colors
    success: "#34d399",        // Green
    error: "#ef4444",          // Red
    warning: "#f59e0b",        // Amber
    info: "#60a5fa",           // Blue
    
    // Interactive elements
    hover: "rgba(99,102,241,0.08)",
    active: "rgba(99,102,241,0.12)",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(99,102,241,0.3)",
    
    // Message bubbles
    userMessage: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    agentMessage: "rgba(255,255,255,0.03)",
    
    // Shadows
    shadow: "0 4px 24px rgba(0,0,0,0.2)",
    shadowHover: "0 8px 32px rgba(0,0,0,0.3)",
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: {
      xs: "11px",
      sm: "12px",
      base: "14px",
      md: "15px",
      lg: "16px",
      xl: "18px",
      "2xl": "20px",
      "3xl": "24px",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },
    letterSpacing: {
      tight: "-0.03em",
      normal: "0",
      wide: "0.02em",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    base: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "40px",
  },
  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    full: "9999px",
  },
};

/**
 * CSS custom properties for theme
 * Can be injected into global styles
 */
export function getThemeCSSVars(theme: ThemeProps): string {
  return `
    :root {
      --orbiter-primary: ${theme.colors?.primary};
      --orbiter-secondary: ${theme.colors?.secondary};
      --orbiter-background: ${theme.colors?.background};
      --orbiter-surface: ${theme.colors?.surface};
      --orbiter-text: ${theme.colors?.text};
      --orbiter-text-secondary: ${theme.colors?.textSecondary};
      --orbiter-success: ${theme.colors?.success};
      --orbiter-error: ${theme.colors?.error};
      --orbiter-border: ${theme.colors?.border};
      --orbiter-font-family: ${theme.typography?.fontFamily};
      --orbiter-font-size-base: ${theme.typography?.fontSize?.base};
      --orbiter-border-radius-md: ${theme.borderRadius?.md};
      --orbiter-border-radius-lg: ${theme.borderRadius?.lg};
      --orbiter-spacing-base: ${theme.spacing?.base};
    }
  `;
}
