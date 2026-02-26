/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ MOCK CALENDAR SERVICE - FOR DEMO ONLY ⚠️
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * WARNING: This is NOT connected to real calendar data!
 * 
 * PURPOSE: Demonstrates calendar integration UX for Mark's demo
 *          Shows how the feature will work once backend is built
 * 
 * STATUS: Backend endpoints DO NOT EXIST yet
 * 
 * REQUIRED BACKEND (TODO):
 *   1. POST /calendar/connect - OAuth flow (Google/Outlook)
 *   2. GET  /calendar/events  - Fetch upcoming events
 *   3. GET  /calendar/status  - Check connection status
 *   4. POST /calendar/disconnect - Unlink calendar
 * 
 * MOCK DATA INCLUDES:
 *   - 5 fake calendar events (Mark, Charles, Josh, etc.)
 *   - Realistic timestamps (tomorrow, day after, etc.)
 *   - Attendee names matching Orbiter team
 * 
 * INTEGRATION NOTE:
 *   - Keep this for demo (shows feature beautifully)
 *   - Build real backend before production
 *   - Replace with OAuth implementation (Google Calendar API, Outlook API)
 *   - Delete this file when real endpoints exist
 * 
 * CONTROLLED BY:
 *   .env.local → NEXT_PUBLIC_USE_MOCK_CALENDAR=true
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CalendarConnection, CalendarEvent, CalendarEventsResponse } from "./calendar";

// Simulated delay to mimic real API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage (in-memory)
let mockCalendarConnection: CalendarConnection | null = null;

/**
 * Mock: Connect a calendar account
 */
export async function mockConnectCalendar(
  email: string,
  provider: "google" | "outlook"
): Promise<CalendarConnection> {
  await delay(800); // Simulate API latency
  
  // Simulate successful connection
  mockCalendarConnection = {
    success: true,
    calendar_id: 12345,
    provider,
    email,
    connected_at: Date.now(),
  };
  
  console.log("[MOCK] Calendar connected:", mockCalendarConnection);
  return mockCalendarConnection;
}

/**
 * Mock: Get upcoming calendar events
 */
export async function mockGetCalendarEvents(
  daysAhead: number = 7,
  limit: number = 20
): Promise<CalendarEventsResponse> {
  await delay(500);
  
  if (!mockCalendarConnection) {
    throw new Error("No calendar connected");
  }
  
  // Generate mock events for the next week
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  const mockEvents: CalendarEvent[] = [
    {
      id: 1,
      title: "Weekly Sync with Mark",
      start_time: now + (1 * oneDayMs) + (10 * 60 * 60 * 1000), // Tomorrow at 10 AM
      end_time: now + (1 * oneDayMs) + (11 * 60 * 60 * 1000), // Tomorrow at 11 AM
      attendees: [
        { email: "mark@orbiter.io", name: "Mark Pederson", master_person_id: 1 },
        { email: mockCalendarConnection.email, name: "Robert Boulos", master_person_id: 1024 },
      ],
      master_person_ids: [1, 1024],
      location: "Zoom",
      description: "Weekly product sync and roadmap discussion",
    },
    {
      id: 2,
      title: "Demo Review with Charles",
      start_time: now + (2 * oneDayMs) + (14 * 60 * 60 * 1000), // Day after tomorrow at 2 PM
      end_time: now + (2 * oneDayMs) + (15 * 60 * 60 * 1000),
      attendees: [
        { email: "charles@orbiter.io", name: "Charles Njenga", master_person_id: 40 },
        { email: mockCalendarConnection.email, name: "Robert Boulos", master_person_id: 1024 },
      ],
      master_person_ids: [40, 1024],
      location: "Google Meet",
      description: "Review Copilot demo integration",
    },
    {
      id: 3,
      title: "1:1 with Josh",
      start_time: now + (3 * oneDayMs) + (16 * 60 * 60 * 1000), // 3 days from now at 4 PM
      end_time: now + (3 * oneDayMs) + (16.5 * 60 * 60 * 1000),
      attendees: [
        { email: "josh@orbiter.io", name: "Josh", master_person_id: 2 },
        { email: mockCalendarConnection.email, name: "Robert Boulos", master_person_id: 1024 },
      ],
      master_person_ids: [2, 1024],
      location: "Office",
    },
    {
      id: 4,
      title: "Team Standup",
      start_time: now + (4 * oneDayMs) + (9 * 60 * 60 * 1000), // 4 days from now at 9 AM
      end_time: now + (4 * oneDayMs) + (9.5 * 60 * 60 * 1000),
      attendees: [
        { email: "mark@orbiter.io", name: "Mark Pederson", master_person_id: 1 },
        { email: "josh@orbiter.io", name: "Josh", master_person_id: 2 },
        { email: "charles@orbiter.io", name: "Charles Njenga", master_person_id: 40 },
        { email: "denis@orbiter.io", name: "Dennis Mbugua", master_person_id: 16 },
        { email: mockCalendarConnection.email, name: "Robert Boulos", master_person_id: 1024 },
      ],
      master_person_ids: [1, 2, 40, 16, 1024],
      location: "Zoom",
    },
  ];
  
  // Filter based on daysAhead and limit
  const maxTime = now + (daysAhead * oneDayMs);
  const filteredEvents = mockEvents
    .filter(event => event.start_time < maxTime)
    .slice(0, limit);
  
  console.log(`[MOCK] Returning ${filteredEvents.length} calendar events`);
  
  return {
    events: filteredEvents,
    total: filteredEvents.length,
  };
}

/**
 * Mock: Check if calendar is connected
 */
export async function mockCheckCalendarStatus(): Promise<{
  connected: boolean;
  email?: string;
  provider?: string;
}> {
  await delay(300);
  
  if (mockCalendarConnection) {
    return {
      connected: true,
      email: mockCalendarConnection.email,
      provider: mockCalendarConnection.provider,
    };
  }
  
  return { connected: false };
}

/**
 * Mock: Disconnect calendar
 */
export async function mockDisconnectCalendar(): Promise<{ success: boolean }> {
  await delay(500);
  
  mockCalendarConnection = null;
  console.log("[MOCK] Calendar disconnected");
  
  return { success: true };
}
