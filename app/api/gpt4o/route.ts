import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Define the runtime
export const runtime = 'edge';

// Create configuration object with OpenAI API key
const configuration = new Configuration({
apiKey: process.env.OPENAI_API_KEY || "",
});

// Create an instance of OpenAIApi
const openai = new OpenAIApi(configuration);

// Define route handler for the POST request to /api/gpt4o
export async function POST(request: Request) {
try {
// Extract the image data and place description from the request body
const { images, placeDescription, numGuests, numBedrooms, numBeds, numBathrooms, contactInfo, optionalAddress } = await request.json();
//console.log(images)
// Check if the image data is valid
if (!images || !Array.isArray(images) || images.length < 2) {
return new Response("Invalid input: At least two images are required for comparison", { status: 400 });
}

const addressRaw =
  typeof optionalAddress === "string" ? optionalAddress.trim() : "";
const addressForPrompt = addressRaw
  ? addressRaw
  : "No full address was provided. Infer the most likely city/region from the photos (architecture, landscape, signage if any) and write plausible directions. If you truly cannot infer a location, write three concise generic arrival tips (e.g. parking, finding the entrance, public transit) that still help guests—do not leave this section blank.";

// One multimodal user message with all images avoids duplicated instructions and odd section gaps.
const instructionText = `Analyze the uploaded images and provide an entire Airbnb listing that includes:
1. Title: A title for the place (maximum 32 characters).
2. Description: A long description (maximum 500 characters).
3. Property Description: ${placeDescription}. Talk about the property as much as you can in a general way based on images. Like this property is located in one of the best spots in...etc (500 characters max)
4. House rules: House rules.
5. Image descriptions for each uploaded photo.(maximum 250 characters) Describe every single image.
6. Number of guests: ${numGuests}.
7. Number of bedrooms: ${numBedrooms}.
8. Number of beds: ${numBeds}.
9. Number of bathrooms: ${numBathrooms}.
10. Contact information: Generate a "Contact Information" section with the following information: ${contactInfo}. It needs to be like if you have any questions or need support, please contact us at this email or phone number or through the Airbnb chat or WhatsApp. We'll be there to assist you.
11. How to Get There: Start this section with the exact line "How to Get There:" on its own line, then on the next lines give 3 short arrival routes or tips (e.g. from airport, from downtown, by car) using this address/context: ${addressForPrompt}. Never leave this section empty—always include at least 3 bullet points or short paragraphs with real steps.
12. Sample cancellation policy.
13. A list of amenities based on the uploaded images. So if you see a router, say Wifi, if you see a kitchen, then say Kitchen, etc. Some common ones are Wifi, TV, Kitchen, Pool, Washer, Air conditioning.
14. Activities Nearby: A list of places and activities (minimum 4) and things to do nearby based on this address/context: ${addressForPrompt} with travel time in parentheses (e.g. "Central Park (15 min)").
Formatting rules:
- Plain text only: do NOT use Markdown—no # or ### headings, no **bold**, no bullet asterisks, no backticks.
- Use clear section headers exactly like: Title:, Description:, How to Get There:, etc. (each header at the start of a block).
- Put a blank line between each section and its body so sections are easy to parse.
Please format the response so that each section is clearly labeled and can be copied individually. Avoid saying anything like I'm unable to view or analyze images directly, but I can help you draft a sample Airbnb listing based on your descriptions and requirements or anything at the end just give the response.
Here are the images:`;

const messages = [
  {
    role: "user" as const,
    content: [
      { type: "text" as const, text: instructionText },
      ...images.map((imageUrl: string) => ({
        type: "image_url" as const,
        image_url: { url: imageUrl },
      })),
    ],
  },
];

const response = await openai.createChatCompletion({
model: "gpt-4o",
stream: true,
max_tokens: 8192,
messages,
} as any); // Use `as any` to handle the type mismatch

// Log the entire response for debugging
//console.log("OpenAI Response:", response);
// Create a streaming text response
const stream = OpenAIStream(response);
//console.log(stream)
return new StreamingTextResponse(stream);
} catch (error) {
// Handle any unexpected errors
console.error("Error in API logic:", error);
return new Response("Internal Server Error", { status: 500 });
}
}
