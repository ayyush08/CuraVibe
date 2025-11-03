export const runtime = "nodejs"


import { NextResponse } from "next/server"
import { fetchRepoAsTemplate } from "@/lib/build-template-from-repo"


export async function POST(req: Request) {
    const { owner, repo, branch, token, folderPath } = await req.json()

    try {
        const template = await fetchRepoAsTemplate(owner, repo, branch, token, folderPath)
        return NextResponse.json(template)
    } catch (err: any) {
        console.error("GitHub fetch error:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
