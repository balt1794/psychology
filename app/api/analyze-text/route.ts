import { Configuration, OpenAIApi } from "openai-edge";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const openai = new OpenAIApi(configuration);

const DIRECTIONS_SYSTEM = `You are a directions-only engine.

Output rules (must follow all):
- Output ONLY directions. No greetings ("Sure", "I'll", "Here are"), no disclaimers about traffic, construction, checking apps, transit schedules, or "might vary".
- No closing lines: no "Safe travels", "Hope this helps", "These directions should", "Let me know", or similar.
- No Markdown: no # headings, no ** or __ bold, no * bullets, no backticks—plain text only.
- Structure (use plain text exactly in this pattern):
  From [Starting point 1]:
  1. First step...
  2. Next step...

  From [Starting point 2]:
  1. ...
  2. ...

  From [Starting point 3]:
  1. ...
  2. ...
- Choose 3 real, popular starting points near the destination (e.g. major station, airport, landmark/downtown).
- Number steps with "1. " "2. " format. Keep steps concise but specific (street names, turns, landmarks).`;

function sanitizeDirectionsOutput(raw: string): string {
  let s = raw.trim();
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*\n]+)\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/`([^`]+)`/g, "$1");
  s = s.replace(/^#{1,6}\s+/gm, "");
  s = s.replace(/^[\t ]*[-*+]\s+/gm, "");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { factType, text } = body as { factType?: string; text?: string };

    const textIn = typeof text === "string" ? text.trim() : "";
    if (textIn) {
      const messages = [
        {
          role: "system" as const,
          content:
            "You help with real estate listing and guest-host content. Follow the user's request. Use plain text unless they explicitly ask for another format. No unnecessary preamble or sign-off.",
        },
        { role: "user" as const, content: textIn },
      ];

      const response = await openai.createChatCompletion({
        model: "gpt-4o",
        messages,
        max_tokens: 2048,
        temperature: 0.4,
      });

      const result = await response.json();
      const content = result.choices?.[0]?.message?.content?.trim() ?? "";
      return NextResponse.json({ response: content });
    }

    const destination = typeof factType === "string" ? factType.trim() : "";
    if (!destination) {
      return NextResponse.json(
        { error: "Send a destination in `factType` or a prompt in `text`." },
        { status: 400 }
      );
    }

    const messages = [
      { role: "system" as const, content: DIRECTIONS_SYSTEM },
      {
        role: "user" as const,
        content: `Destination: ${destination}\n\nWrite the three "From ..." route blocks with numbered steps only. Nothing before the first "From" line. Nothing after the last step.`,
      },
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages,
      max_tokens: 4096,
      temperature: 0.2,
    });

    const result = await response.json();
    let fact = result.choices?.[0]?.message?.content?.trim() ?? "";
    fact = sanitizeDirectionsOutput(fact);

    return NextResponse.json({ fact });
  } catch (error) {
    console.error("Error in analyze-text:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
