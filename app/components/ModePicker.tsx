"use client";

import React from 'react';

export interface ModePickerProps {
  selectedMode: 'default' | 'leverage' | 'meeting' | 'outcome';
  onSelectMode: (mode: 'default' | 'leverage' | 'meeting' | 'outcome') => void;
}

// Linear-style SVG icons
const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

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

type ModeConfig = {
  id: 'default' | 'leverage' | 'meeting' | 'outcome';
  icon: () => React.ReactElement;
  label: string;
  description: string;
};

const modes: ModeConfig[] = [
  {
    id: 'default',
    icon: ChatIcon,
    label: 'Chat',
    description: 'General conversation'
  },
  {
    id: 'leverage',
    icon: LeverageIcon,
    label: 'Leverage Loops',
    description: 'Help someone achieve a goal'
  },
  {
    id: 'meeting',
    icon: MeetingIcon,
    label: 'Meeting Prep',
    description: 'Get context and talking points'
  },
  {
    id: 'outcome',
    icon: OutcomeIcon,
    label: 'Outcomes',
    description: 'Map a goal to an action plan'
  }
];

export function ModePicker({ selectedMode, onSelectMode }: ModePickerProps) {
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
      
      {modes.map((mode) => {
        const isSelected = selectedMode === mode.id;
        const Icon = mode.icon;
        
        return (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              background: isSelected 
                ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.08))'
                : 'transparent',
              border: isSelected 
                ? '1px solid rgba(99,102,241,0.35)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              textAlign: 'left',
              width: '100%',
              boxShadow: isSelected 
                ? '0 4px 16px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08)'
                : 'none',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
              } else {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              } else {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08)';
              }
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: isSelected 
                ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(124,58,237,0.2))'
                : 'rgba(124,58,237,0.08)',
              color: isSelected 
                ? 'rgb(167,139,250)'
                : 'rgba(167,139,250,0.7)',
              flexShrink: 0,
              boxShadow: isSelected 
                ? '0 2px 8px rgba(99,102,241,0.25)'
                : 'none',
              transition: 'all 0.2s ease',
            }}>
              <Icon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: isSelected 
                  ? 'rgba(255,255,255,0.98)'
                  : 'rgba(255,255,255,0.95)',
                marginBottom: '2px',
              }}>
                {mode.label}
              </div>
              <div style={{
                fontSize: '12px',
                color: isSelected 
                  ? 'rgba(255,255,255,0.6)'
                  : 'rgba(255,255,255,0.5)',
                lineHeight: 1.4,
              }}>
                {mode.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
