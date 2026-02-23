/**
 * Meeting Prep utilities
 * Integrates with Xano meeting-prep endpoint
 */

const BASE_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz";

export interface MeetingPrepRequest {
  master_person_id: number;
  meeting_id?: number;
  context?: string;
}

export interface MeetingPrepResponse {
  person_summary: string;
  talking_points: string[];
  suggested_openers: string[];
  why_they_care: string;
  listen_for: string[];
  landmines: string[];
}

/**
 * Generate meeting prep for a person
 * @param request - Meeting prep request
 * @param authToken - Auth token (optional if using default)
 */
export async function generateMeetingPrep(
  request: MeetingPrepRequest,
  authToken?: string
): Promise<MeetingPrepResponse> {
  const url = `${BASE_URL}/meeting-prep`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate meeting prep: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Generate beautified dispatch description (server-side)
 * @param masterPersonId - Master person ID
 * @param goal - What to accomplish
 * @param context - Additional context
 * @param authToken - Auth token (optional)
 */
export async function generateDispatchDescription(
  masterPersonId: number,
  goal: string,
  context?: string,
  authToken?: string
): Promise<string> {
  const url = `${BASE_URL}/dispatch-describe`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      master_person_id: masterPersonId,
      goal,
      context,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate dispatch description: ${response.statusText}`);
  }

  const data = await response.json();
  return data.description;
}
