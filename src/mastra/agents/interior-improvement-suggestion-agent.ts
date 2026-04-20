import { Agent } from "@mastra/core";

export const interiorImprovementSuggestionAgent = new Agent({
  id: "interior-improvement-suggestion-agent",
  name: "Interior Improvement Suggestion Agent",
  instructions:
    "You are an expert interior designer. Analyze the interior image and provide concise, actionable improvement suggestions for aesthetics, functionality, lighting, and decor.",
  model: "openrouter/google/gemini-2.5-flash",
});
