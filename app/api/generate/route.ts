// import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { streamText } from "ai";

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export async function POST(req: Request) {
//   const { prompt } = await req.json();
//   try {
//     const result = await streamText({
//       model: google("gemini-2.0-flash-exp"),
//       prompt,
//     });
//     return result.toTextStreamResponse();
//   } catch (error) {
//     console.error("Error generating text:", error);
//     // @ts-ignore
//     return new Response(`Error generating text: ${error.message || error}`, {
//       status: 500,
//     });
//   }
// }
