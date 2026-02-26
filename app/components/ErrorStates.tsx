/**
 * ═══════════════════════════════════════════════════════════════════════
 * ERROR STATES - Reusable Error UI Components
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * INTEGRATION NOTE: Import these components wherever you need to show errors
 * 
 * USAGE EXAMPLES:
 *   <NetworkError onRetry={refetch} />
 *   <ValidationError message="Email is required" />
 *   <NotFoundError entity="person" onGoBack={() => navigate('/search')} />
 * 
 * STYLING: All components follow Linear design system
 *   - Consistent colors, spacing, animations
 *   - Clear visual hierarchy
 *   - Actionable recovery CTAs
 * 
 * REMOVE DURING INTEGRATION:
 *   - Any demo-specific error messages
 *   - Test/dev-only error details
 * ═══════════════════════════════════════════════════════════════════════
 */

"use client";

import React from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * NETWORK ERROR
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * WHEN TO USE: API calls fail, no internet, backend unavailable
 * 
 * MARK'S REQUIREMENT: "Can't reach Xano" message with retry button
 * 
 * STYLING:
 *   - Orange accent (#f59e0b) for warnings
 *   - Subtle pulse animation
 *   - Prominent retry button
 * ═══════════════════════════════════════════════════════════════════════
 */
interface NetworkErrorProps {
  onRetry: () => void;
  message?: string;
}

export function NetworkError({ onRetry, message }: NetworkErrorProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 32px',
      background: 'rgba(245,158,11,0.05)',
      border: '1px solid rgba(245,158,11,0.2)',
      borderRadius: '12px',
      animation: 'fadeIn 0.3s ease both',
    }}>
      {/* Wifi Off Icon */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'rgba(245,158,11,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(245,158,11)" strokeWidth="2">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>

      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.95)',
        marginBottom: '8px',
      }}>
        Connection Lost
      </h3>

      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.65)',
        textAlign: 'center',
        marginBottom: '24px',
        lineHeight: 1.6,
      }}>
        {message || "Can't reach the server. Check your internet connection or try again."}
      </p>

      <button
        onClick={onRetry}
        style={{
          padding: '12px 24px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
          border: 'none',
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,158,11,0.3)';
        }}
      >
        Retry Connection
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * VALIDATION ERROR
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * WHEN TO USE: Form validation, required fields, invalid input
 * 
 * MARK'S REQUIREMENT: "Inline field validation with clear error messages"
 * 
 * STYLING:
 *   - Red accent (#ef4444) for errors
 *   - Small, inline display
 *   - Icon + message
 * ═══════════════════════════════════════════════════════════════════════
 */
interface ValidationErrorProps {
  message: string;
  field?: string;
}

export function ValidationError({ message, field }: ValidationErrorProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      padding: '10px 12px',
      background: 'rgba(239,68,68,0.08)',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: '8px',
      marginTop: '8px',
      animation: 'shake 0.3s ease',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(239,68,68)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div>
        {field && (
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(239,68,68,0.9)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '2px',
          }}>
            {field}
          </div>
        )}
        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.5,
        }}>
          {message}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * NOT FOUND ERROR
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * WHEN TO USE: Search returned no results, person not found, 404
 * 
 * STYLING:
 *   - Neutral gray tone
 *   - Helpful suggestions
 *   - Go back / try again CTAs
 * ═══════════════════════════════════════════════════════════════════════
 */
interface NotFoundErrorProps {
  entity: string; // e.g., "person", "meeting", "result"
  onGoBack?: () => void;
  onTryAgain?: () => void;
}

export function NotFoundError({ entity, onGoBack, onTryAgain }: NotFoundErrorProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 32px',
      textAlign: 'center',
    }}>
      {/* Empty State Icon */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.95)',
        marginBottom: '8px',
      }}>
        No {entity} found
      </h3>

      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.55)',
        marginBottom: '24px',
        lineHeight: 1.6,
      }}>
        Try adjusting your search or check back later
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        {onGoBack && (
          <button
            onClick={onGoBack}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.75)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Go Back
          </button>
        )}
        {onTryAgain && (
          <button
            onClick={onTryAgain}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: 'white',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * LOADING SKELETON
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * WHEN TO USE: While fetching data, prevents layout shift
 * 
 * MARK'S REQUIREMENT: "Subtle shimmer effect, prevent layout shift"
 * 
 * STYLING:
 *   - Matches card dimensions
 *   - Shimmer animation
 *   - Placeholder content
 * ═══════════════════════════════════════════════════════════════════════
 */
export function LoadingSkeleton({ height = '120px' }: { height?: string }) {
  return (
    <div style={{
      width: '100%',
      height,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Shimmer overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        animation: 'shimmer 1.5s infinite',
      }} />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
