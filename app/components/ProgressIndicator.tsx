/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PROGRESS INDICATOR - Interview Progress
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * MARK'S REQUIREMENT: "Show Q 1/4 during interview, clear feedback"
 * 
 * INTEGRATION NOTE: Shows user progress through multi-step flows
 * 
 * USAGE:
 *   <ProgressIndicator current={2} total={4} label="Question" />
 *   // Shows: "Question 2/4" with progress bar
 * 
 * STYLING:
 *   - Purple gradient progress bar
 *   - Smooth width transition
 *   - Compact, unobtrusive
 *   - Accessible (ARIA labels)
 * 
 * VARIANTS:
 *   - Interview progress (Q 1/4)
 *   - Multi-step forms
 *   - Loading percentages
 * ═══════════════════════════════════════════════════════════════════════════
 */

"use client";

import React from 'react';

interface ProgressIndicatorProps {
  /** Current step/question number (1-indexed) */
  current: number;
  /** Total number of steps/questions */
  total: number;
  /** Label for the progress (e.g., "Question", "Step") */
  label?: string;
  /** Show progress bar (default: true) */
  showBar?: boolean;
  /** Compact mode (smaller, inline) */
  compact?: boolean;
}

/**
 * Linear-styled progress indicator with smooth animations
 * 
 * ACCESSIBILITY:
 *   - ARIA role="progressbar"
 *   - aria-valuenow, aria-valuemin, aria-valuemax
 *   - aria-label describes progress
 */
export function ProgressIndicator({ 
  current, 
  total, 
  label = "Step",
  showBar = true,
  compact = false,
}: ProgressIndicatorProps) {
  // Calculate percentage (0-100)
  const percentage = Math.round((current / total) * 100);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: compact ? '6px' : '8px',
      width: '100%',
      maxWidth: compact ? '200px' : '300px',
    }}>
      {/* Text Label and Count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: compact ? '11px' : '12px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.65)',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        <span>{label}</span>
        <span style={{ 
          color: 'rgba(99,102,241,0.9)',
          fontVariantNumeric: 'tabular-nums', // Monospaced numbers
        }}>
          {current} / {total}
        </span>
      </div>

      {/* Progress Bar */}
      {showBar && (
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} ${current} of ${total}`}
          style={{
            width: '100%',
            height: compact ? '3px' : '4px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '100px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Progress Fill */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '100px',
            transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring animation
            boxShadow: '0 0 10px rgba(99,102,241,0.5)',
          }} />
        </div>
      )}

      {/* Optional Percentage (for debugging or detailed views) */}
      {!compact && process.env.NODE_ENV === 'development' && (
        <div style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.35)',
          textAlign: 'right',
          fontFamily: 'monospace',
        }}>
          {percentage}%
        </div>
      )}
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CIRCULAR PROGRESS - For Processing States
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * WHEN TO USE: Waiting room, dispatch processing, background tasks
 * 
 * STYLING: Spinning purple circle with gradient
 * ═══════════════════════════════════════════════════════════════════════════
 */
interface CircularProgressProps {
  /** Size in pixels (default: 40) */
  size?: number;
  /** Stroke width in pixels (default: 3) */
  strokeWidth?: number;
  /** Optional label below spinner */
  label?: string;
}

export function CircularProgress({ 
  size = 40, 
  strokeWidth = 3,
  label,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Dash offset creates the spinning effect
  const dashOffset = circumference * 0.25; // 75% visible

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transformOrigin: 'center',
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {label && (
        <div style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.65)',
          fontWeight: 500,
        }}>
          {label}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STEP INDICATOR - Multi-Step Flow
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * WHEN TO USE: Onboarding, setup wizards, multi-page forms
 * 
 * STYLING: Horizontal dots showing current step
 * ═══════════════════════════════════════════════════════════════════════════
 */
interface StepIndicatorProps {
  /** Current step (0-indexed) */
  current: number;
  /** Total number of steps */
  total: number;
  /** Optional step labels */
  labels?: string[];
}

export function StepIndicator({ current, total, labels }: StepIndicatorProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 0',
    }}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        const isCompleted = index < current;
        
        return (
          <React.Fragment key={index}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}>
              {/* Step Circle */}
              <div style={{
                width: isActive ? '32px' : '24px',
                height: isActive ? '32px' : '24px',
                borderRadius: '50%',
                background: isActive 
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : isCompleted
                  ? 'rgba(99,102,241,0.3)'
                  : 'rgba(255,255,255,0.08)',
                border: isActive 
                  ? '2px solid rgba(99,102,241,0.5)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isActive 
                  ? '0 4px 16px rgba(99,102,241,0.4)'
                  : 'none',
              }}>
                {isCompleted ? (
                  // Checkmark for completed steps
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  // Step number
                  <span style={{
                    fontSize: isActive ? '14px' : '12px',
                    fontWeight: 600,
                    color: isActive 
                      ? 'white'
                      : isCompleted
                      ? 'rgba(255,255,255,0.5)'
                      : 'rgba(255,255,255,0.3)',
                  }}>
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step Label */}
              {labels && labels[index] && (
                <div style={{
                  fontSize: '11px',
                  color: isActive 
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.45)',
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>
                  {labels[index]}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < total - 1 && (
              <div style={{
                flex: 1,
                height: '2px',
                background: isCompleted 
                  ? 'rgba(99,102,241,0.3)'
                  : 'rgba(255,255,255,0.08)',
                transition: 'background 0.3s ease',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
