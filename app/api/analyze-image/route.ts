import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const openai = new OpenAIApi(configuration);

const HOUSE_RULES_SYSTEM = `You write guest-facing house rules, check-in instructions, and cancellation policy from property photos.

Output rules (follow every rule):
- Output ONLY these three sections, in this exact order, with these exact headings on their own lines (keep the colon):
  House Rules:
  Instructions to Check In:
  Standard Cancellation:
- Under each heading, use bullet lines only. Each bullet must start with "- " (hyphen then space).
- Do not add any other sections or blocks: no title, no listing description, no room-by-room photo inventory, no amenities list, no "How to Get There", no activities, no contact section.
- No greetings, apologies, disclaimers, or sign-offs.
- No Markdown: no # or ###, no ** or __, no backticks—plain text only.
- Base rules on what the photos suggest (pool, stairs, balcony, appliances, pets, smoking areas, parking, etc.). Where photos are silent, use sensible short-term-rental defaults.
- Tone: clear, professional, and friendly. Keep bullets concise.
- If all images are clearly the same one listing, output one set of three sections. If images clearly show two unrelated properties, output two full sets separated by a single line containing only "---" between them.`;

const LEGACY_LISTING_USER_TEXT =
  "Look at all the images uploaded and give me a title and description of the place, house rules, instructions to check in, standard cancellation, and also give me a good description of the images in a listing form so if there are chairs say 4 chairs, etc: Give it to me with bullet points. If there are two different images of 2 different houses give me a title and description of the place for each one, house rules, instructions to check in, standard cancellation, and also give me a good description of each image in a listing form. If the images have are related to each other, so if it's a house and the other images are spaces within the house, then give me one listing, but if it's two images with two different house, then give me two listings. Don't ever tell users, you can't give them a response or don't tell them that the uploaded images are two different images, just give me a the listings. You always create listings for multiple images.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, mode } = body as { images: string[]; mode?: string };

    if (!images || !Array.isArray(images) || images.length < 2) {
      return new Response("Invalid input: At least two images are required", { status: 400 });
    }

    const houseRulesOnly = mode === "house_rules";

    if (houseRulesOnly) {
      const userContent: Array<
        { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }
      > = [
        {
          type: "text",
          text: "Using these photos, write the three sections now. Start directly with the line: House Rules:",
        },
        ...images.map((base64Image: string) => ({
          type: "image_url" as const,
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        })),
      ];

      const messages = [
        { role: "system" as const, content: HOUSE_RULES_SYSTEM },
        { role: "user" as const, content: userContent },
      ];

      const response = await openai.createChatCompletion({
        model: "gpt-4o",
        stream: true,
        max_tokens: 4096,
        temperature: 0.25,
        messages,
      } as any);

      const stream = OpenAIStream(response);
      return new StreamingTextResponse(stream);
    }

    const legacyMessages = images.map((base64Image: string) => {
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      return {
        role: "user" as const,
        content: [
          { type: "text" as const, text: LEGACY_LISTING_USER_TEXT },
          { type: "image_url" as const, image_url: { url: imageUrl } },
        ],
      };
    });

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      stream: true,
      max_tokens: 4096,
      messages: legacyMessages,
    } as any);

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in analyze-image:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
