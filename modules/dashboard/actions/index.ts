'use server'
import { db } from "@/lib/db"
import { currentUser } from "@/modules/auth/actions"
import { revalidatePath } from "next/cache"
import { CreateFromGithubParams, TemplateType } from "../types"



export const toggleStarMarked = async (playgroundId: string, isMarked: boolean) => {
    const user = await currentUser()
    const userId = user?.id!
    if (!userId) throw new Error('User id is missing')
    try {
        if (isMarked) {
            await db.starmark.upsert({
                where:{
                    userId_playgroundId:{
                        userId,
                        playgroundId
                    }
                },
                update:{},
                create:{
                    userId,
                    playgroundId,
                    isMarked: true
                }
            })
        } else {
            await db.starmark.delete({
                where: {
                    userId_playgroundId: {
                        userId,
                        playgroundId
                    }
                }
            })
        }
        revalidatePath('/dashboard')
        return { success: true, isMarked }
    } catch (error) {
        console.log(error)
        return { success: false, error }
    }
}

export const getAllPlaygroundForUser = async () => {
    const user = await currentUser()

    try {
        const playgrounds = await db.playground.findMany({
            where: {
                userId: user?.id
            },
            include: {
                user: true,
                Starmark: {
                    where: {
                        userId: user?.id
                    },
                }
            }
        })
        return playgrounds
    } catch (error) {
        console.log(error)
    }
}


export const createPlayground = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "ANGULAR" | "HONO" | "UNKNOWN";
    description?: string;
}) => {
    const user = await currentUser()

    const { template, title, description } = data

    try {
        const playground = await db.playground.create({
            data: {
                title,
                description,
                template,
                userId: user?.id!
            }
        })
        revalidatePath('/dashboard')
        return playground
    } catch (error) {
        console.log(error)
    }
}

export const deleteProjectById = async (id: string) => {
    try {
        await db.playground.delete({
            where: {
                id
            }
        })
        revalidatePath('/dashboard') // Revalidate the path to update the UI and remove the preloaded data on the client side
    } catch (error) {
        console.log(error)
    }
}


export const editProjectById = async (id: string, data: {
    title: string;
    description?: string;
}) => {
    try {
        await db.playground.update({
            where: {
                id
            },
            data: data
        })
        revalidatePath('/dashboard')
    } catch (error) {
        console.log(error)
    }
}

export const duplicateProjectById = async (id: string) => {
    try {
        const originalPlayground = await db.playground.findUnique({
            where: {
                id
            },
            include: {
                user: true,
                templateFiles: true
            }
        })
        if (!originalPlayground) {
            throw new Error('Original Playground not found')
        }

        const duplicatedPlayground = await db.playground.create({
            data: {
                title: `${originalPlayground.title} (Copy)`,
                description: originalPlayground.description,
                template: originalPlayground.template,
                userId: originalPlayground.userId,
                //TODO: fix template files duplication
                // templateFiles: originalPlayground.templateFiles
            }
        })

        revalidatePath('/dashboard')
        return duplicatedPlayground

    } catch (error) {
        console.log(error)
    }
}


export async function createPlaygroundFromGithub({
    title,
    description,
    templateData,
    framework,
}: CreateFromGithubParams) {

    try {
        const user = await currentUser();
        if (!user?.id) throw new Error("Unauthorized");

        // 1) Create Playground entry
        const playground = await db.playground.create({
            data: {
                title,
                description,
                template: framework,
                userId: user.id,
            },
        });
        console.log("created github playground", playground);

        // 2) Store template files JSON as a single TemplateFile entry
        const templateSave = await db.templateFile.create({
            data: {
                playgroundId: playground.id,
                content: JSON.stringify(templateData), // ← This is your entire repo/folder ready to load in editor
            },
        });
        console.log("created github template file", templateSave);

        return playground;
    } catch (error) {
        console.error("Error creating playground from GitHub:", error);
        throw error;
    }
}