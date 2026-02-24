"use client";

import { InlineInterviewCard } from "./InlineInterviewCard";
import { useCallback } from "react";

/**
 * Wrapper that provides dispatch trigger capability to InlineInterviewCard
 * This allows the interview to trigger the DispatchConfirmationModal at confirm stage
 */

interface InlineInterviewCardWrapperProps {
  question: string;
  stage: "identify_person" | "clarify_outcome" | "extract_context" | "confirm";
  context?: {
    personName?: string;
    personId?: number;
    outcome?: string;
    constraints?: string[];
  };
  examples?: string[];
  helpText?: string;
  onDispatchTrigger?: (data: {
    personId?: number;
    personName?: string;
    outcome?: string;
    constraints?: string[];
    description: string;
  }) => void;
}

export function InlineInterviewCardWrapper(props: InlineInterviewCardWrapperProps) {
  // If this is confirm stage, we need to handle dispatch specially
  const handleConfirmDispatch = useCallback(() => {
    if (props.stage === "confirm" && props.onDispatchTrigger && props.context) {
      // Generate description
      const { personName, outcome, constraints } = props.context;
      const constraintText = constraints && constraints.length > 0 
        ? ` with these preferences: ${constraints.join(", ")}`
        : "";
      const description = `Help ${personName || "them"} ${outcome || "achieve their goal"}${constraintText}.`;
      
      // Trigger dispatch modal
      props.onDispatchTrigger({
        personId: props.context.personId,
        personName: props.context.personName,
        outcome: props.context.outcome,
        constraints: props.context.constraints,
        description,
      });
    }
  }, [props]);

  // For confirm stage, intercept "Yes, dispatch now" clicks
  if (props.stage === "confirm") {
    return (
      <div>
        <InlineInterviewCard {...props} />
        {/* Hidden script that listens for dispatch confirmation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Listen for clicks on "Yes, dispatch now" button
                document.addEventListener('click', function(e) {
                  const target = e.target;
                  if (target && target.textContent && target.textContent.includes('Yes, dispatch now')) {
                    // Trigger dispatch
                    window.dispatchEvent(new CustomEvent('interview-dispatch-confirmed'));
                  }
                });
              })();
            `,
          }}
        />
      </div>
    );
  }

  // For other stages, render normally
  return <InlineInterviewCard {...props} />;
}
