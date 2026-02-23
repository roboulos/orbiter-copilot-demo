#!/usr/bin/env node
/**
 * Simple test script for interview flow logic
 * Run with: node test-interview-flow.js
 */

// Mock intent classifier
function classifyIntent(prompt) {
  const lower = prompt.toLowerCase();
  
  // Exploratory: vague or open-ended
  if (lower.includes("help someone") || lower.includes("explore") || lower === "help") {
    return {
      type: "exploratory",
      nextStage: "identify_person",
      personMentioned: null,
      outcomeMentioned: null,
      contextMentioned: null,
    };
  }
  
  // Partial: has some details but not all
  if (lower.includes("help") && (lower.includes("find") || lower.includes("connect"))) {
    return {
      type: "partial",
      nextStage: "identify_person",
      personMentioned: null,
      outcomeMentioned: "find job" || "connect with investors",
      contextMentioned: null,
    };
  }
  
  // Complete: very detailed
  if (lower.split(" ").length > 15) {
    return {
      type: "complete",
      nextStage: "confirm",
      personMentioned: "Mark",
      outcomeMentioned: "find investors",
      contextMentioned: ["Series A", "SF", "SaaS"],
    };
  }
  
  return {
    type: "partial",
    nextStage: "clarify_outcome",
    personMentioned: null,
    outcomeMentioned: null,
    contextMentioned: null,
  };
}

// Simulate interview state
let state = {
  active: false,
  stage: "identify_person",
  personId: undefined,
  personName: undefined,
  outcome: undefined,
  constraints: [],
};

function processInput(input, selectedPersonId, selectedPersonName) {
  console.log(`\n[INPUT] "${input}"`);
  console.log(`[STATE BEFORE] active=${state.active}, stage=${state.stage}, person=${state.personName}, outcome=${state.outcome}`);
  
  // Not active - start interview
  if (!state.active) {
    const analysis = classifyIntent(input);
    console.log(`[INTENT] type=${analysis.type}, nextStage=${analysis.nextStage}`);
    
    // Check if person already selected
    const hasPerson = selectedPersonId && selectedPersonName;
    
    if (hasPerson) {
      state = {
        ...state,
        active: true,
        stage: "clarify_outcome",
        personId: selectedPersonId,
        personName: selectedPersonName,
      };
      
      console.log(`[ACTION] show_question (clarify_outcome)`);
      return { type: "show_question", question: `What outcome for ${selectedPersonName}?` };
    }
    
    // No person - start from identify_person
    state = {
      ...state,
      active: true,
      stage: analysis.nextStage,
    };
    
    if (analysis.nextStage === "identify_person") {
      console.log(`[ACTION] show_person_picker`);
      return { type: "show_person_picker" };
    }
    
    console.log(`[ACTION] show_question (${analysis.nextStage})`);
    return { type: "show_question", question: "Question..." };
  }
  
  // Active interview - process based on stage
  switch (state.stage) {
    case "identify_person":
      if (selectedPersonId && selectedPersonName) {
        state = {
          ...state,
          stage: "clarify_outcome",
          personId: selectedPersonId,
          personName: selectedPersonName,
        };
        console.log(`[ACTION] show_question (clarify_outcome)`);
        return { type: "show_question", question: `What outcome for ${selectedPersonName}?` };
      }
      console.log(`[ACTION] show_person_picker (still waiting)`);
      return { type: "show_person_picker" };
      
    case "clarify_outcome":
      state = {
        ...state,
        stage: "extract_context",
        outcome: input,
      };
      
      // If detailed, skip to confirmation
      if (input.length > 50) {
        state.stage = "confirm";
        console.log(`[ACTION] show_confirmation (skipped context)`);
        return { type: "show_confirmation", summary: `Help ${state.personName} with: ${input}` };
      }
      
      console.log(`[ACTION] show_question (extract_context)`);
      return { type: "show_question", question: "Any constraints?" };
      
    case "extract_context":
      state = {
        ...state,
        stage: "confirm",
        constraints: input.trim() ? [input] : [],
      };
      console.log(`[ACTION] show_confirmation`);
      return { type: "show_confirmation", summary: `Help ${state.personName} with: ${state.outcome}. Constraints: ${input || "none"}` };
      
    case "confirm":
      console.log(`[ACTION] dispatch`);
      return { type: "dispatch" };
  }
  
  return { type: "show_question", question: "Unknown" };
}

console.log("=== INTERVIEW FLOW TEST ===\n");

// Test 1: Exploratory intent
console.log("\n--- TEST 1: Exploratory Intent ---");
processInput("help someone");
processInput("", 123, "Mark Pederson"); // User selects person
processInput("Find them investors");
processInput("Series A, SaaS focus");

// Reset
state = { active: false, stage: "identify_person" };

// Test 2: Skip flow
console.log("\n\n--- TEST 2: Skip Flow ---");
processInput("help someone");
processInput("", 456, "Josh"); // User selects person
processInput("just do it"); // Skip intent (would need to detect this)

// Reset
state = { active: false, stage: "identify_person" };

// Test 3: Complete intent
console.log("\n\n--- TEST 3: Complete Intent ---");
processInput("Help Mark Pederson find Series A investors in San Francisco who focus on SaaS companies and have experience with marketplace products and can provide warm intros");

console.log("\n\n=== TEST COMPLETE ===");
console.log("\nAll 3 flows executed successfully!");
console.log("Expected: Each flow shows proper stage transitions and actions");
console.log("Review output above to verify logic");
