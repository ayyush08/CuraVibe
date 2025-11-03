"use client"

import { useState } from "react"
import { toast } from "sonner"
import { TemplateFolder } from "@/modules/playground/lib/path-to-json"

// --- helper to detect framework ---
function detectFrameworkFromPackageJson(pkgContent: string):
    "NEXTJS" | "REACT" | "EXPRESS" | "VUE" | "ANGULAR" | "HONO" | "UNKNOWN" {
    try {
        const pkg = JSON.parse(pkgContent)
        const deps = { ...pkg.dependencies, ...pkg.devDependencies }
        console.log(deps);

        if (deps.next) return "NEXTJS"
        if (deps.react && !deps.next) return "REACT"
        if (deps.express) return "EXPRESS"
        if (deps.vue) return "VUE"
        if (deps["@angular/core"]) return "ANGULAR"
        if (deps.hono) return "HONO"
        return "UNKNOWN"
    } catch {
        return "UNKNOWN"
    }
}

export function useRepoFolders(githubAccessToken: string | null) {
    const [repoFolders, setRepoFolders] = useState<any[]>([])
    const [templateData, setTemplateData] = useState<TemplateFolder | null>(null)
    const [framework, setFramework] = useState<
        "NEXTJS" | "REACT" | "EXPRESS" | "VUE" | "ANGULAR" | "HONO" | "UNKNOWN"
    >("UNKNOWN")
    const [loadingFolders, setLoadingFolders] = useState(false)

    const checkPackageJson = async (owner: string, repo: string, path = "", branch = "main") => {
        try {
            const encodedPath = path ? `${encodeURIComponent(path)}/package.json` : "package.json"
            const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${branch}`
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${githubAccessToken}` },
            })
            console.log(res);

            if (!res.ok) return false

            // return package.json content if exists
            const json = await res.json()
            if (json?.download_url) {
                const pkgRes = await fetch(json.download_url)
                const pkgContent = await pkgRes.text()
                return pkgContent
            }
            return false
        } catch {
            return false
        }
    }

    const handleSelectFolder = async (folder: any, repo: any) => {
        try {
            setLoadingFolders(true)
            const res = await fetch("/api/get-repo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    owner: repo.owner.login,
                    repo: repo.name,
                    branch: repo.default_branch,
                    token: githubAccessToken,
                    folderPath: folder.path,
                }),
            })
            if (!res.ok) throw new Error("Failed to fetch repo template")
            const template = await res.json()

            // --- detect framework ---
            const pkgContent = await checkPackageJson(repo.owner.login, repo.name, folder.path, repo.default_branch)
            if (pkgContent && typeof pkgContent === "string") {
                console.log("package.json content", pkgContent);

                const detected = detectFrameworkFromPackageJson(pkgContent)
                setFramework(detected)
                console.log("Detected Framework:", detected)
            }

            setTemplateData(template)
            console.log("Saving template to DB:", template)
        } catch (err) {
            console.error(err)
            toast.error("Error fetching folder contents.")
        } finally {
            setLoadingFolders(false)
        }
    }

    const handleSelectRepo = async (repo: any) => {
        setRepoFolders([])
        setTemplateData(null)
        setFramework("UNKNOWN")
        setLoadingFolders(true)
        try {
            const rootPkg = await checkPackageJson(repo.owner.login, repo.name)
            const rootHasPackageJson = !!rootPkg
            const res = await fetch(
                `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents?ref=${repo.default_branch}`,
                { headers: { Authorization: `Bearer ${githubAccessToken}` } }
            )
            const data = await res.json()
            const folders = data.filter((item: any) => item.type === "dir")
            const checked = await Promise.all(
                folders.map(async (f: any) => ({
                    ...f,
                    hasPackageJson: !!(await checkPackageJson(repo.owner.login, repo.name, f.path)),
                }))
            )
            if (rootHasPackageJson)
                checked.unshift({ name: "root", path: "", type: "dir", hasPackageJson: true })
            setRepoFolders(checked)
            if (checked.filter(f => f.hasPackageJson).length === 1) {
                await handleSelectFolder(checked.find(f => f.hasPackageJson), repo)
            }
        } catch (err) {
            console.error(err)
            toast.error("Error fetching repo details.")
        } finally {
            setLoadingFolders(false)
        }
    }

    return { repoFolders, templateData, framework, loadingFolders, handleSelectRepo, handleSelectFolder,setTemplateData }
}
