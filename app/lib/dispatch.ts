/**
 * Dispatch utilities - keyword detection & beautified descriptions
 * Addresses Mark's requirements from Feb 23 conversation
 */

// Keyword patterns that indicate dispatch intent
const DISPATCH_KEYWORDS = [
  "show me",
  "let's do this",
  "let's do it",
  "execute",
  "go",
  "dispatch",
  "send it",
  "make it happen",
  "do it",
  "run it",
];

/**
 * Detect if user message indicates they want to dispatch
 */
export function detectDispatchIntent(message: string): boolean {
  const lower = message.toLowerCase().trim();
  return DISPATCH_KEYWORDS.some(keyword => lower.includes(keyword));
}

/**
 * Generate beautified LLM description for leverage loop dispatch
 * Format: "Leverage my network to help [Person] with [Goal] because..."
 */
export function generateDispatchDescription(data: {
  personName: string;
  personTitle?: string | null;
  personCompany?: string | null;
  goal: string;
  context?: string;
}): string {
  const { personName, personTitle, personCompany, goal, context } = data;

  // Build person description
  let personDesc = personName;
  if (personTitle && personCompany) {
    personDesc += ` (${personTitle} at ${personCompany})`;
  } else if (personTitle) {
    personDesc += ` (${personTitle})`;
  }

  // Build goal description
  const cleanGoal = goal.trim();

  // Build contextual reason if provided
  let reason = "";
  if (context) {
    reason = ` to ${context}`;
  }

  return `Leverage my network to help ${personDesc} ${cleanGoal}${reason}`;
}

/**
 * Extract dispatch data from conversation context
 */
export function extractDispatchContext(messages: Array<{ role: string; content: string }>) {
  // Find the most recent user goal/request
  const userMessages = messages.filter(m => m.role === "user");
  const lastUserMessage = userMessages[userMessages.length - 1]?.content || "";

  // Extract person and goal from conversation
  // This is a simplified extraction - in production would use LLM
  return {
    goal: lastUserMessage,
    extractedAt: Date.now(),
  };
}
