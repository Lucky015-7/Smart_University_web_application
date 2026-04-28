import { useEffect, useState } from "react"

type UserCacheValue = {
  name: string | null
  email: string | null
}

const userCache = new Map<string, UserCacheValue>()

export function useUserName(userId?: string | null) {
  const [state, setState] = useState<{
    name: string | null
    email: string | null
    loading: boolean
  }>(() => {
    if (!userId) return { name: null, email: null, loading: false }
    const cached = userCache.get(String(userId))
    return {
      name: cached?.name ?? null,
      email: cached?.email ?? null,
      loading: cached ? false : true,
    }
  })

  useEffect(() => {
    if (!userId) return

    const id = String(userId)
    const cached = userCache.get(id)
    if (cached) {
      setState({ name: cached.name, email: cached.email, loading: false })
      return
    }

    let mounted = true
    setState({ name: null, email: null, loading: true })

    ;(async () => {
      try {
        const res = await fetch(`/api/auth0/management/users/${encodeURIComponent(id)}`, {
          method: "GET",
          cache: "no-store",
        })

        if (!res.ok) {
          // store fallback as id only
          userCache.set(id, { name: id, email: null })
          if (mounted) setState({ name: id, email: null, loading: false })
          return
        }

        const data = await res.json()
        const displayName = (data && (data.name || data.nickname || data.email || data.user_id)) || id
        const email = (data && (data.email || null))

        userCache.set(id, { name: displayName, email })
        if (mounted) setState({ name: displayName, email, loading: false })
      } catch (error) {
        userCache.set(id, { name: id, email: null })
        if (mounted) setState({ name: id, email: null, loading: false })
      }
    })()

    return () => {
      mounted = false
    }
  }, [userId])

  return state
}
