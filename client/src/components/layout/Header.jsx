import React, { useState } from "react"
import { Bell, Menu, Search, User, Plus, FileText, Calendar, Image } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"

import { useNavigate } from "react-router-dom"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SidebarTrigger } from "../ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import CreateNewsSheet from "../forms/CreateNewsSheet"
import CreateEventSheet from "../forms/CreateEventSheet"
import CreateMediaSheet from "../forms/CreateMediaSheet"

export function Header({ sidebarOpen, setSidebarOpen }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [newsSheetOpen, setNewsSheetOpen] = useState(false)
    const [eventSheetOpen, setEventSheetOpen] = useState(false)
    const [mediaSheetOpen, setMediaSheetOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    return (
        <header className="sticky top-0 z-30 rounded-t-xl flex items-center justify-between h-16 px-4 border-b border-border bg-background">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1" />
            </div>

            <div className="flex items-center gap-2">
                {/* Quick Create Dropdown - Only for admin users */}
                {user?.role === 'admin' && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Plus size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setNewsSheetOpen(true)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Create News
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEventSheetOpen(true)}>
                                <Calendar className="mr-2 h-4 w-4" />
                                Create Event
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setMediaSheetOpen(true)}>
                                <Image className="mr-2 h-4 w-4" />
                                Upload Media
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-1">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.photo} alt={user?.name || "User"} />
                                    <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                                    </p>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Creation Sheets */}
            <CreateNewsSheet 
                isOpen={newsSheetOpen} 
                onClose={() => setNewsSheetOpen(false)} 
            />
            <CreateEventSheet 
                isOpen={eventSheetOpen} 
                onClose={() => setEventSheetOpen(false)} 
            />
            <CreateMediaSheet 
                isOpen={mediaSheetOpen} 
                onClose={() => setMediaSheetOpen(false)} 
            />
        </header>
    )
}
