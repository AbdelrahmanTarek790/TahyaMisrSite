"use client"
import React, { lazy, Suspense } from "react"
import PublicPagesHeader from "./PublicPagesHeader"
import PublicPagesFooter from "./PublicPagesFooter"
import FloatingScrollToTop from "../ui/FloatingScrollToTop"
import ProfileBanner from "./ProfileBanner"
import { usePathname } from "next/navigation"

// Lazy load sections for better performance
const HonorRoll = lazy(() => import("../sections/HonorRoll"))
const Partners = lazy(() => import("../sections/Partners"))
const Privileges = lazy(() => import("../sections/Privileges"))

export default function PublicLayout({ children }) {
    const pathname = usePathname()

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <PublicPagesHeader />
            <ProfileBanner />
            <main className="flex-grow">
                {children}

                {/* Global sections at the bottom of public pages */}
                <Suspense fallback={<div className="h-20" />}>
                    {pathname !== "/" && !pathname.includes("/honor-roll") && <HonorRoll />}
                    {pathname !== "/" && !pathname.includes("/privileges") && <Privileges />}
                    {pathname !== "/" && !pathname.includes("/partners") && <Partners />}
                </Suspense>
            </main>
            <PublicPagesFooter />
            <FloatingScrollToTop />
        </div>
    )
}
