import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Content, GenerateContentParameters } from "@google/genai";

interface ChatMessage {
  role: "user" | "model"; //in gemini, the assistant is called 'model'
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[]; //for context
  stream?: boolean; //whether to stream response
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const MODEL = "gemini-2.5-flash";

function convertToGeminiContent(messages: ChatMessage[]): Content[] {
  return messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));
}

const systemPrompt = `You are a helpful AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice  
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. Use proper code formatting when showing examples. Do not over explain keep it concise and to the point. If you don't know the answer, say you don't know instead of guessing. Only provide code snippets when asked or when it adds significant value to the answer. Always prioritize clarity and usefulness in your responses. Less tokens more value.`;

async function generateAIResponse(messages: ChatMessage[]): Promise<string> {
  const contents = convertToGeminiContent(messages);

  console.log("Contents sent to Gemini:", contents);

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    console.log("Response from AI", response.candidates?.[0]?.content?.parts);
    const fullText =
      response.candidates?.[0]?.content?.parts
        ?.filter((p) => typeof p.text === "string")
        ?.map((p) => p.text)
        ?.join("") || "";

    if (!fullText) {
      throw new Error("No response from AI");
    }

    return fullText.trim();
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error("Failed to generate AI response");
  }
}

async function streamAIResponse(
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const contents = convertToGeminiContent(messages);
  console.log("Contents sent to Gemini (stream):", contents);
  try {
    const responseStream = await ai.models.generateContentStream({
      model: MODEL,
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text;

            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }

          controller.close();
        } catch (error) {
          console.error("AI stream error:", error);
          controller.error(error);
        }
      }
    });

    return stream;
  } catch (error) {
    console.error("AI generation error:", error);
    throw new Error("Failed to start AI response stream from Gemini");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { message, history = [], stream } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and should be a string" },
        { status: 400 }
      );
    }

    //Validate history format

    const validHistory = Array.isArray(history)
      ? history.filter(
          (msg) =>
            msg &&
            typeof msg === "object" &&
            typeof msg.role === "string" &&
            typeof msg.content === "string" &&
            ["user", "model"].includes(msg.role)
        )
      : [];

    //to avoid overloading the context, we will only keep the last 10 messages
    const recentHistory = validHistory.slice(-10);

    const messages: ChatMessage[] = [
      ...recentHistory,
      { role: "user", content: message }
    ];

    //Generate AI response
    if (stream) {
      const aiStream = await streamAIResponse(messages);
      return new NextResponse(aiStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive"
        }
      });
    } else {
      const aiResponse = await generateAIResponse(messages);
      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Chat API Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
