import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const openai = new OpenAIApi(configuration);

export type DescriptionMode = "simple" | "detailed";

export type PropertyDetailsPayload = {
  bedrooms?: string;
  bathrooms?: string;
  squareFeet?: string;
  lotSize?: string;
  yearBuilt?: string;
  propertyType?: string;
  parking?: string;
  hoa?: string;
  neighborhood?: string;
  cityOrArea?: string;
  additionalNotes?: string;
};

function buildFactsBlock(details: PropertyDetailsPayload | undefined): string {
  if (!details) return "";
  const lines: string[] = [];
  const add = (label: string, value: string | undefined) => {
    const v = value?.trim();
    if (v) lines.push(`- ${label}: ${v}`);
  };
  add("Bedrooms", details.bedrooms);
  add("Bathrooms", details.bathrooms);
  add("Square feet (living)", details.squareFeet);
  add("Lot size", details.lotSize);
  add("Year built", details.yearBuilt);
  add("Property type", details.propertyType);
  add("Parking", details.parking);
  add("HOA / fees", details.hoa);
  add("Neighborhood", details.neighborhood);
  add("City / area", details.cityOrArea);
  add("Other notes from host", details.additionalNotes);
  if (lines.length === 0) return "";
  return `Property facts provided by the user (use these exact figures where given; do not contradict them; you may infer tone from photos):\n${lines.join("\n")}\n`;
}

const AIRBNB_TITLE_MAX = 50;
const AIRBNB_DESCRIPTION_MAX = 500;

function buildInstructions(
  mode: DescriptionMode,
  factsBlock: string,
  airbnbListing: boolean
): string {
  const base =
    "You are an expert real estate listing copywriter. Write in clear, persuasive English suitable for MLS, Zillow, Airbnb, or brokerage sites. Do not refuse; describe what you see in the photos.";

  const sharedFormat = `
OUTPUT FORMAT (strict):
1) First line: the listing TITLE only—plain text, no Markdown, no "#" characters, no **bold**.
2) One blank line.
3) DESCRIPTION: flowing paragraphs of plain prose only (the main body). No other section headings, no bullet lists, no "Key facts" or "Features" blocks, no markdown at all in the body.
4) Weave any provided facts (beds, baths, sq ft, parking, neighborhood, etc.) into the description paragraphs when given; do not invent conflicting numbers.
5) No preamble ("Here is your listing") or sign-off.`;

  if (airbnbListing) {
    const airbnbLimits = `
HARD CHARACTER LIMITS (Airbnb-style short fields; count spaces and punctuation):
- The first line (plain title, no Markdown) must be between 0 and ${AIRBNB_TITLE_MAX} characters inclusive. Never exceed ${AIRBNB_TITLE_MAX}.
- The entire description body (everything after the blank line under the title) must be between 0 and ${AIRBNB_DESCRIPTION_MAX} characters inclusive. Never exceed ${AIRBNB_DESCRIPTION_MAX}. Stop mid-sentence if needed.`;

    if (mode === "simple") {
      return `${base}

MODE: SIMPLE (Airbnb listing limits ON)
After the plain-text title line, write a very short marketing description that fits within the ${AIRBNB_DESCRIPTION_MAX}-character body limit.
${sharedFormat}
${airbnbLimits}`;
    }

    return `${base}

MODE: DETAILED (Airbnb listing limits ON)
After the plain-text title line, write the best possible narrative within the ${AIRBNB_DESCRIPTION_MAX}-character body limit—dense, specific prose. No lists or extra headers.
${factsBlock ? `FACTS TO WEAVE INTO PROSE:\n${factsBlock}\n` : "No structured facts were provided; describe carefully from images and avoid inventing precise counts.\n"}
${sharedFormat}
${airbnbLimits}`;
  }

  if (mode === "simple") {
    return `${base}

MODE: SIMPLE
After the plain-text title line, write 2–3 short paragraphs of marketing description (warm, scannable). Keep it concise but do not worry about a specific character cap.
${sharedFormat}`;
  }

  return `${base}

MODE: DETAILED
After the plain-text title line, write a rich, professional narrative: several paragraphs covering layout, finishes, natural light, outdoor space, lifestyle, and notable details visible in the photos. No lists or extra headers—only title + body.

${factsBlock ? `FACTS TO WEAVE INTO PROSE:\n${factsBlock}\n` : "No structured facts were provided; describe carefully from images and avoid inventing precise counts.\n"}
${sharedFormat}`;
}

function buildSystemMessage(airbnbListing: boolean): string {
  const base =
    "You write accurate, compliant real estate marketing copy. Never include discriminatory language. If a fact is missing, do not invent it.";
  if (airbnbListing) {
    return `${base} Output must be exactly: one plain-text title line (title max ${AIRBNB_TITLE_MAX} chars, no Markdown), blank line, then body only (max ${AIRBNB_DESCRIPTION_MAX} chars total)—no bullet lists or extra sections.`;
  }
  return `${base} Output must be: one plain-text title line (no Markdown), blank line, then paragraph body only—no bullet lists or extra sections. There is no character limit unless the user asks for brevity in the prose itself.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const images: string[] = body.images;
    const mode: DescriptionMode = body.mode === "detailed" ? "detailed" : "simple";
    const propertyDetails: PropertyDetailsPayload | undefined = body.propertyDetails;
    const airbnbListing = Boolean(body.airbnbListing);

    if (!images || !Array.isArray(images) || images.length < 1) {
      return new Response("Invalid input: At least one image is required.", { status: 400 });
    }

    const factsBlock = mode === "detailed" ? buildFactsBlock(propertyDetails) : "";
    const instructions = buildInstructions(mode, factsBlock, airbnbListing);

    const imageParts = images.map((base64) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:image/jpeg;base64,${base64}`,
      },
    }));

    const messages = [
      {
        role: "system" as const,
        content: buildSystemMessage(airbnbListing),
      },
      {
        role: "user" as const,
        content: [
          {
            type: "text" as const,
            text: `${instructions}\n\nAnalyze all attached property photos together and write the listing now.`,
          },
          ...imageParts,
        ],
      },
    ];

    const maxTokens = airbnbListing
      ? mode === "detailed"
        ? 900
        : 600
      : mode === "detailed"
        ? 4096
        : 2048;

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      stream: true,
      max_tokens: maxTokens,
      messages,
    } as any);

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in analyze-description:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
