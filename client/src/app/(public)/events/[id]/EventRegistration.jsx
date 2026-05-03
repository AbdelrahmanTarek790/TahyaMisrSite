"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { eventsAPI } from "@/app/api/api"
import GuestEventRegisterDialog from "@/components/dialogs/GuestEventRegisterDialog"

export default function EventRegistration({ eventId }) {
    const { user } = useAuth()
    const [isRegistering, setIsRegistering] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
    const [guestDialogOpen, setGuestDialogOpen] = useState(false)
    const [error, setError] = useState(null)

    const handleRegistration = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            setGuestDialogOpen(true)
            return
        }

        try {
            setIsRegistering(true)
            await eventsAPI.register(eventId)
            setIsRegistered(true)
        } catch (error) {
            console.error("Failed to register for event:", error)
            setError(error.error || "Failed to register for event")
        } finally {
            setIsRegistering(false)
        }
    }

    const submitGuestRegistration = async (payload, reset) => {
        try {
            setIsRegistering(true)
            await eventsAPI.guestRegister(eventId, payload)
            setIsRegistered(true)
            setGuestDialogOpen(false)
            reset?.()
        } catch (error) {
            console.error("Failed to guest-register for event:", error)
            setError(error.error || "تعذر التسجيل كضيف")
        } finally {
            setIsRegistering(false)
        }
    }

    return (
        <>
            <div className="mb-6">
                {isRegistered ? (
                    <Button disabled className="bg-green-600 text-white font-arabic">
                        ✓ أنت مسجل في هذه الفعالية
                    </Button>
                ) : (
                    <Button
                        onClick={handleRegistration}
                        disabled={isRegistering}
                        className="bg-egypt-red hover:bg-egypt-red/90 text-white font-arabic"
                    >
                        {isRegistering ? "جاري التسجيل..." : "سجل في الفعالية"}
                    </Button>
                )}
                {error && <p className="text-red-600 text-sm mt-2 font-arabic text-right">{error}</p>}
            </div>

            {/* Guest Register Dialog */}
            <GuestEventRegisterDialog
                open={guestDialogOpen}
                onOpenChange={setGuestDialogOpen}
                onSubmit={submitGuestRegistration}
                loading={isRegistering}
            />
        </>
    )
}
