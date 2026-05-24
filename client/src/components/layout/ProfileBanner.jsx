"use client"
import React, { useEffect, useState, useCallback } from "react"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import { mandatoryUpdatesAPI } from "@/app/api/api"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function ProfileBanner() {
    const { user } = useAuth()
    const router = useRouter()
    const [pendingUpdates, setPendingUpdates] = useState([])
    const [missingFields, setMissingFields] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchPendingUpdates = useCallback(async () => {
        try {
            setIsLoading(true)
            const response = await mandatoryUpdatesAPI.getMyPending()
            const data = response.data || {}
            setPendingUpdates(data.pendingUpdates || [])
            setMissingFields(data.missingFields || [])
        } catch (error) {
            console.error("Failed to fetch pending mandatory updates for banner:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (user) {
            fetchPendingUpdates()
        }
    }, [user, fetchPendingUpdates])

    if (isLoading || pendingUpdates.length > 0 || missingFields.length === 0) return null

    const firstField = missingFields[0]?.label || "مطلوب"

    return (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 sm:px-6 lg:px-8 w-full z-40">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 bg-amber-100 p-1.5 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-amber-900 truncate">
                            ملفك الشخصي غير مكتمل، يرجى استكمال بياناتك:{" "}
                            <span className="font-bold">{firstField}</span>
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/profile")}
                    className="flex-shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-1"
                >
                    تحديث الآن
                    <ArrowLeft className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
