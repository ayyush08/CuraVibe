import { scanTemplateDirectory } from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

function validateJsonStructure(data: unknown): boolean {
    try {
        JSON.parse(JSON.stringify(data)); // Ensures it's serializable
        return true;
    } catch (error) {
        console.error("Invalid JSON structure:", error);
        return false;
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    if (!id) {
        return Response.json({ error: "Missing playground ID" }, { status: 400 });
    }

    const playground = await db.playground.findUnique({
        where: { id }
    })

    if (!playground) {
        return Response.json({ error: "Playground not found" }, { status: 404 });
    }

    const templateKey = playground.template as keyof typeof templatePaths;
    const templatePath = templatePaths[templateKey]

    if (!templatePath) {
        return Response.json({ error: "Invalid template" }, { status: 404 });
    }

    try {
        const inputPath = path.join(process.cwd(), templatePath);
        console.log("[Template API] Scanning template path:", inputPath);
        console.log("[Template API] Template key:", templateKey);
        
        // Directly scan the directory without writing to filesystem
        // This works in production (Vercel/serverless) where filesystem is read-only
        const result = await scanTemplateDirectory(inputPath, {
            ignoreFiles: [
                'package-lock.json',
                'yarn.lock',
                'pnpm-lock.yaml',
                '.DS_Store',
                'thumbs.db',
                '.gitignore',
                '.npmrc',
                '.yarnrc',
                '.env',
                '.env.local',
                '.env.development',
                '.env.production',
                '.env.test'
            ],
            ignoreFolders: [
                'node_modules',
                '.git',
                '.vscode',
                '.idea',
                'dist',
                'build',
                'coverage',
                '.next',
                'output'
            ],
            maxFileSize: 1024 * 1024 // 1MB max file size
        });

        console.log("[Template API] Successfully scanned template with", result.items.length, "items");

        // Validate the JSON structure before returning
        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid JSON structure" }, { status: 500 });
        }

        return Response.json({ success: true, templateJson: result }, { status: 200 });
    } catch (error) {
        console.error("[Template API] Error generating template JSON:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[Template API] Error details:", errorMessage);
        
        return Response.json({ 
            error: "Failed to generate template",
            details: errorMessage,
            templatePath: templatePath
        }, { status: 500 });
    }


}
