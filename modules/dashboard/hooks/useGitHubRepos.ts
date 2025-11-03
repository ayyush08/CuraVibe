"use client"
import { useEffect, useRef, useState, useCallback } from "react"

const REPOS_PER_PAGE = 20

export const useGithubRepos = (token: string | null) => {
    const [repos, setRepos] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const observer = useRef<IntersectionObserver | null>(null)

    const lastRepoRef = useCallback(
        (node: HTMLButtonElement | null) => {
            if (loading) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prev => prev + 1)
                }
            })
            if (node) observer.current.observe(node)
        },
        [loading, hasMore]
    )

    useEffect(() => {
        if (!token) return
        const fetchRepos = async () => {
            setLoading(true)

            const res = await fetch(
                `https://api.github.com/user/repos?per_page=${REPOS_PER_PAGE}&page=${page}&sort=updated&direction=desc&type=owner`,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const data = await res.json()

            // stop when no more
            if (data.length < REPOS_PER_PAGE) setHasMore(false)

            // dedupe by repo id
            setRepos(prev => {
                const merged = [...prev, ...data]
                return Array.from(new Map(merged.map(r => [r.id, r])).values())
            })

            setLoading(false)
        }
        fetchRepos()
    }, [token, page])
    console.log("repos",repos);
    
    return { repos, loading, hasMore, lastRepoRef }
}
