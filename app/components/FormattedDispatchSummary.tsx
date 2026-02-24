"use client";

/**
 * FormattedDispatchSummary - Formats the plain text dispatch summary from backend
 * Takes the wall of text and makes it beautiful with headers, bullets, structure
 */

interface FormattedDispatchSummaryProps {
  text: string;
  onDispatch?: () => void;
}

export function FormattedDispatchSummary({ text, onDispatch }: FormattedDispatchSummaryProps) {
  // Parse the text to extract structured data
  const lines = text.split('\n').filter(l => l.trim());
  
  const data: any = {
    goal: '',
    target: '',
    outcome: '',
    constraints: '',
    quickMatches: [] as string[],
    description: ''
  };

  lines.forEach(line => {
    if (line.startsWith('Goal:')) data.goal = line.replace('Goal:', '').trim();
    else if (line.startsWith('Target:')) data.target = line.replace('Target:', '').trim();
    else if (line.startsWith('Outcome:')) data.outcome = line.replace('Outcome:', '').trim();
    else if (line.startsWith('Constraints:')) data.constraints = line.replace('Constraints:', '').trim();
    else if (line.includes('•') || line.includes('-')) {
      // Extract bullet point
      const match = line.match(/[•-]\s*(.+)/);
      if (match) data.quickMatches.push(match[1].trim());
    }
    else if (line.startsWith('I will search')) data.description = line;
  });

  return (
    <div
      style={{
        maxWidth: "700px",
        background: "linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "16px",
        padding: "28px",
        margin: "16px 0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "12px",
        }}>
          Request Summary
        </div>
        <div style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "rgba(255,255,255,0.95)",
          lineHeight: "1.5",
        }}>
          {data.goal || text.substring(0, 100) + '...'}
        </div>
      </div>

      {/* Details Grid */}
      <div style={{
        display: "grid",
        gap: "16px",
        marginBottom: "24px",
      }}>
        {data.target && (
          <div style={{
            padding: "12px 16px",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "6px",
            }}>
              Target
            </div>
            <div style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 500,
            }}>
              👤 {data.target}
            </div>
          </div>
        )}

        {data.outcome && (
          <div style={{
            padding: "12px 16px",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "6px",
            }}>
              Outcome
            </div>
            <div style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 500,
            }}>
              🎯 {data.outcome}
            </div>
          </div>
        )}

        {data.constraints && (
          <div style={{
            padding: "12px 16px",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "6px",
            }}>
              Constraints
            </div>
            <div style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.9)",
              fontWeight: 500,
            }}>
              📋 {data.constraints}
            </div>
          </div>
        )}
      </div>

      {/* Quick Matches */}
      {data.quickMatches.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.7)",
            marginBottom: "12px",
          }}>
            Quick Matches Found:
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}>
            {data.quickMatches.map((match: string, i: number) => (
              <div
                key={i}
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.85)",
                  padding: "10px 14px",
                  background: "rgba(52,211,153,0.08)",
                  border: "1px solid rgba(52,211,153,0.15)",
                  borderRadius: "8px",
                  lineHeight: "1.5",
                }}
              >
                • {match}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {data.description && (
        <div style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.7)",
          lineHeight: "1.6",
          padding: "16px",
          background: "rgba(0,0,0,0.15)",
          borderRadius: "10px",
          borderLeft: "3px solid rgba(99,102,241,0.5)",
        }}>
          {data.description}
        </div>
      )}
    </div>
  );
}
