"use client";

import React, { useState } from 'react';
import type { CopilotConversation } from '../lib/xano';

export interface ModePickerProps {
  selectedMode: 'default' | 'leverage' | 'meeting' | 'outcome';
  onSelectMode: (mode: 'default' | 'leverage' | 'meeting' | 'outcome') => void;
  conversations?: CopilotConversation[];
  onSelectConversation?: (conv: CopilotConversation) => void;
}

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const LeverageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const MeetingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const OutcomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    id: 'outcome',
    icon: OutcomeIcon,
    label: 'Outcomes',
    description: 'Map a goal to an action plan'
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
    id: 'default',
    icon: ChatIcon,
    label: 'Chat',
    description: 'General conversation'
  },
];

const modeIcons: Record<string, () => React.ReactElement> = {
  default: ChatIcon,
  leverage: LeverageIcon,
  meeting: MeetingIcon,
  outcome: OutcomeIcon,
};

function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function ModePicker({ selectedMode, onSelectMode, conversations, onSelectConversation }: ModePickerProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      padding: '16px 12px',
      width: '280px',
      background: 'rgba(255,255,255,0.015)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      height: '100%',
      overflowY: 'auto',
    }}>
      <div style={{ marginBottom: '8px', paddingLeft: '12px' }}>
        <h3 style={{
          fontSize: '11px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '0',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
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
            role="tab"
            aria-selected={isSelected}
            aria-label={`${mode.label}: ${mode.description}`}
            aria-controls={`mode-panel-${mode.id}`}
            tabIndex={isSelected ? 0 : -1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              background: isSelected
                ? 'rgba(99,102,241,0.08)'
                : 'transparent',
              border: isSelected
                ? '1px solid rgba(99,102,241,0.2)'
                : '1px solid transparent',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              textAlign: 'left',
              width: '100%',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isSelected
                ? 'rgba(99,102,241,0.15)'
                : 'rgba(255,255,255,0.04)',
              color: isSelected
                ? 'rgba(167,139,250,0.9)'
                : 'rgba(255,255,255,0.4)',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}>
              <Icon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: isSelected ? 600 : 500,
                color: isSelected
                  ? 'rgba(255,255,255,0.95)'
                  : 'rgba(255,255,255,0.7)',
                marginBottom: '1px',
                letterSpacing: '-0.01em',
              }}>
                {mode.label}
              </div>
              <div style={{
                fontSize: '11px',
                color: isSelected
                  ? 'rgba(255,255,255,0.45)'
                  : 'rgba(255,255,255,0.3)',
                lineHeight: 1.35,
              }}>
                {mode.description}
              </div>
            </div>
          </button>
        );
      })}

      {/* Recent Conversations */}
      {conversations && conversations.length > 0 && (
        <>
          <div style={{
            marginTop: '16px',
            marginBottom: '4px',
            paddingLeft: '12px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '16px',
          }}>
            <h3 style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '0',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Recent
            </h3>
          </div>

          {conversations.slice(0, 8).map((conv) => {
            const ModeIcon = modeIcons[conv.mode] || ChatIcon;
            return (
              <ConversationRow
                key={conv.id}
                conv={conv}
                ModeIcon={ModeIcon}
                onClick={() => onSelectConversation?.(conv)}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

function ConversationRow({
  conv,
  ModeIcon,
  onClick,
}: {
  conv: CopilotConversation;
  ModeIcon: () => React.ReactElement;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 12px',
        background: hovered ? 'rgba(255,255,255,0.035)' : 'transparent',
        border: '1px solid transparent',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left',
        width: '100%',
        outline: 'none',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.3)',
        flexShrink: 0,
      }}>
        <div style={{ transform: 'scale(0.7)' }}>
          <ModeIcon />
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 500,
          color: 'rgba(255,255,255,0.6)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
        }}>
          {conv.title}
        </div>
        <div style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.25)',
          lineHeight: 1.35,
        }}>
          {timeAgo(conv.updated_at)}
        </div>
      </div>
    </button>
  );
}
