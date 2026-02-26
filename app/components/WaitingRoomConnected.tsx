"use client";

import { useEffect, useState, useCallback } from "react";
import { WaitingRoom } from "./WaitingRoom";
import { getProcessStatus, cancelProcess, type ProcessStatus } from "../lib/process";

interface WaitingRoomConnectedProps {
  processId: number;
  title: string;
  description?: string;
  onComplete?: (result: unknown) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  authToken?: string;
  pollIntervalMs?: number;
}

/**
 * WaitingRoomConnected - Wrapper that handles actual backend polling
 * Use this when you have a real process_id from the backend
 */
export function WaitingRoomConnected({
  processId,
  title,
  description,
  onComplete,
  onError,
  onCancel,
  authToken,
  pollIntervalMs = 2000,
}: WaitingRoomConnectedProps) {
  const [status, setStatus] = useState<ProcessStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Poll process status
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      if (!isMounted) return;

      try {
        const currentStatus = await getProcessStatus(processId, authToken);
        
        if (!isMounted) return;
        
        setStatus(currentStatus);

        // Handle terminal states (updated for new backend status values)
        if (currentStatus.is_complete || currentStatus.status === "suggestion") {
          onComplete?.((currentStatus as any).result);
          return;
        }

        if (currentStatus.status === "archived") {
          onCancel?.();
          return;
        }

        // Continue polling if not complete
        if (!currentStatus.is_complete) {
          timeoutId = setTimeout(poll, pollIntervalMs);
        }
      } catch (err) {
        if (!isMounted) return;
        
        const errorMsg = err instanceof Error ? err.message : "Failed to get process status";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    };

    // Start polling
    poll();

    // Cleanup
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [processId, authToken, pollIntervalMs, onComplete, onError, onCancel]);

  const handleCancel = useCallback(async () => {
    if (isCancelling) return;

    setIsCancelling(true);
    try {
      await cancelProcess(processId, authToken);
      // Status will update via polling
      onCancel?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to cancel process";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsCancelling(false);
    }
  }, [processId, authToken, onCancel, onError, isCancelling]);

  const handleViewResults = useCallback(() => {
    // Results are fetched separately from leverage-loop-suggestions endpoint
    onComplete?.(null);
  }, [onComplete]);

  if (error) {
    return (
      <WaitingRoom
        title={title}
        description={error}
        status="error"
        progress={status?.progress || 0}
      />
    );
  }

  if (!status) {
    return (
      <WaitingRoom
        title={title}
        description={description || "Initializing..."}
        status="pending"
        progress={0}
      />
    );
  }

  // Map backend status to UI status
  const uiStatus: "pending" | "running" | "complete" | "error" =
    status.status === "draft" ? "pending" :
    status.status === "submitted" ? "pending" :
    status.status === "processing" ? "running" :
    status.status === "suggestion" ? "complete" :
    status.status === "archived" ? "error" : "running";

  return (
    <WaitingRoom
      title={title}
      description={description}
      status={uiStatus}
      progress={status.progress}
      currentStep={status.current_step}
      onCancel={!status.is_complete ? handleCancel : undefined}
      onViewResults={status.is_complete ? handleViewResults : undefined}
    />
  );
}
