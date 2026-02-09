import { scanTemplateDirectory } from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import { NextRequest } from "next/server";

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
        console.log("Scanning template path:", inputPath);
        
        // Directly scan the template directory without writing to file
        // This works in production environments where filesystem is read-only
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
                '.env.production'
            ],
            ignoreFolders: [
                'node_modules',
                '.git',
                '.vscode',
                '.idea',
                'dist',
                'build',
                'coverage',
                '.next'
            ],
            maxFileSize: 1024 * 1024 // 1MB
        });

        // Validate the JSON structure before returning
        if (!validateJsonStructure(result.items)) {
            return Response.json({ error: "Invalid JSON structure" }, { status: 500 });
        }

        return Response.json({ success: true, templateJson: result }, { status: 200 });
    } catch (error) {
        console.error("Error generating template JSON:", error);
        return Response.json({ 
            error: "Failed to generate template", 
            details: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
    }


}
