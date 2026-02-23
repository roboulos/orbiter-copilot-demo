/**
 * Calendar Integration utilities
 * Connects to Xano calendar endpoints for email/calendar access
 */

import {
  mockConnectCalendar,
  mockGetCalendarEvents,
  mockCheckCalendarStatus,
  mockDisconnectCalendar,
} from "./calendar-mock";

const API_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_CALENDAR === "true";

export interface CalendarConnection {
  success: boolean;
  calendar_id: number;
  provider: "google" | "outlook";
  email: string;
  connected_at?: number;
}

export interface CalendarEvent {
  id: number | string;
  title: string;
  start_time: number;
  end_time?: number;
  attendees: Array<{
    email: string;
    name?: string;
    master_person_id?: number;
  }>;
  master_person_ids?: number[];
  location?: string;
  description?: string;
}

export interface CalendarEventsResponse {
  events: CalendarEvent[];
  total: number;
}

/**
 * Connect a calendar account
 * @param email - Email address to connect
 * @param provider - Calendar provider (google or outlook)
 * @param authToken - Auth token for Xano
 */
export async function connectCalendar(
  email: string,
  provider: "google" | "outlook",
  authToken: string
): Promise<CalendarConnection> {
  // Use mock if flag is set
  if (USE_MOCK) {
    console.log("[CALENDAR] Using mock calendar service");
    return mockConnectCalendar(email, provider);
  }
  
  const url = `${API_URL}/calendar/connect`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ email, provider }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to connect calendar: ${response.statusText}. ${errorText}`);
  }

  return response.json();
}

/**
 * Get upcoming calendar events
 * @param authToken - Auth token for Xano
 * @param daysAhead - Number of days to look ahead (default: 7)
 * @param limit - Maximum number of events (default: 20)
 */
export async function getCalendarEvents(
  authToken: string,
  daysAhead: number = 7,
  limit: number = 20
): Promise<CalendarEventsResponse> {
  // Use mock if flag is set
  if (USE_MOCK) {
    console.log("[CALENDAR] Using mock calendar events");
    return mockGetCalendarEvents(daysAhead, limit);
  }
  
  const params = new URLSearchParams({
    days_ahead: String(daysAhead),
    limit: String(limit),
  });
  
  const url = `${API_URL}/calendar/events?${params}`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if calendar is connected
 * @param authToken - Auth token for Xano
 */
export async function checkCalendarStatus(authToken: string): Promise<{
  connected: boolean;
  email?: string;
  provider?: string;
}> {
  // Use mock if flag is set
  if (USE_MOCK) {
    console.log("[CALENDAR] Using mock calendar status");
    return mockCheckCalendarStatus();
  }
  
  try {
    const url = `${API_URL}/calendar/status`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      return { connected: false };
    }

    return response.json();
  } catch (error) {
    console.error("Error checking calendar status:", error);
    return { connected: false };
  }
}

/**
 * Disconnect calendar
 * @param authToken - Auth token for Xano
 */
export async function disconnectCalendar(authToken: string): Promise<{ success: boolean }> {
  // Use mock if flag is set
  if (USE_MOCK) {
    console.log("[CALENDAR] Using mock calendar disconnect");
    return mockDisconnectCalendar();
  }
  
  const url = `${API_URL}/calendar/disconnect`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to disconnect calendar: ${response.statusText}`);
  }

  return response.json();
}
