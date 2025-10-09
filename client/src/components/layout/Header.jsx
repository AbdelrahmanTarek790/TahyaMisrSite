import React, { useState, useEffect } from "react"
import { Bell, Menu, Search, User, Plus, FileText, Calendar, Image, Check, X } from "lucide-react"
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
import LanguageToggle from "../ui/LanguageToggle"
// import LanguageToggle from "../LanguageToggle"

export function Header({ sidebarOpen, setSidebarOpen }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [newsSheetOpen, setNewsSheetOpen] = useState(false)
    const [eventSheetOpen, setEventSheetOpen] = useState(false)
    const [mediaSheetOpen, setMediaSheetOpen] = useState(false)
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Event: Annual Meeting",
            message: "The annual meeting has been scheduled for next week",
            type: "event",
            read: false,
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        },
        {
            id: 2,
            title: "System Maintenance",
            message: "Scheduled maintenance will occur this weekend",
            type: "system",
            read: false,
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        },
        {
            id: 3,
            title: "Welcome to Tahya Misr!",
            message: "Thank you for joining our platform",
            type: "general",
            read: true,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
    ])

    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    const markAsRead = (notificationId) => {
        setNotifications((prev) => prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)))
    }

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    }

    const removeNotification = (notificationId) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
    }

    const unreadCount = notifications.filter((n) => !n.read).length

    const getNotificationIcon = (type) => {
        switch (type) {
            case "event":
                return <Calendar className="h-4 w-4 text-blue-500" />
            case "system":
                return <Bell className="h-4 w-4 text-orange-500" />
            default:
                return <FileText className="h-4 w-4 text-gray-500" />
        }
    }

    const formatTimestamp = (timestamp) => {
        const now = new Date()
        const diff = now - timestamp
        const minutes = Math.floor(diff / (1000 * 60))
        const hours = Math.floor(diff / (1000 * 60 * 60))

        if (minutes < 1) return "Just now"
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        return timestamp.toLocaleDateString()
    }

    return (
        <header className="sticky top-0 z-30 rounded-t-xl flex items-center justify-between h-16 px-4 border-b border-border bg-background">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1" />
            </div>

            <div className="flex items-center gap-2">
                {/* Quick Create Dropdown - Only for admin users */}
                {user?.role === "admin" && (
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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <div className="flex items-center justify-between p-2">
                            <DropdownMenuLabel className="m-0">Notifications</DropdownMenuLabel>
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-6 px-2">
                                    Mark all read
                                </Button>
                            )}
                        </div>
                        <DropdownMenuSeparator />
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                                            !notification.read ? "bg-blue-50" : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {getNotificationIcon(notification.type)}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className={`text-sm font-medium truncate ${
                                                            !notification.read ? "text-blue-900" : "text-gray-900"
                                                        }`}
                                                    >
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>}
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">{formatTimestamp(notification.timestamp)}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {!notification.read && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeNotification(notification.id)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <>
                                <DropdownMenuSeparator />
                                <div className="p-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate("/admin/notifications")}
                                        className="w-full text-center text-xs"
                                    >
                                        View all notifications
                                    </Button>
                                </div>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Language Toggle */}
                <LanguageToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-1">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage
                                        src={user?.profileImage ? `https://form.codepeak.software/uploads/${user.profileImage}` : undefined}
                                        alt={user?.name || "User"}
                                    />
                                    <AvatarFallback className="text-2xl">{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
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
            <CreateNewsSheet isOpen={newsSheetOpen} onClose={() => setNewsSheetOpen(false)} />
            <CreateEventSheet isOpen={eventSheetOpen} onClose={() => setEventSheetOpen(false)} />
            <CreateMediaSheet isOpen={mediaSheetOpen} onClose={() => setMediaSheetOpen(false)} />
        </header>
    )
}
