"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function RoleGuard({ children, allowedRoles }) {
    const router = useRouter()
    const { user, isLoading, isInitialized } = useAuth()

    useEffect(() => {
        if (isInitialized && !isLoading) {
            if (!user) {
                router.push("/login")
            } else if (!allowedRoles.includes(user.role)) {
                router.push("/dashboard")
            }
        }
    }, [user, isLoading, isInitialized, allowedRoles, router])

    if (!isInitialized || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null
    }

    return <>{children}</>
}