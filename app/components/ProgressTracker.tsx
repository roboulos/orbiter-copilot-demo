"use client";

import { useThreadState } from "@crayonai/react-core";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function ProgressTracker({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressTrackerProps) {
  const { isRunning } = useThreadState();

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(10,10,18,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "12px 20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Progress bar */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Interview Progress
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#8b5cf6",
              }}
            >
              {currentStep} of {totalSteps}
            </span>
          </div>

          {/* Bar */}
          <div
            style={{
              height: "6px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "3px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Progress fill */}
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                borderRadius: "3px",
                transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Shimmer effect */}
              {isRunning && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    animation: "shimmer 1.5s infinite",
                  }}
                />
              )}
            </div>
          </div>

          {/* Step labels */}
          {stepLabels && stepLabels.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              {stepLabels.map((label, i) => {
                const stepNumber = i + 1;
                const isComplete = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                const isFuture = stepNumber > currentStep;

                return (
                  <div
                    key={i}
                    style={{
                      fontSize: "10px",
                      color: isComplete
                        ? "#34d399"
                        : isCurrent
                        ? "#8b5cf6"
                        : "rgba(255,255,255,0.3)",
                      fontWeight: isCurrent ? 600 : 400,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {isComplete && "✓ "}
                    {label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isRunning && (
          <div
            style={{
              display: "flex",
              gap: "4px",
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#6366f1",
                  animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
