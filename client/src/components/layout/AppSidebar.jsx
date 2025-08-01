"use client"

import * as React from "react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

import { Users, Newspaper, Calendar, Image, Settings, Bell, LogOut, Home, UserCircle, ChevronRight } from "lucide-react"
import { NavMain } from "../ui/nav-main"
// import { NavSecondary } from "../ui/nav-secondary"

import { useNavigate } from "react-router-dom"
// import { DirectionSwitcher } from "../DirectionSwitcher"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarImage } from "../ui/avatar"
import { API_BASE_URL } from "@/constants/api"

export function AppSidebar(props) {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Define navigation items
    const navItems = [
        { title: "Dashboard", url: "/dashboard", icon: Home, role: ["student", "volunteer", "admin"] },
        { title: "News", url: "/news", icon: Newspaper, role: ["student", "volunteer", "admin"] },
        { title: "Events", url: "/events", icon: Calendar, role: ["student", "volunteer", "admin"] },
        { title: "Media", url: "/media", icon: Image, role: ["student", "volunteer", "admin"] },
        { title: "Manage News", url: "/admin/news", icon: Newspaper, role: ["admin"] },
        { title: "Manage Events", url: "/admin/events", icon: Calendar, role: ["admin"] },
        { title: "Users", url: "/admin/users", icon: Users, role: ["admin"] },
        { title: "Positions", url: "/admin/positions", icon: Settings, role: ["admin"] },
        { title: "Notifications", url: "/admin/notifications", icon: Bell, role: ["admin"] },
        { title: "Settings", url: "/settings", icon: UserCircle, role: ["student", "volunteer", "admin"] },
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
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                            <a href="/">
                                <span className="text-base font-semibold">NewsPress</span>
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
                            <Avatar src={API_BASE_URL + "/uploads/" + user.profileImage} alt={user.name}>
                                <AvatarImage src={API_BASE_URL + "/uploads/" + user.profileImage} alt={user.name} />
                            </Avatar>
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
