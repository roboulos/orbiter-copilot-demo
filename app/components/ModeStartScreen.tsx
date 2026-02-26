"use client";

interface ModeStartScreenProps {
  mode: 'leverage' | 'meeting' | 'outcome';
  onSubmit: (value: string) => void;
}

export function ModeStartScreen({ mode, onSubmit }: ModeStartScreenProps) {
  const [input, setInput] = React.useState('');

  const config = {
    leverage: {
      title: 'Who would you like to help?',
      subtitle: 'Search your network or type a name',
      placeholder: 'e.g., Ray Deck, Sarah Chen...',
      examples: [
        'Ray Deck',
        'Help someone find investors',
        'Connect someone with a hire'
      ]
    },
    meeting: {
      title: 'Who are you meeting with?',
      subtitle: 'View calendar or type a name',
      placeholder: 'e.g., Charles, Mark Pederson...',
      examples: [
        'Meeting with Charles',
        'Prepare for Mark call',
        'Coffee with investors'
      ]
    },
    outcome: {
      title: 'What outcome do you want to achieve?',
      subtitle: 'Describe your goal',
      placeholder: 'e.g., Raise $4M seed round...',
      examples: [
        'Raise $4M seed round',
        'Hire senior engineer',
        'Find 10 beta customers'
      ]
    }
  };

  const { title, subtitle, placeholder, examples } = config[mode];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 40px',
      minHeight: '500px',
      background: 'transparent',
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: '32px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.95)',
        marginBottom: '12px',
        textAlign: 'center',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '15px',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '48px',
        textAlign: 'center',
      }}>
        {subtitle}
      </p>

      {/* Search Input */}
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{
          position: 'relative',
          width: '100%',
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            autoFocus
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.95)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              outline: 'none',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: 'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          />
          
          {/* Submit Button (Enter hint) */}
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.3)',
            pointerEvents: 'none',
          }}>
            ↵
          </div>
        </div>
      </form>

      {/* Examples */}
      <div style={{
        marginTop: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        maxWidth: '520px',
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '4px',
        }}>
          Examples
        </div>
        {examples.map((example, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setInput(example);
              onSubmit(example);
            }}
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.6)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}

// Need React import
import React from 'react';
