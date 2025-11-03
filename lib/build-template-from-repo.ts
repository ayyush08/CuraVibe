import JSZip from "jszip"
import { TemplateFolder } from "@/modules/playground/lib/path-to-json"

/**
 * Parse a GitHub repo zipball into TemplateFolder
 */
export async function fetchRepoAsTemplate(
    owner: string,
    repo: string,
    branch: string,
    token: string,
    folderPath?: string,
): Promise<TemplateFolder> {
    // 1️⃣ Fetch ZIP archive
    const zipRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`, {
        headers: { Authorization: `Bearer ${token}` },
    })

    console.log("zipres",zipRes);
    

    if (!zipRes.ok) throw new Error(`Failed to fetch repo zip: ${zipRes.status}`)
    const blob = await zipRes.arrayBuffer()

    // 2️⃣ Load ZIP in memory
    const zip = await JSZip.loadAsync(blob)

    // The first directory in the ZIP is usually {repo}-{sha}/
    const rootPrefix = Object.keys(zip.files)[0]?.split("/")[0]

    // 3️⃣ Optionally focus on subfolder
    const basePath = folderPath ? `${rootPrefix}/${folderPath}/` : `${rootPrefix}/`

    // 4️⃣ Build TemplateFolder recursively
    function buildStructure(currentPath: string): TemplateFolder {
        const folderName = currentPath.split("/").filter(Boolean).pop() || "root"
        const folder: TemplateFolder = { folderName, items: [] }

        // Group files directly under current path
        const fileKeys = Object.keys(zip.files).filter((k) => {
            if (!k.startsWith(currentPath)) return false
            const relative = k.replace(currentPath, "")
            return relative && !relative.includes("/") && !zip.files[k].dir
        })

        for (const key of fileKeys) {
            const filenameFull = key.split("/").pop()!
            const [filename, ...extParts] = filenameFull.split(".")
            const fileExtension = extParts.join(".")
            folder.items.push({
                filename,
                fileExtension,
                content: "", // will fill later
            })
        }

        // Subfolders
        const subfolders = new Set<string>()
        for (const k of Object.keys(zip.files)) {
            if (k.startsWith(currentPath)) {
                const relative = k.replace(currentPath, "")
                const parts = relative.split("/")
                if (parts.length > 1 && parts[0]) {
                    subfolders.add(parts[0])
                }
            }
        }

        for (const sub of subfolders) {
            const subPath = `${currentPath}${sub}/`
            folder.items.push(buildStructure(subPath))
        }

        return folder
    }

    const template = buildStructure(basePath)

    // 5️⃣ Fill file contents (parallelized)
    const contentPromises: Promise<void>[] = []

    async function fillContent(folder: TemplateFolder, currentPath: string) {
        for (const item of folder.items) {
            if ("filename" in item) {
                const fullPath = `${currentPath}${item.filename}${item.fileExtension ? "." + item.fileExtension : ""}`
                const file = zip.file(fullPath)
                if (file) {
                    contentPromises.push(
                        file.async("text").then((txt) => {
                            item.content = txt
                        }),
                    )
                }
            } else {
                const nextPath = `${currentPath}${item.folderName}/`
                await fillContent(item, nextPath)
            }
        }
    }

    await fillContent(template, basePath)
    await Promise.all(contentPromises)

    return template
}
