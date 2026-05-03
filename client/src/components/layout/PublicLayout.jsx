import React from "react"
// import { Outlet } from "react-router-dom"
import PublicPagesHeader from "./PublicPagesHeader"
import PublicPagesFooter from "./PublicPagesFooter"
import FloatingScrollToTop from "../ui/FloatingScrollToTop"

export default function PublicLayout({children}) {
    return (
        <div className="flex flex-col min-h-screen  bg-background">
            <PublicPagesHeader />
            <main className="flex-grow">
                {children}
            </main>
            <PublicPagesFooter />
            <FloatingScrollToTop />
        </div>
    )
}
