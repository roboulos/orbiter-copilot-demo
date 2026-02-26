"use client";

export interface ModePickerProps {
  onSelectMode: (mode: 'leverage' | 'meeting' | 'outcome') => void;
}

export function ModePicker({ onSelectMode }: ModePickerProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '16px',
      width: '240px',
      borderRight: '1px solid rgba(255,255,255,0.1)',
    }}>
      <h3 style={{
        fontSize: '12px',
        fontWeight: 600,
        color: '#94a3b8',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        Mode
      </h3>
      
      {/* Leverage Loops */}
      <button
        onClick={() => onSelectMode('leverage')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={{
          fontSize: '20px',
          lineHeight: 1,
        }}>🤝</div>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: '2px',
          }}>
            Leverage Loops
          </div>
          <div style={{
            fontSize: '11px',
            color: '#64748b',
            lineHeight: 1.3,
          }}>
            Help someone
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
          padding: '12px',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(34,197,94,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={{
          fontSize: '20px',
          lineHeight: 1,
        }}>📅</div>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: '2px',
          }}>
            Meeting Prep
          </div>
          <div style={{
            fontSize: '11px',
            color: '#64748b',
            lineHeight: 1.3,
          }}>
            Prepare for meeting
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
          padding: '12px',
          background: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(251,146,60,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={{
          fontSize: '20px',
          lineHeight: 1,
        }}>🎯</div>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: '2px',
          }}>
            Outcomes
          </div>
          <div style={{
            fontSize: '11px',
            color: '#64748b',
            lineHeight: 1.3,
          }}>
            Achieve a goal
          </div>
        </div>
      </button>
    </div>
  );
}
