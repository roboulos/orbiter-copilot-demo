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
      maxWidth: '500px',
      margin: '0 auto',
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 600,
        color: '#f1f5f9',
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        Choose what you want to do
      </h2>
      
      {/* Leverage Loops */}
      <button
        onClick={() => onSelectMode('leverage')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#f1f5f9',
          margin: 0,
        }}>
          Leverage Loops
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          margin: 0,
        }}>
          Help someone from your network
        </p>
      </button>

      {/* Meeting Prep */}
      <button
        onClick={() => onSelectMode('meeting')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.1))',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.2))';
          e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.1))';
          e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#f1f5f9',
          margin: 0,
        }}>
          Meeting Prep
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          margin: 0,
        }}>
          Prepare for an upcoming meeting
        </p>
      </button>

      {/* Outcomes */}
      <button
        onClick={() => onSelectMode('outcome')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(251,146,60,0.1), rgba(249,115,22,0.1))',
          border: '1px solid rgba(251,146,60,0.3)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(249,115,22,0.2))';
          e.currentTarget.style.borderColor = 'rgba(251,146,60,0.5)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,146,60,0.1), rgba(249,115,22,0.1))';
          e.currentTarget.style.borderColor = 'rgba(251,146,60,0.3)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <h3 style={{
          fontSize: '18px',
          fontWeight: 600,
          color: '#f1f5f9',
          margin: 0,
        }}>
          Outcomes
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          margin: 0,
        }}>
          Achieve a goal through your network
        </p>
      </button>
    </div>
  );
}
