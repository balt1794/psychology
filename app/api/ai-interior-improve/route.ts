import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminStorage } from "@/lib/firebaseAdmin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const imageUrl = body.imageUrl as string | undefined;
    const approvedChanges = (body.approvedChanges as string[] | undefined) ?? [];

    if (!imageUrl) {
      return NextResponse.json({ error: "No image URL provided" }, { status: 400 });
    }
    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!googleApiKey) {
      throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
    }

    const sourceImageResponse = await fetch(imageUrl);
    if (!sourceImageResponse.ok) {
      throw new Error(`Unable to fetch source image: ${sourceImageResponse.status}`);
    }
    const sourceImageBuffer = Buffer.from(await sourceImageResponse.arrayBuffer());
    const sourceImageMimeType = sourceImageResponse.headers.get("content-type") || "image/jpeg";
    const sourceImageBase64 = sourceImageBuffer.toString("base64");

    const editPrompt = `You are an expert interior design image editor.
Apply these approved changes while keeping the room photorealistic and coherent:
${approvedChanges.length ? approvedChanges.map((c) => `- ${c}`).join("\n") : "- Improve lighting and staging subtly"}

Keep structure/perspective realistic, preserve untouched areas, and output only the edited image.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: editPrompt },
                {
                  inline_data: {
                    mime_type: sourceImageMimeType,
                    data: sourceImageBase64,
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
      throw new Error(`Gemini image generation failed: ${errorText}`);
    }

    const geminiJson = await geminiResponse.json();
    const imagePart = geminiJson?.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData?.data || p.inline_data?.data,
    );
    const generatedBase64 =
      imagePart?.inlineData?.data || imagePart?.inline_data?.data;
    const generatedMimeType =
      imagePart?.inlineData?.mimeType || imagePart?.inline_data?.mime_type || "image/png";

    if (!generatedBase64) {
      throw new Error("Gemini did not return image data");
    }

    const extension = generatedMimeType.includes("jpeg") ? "jpg" : "png";
    const fileName = `${randomUUID()}.${extension}`;
    const storagePath = `ai-interior/generated/${fileName}`;
    const bucket = adminStorage.bucket();
    const file = bucket.file(storagePath);

    await file.save(Buffer.from(generatedBase64, "base64"), {
      metadata: { contentType: generatedMimeType },
    });
    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("AI interior improve error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
