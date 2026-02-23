import { useState, useCallback } from "react";
import { classifyIntent, detectSkipIntent, getNextQuestion, generateDispatchSummary, type IntentAnalysis } from "../lib/intent-classifier";

export type InterviewStage = "identify_person" | "clarify_outcome" | "extract_context" | "confirm";

export interface InterviewState {
  active: boolean;
  stage: InterviewStage;
  personId?: number;
  personName?: string;
  outcome?: string;
  constraints?: string[];
  intentAnalysis?: IntentAnalysis;
}

export interface InterviewAction {
  type: "show_person_picker" | "show_question" | "show_confirmation" | "dispatch" | "reset";
  question?: string;
  examples?: string[];
  helpText?: string;
  summary?: string;
}

/**
 * Hook to manage interview-first copilot flow
 */
export function useInterviewFlow() {
  const [state, setState] = useState<InterviewState>({
    active: false,
    stage: "identify_person",
  });
  
  // Force re-render mechanism
  const [, forceUpdate] = useState({});

  /**
   * Process user input and determine next interview action
   */
  const processInput = useCallback((
    input: string,
    selectedPersonId?: number,
    selectedPersonName?: string
  ): InterviewAction => {
    // If user wants to skip interview
    if (detectSkipIntent(input)) {
      if (state.personName && state.outcome) {
        // We have enough info, go straight to dispatch
        const summary = generateDispatchSummary({
          personName: state.personName,
          outcome: state.outcome,
          constraints: state.constraints,
        });
        
        setState(prev => ({ ...prev, stage: "confirm" }));
        
        return {
          type: "show_confirmation",
          summary,
        };
      }
    }

    // If not active, start interview on first input
    if (!state.active) {
      const analysis = classifyIntent(input);
      
      // Check if person is already selected in UI
      const hasPerson = selectedPersonId && selectedPersonName;
      
      if (hasPerson) {
        // Person selected, update state
        setState({
          active: true,
          stage: "clarify_outcome",
          personId: selectedPersonId,
          personName: selectedPersonName,
          intentAnalysis: analysis,
        });
        
        // If analysis shows complete intent, skip interview
        if (analysis.type === "complete") {
          const summary = generateDispatchSummary({
            personName: selectedPersonName,
            outcome: analysis.outcomeMentioned || input,
            constraints: analysis.contextMentioned,
          });
          
          setState(prev => ({ ...prev, stage: "confirm", outcome: input }));
          
          return {
            type: "show_confirmation",
            summary,
          };
        }
        
        // Otherwise, ask for clarification
        const next = getNextQuestion("clarify_outcome", { personName: selectedPersonName });
        
        return {
          type: "show_question",
          question: next.question,
          examples: next.examples,
          helpText: next.helpText,
        };
      }
      
      // No person selected, start from beginning
      console.log('[useInterviewFlow] Activating interview - stage:', analysis.nextStage);
      setState({
        active: true,
        stage: analysis.nextStage,
        intentAnalysis: analysis,
      });
      console.log('[useInterviewFlow] setState called with active: true');
      
      if (analysis.nextStage === "identify_person") {
        return {
          type: "show_person_picker",
          question: "Who would you like to help?",
        };
      }
      
      const next = getNextQuestion(analysis.nextStage, {});
      return {
        type: "show_question",
        question: next.question,
        examples: next.examples,
        helpText: next.helpText,
      };
    }

    // Active interview, process based on current stage
    switch (state.stage) {
      case "identify_person":
        if (selectedPersonId && selectedPersonName) {
          // Person selected
          setState(prev => ({
            ...prev,
            stage: "clarify_outcome",
            personId: selectedPersonId,
            personName: selectedPersonName,
          }));
          
          const next = getNextQuestion("clarify_outcome", { personName: selectedPersonName });
          return {
            type: "show_question",
            question: next.question,
            examples: next.examples,
            helpText: next.helpText,
          };
        }
        // Still need person
        return {
          type: "show_person_picker",
          question: "Please select a person to help:",
        };

      case "clarify_outcome":
        // User provided outcome
        setState(prev => ({
          ...prev,
          stage: "extract_context",
          outcome: input,
        }));
        
        // Check if input has enough detail to skip context extraction
        if (input.length > 50 || input.split(" ").length > 8) {
          // Detailed outcome, go to confirmation
          const summary = generateDispatchSummary({
            personName: state.personName!,
            outcome: input,
          });
          
          setState(prev => ({ ...prev, stage: "confirm" }));
          
          return {
            type: "show_confirmation",
            summary,
          };
        }
        
        // Ask for optional context
        const contextQ = getNextQuestion("extract_context", {});
        return {
          type: "show_question",
          question: contextQ.question,
          examples: contextQ.examples,
          helpText: contextQ.helpText,
        };

      case "extract_context":
        // User provided constraints (optional)
        const constraints = input.trim() ? [input] : undefined;
        
        setState(prev => ({
          ...prev,
          stage: "confirm",
          constraints,
        }));
        
        const summary = generateDispatchSummary({
          personName: state.personName!,
          outcome: state.outcome!,
          constraints,
        });
        
        return {
          type: "show_confirmation",
          summary,
        };

      case "confirm":
        // User confirmed, dispatch
        return {
          type: "dispatch",
        };
    }

    // Fallback
    return {
      type: "show_question",
      question: "I'm not sure what you mean. Can you clarify?",
    };
  }, [state]);

  /**
   * Reset interview state
   */
  const reset = useCallback(() => {
    setState({
      active: false,
      stage: "identify_person",
    });
  }, []);

  /**
   * Update person in interview state
   */
  const setPerson = useCallback((personId: number, personName: string) => {
    setState(prev => ({
      ...prev,
      personId,
      personName,
      stage: prev.stage === "identify_person" ? "clarify_outcome" : prev.stage,
    }));
  }, []);

  /**
   * Skip to specific stage (for power users)
   */
  const skipToStage = useCallback((stage: InterviewStage) => {
    setState(prev => ({ ...prev, stage }));
  }, []);

  return {
    state,
    processInput,
    reset,
    setPerson,
    skipToStage,
  };
}
