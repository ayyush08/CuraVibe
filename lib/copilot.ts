
import { CompletionCopilot } from "monacopilot";


const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

if(!MISTRAL_API_KEY){
    throw new Error("MISTRAL_API_KEY is not defined in environment variables");
}


export const copilot = new CompletionCopilot(MISTRAL_API_KEY, {
    provider: "mistral",
    model: "codestral",
});
