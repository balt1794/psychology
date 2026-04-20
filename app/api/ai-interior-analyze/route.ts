import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const imageUrl = body.imageUrl as string | undefined;
    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }
    const normalizedImageUrl = imageUrl.startsWith("/")
      ? `${request.nextUrl.origin}${imageUrl}`
      : imageUrl;
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!googleApiKey) {
      throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
    }

    const imageResponse = await fetch(normalizedImageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Unable to fetch image: ${imageResponse.status}`);
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    const imageMimeType = imageResponse.headers.get("content-type") || "image/jpeg";
    const imageBase64 = imageBuffer.toString("base64");

    const prompt = `You are an expert interior designer.
Analyze this room image and return 5 concise, actionable improvement suggestions.
Return plain JSON with this exact shape: {"suggestions":["...","..."]}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: imageMimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini analyze failed: ${errorText}`);
    }

    const geminiJson = await geminiResponse.json();
    const textOutput =
      geminiJson?.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text ?? "{}";
    const cleaned = textOutput.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned || "{}");
    const suggestions = Array.isArray(parsed.suggestions)
      ? parsed.suggestions
      : Array.isArray(parsed.changes)
        ? parsed.changes
        : [];
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI interior analyze error:", error);
    return NextResponse.json({
      suggestions: [
        "Use warmer layered lighting to improve room ambiance.",
        "Add a larger area rug to define the seating zone.",
        "Replace or re-style wall art for a cleaner focal point.",
        "Introduce plants for color and natural contrast.",
        "Declutter visible surfaces and simplify decor accents.",
      ],
    });
  }
}
