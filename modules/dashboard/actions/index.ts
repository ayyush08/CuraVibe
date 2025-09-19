'use server'
import { db } from "@/lib/db"
import { currentUser } from "@/modules/auth/actions"
import { revalidatePath } from "next/cache"



export const toggleStarMarked = async (playgroundId: string, isMarked: boolean) => {
    const user = await currentUser()
    const userId = user?.id!
    if(!userId)  throw new Error('User id is missing')
    try {
        if(isMarked){
            await db.starmark.create({
                data:{
                    userId,
                    playgroundId,
                    isMarked
                }
            })
        }else{
            await db.starmark.delete({
                where:{
                    userId_playgroundId:{
                        userId,
                        playgroundId
                    }
                }
            })
        }
        revalidatePath('/dashboard')
        return { success: true, isMarked  }
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
                Starmark:{
                    where: {
                        userId: user?.id
                    },
                    select:{
                        isMarked: true
                    }
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
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "ANGULAR" | "HONO";
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
            //TODO: Add template files
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

                //TODO: Add template files
            }
        })

        revalidatePath('/dashboard')
        return duplicatedPlayground

    } catch (error) {
        console.log(error)
    }
}