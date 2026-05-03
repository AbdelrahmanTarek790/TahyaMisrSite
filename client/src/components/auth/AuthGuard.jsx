"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function AuthGuard({ children }) {
    const router = useRouter()
    const { user, isLoading, isInitialized } = useAuth()

    useEffect(() => {
        if (isInitialized && !isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, isInitialized, router])

    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return <>{children}</>
}