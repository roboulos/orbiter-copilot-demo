/**
 * Smart, context-aware interview question templates
 * Dynamic examples based on person, network, history
 */

export interface InterviewContext {
  personName?: string;
  personId?: number;
  personTitle?: string;
  personCompany?: string;
  outcome?: string;
  constraints?: string[];
  networkSize?: number;
  recentConversations?: Array<{ personName: string; topic: string }>;
}

export interface InterviewQuestion {
  question: string;
  stage: "identify_person" | "clarify_outcome" | "extract_context" | "confirm";
  examples: string[];
  helpText: string;
}

/**
 * Generate smart examples for clarify_outcome based on person context
 */
export function generateOutcomeExamples(context: InterviewContext): string[] {
  const { personTitle, personCompany, personName } = context;
  
  // Base examples (always relevant)
  const baseExamples = [
    "Find job opportunities",
    "Connect with investors",
    "Introduce to experts",
    "Find partnership opportunities",
  ];

  // Context-aware examples
  const smartExamples: string[] = [];

  if (personTitle?.toLowerCase().includes("founder") || personTitle?.toLowerCase().includes("ceo")) {
    smartExamples.push("Connect with potential investors");
    smartExamples.push("Find co-founder or CTO");
    smartExamples.push("Intro to advisors in their space");
  } else if (personTitle?.toLowerCase().includes("engineer") || personTitle?.toLowerCase().includes("developer")) {
    smartExamples.push("Help them find senior eng roles");
    smartExamples.push("Connect with open-source maintainers");
    smartExamples.push("Intro to hiring managers");
  } else if (personTitle?.toLowerCase().includes("designer")) {
    smartExamples.push("Connect with product teams hiring designers");
    smartExamples.push("Intro to design leaders");
    smartExamples.push("Find freelance opportunities");
  } else if (personTitle?.toLowerCase().includes("sales") || personTitle?.toLowerCase().includes("bd")) {
    smartExamples.push("Connect with potential clients");
    smartExamples.push("Intro to sales leaders");
    smartExamples.push("Find partnership opportunities");
  }

  // If we have smart examples, use them; otherwise use base
  return smartExamples.length >= 3 ? smartExamples.slice(0, 4) : baseExamples;
}

/**
 * Generate smart constraint examples based on outcome
 */
export function generateConstraintExamples(context: InterviewContext): string[] {
  const { outcome } = context;

  if (!outcome) {
    return [
      "Geographic location preference",
      "Industry or sector focus",
      "Company size or stage",
      "Remote vs on-site",
    ];
  }

  const lower = outcome.toLowerCase();

  if (lower.includes("job") || lower.includes("role") || lower.includes("position")) {
    return [
      "Only remote positions",
      "SF Bay Area only",
      "Series A-C startups",
      "Open to relocation",
    ];
  } else if (lower.includes("investor") || lower.includes("funding") || lower.includes("raise")) {
    return [
      "Seed stage ($500K-$2M)",
      "SF Bay Area investors only",
      "Looking for lead investor",
      "Open to angels or VCs",
    ];
  } else if (lower.includes("partnership") || lower.includes("collaborate")) {
    return [
      "B2B SaaS companies only",
      "Must have enterprise customers",
      "Geographic proximity preferred",
      "Looking for co-marketing",
    ];
  } else if (lower.includes("expert") || lower.includes("advisor") || lower.includes("mentor")) {
    return [
      "10+ years experience",
      "Has scaled to $10M+ ARR",
      "Available for monthly calls",
      "Technical background required",
    ];
  }

  // Default
  return [
    "Geographic location preference",
    "Industry or sector focus",
    "Company size or stage",
    "Specific expertise required",
  ];
}

/**
 * Generate dynamic question for identify_person stage
 */
export function getIdentifyPersonQuestion(context: InterviewContext): InterviewQuestion {
  const { networkSize } = context;

  let question = "Who would you like to help?";
  let helpText = "Search your network or browse recent contacts.";

  if (networkSize && networkSize > 1000) {
    helpText = `You have ${networkSize.toLocaleString()}+ connections. I'll help you find the right person.`;
  } else if (networkSize && networkSize > 100) {
    helpText = `Search across your ${networkSize} connections.`;
  }

  return {
    question,
    stage: "identify_person",
    examples: [], // No examples for person picker
    helpText,
  };
}

/**
 * Generate dynamic question for clarify_outcome stage
 */
export function getClarifyOutcomeQuestion(context: InterviewContext): InterviewQuestion {
  const { personName, personTitle } = context;

  let question = personName
    ? `What outcome are you looking for with ${personName}?`
    : "What outcome are you looking for?";

  let helpText = "Think about what would be most valuable for them right now.";

  if (personTitle) {
    helpText = `${personName} is a ${personTitle}. What would help them most?`;
  }

  return {
    question,
    stage: "clarify_outcome",
    examples: generateOutcomeExamples(context),
    helpText,
  };
}

/**
 * Generate dynamic question for extract_context stage
 */
export function getExtractContextQuestion(context: InterviewContext): InterviewQuestion {
  const { personName, outcome } = context;

  let question = "Any specific constraints or preferences?";

  if (outcome && personName) {
    question = `Any constraints for helping ${personName} ${outcome.toLowerCase()}?`;
  }

  const helpText = "This is optional but helps me find better matches.";

  return {
    question,
    stage: "extract_context",
    examples: generateConstraintExamples(context),
    helpText,
  };
}

/**
 * Generate confirmation summary
 */
export function getConfirmationQuestion(context: InterviewContext): InterviewQuestion {
  const { personName, outcome, constraints } = context;

  let question = "Ready to dispatch this request?";

  const summary = `I'll help ${personName || "them"} ${outcome || "achieve their goal"}`;
  const constraintText = constraints && constraints.length > 0
    ? ` with these constraints: ${constraints.join(", ")}`
    : "";

  return {
    question: `${summary}${constraintText}.`,
    stage: "confirm",
    examples: ["Yes, dispatch now", "Let me refine this", "Start over"],
    helpText: "I'll analyze your network and find the best connections.",
  };
}

/**
 * Main function: Get next interview question based on current context
 */
export function getNextInterviewQuestion(
  stage: "identify_person" | "clarify_outcome" | "extract_context" | "confirm",
  context: InterviewContext
): InterviewQuestion {
  switch (stage) {
    case "identify_person":
      return getIdentifyPersonQuestion(context);
    case "clarify_outcome":
      return getClarifyOutcomeQuestion(context);
    case "extract_context":
      return getExtractContextQuestion(context);
    case "confirm":
      return getConfirmationQuestion(context);
  }
}
