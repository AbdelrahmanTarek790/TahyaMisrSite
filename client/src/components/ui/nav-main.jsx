"use client"

import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

export function NavMain({ items }) {
    const active = `bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear`
    const location = useLocation()

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => {
                        // Check if current path starts with the item's URL (for nested routes)
                        const isActive = location.pathname === item.url || (item.url !== "/" && location.pathname.startsWith(item.url))

                        return (
                            <SidebarMenuItem key={item.title}>
                                <Link to={item.url} className="flex items-center gap-2 cursor-pointer">
                                    <SidebarMenuButton className={isActive ? active : ""} tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
