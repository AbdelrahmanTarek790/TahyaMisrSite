"use client"

import * as React from "react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

import { Users, Newspaper, Calendar, Image, Settings, Bell, LogOut, Home, UserCircle, ChevronRight, Clock } from "lucide-react"
import { NavMain } from "../ui/nav-main"
// import { NavSecondary } from "../ui/nav-secondary"

import { useNavigate } from "react-router-dom"
// import { DirectionSwitcher } from "../DirectionSwitcher"
import { useAuth } from "@/context/AuthContext"

export function AppSidebar(props) {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Define navigation items
    const navItems = [
        { title: "لوحة التحكم", url: "/dashboard", icon: Home, role: ["student", "volunteer", "admin"] },
        { title: "الأخبار", url: "/dashboard/news", icon: Newspaper, role: ["student", "volunteer", "admin"] },
        { title: "الفعاليات", url: "/dashboard/events", icon: Calendar, role: ["student", "volunteer", "admin"] },
        { title: "الوسائط", url: "/media", icon: Image, role: ["student", "volunteer", "admin"] },
        { title: "إدارة الأخبار", url: "/admin/news", icon: Newspaper, role: ["admin"] },
        { title: "إدارة الفعاليات", url: "/admin/events", icon: Calendar, role: ["admin"] },
        { title: "الجدول الزمني", url: "/admin/timeline", icon: Clock, role: ["admin"] },
        { title: "المستخدمون", url: "/admin/users", icon: Users, role: ["admin"] },
        { title: "طلبات الانضمام", url: "/admin/join-requests", icon: Users, role: ["admin"] },
        { title: "المناصب", url: "/admin/positions", icon: Settings, role: ["admin"] },
        { title: "الإشعارات", url: "/admin/notifications", icon: Bell, role: ["admin"] },
        { title: "الإعدادات", url: "/settings", icon: UserCircle, role: ["student", "volunteer", "admin"] },
    ]

    // Filter navigation items based on user role and authentication status
    const filteredNavItems = navItems.filter((item) => {
        // Public items are always visible
        if (item.public) return true

        // If not authenticated, only show public items
        if (!isAuthenticated) return false

        // If item has role restrictions, check if user has required role
        if (item.role && user?.role) {
            return item.role.includes(user.role)
        }

        // No role restrictions but requires authentication
        return isAuthenticated
    })

    // const navSecondaryItems = [
    //     {
    //         title: "Settings",
    //         url: "/settings/profile",
    //         icon: Settings,
    //     },
    //     {
    //         title: "View Site",
    //         url: "/",
    //         icon: Eye,
    //     },
    // ]

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5  py-4">
                            <a href="/" className=" text-center  py-4">
                                <p className="text-2xl py-2 font-bold mx-auto">
                                    اتحاد شباب <span className="text-egypt-red">تحيا مصر</span>
                                </p>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {/* <SidebarMenuItem className="ml-auto">
                        <DirectionSwitcher />
                    </SidebarMenuItem> */}
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={filteredNavItems} />
                {/* <NavSecondary items={navSecondaryItems} className="mt-auto" /> */}
            </SidebarContent>
            <SidebarFooter>
                {/* If you want to add user info in the footer */}
                {isAuthenticated && user && (
                    <div className="p-3 border-t">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                        </div>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
