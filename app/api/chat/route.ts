import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}


interface ChatRequest {
    message: string;
    history: ChatMessage[]; //for context
}



async function generateAIResponse(messages: ChatMessage[]): Promise<string> {
    const systemPrompt = `You are a helpful AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice  
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. Use proper code formatting when showing examples.`;

    const fullMessages = [{ role: "system", content: systemPrompt }, ...messages];

    console.log("Full Messages:", fullMessages);

    const prompt = fullMessages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n\n");

    console.log("Prompt sent to AI:", prompt);

    try {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "codellama:latest",
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7, // Controls randomness (0-1)
                    max_tokens: 1000, // Maximum response length
                    top_p: 0.9, // controls diversity
                },
            }),
        });

        const data = await response.json();

        if (!data.response) {
            throw new Error("No response from AI model");
        }

        return data.response.trim();
    } catch (error) {
        console.error("AI generation error:", error);
        throw new Error("Failed to generate AI response");
    }


}

export async function POST(req: NextRequest) {
    try {
        const body: ChatRequest = await req.json();
        const { message, history = [] } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required and should be a string' },
                { status: 400 }
            )
        }

        //Validate history format

        const validHistory = Array.isArray(history) ?
            history.filter(msg =>
                msg &&
                typeof msg === 'object' &&
                typeof msg.role === 'string' &&
                typeof msg.content === 'string' &&
                ['user', 'assistant'].includes(msg.role)
            ) : [];


        //to avoid overloading the context, we will only keep the last 10 messages
        const recentHistory = validHistory.slice(-10)

        const messages: ChatMessage[] = [
            ...recentHistory,
            { role: 'user', content: message }
        ]

        //Generate AI response

        const aiResponse = await generateAIResponse(messages);

        //can save chat to db

        return NextResponse.json({
            response: aiResponse,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error("Chat API Error:", error);

        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

        return NextResponse.json(
            {
                error: "Failed to generate AI response",
                details: errorMessage,
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}