/**
 * Intent Classification for Interview-First Copilot
 * Analyzes user prompts to determine intent level and guide interview flow
 */

export type IntentType = "complete" | "partial" | "exploratory";

export interface IntentAnalysis {
  type: IntentType;
  confidence: number;
  hasPerson: boolean;
  personMentioned?: string;
  hasOutcome: boolean;
  outcomeMentioned?: string;
  hasContext: boolean;
  contextMentioned?: string[];
  nextStage: "identify_person" | "clarify_outcome" | "extract_context" | "confirm";
}

/**
 * Classify user intent level for interview-first flow
 */
export function classifyIntent(prompt: string): IntentAnalysis {
  const lower = prompt.toLowerCase();
  
  // Detect person mentions
  const personPatterns = [
    /\b(help|find|connect|introduce)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/,
    /\bfor\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(needs?|wants?|looking)\b/,
  ];
  
  let personMentioned: string | undefined;
  let hasPerson = false;
  
  for (const pattern of personPatterns) {
    const match = prompt.match(pattern);
    if (match && match[1] && !["someone", "people", "person"].includes(match[1].toLowerCase())) {
      personMentioned = match[1] || match[2];
      hasPerson = true;
      break;
    }
  }
  
  // Vague person indicators
  const vaguePersonTerms = ["someone", "people", "person", "contact", "connection"];
  const hasVaguePerson = vaguePersonTerms.some(term => lower.includes(term));
  
  // Detect outcome mentions
  const outcomePatterns = [
    /(find|looking for|need|want|searching for)\s+(a|an|some)?\s*([a-z\s]+(?:job|role|investor|partner|customer|advisor|expert|consultant|opportunity|introduction|connection|meeting))/i,
    /(help\s+(?:them|him|her)\s+(?:find|get|connect|meet))\s+([a-z\s]+)/i,
    /(introduce|connect)\s+(?:them|him|her|someone)\s+to\s+([a-z\s]+)/i,
  ];
  
  let outcomeMentioned: string | undefined;
  let hasOutcome = false;
  
  for (const pattern of outcomePatterns) {
    const match = prompt.match(pattern);
    if (match && match[2]) {
      outcomeMentioned = match[2].trim();
      hasOutcome = true;
      break;
    } else if (match && match[3]) {
      outcomeMentioned = match[3].trim();
      hasOutcome = true;
      break;
    }
  }
  
  // Specific outcome indicators
  const specificOutcomes = [
    "job", "role", "position", "investor", "funding", "partner", "customer", 
    "expert", "consultant", "advisor", "introduction", "meeting", "collaboration"
  ];
  
  if (!hasOutcome) {
    for (const term of specificOutcomes) {
      if (lower.includes(term)) {
        hasOutcome = true;
        outcomeMentioned = term;
        break;
      }
    }
  }
  
  // Vague outcome indicators
  const vagueOutcomeTerms = [
    "something", "anything", "help", "support", "assist", "do something"
  ];
  const hasVagueOutcome = vagueOutcomeTerms.some(term => lower.includes(term));
  
  // Detect context/constraints
  const contextPatterns = [
    /(because|since|as|for)\s+([^.!?]+)/i,
    /(with|in|at|for|about)\s+([a-z\s]+(?:startup|company|industry|sector|field|area))/i,
    /(looking for|need|want|prefer)\s+([a-z\s]+(?:experience|background|skills|expertise))/i,
  ];
  
  const contextMentioned: string[] = [];
  let hasContext = false;
  
  for (const pattern of contextPatterns) {
    const match = prompt.match(pattern);
    if (match && match[2]) {
      contextMentioned.push(match[2].trim());
      hasContext = true;
    }
  }
  
  // Additional context indicators
  if (prompt.length > 100 || prompt.split(" ").length > 15) {
    hasContext = true;
  }
  
  // Classify intent type
  let type: IntentType;
  let confidence: number;
  let nextStage: IntentAnalysis["nextStage"];
  
  if (hasPerson && hasOutcome && hasContext) {
    // Complete intent: person + outcome + context
    type = "complete";
    confidence = 0.9;
    nextStage = "confirm";
  } else if (hasPerson && hasOutcome) {
    // Complete intent: person + outcome (context optional)
    type = "complete";
    confidence = 0.8;
    nextStage = "extract_context";
  } else if ((hasPerson || hasVaguePerson) && (hasVagueOutcome || !hasOutcome)) {
    // Partial intent: person but vague outcome
    type = "partial";
    confidence = 0.7;
    nextStage = "clarify_outcome";
  } else if (hasPerson && !hasOutcome) {
    // Partial intent: person but no outcome
    type = "partial";
    confidence = 0.75;
    nextStage = "clarify_outcome";
  } else if (!hasPerson && hasOutcome) {
    // Partial intent: outcome but no person
    type = "partial";
    confidence = 0.7;
    nextStage = "identify_person";
  } else {
    // Exploratory intent: vague or no specific ask
    type = "exploratory";
    confidence = 0.6;
    nextStage = "identify_person";
  }
  
  return {
    type,
    confidence,
    hasPerson,
    personMentioned,
    hasOutcome,
    outcomeMentioned,
    hasContext,
    contextMentioned: contextMentioned.length > 0 ? contextMentioned : undefined,
    nextStage,
  };
}

