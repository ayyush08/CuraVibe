"use client"
import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { getGithubAccessTokenByUserId } from "@/modules/auth/actions"

export const useGithubAuth = () => {
    const { data: session, status } = useSession()
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchToken = async () => {
            if (!session?.user?.id) return
            setLoading(true)
            const t = await getGithubAccessTokenByUserId(session.user.id)
            if (t) setToken(t)
            setLoading(false)
        }
        fetchToken()
    }, [session?.user?.id, status])

    const connectGithub = async () => {
        setLoading(true)
        const res = await signIn("github", { redirect: false })
        if (res?.url) window.location.href = res.url
        setLoading(false)
    }

    return { token, loading, connectGithub }
}
