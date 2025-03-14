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

// Define route handler for the POST request to /api/analyze-image
export async function POST(request: Request) {
try {
// Extract the image data from the request body
const { images } = await request.json();

// Check if the image data is valid
if (!images || !Array.isArray(images) || images.length < 2) {
return new Response("Invalid input: At least two images are required for comparison", { status: 400 });
}

// Make a request to OpenAI API for image analysis
const messages = images.map((base64Image, index) => {
// Decode the base64 image string
const imageUrl = `data:image/jpeg;base64,${base64Image}`;
return {
role: "user",
content: [
{
type: "text",
text: "Look at all the images uploaded and give me a title and description of the place for sale. E.g. Property with 2 bedrooms, and one bathroom. Tile countertop, etc etc.",
},
{
type: "image_url",
image_url: { url: imageUrl },
},
],
};
});


const response = await openai.createChatCompletion({
model: "gpt-4o",
stream: true,
max_tokens: 4096,
messages,
} as any); // Use `as any` to handle the type mismatch

// Create a streaming text response
const stream = OpenAIStream(response);

return new StreamingTextResponse(stream);
} catch (error) {
// Handle any unexpected errors
console.error("Error in API logic:", error);
return new Response("Internal Server Error", { status: 500 });
}
}