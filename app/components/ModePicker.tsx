"use client";

export interface ModePickerProps {
  onSelectMode: (mode: 'leverage' | 'meeting' | 'outcome') => void;
}

// Linear-style SVG icons
const LeverageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MeetingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const OutcomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export function ModePicker({ onSelectMode }: ModePickerProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '20px 16px',
      width: '300px',
      background: 'rgba(255,255,255,0.02)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '2px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Mode
        </h3>
      </div>
      
      {/* Leverage Loops */}
      <button
        onClick={() => onSelectMode('leverage')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          textAlign: 'left',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'rgba(124,58,237,0.1)',
          color: 'rgb(167,139,250)',
          flexShrink: 0,
        }}>
          <LeverageIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '2px',
          }}>
            Leverage Loops
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.4,
          }}>
            Help someone achieve a goal
          </div>
        </div>
      </button>

      {/* Meeting Prep */}
      <button
        onClick={() => onSelectMode('meeting')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          textAlign: 'left',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'rgba(124,58,237,0.1)',
          color: 'rgb(167,139,250)',
          flexShrink: 0,
        }}>
          <MeetingIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '2px',
          }}>
            Meeting Prep
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.4,
          }}>
            Get context and talking points
          </div>
        </div>
      </button>

      {/* Outcomes */}
      <button
        onClick={() => onSelectMode('outcome')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          textAlign: 'left',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: 'rgba(124,58,237,0.1)',
          color: 'rgb(167,139,250)',
          flexShrink: 0,
        }}>
          <OutcomeIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '2px',
          }}>
            Outcomes
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.4,
          }}>
            Map a goal to an action plan
          </div>
        </div>
      </button>
    </div>
  );
}
