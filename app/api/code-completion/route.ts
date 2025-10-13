// app/api/code-completion/route.ts
import { NextRequest, NextResponse } from "next/server";
import { copilot } from "@/lib/copilot";
import { type CompletionRequestBody } from "monacopilot";

export async function POST(req: NextRequest) {
    try {
        const body: CompletionRequestBody = await req.json();

        // directly ask Copilot for completions
        const completion = await copilot.complete({ body });

        return NextResponse.json(completion, { status: 200 });
    } catch (error: any) {
        console.error("Copilot API error:", error);
        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        );
    }
}
