import { useReducer, useCallback } from "react";
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

type StateAction = 
  | { type: 'ACTIVATE'; payload: Partial<InterviewState> }
  | { type: 'UPDATE_STAGE'; payload: Partial<InterviewState> }
  | { type: 'RESET' }
  | { type: 'SET_PERSON'; personId: number; personName: string };

function interviewReducer(state: InterviewState, action: StateAction): InterviewState {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('[interviewReducer] ⚡ ACTION RECEIVED:', action.type);
  console.log('[interviewReducer] 📊 Current state:', { active: state.active, stage: state.stage });
  console.log('[interviewReducer] 📦 Action payload:', JSON.stringify(action));
  
  switch (action.type) {
    case 'ACTIVATE':
      const newState = { ...state, ...action.payload, active: true };
      console.log('[interviewReducer] ✅ ACTIVATE - Returning NEW state:', newState);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      return newState;
      
    case 'UPDATE_STAGE':
      return { ...state, ...action.payload };
      
    case 'SET_PERSON':
      return {
        ...state,
        personId: action.personId,
        personName: action.personName,
        stage: state.stage === 'identify_person' ? 'clarify_outcome' : state.stage,
      };
      
    case 'RESET':
      return {
        active: false,
        stage: "identify_person",
      };
      
    default:
      return state;
  }
}

/**
 * Hook to manage interview-first copilot flow
 */
export function useInterviewFlow() {
  const [state, dispatch] = useReducer(interviewReducer, {
    active: false,
    stage: "identify_person",
  });

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
        
        dispatch({ type: 'UPDATE_STAGE', payload: { stage: "confirm" } });
        
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
        dispatch({
          type: 'ACTIVATE',
          payload: {
            stage: "clarify_outcome",
            personId: selectedPersonId,
            personName: selectedPersonName,
            intentAnalysis: analysis,
          }
        });
        
        // If analysis shows complete intent, skip interview
        if (analysis.type === "complete") {
          const summary = generateDispatchSummary({
            personName: selectedPersonName,
            outcome: analysis.outcomeMentioned || input,
            constraints: analysis.contextMentioned,
          });
          
          dispatch({ type: 'UPDATE_STAGE', payload: { stage: "confirm", outcome: input } });
          
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
      console.log('╔═══════════════════════════════════════╗');
      console.log('║  🚀 STARTING INTERVIEW (No Person)   ║');
      console.log('╚═══════════════════════════════════════╝');
      console.log('[useInterviewFlow] Analysis:', analysis);
      console.log('[useInterviewFlow] Next stage:', analysis.nextStage);
      console.log('[useInterviewFlow] About to dispatch ACTIVATE...');
      
      dispatch({
        type: 'ACTIVATE',
        payload: {
          stage: analysis.nextStage,
          intentAnalysis: analysis,
        }
      });
      
      console.log('[useInterviewFlow] ✓ dispatch(ACTIVATE) called!');
      
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
          dispatch({
            type: 'UPDATE_STAGE',
            payload: {
              stage: "clarify_outcome",
              personId: selectedPersonId,
              personName: selectedPersonName,
            }
          });
          
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
        dispatch({
          type: 'UPDATE_STAGE',
          payload: {
            stage: "extract_context",
            outcome: input,
          }
        });
        
        // Check if input has enough detail to skip context extraction
        if (input.length > 50 || input.split(" ").length > 8) {
          // Detailed outcome, go to confirmation
          const summary = generateDispatchSummary({
            personName: state.personName!,
            outcome: input,
          });
          
          dispatch({ type: 'UPDATE_STAGE', payload: { stage: "confirm" } });
          
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
        
        dispatch({
          type: 'UPDATE_STAGE',
          payload: {
            stage: "confirm",
            constraints,
          }
        });
        
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
    console.log('[useInterviewFlow] reset() called');
    dispatch({ type: 'RESET' });
  }, []);

  /**
   * Update person in interview state
   */
  const setPerson = useCallback((personId: number, personName: string) => {
    console.log('[useInterviewFlow] setPerson() called:', personId, personName);
    dispatch({ type: 'SET_PERSON', personId, personName });
  }, []);

  /**
   * Skip to specific stage (for power users)
   */
  const skipToStage = useCallback((stage: InterviewStage) => {
    console.log('[useInterviewFlow] skipToStage() called:', stage);
    dispatch({ type: 'UPDATE_STAGE', payload: { stage } });
  }, []);

  return {
    state,
    processInput,
    reset,
    setPerson,
    skipToStage,
  };
}
