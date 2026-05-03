'use client'
import PublicLayout from "@/components/layout/PublicLayout"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

const AuthLayout = ({ children }) => {
    const router = useRouter()
    const { user, loading } = useAuth()

     useEffect(() => {
        if (!loading && user) {
            router.push("/")
        }
        }, [user, loading, router])
    return (
        <div>
            <PublicLayout>{children}</PublicLayout>
        </div>
    )
}

export default AuthLayout
