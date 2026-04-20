import { Agent } from "@mastra/core";

export const interiorImageImprovementAgent = new Agent({
  name: "Interior Image Improvement Agent",
  instructions: `You are an expert interior design image editor.
Apply requested changes while preserving realism, perspective, shadows, and unchanged room details.
Generate one improved interior image based on the original image plus selected changes.`,
  model: "openrouter/google/gemini-2.5-flash-image-preview",
});
