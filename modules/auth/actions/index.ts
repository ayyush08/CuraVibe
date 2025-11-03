'use server'
//server actions
import { auth } from '@/auth'
import { db } from '@/lib/db'


export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
            include:{
                accounts: true,
                
            }
        })
        
        return user
    } catch (error) {
        console.error(error)
        return null
    }
}

export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where:{
                userId
            }
        })
        return account
    } catch (error) {
        console.error(error)
        return null
    }
}

export const currentUser = async () => {
    const user = await auth()
    return user?.user;
}

export const getGithubAccessTokenByUserId = async (userId: string) => {
    try {
        const account =  await db.account.findFirst({
            where:{
                userId,
                provider: 'github'
            }
        })
        console.log(account);
        if(account?.provider !== 'github') return null
        
        return account?.accessToken ?? null
    } catch (error) {
        console.error(error)
        return null
    }
}