/**
 * Detect if user wants to skip interview ("just do it" pattern)
 */
export function detectSkipIntent(prompt: string): boolean {
  const skipPatterns = [
    /just\s+(do\s+it|go|execute|run|start)/i,
    /skip\s+(questions?|interview|this)/i,
    /go\s+ahead/i,
    /let'?s\s+go/i,
    /execute|dispatch|run\s+it/i,
  ];
  
  return skipPatterns.some(pattern => pattern.test(prompt));
}

/**
 * Generate next interview question based on stage
 */
export function getNextQuestion(
  stage: IntentAnalysis["nextStage"],
  context: {
    personName?: string;
    outcome?: string;
  }
): {
  question: string;
  examples?: string[];
  helpText?: string;
} {
  switch (stage) {
    case "identify_person":
      return {
        question: "Who would you like to help?",
        helpText: "I'll search your network and show you people you might want to help.",
        examples: [
          "Someone looking for a job",
          "A founder who needs introductions",
          "A friend exploring new opportunities",
        ],
      };
      
    case "clarify_outcome":
      return {
        question: context.personName
          ? `What specific outcome are you looking for with ${context.personName}?`
          : "What specific outcome are you looking for?",
        examples: [
          `Help them find a ${context.outcome || "job"} at a specific company`,
          "Connect them with potential investors",
          "Introduce them to industry experts",
          "Find partnership opportunities",
        ],
        helpText: "Think about what would be most valuable for them right now.",
      };
      
    case "extract_context":
      return {
        question: "Any specific constraints or preferences I should know about?",
        examples: [
          "Geographic location",
          "Industry or sector focus",
          "Company size or stage",
          "Specific skills or background",
        ],
        helpText: "This is optional but helps me find better matches.",
      };
      
    case "confirm":
      return {
        question: "Let me confirm what I understand...",
        helpText: "I'll show you a summary before dispatching.",
      };
  }
}

/**
 * Generate dispatch summary from collected context
 */
export function generateDispatchSummary(context: {
  personName: string;
  outcome: string;
  constraints?: string[];
}): string {
  let summary = `I'll leverage your network to help ${context.personName} ${context.outcome}.`;
  
  if (context.constraints && context.constraints.length > 0) {
    summary += `\n\nFocusing on: ${context.constraints.join(", ")}`;
  }
  
  summary += "\n\nThis will analyze your connections, identify the best matches, and suggest warm introduction paths.";
  
  return summary;
}
