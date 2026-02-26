/**
 * ═══════════════════════════════════════════════════════════════════════
 * ERROR BOUNDARY - Graceful Error Handling
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * INTEGRATION NOTE: This provides graceful error handling throughout the app.
 * 
 * WHY: Mark wants professional error states, not crashes or stack traces.
 *      "Linear-styled error messages with helpful recovery actions"
 * 
 * STYLING: Linear-inspired design with:
 *   - Purple accent color (#6366f1)
 *   - Subtle gradient backgrounds
 *   - Smooth animations
 *   - Clear recovery CTAs
 * 
 * USAGE: Wrap any component that might error:
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 * 
 * DURING INTEGRATION:
 *   - Connect to real error logging service
 *   - Add user-specific error context
 *   - Customize recovery actions per error type
 * ═══════════════════════════════════════════════════════════════════════
 */

"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // INTEGRATION NOTE: Add real error logging here
    // e.g., Sentry.captureException(error, { extra: errorInfo });
    console.error('Uncaught error:', error, errorInfo);
    
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI or default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error} 
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ERROR FALLBACK UI
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * STYLING NOTE: Linear-inspired error state
 * 
 * COLORS:
 *   - Background: rgba(255,255,255,0.03) - Subtle elevated surface
 *   - Border: rgba(239,68,68,0.3) - Red accent for errors
 *   - Text: Standard hierarchy (95% / 65% / 45% opacity)
 * 
 * ANIMATION:
 *   - Fade in on mount (0.3s)
 *   - Button hover lift (spring animation)
 * 
 * ACCESSIBILITY:
 *   - Clear error message (no technical jargon)
 *   - Prominent retry button
 *   - Keyboard accessible
 * ═══════════════════════════════════════════════════════════════════════
 */
interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 32px',
      minHeight: '400px',
      animation: 'fadeIn 0.3s ease both',
    }}>
      {/* Error Icon - Linear style */}
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'rgba(239,68,68,0.12)',
        border: '1px solid rgba(239,68,68,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 8px 24px rgba(239,68,68,0.15)',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(239,68,68)" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      {/* Error Message */}
      <h3 style={{
        fontSize: '20px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.95)',
        marginBottom: '12px',
        textAlign: 'center',
        letterSpacing: '-0.02em',
      }}>
        Something went wrong
      </h3>

      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
        marginBottom: '8px',
        lineHeight: 1.6,
        maxWidth: '400px',
      }}>
        We encountered an unexpected error. This has been logged and we'll look into it.
      </p>

      {/* DEMO ONLY: Show error message in dev mode */}
      {process.env.NODE_ENV === 'development' && error && (
        <details style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          maxWidth: '500px',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.45)',
          cursor: 'pointer',
        }}>
          <summary style={{ marginBottom: '8px', fontWeight: 600 }}>
            Error Details (dev only)
          </summary>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            fontFamily: 'monospace',
            fontSize: '11px',
          }}>
            {error.message}
          </pre>
        </details>
      )}

      {/* Recovery Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '32px',
      }}>
        {/* Retry Button - Primary CTA */}
        <button
          onClick={onReset}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: '1px solid rgba(99,102,241,0.4)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)';
          }}
        >
          Try Again
        </button>

        {/* Reload Page - Secondary Action */}
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.75)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
          }}
        >
          Reload Page
        </button>
      </div>

      {/* Fade in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
