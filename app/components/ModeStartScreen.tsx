"use client";

import React, { useState, useRef, useEffect } from 'react';
import { getCalendarEvents, checkCalendarStatus, type CalendarEvent } from '../lib/calendar';
import { getAuthToken } from '../lib/xano';

interface ModeStartScreenProps {
  mode: 'default' | 'leverage' | 'meeting' | 'outcome';
  onSubmit: (value: string) => void;
}

export function ModeStartScreen({ mode, onSubmit }: ModeStartScreenProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredExample, setHoveredExample] = useState<number | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarConnected, setCalendarConnected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * ═══════════════════════════════════════════════════════════════════════
   * CALENDAR INTEGRATION - ⚠️ CURRENTLY USING MOCK DATA
   * ═══════════════════════════════════════════════════════════════════════
   * 
   * STATUS: UI is complete, backend endpoints DO NOT EXIST yet
   * 
   * WHAT'S HAPPENING:
   *   - This code calls getCalendarEvents() and checkCalendarStatus()
   *   - Those functions call the real Xano calendar endpoints
   * 
   * MOCK DATA (5 fake events):
   *   1. "Weekly Sync with Mark" (tomorrow 10 AM)
   *   2. "Demo Review with Charles" (day after 2 PM)
   *   3. "Strategy Session with Josh" (2 days 9 AM)
   *   4. "Investor Update Call" (3 days 3 PM)
   *   5. "Product Review with Dennis" (4 days 11 AM)
   * 
   * FOR DEMO:
   *   - ✅ Perfect for Mark's Thursday demo
   *   - ✅ Shows UX flow beautifully
   *   - ✅ Events are clickable, auto-populate chat
   * 
   * FOR PRODUCTION:
   *   - ❌ Need to build real Xano calendar endpoints
   *   - ❌ Need OAuth flow (Google Calendar, Outlook)
   *   - ❌ Need calendar connection UI
   * 
   * INTEGRATION NOTE: Keep mock for demo, build backend before launch
   * ═══════════════════════════════════════════════════════════════════════
   */
  useEffect(() => {
    if (mode === 'meeting') {
      loadCalendarEvents();
    }
  }, [mode]);

  const loadCalendarEvents = async () => {
    try {
      setCalendarLoading(true);
      const authToken = await getAuthToken();
      
      const status = await checkCalendarStatus(authToken);
      setCalendarConnected(status.connected);
      
      if (status.connected) {
        // NOTE: Returns mock events (5 fake meetings)
        const response = await getCalendarEvents(authToken, 7, 10);
        setCalendarEvents(response.events || []);
      }
    } catch (error) {
      console.error('Failed to load calendar events:', error);
      setCalendarEvents([]);
    } finally {
      setCalendarLoading(false);
    }
  };

  // Pass 1: Enhanced typography and content structure
  const config = {
    default: {
      title: 'How can I help you?',
      subtitle: 'Ask me anything',
      placeholder: 'Type your message...',
      examples: [
        { text: 'Search my network', caption: 'Find connections' },
        { text: 'Prepare for a meeting', caption: 'Get context' },
        { text: 'Help me achieve a goal', caption: 'Create a plan' }
      ],
      gradient: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(99,102,241,0.08) 100%)'
    },
    leverage: {
      title: 'Who would you like to help?',
      subtitle: 'Search your network or type a name',
      placeholder: 'Type a name or describe the connection...',
      examples: [
        { text: 'Ray Deck', caption: 'Help a specific person' },
        { text: 'Help someone find investors', caption: 'Connect with funding' },
        { text: 'Connect someone with a hire', caption: 'Make an introduction' }
      ],
      gradient: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.1) 100%)'
    },
    meeting: {
      title: 'Who are you meeting with?',
      subtitle: 'View your calendar or enter a name',
      placeholder: 'Type a name or meeting context...',
      examples: [
        { text: 'Meeting with Charles', caption: 'Get context on Charles' },
        { text: 'Prepare for Mark call', caption: 'Talking points for Mark' },
        { text: 'Coffee with investors', caption: 'Investor meeting prep' }
      ],
      gradient: 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(16,185,129,0.08) 100%)'
    },
    outcome: {
      title: 'What outcome do you want to achieve?',
      subtitle: 'Describe your goal and we\'ll create a plan',
      placeholder: 'Type your goal or objective...',
      examples: [
        { text: 'Raise $4M seed round', caption: 'Fundraising goal' },
        { text: 'Hire senior engineer', caption: 'Recruiting objective' },
        { text: 'Find 10 beta customers', caption: 'Growth target' }
      ],
      gradient: 'linear-gradient(135deg, rgba(251,146,60,0.12) 0%, rgba(249,115,22,0.08) 100%)'
    }
  };

  const { title, subtitle, placeholder, examples, gradient } = config[mode];

  // Pass 6: Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Number keys (1-3) to select examples
      if (e.key >= '1' && e.key <= '3' && !isFocused) {
        const idx = parseInt(e.key) - 1;
        if (examples[idx]) {
          onSubmit(examples[idx].text);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [examples, isFocused, onSubmit]);

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
      padding: '120px 48px 80px',
      minHeight: '600px',
      background: 'transparent',
      position: 'relative',
    }}>
      {/* Pass 7: Ambient gradient backdrop */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '600px',
        background: gradient,
        filter: 'blur(120px)',
        opacity: 0.3,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '580px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Pass 1 & 5: Typography with enhanced hierarchy */}
        <h1 style={{
          fontSize: '40px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.98)',
          marginBottom: '16px',
          textAlign: 'center',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          // Pass 2: Subtle text gradient
          background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {title}
        </h1>

        {/* Pass 4: Improved subtitle spacing and color */}
        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.55)',
          marginBottom: '56px',
          textAlign: 'center',
          lineHeight: 1.5,
          letterSpacing: '-0.01em',
        }}>
          {subtitle}
        </p>

        {/* Pass 3: Enhanced input with micro-interactions */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{
            position: 'relative',
            width: '100%',
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              autoFocus
              aria-label={title}
              style={{
                width: '100%',
                padding: '18px 56px 18px 20px',
                fontSize: '16px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.95)',
                // Pass 7: Enhanced background with glow
                background: isFocused 
                  ? 'rgba(255,255,255,0.09)' 
                  : 'rgba(255,255,255,0.06)',
                border: isFocused
                  ? '1.5px solid rgba(124,58,237,0.6)'
                  : '1px solid rgba(255,255,255,0.14)',
                borderRadius: '10px',
                outline: 'none',
                // Pass 10: Spring-based animation
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em',
                // Pass 7: Subtle shadow
                boxShadow: isFocused
                  ? '0 0 0 4px rgba(124,58,237,0.08), 0 8px 16px -4px rgba(0,0,0,0.15)'
                  : '0 2px 8px -2px rgba(0,0,0,0.08)',
              }}
            />
            
            {/* Pass 12: Enhanced keyboard hint */}
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'none',
            }}>
              {!input && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}>
                  <kbd style={{
                    padding: '2px 5px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '4px',
                    fontSize: '10px',
                  }}>⌘K</kbd>
                </div>
              )}
              {input && (
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(124,58,237,0.6)',
                  fontWeight: 500,
                }}>
                  ↵
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Pass 8: Clearer examples section structure */}
        <div style={{
          marginTop: '48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
        }}>
          {/* Pass 5: Better label hierarchy */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Examples
            </div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
              fontWeight: 500,
            }}>
              Press 1-3
            </div>
          </div>
          
          {/* Pass 3 & 10: Enhanced example buttons with animations */}
          {examples.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(example.text);
                onSubmit(example.text);
              }}
              onMouseEnter={() => setHoveredExample(idx)}
              onMouseLeave={() => setHoveredExample(null)}
              aria-label={`Example ${idx + 1}: ${example.text}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: hoveredExample === idx 
                  ? 'rgba(255,255,255,0.95)' 
                  : 'rgba(255,255,255,0.65)',
                // Pass 7: Sophisticated background layers
                background: hoveredExample === idx
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.02)',
                border: hoveredExample === idx
                  ? '1px solid rgba(255,255,255,0.15)'
                  : '1px solid rgba(255,255,255,0.09)',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                // Pass 10: Smoother spring animation
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                // Pass 7: Subtle elevation
                boxShadow: hoveredExample === idx
                  ? '0 4px 12px -2px rgba(0,0,0,0.12)'
                  : '0 0 0 0 rgba(0,0,0,0)',
                // Pass 10: Slight lift on hover
                transform: hoveredExample === idx ? 'translateY(-1px)' : 'translateY(0)',
                letterSpacing: '-0.01em',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  marginBottom: '3px',
                }}>
                  {example.text}
                </div>
                {/* Pass 8: Helper caption for clarity */}
                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 400,
                }}>
                  {example.caption}
                </div>
              </div>
              {/* Pass 12: Keyboard shortcut hint */}
              <kbd style={{
                padding: '3px 7px',
                fontSize: '11px',
                fontWeight: 600,
                color: hoveredExample === idx 
                  ? 'rgba(255,255,255,0.5)' 
                  : 'rgba(255,255,255,0.25)',
                background: hoveredExample === idx
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                {idx + 1}
              </kbd>
            </button>
          ))}
        </div>

        {/* Calendar Events for Meeting Prep */}
        {mode === 'meeting' && calendarConnected && !calendarLoading && calendarEvents.length > 0 && (
          <div style={{
            marginTop: '40px',
            width: '100%',
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '14px',
            }}>
              Upcoming Meetings
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {calendarEvents.slice(0, 5).map((event, idx) => {
                // Support both Nylas format (when.start_time) and flat format (start_time)
                const rawStart = (event as any).when?.start_time || event.start_time;
                const startDate = rawStart ? new Date(rawStart * 1000) : new Date();
                const isToday = startDate.toDateString() === new Date().toDateString();
                const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

                const dateLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' :
                  startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                const timeLabel = startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                // Support both Nylas format (participants) and our format (attendees)
                const people = (event.attendees || (event as any).participants || []) as Array<{ email: string; name?: string }>;
                const attendeeNames = people
                  .filter(a => a.name || a.email)
                  .map(a => a.name?.split(' ')[0] || a.email?.split('@')[0])
                  .slice(0, 3)
                  .join(', ');

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => {
                      const meetingPrompt = `Meeting with ${attendeeNames || 'attendees'}: ${event.title}`;
                      setInput(meetingPrompt);
                      onSubmit(meetingPrompt);
                    }}
                    onMouseEnter={() => setHoveredEvent(idx)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '12px 14px',
                      background: hoveredEvent === idx
                        ? 'rgba(34,197,94,0.08)'
                        : 'rgba(255,255,255,0.02)',
                      border: hoveredEvent === idx
                        ? '1px solid rgba(34,197,94,0.3)'
                        : '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: hoveredEvent === idx ? 'translateY(-1px)' : 'translateY(0)',
                      boxShadow: hoveredEvent === idx
                        ? '0 4px 12px -2px rgba(34,197,94,0.15)'
                        : 'none',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: hoveredEvent === idx 
                          ? 'rgba(255,255,255,0.95)' 
                          : 'rgba(255,255,255,0.85)',
                        letterSpacing: '-0.01em',
                      }}>
                        {event.title}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isToday 
                          ? 'rgba(34,197,94,0.8)' 
                          : 'rgba(255,255,255,0.4)',
                        padding: '2px 7px',
                        background: isToday 
                          ? 'rgba(34,197,94,0.12)' 
                          : 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                      }}>
                        {dateLabel}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)',
                    }}>
                      <span>🕐 {timeLabel}</span>
                      {attendeeNames && (
                        <>
                          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                          <span>{attendeeNames}</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Calendar Loading State */}
        {mode === 'meeting' && calendarLoading && (
          <div style={{
            marginTop: '40px',
            textAlign: 'center',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
          }}>
            Loading calendar events...
          </div>
        )}

        {/* Calendar Not Connected */}
        {mode === 'meeting' && !calendarLoading && !calendarConnected && (
          <div style={{
            marginTop: '40px',
            padding: '16px',
            background: 'rgba(251,146,60,0.08)',
            border: '1px solid rgba(251,146,60,0.2)',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '8px',
            }}>
              📅 Connect your calendar to see upcoming meetings
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.45)',
            }}>
              Click the calendar icon in the header to connect
            </div>
          </div>
        )}

        {/* Pass 12: Contextual help text */}
        <div style={{
          marginTop: '40px',
          textAlign: 'center',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.6,
        }}>
          {mode === 'default' && "Your intelligent assistant for networking and productivity"}
          {mode === 'leverage' && "We'll find the best connections in your network"}
          {mode === 'meeting' && "Get insights and talking points for better conversations"}
          {mode === 'outcome' && "We'll map your goal to actionable steps"}
        </div>
      </div>
    </div>
  );
}
