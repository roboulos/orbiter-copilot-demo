"use client";

export interface ModePickerProps {
  onSelectMode: (mode: 'leverage' | 'meeting' | 'outcome') => void;
}

export function ModePicker({ onSelectMode }: ModePickerProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '32px 24px',
      width: '360px',
      background: 'linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.95) 100%)',
      borderRight: '1px solid rgba(148,163,184,0.15)',
    }}>
      <div>
        <h3 style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#64748b',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Choose Mode
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#94a3b8',
          lineHeight: 1.4,
        }}>
          Select how you want to use Copilot
        </p>
      </div>
      
      {/* Leverage Loops */}
      <button
        onClick={() => onSelectMode('leverage')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '24px 20px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.15) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
          width: '100%',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.25) 100%)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(99,102,241,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.15) 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{
          fontSize: '32px',
          lineHeight: 1,
        }}>🤝</div>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '6px',
          }}>
            Leverage Loops
          </div>
          <div style={{
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: 1.5,
          }}>
            Help someone from your network achieve a goal
          </div>
        </div>
      </button>

      {/* Meeting Prep */}
      <button
        onClick={() => onSelectMode('meeting')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '24px 20px',
          background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.15) 100%)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
          width: '100%',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.25) 100%)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(34,197,94,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.15) 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{
          fontSize: '32px',
          lineHeight: 1,
        }}>📅</div>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '6px',
          }}>
            Meeting Prep
          </div>
          <div style={{
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: 1.5,
          }}>
            Get context and talking points for upcoming meetings
          </div>
        </div>
      </button>

      {/* Outcomes */}
      <button
        onClick={() => onSelectMode('outcome')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '24px 20px',
          background: 'linear-gradient(135deg, rgba(251,146,60,0.08) 0%, rgba(251,146,60,0.15) 100%)',
          border: '1px solid rgba(251,146,60,0.2)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
          width: '100%',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,146,60,0.15) 0%, rgba(251,146,60,0.25) 100%)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(251,146,60,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,146,60,0.08) 0%, rgba(251,146,60,0.15) 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{
          fontSize: '32px',
          lineHeight: 1,
        }}>🎯</div>
        <div>
          <div style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: '6px',
          }}>
            Outcomes
          </div>
          <div style={{
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: 1.5,
          }}>
            Map a goal to an actionable plan through your network
          </div>
        </div>
      </button>
    </div>
  );
}
