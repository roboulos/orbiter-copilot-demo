"use client";

import { useState, useEffect } from "react";
import { getAuthToken } from "@/app/lib/xano";
import {
  connectCalendar,
  disconnectCalendar,
  checkCalendarStatus,
  type CalendarConnection,
} from "@/app/lib/calendar";

interface CalendarSettingsProps {
  onClose?: () => void;
  onSuccess?: (connection: CalendarConnection) => void;
}

export default function CalendarSettings({ onClose, onSuccess }: CalendarSettingsProps) {
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<"google" | "outlook">("google");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [calendarStatus, setCalendarStatus] = useState<{
    connected: boolean;
    email?: string;
    provider?: string;
  }>({ connected: false });
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    setCheckingStatus(true);
    try {
      const token = await getAuthToken();
      const status = await checkCalendarStatus(token);
      setCalendarStatus(status);
      if (status.connected && status.email) {
        setEmail(status.email);
        setProvider((status.provider as "google" | "outlook") || "google");
      }
    } catch (err) {
      console.error("Error checking calendar status:", err);
    } finally {
      setCheckingStatus(false);
    }
  }

  async function handleConnect() {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await getAuthToken();
      const result = await connectCalendar(email, provider, token);
      
      setSuccess(`Successfully connected ${provider} calendar for ${email}`);
      setCalendarStatus({
        connected: true,
        email,
        provider,
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect calendar";
      setError(errorMessage);
      
      // Check if it's the OAuth blocker
      if (errorMessage.includes("OAuth") || errorMessage.includes("permission") || errorMessage.includes("unauthorized")) {
        setError(
          "Calendar connection requires OAuth authorization. Please contact Mark to grant Nylas OAuth access for your email."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = await getAuthToken();
      await disconnectCalendar(token);
      
      setSuccess("Calendar disconnected successfully");
      setCalendarStatus({ connected: false });
      setEmail("");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to disconnect calendar";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (checkingStatus) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Checking calendar status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Calendar Integration</h2>
        <p className="text-gray-600">
          Connect your calendar to automatically generate meeting prep materials for upcoming meetings.
        </p>
      </div>

      {calendarStatus.connected ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-green-800">Calendar Connected</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  <strong>Email:</strong> {calendarStatus.email}
                </p>
                <p className="mt-1">
                  <strong>Provider:</strong> {calendarStatus.provider}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? "Disconnecting..." : "Disconnect Calendar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="robert@snappy.ai"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Calendar Provider</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="provider"
                  value="google"
                  checked={provider === "google"}
                  onChange={(e) => setProvider(e.target.value as "google")}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Google Calendar</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="provider"
                  value="outlook"
                  checked={provider === "outlook"}
                  onChange={(e) => setProvider(e.target.value as "outlook")}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Outlook Calendar</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={loading || !email}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Connecting..." : `Connect ${provider === "google" ? "Google" : "Outlook"} Calendar`}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 How it works</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Connect your Google or Outlook calendar</li>
          <li>Orbiter will scan your upcoming meetings</li>
          <li>Automatically generate prep materials for each attendee</li>
          <li>Get talking points, context, and landmines to avoid</li>
        </ul>
      </div>

      {onClose && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
