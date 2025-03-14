// pages/api/random-fact.ts

import { Configuration, OpenAIApi } from "openai-edge";
import { NextRequest, NextResponse } from "next/server";

// Define the runtime
export const runtime = 'edge';

// Create configuration object with OpenAI API key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Create an instance of OpenAIApi
const openai = new OpenAIApi(configuration);

// Define route handler for the POST request to /api/random-fact
export async function POST(request: NextRequest) {
  try {
    const { factType } = await request.json();

    // Construct the prompt for a random fact based on the fact type
    const prompt = `Give me 3 different instructions on how to get to ${factType}. Pick 3 popular points and give me detailed instructions from there`;

    // Construct the messages array for the OpenAI API
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      {
        role: "user",
        content: prompt,
      }
    ];

    // Call OpenAI to get a completion
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages,
      max_tokens: 4096,
    });

    // Parse the response
    const result = await response.json();
    const fact = result.choices[0].message.content.trim();

    // Return the fact as a JSON response
    return NextResponse.json({ fact });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in API logic:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
