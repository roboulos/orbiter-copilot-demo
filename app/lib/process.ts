/**
 * Process monitoring utilities
 * Integrates with Xano process endpoints
 */

const BASE_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz";

/**
 * UPDATED: Feb 27, 2026 to match actual backend status values
 * 
 * Status progression:
 *   draft (0%) -> submitted (10%) -> processing (50%) -> suggestion (100%)
 * 
 * Mapping to old values:
 *   suggestion = complete
 *   archived = cancelled
 */
export interface ProcessStatus {
  process_id: number;  // Backend uses process_id not id
  status: "draft" | "submitted" | "processing" | "suggestion" | "archived";
  progress: number; // 0-100
  current_step: string;
  is_complete: boolean;  // Backend provides this convenience field
  mode: string;  // "loop" | "outcome" | "serendipity"
  title?: string;  // Human-readable title
}

export interface ProcessStatusResponse {
  process_id: number;
  status: "draft" | "submitted" | "processing" | "suggestion" | "archived";
  progress: number;
  current_step: string;
  is_complete: boolean;
  mode: string;
  title?: string;
}

export interface CancelProcessResponse {
  success: boolean;
  cancelled_at: number;
}

/**
 * Get process status
 * @param processId - Process ID to check
 * @param authToken - Auth token (optional if using default)
 */
export async function getProcessStatus(
  processId: number,
  authToken?: string
): Promise<ProcessStatus> {
  const url = `${BASE_URL}/process-status?process_id=${processId}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to get process status: ${response.statusText}`);
  }

  const data: ProcessStatusResponse = await response.json();

  return {
    process_id: data.process_id,
    status: data.status,
    progress: data.progress,
    current_step: data.current_step,
    is_complete: data.is_complete,
    mode: data.mode,
    title: data.title,
  };
}

/**
 * Cancel a running process
 * @param processId - Process ID to cancel
 * @param authToken - Auth token (optional if using default)
 */
export async function cancelProcess(
  processId: number,
  authToken?: string
): Promise<CancelProcessResponse> {
  const url = `${BASE_URL}/process-cancel`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ process_id: processId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel process: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Poll process status until complete, failed, or cancelled
 * @param processId - Process ID to poll
 * @param onUpdate - Callback for status updates
 * @param pollIntervalMs - Polling interval in milliseconds (default: 2000)
 * @param authToken - Auth token (optional)
 * @returns Promise that resolves with final status
 */
export async function pollProcessStatus(
  processId: number,
  onUpdate: (status: ProcessStatus) => void,
  pollIntervalMs = 2000,
  authToken?: string
): Promise<ProcessStatus> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const status = await getProcessStatus(processId, authToken);
        onUpdate(status);

        // Check if complete using is_complete flag or status
        if (status.is_complete || status.status === "suggestion" || status.status === "archived") {
          resolve(status);
          return;
        }

        // Continue polling
        setTimeout(poll, pollIntervalMs);
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
}
