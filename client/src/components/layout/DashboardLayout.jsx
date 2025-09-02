import React, { useState } from "react"
// import { Sidebar } from "./Sidebar"
// import { Header } from "./Header"
import { useAuth } from "../../context/AuthContext"
import { Navigate } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "../ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Header } from "./Header"

export function DashboardLayout({ children }) {
    const { isAuthenticated, loading } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            }}
        >
            <AppSidebar variant="inset" />

            {/* Sidebar with fixed width */}
            {/* <div className={`h-full ${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden`}>
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            </div> */}

            {/* Main area */}
            <SidebarInset>
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
                            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
