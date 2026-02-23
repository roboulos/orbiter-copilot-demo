/**
 * Process monitoring utilities
 * Integrates with Xano process endpoints
 */

const BASE_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "https://xh2o-yths-38lt.n7c.xano.io/api:Bd_dCiOz";

export interface ProcessStatus {
  id: number;
  status: "queued" | "running" | "complete" | "failed" | "cancelled";
  progress: number; // 0-100
  current_step?: string;
  elapsed_seconds: number;
  estimated_seconds?: number;
  result?: unknown;
  error?: string;
}

export interface ProcessStatusResponse {
  id: number;
  status: string;
  progress: number;
  current_step?: string;
  elapsed_seconds: number;
  estimated_seconds?: number;
  result?: unknown;
  error?: string;
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
    id: data.id,
    status: data.status as ProcessStatus["status"],
    progress: data.progress,
    current_step: data.current_step,
    elapsed_seconds: data.elapsed_seconds,
    estimated_seconds: data.estimated_seconds,
    result: data.result,
    error: data.error,
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

        if (status.status === "complete" || status.status === "failed" || status.status === "cancelled") {
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
