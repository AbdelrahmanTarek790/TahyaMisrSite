import React, { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Logo from "@/assets/Logo.png"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Search, X, ChevronDown, User, LogIn, Bell } from "lucide-react"
// import api from "@/lib/axios"
import { cn, getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"

export default function PublicPagesHeader() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [isScrolled, setIsScrolled] = useState(false)

    // Handle scroll event to change header styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Fetch categories for navigation

    // Handle search submission

    // Handle logout
    const handleLogout = async () => {
        await logout()
        navigate("/login")
    }

    // Render authentication buttons based on login state
    const renderAuthButtons = () => {
        if (user) {
            return (
                <div className="flex items-center gap-2">
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
                            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user.role !== "user" && <DropdownMenuItem onClick={() => navigate("/dashboard")}>لوحة التحكم</DropdownMenuItem>}
                            <DropdownMenuItem onClick={() => navigate("/settings/profile")}>الملف الشخصي</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/settings/account")}>إعدادات الحساب</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>تسجيل الخروج</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        } else {
            return (
                <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/login">
                            <LogIn className="mr-2 h-4 w-4" /> تسجيل الدخول
                        </Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link to="/register">إنشاء حساب</Link>
                    </Button>
                </div>
            )
        }
    }
    {
        /* <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.photo} alt={user?.name || "User"} />
                            <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <p className="font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {user.role !== "user" && (
                        <Button className="w-full" variant="outline" asChild>
                            <Link to="/dashboard">Dashboard</Link>
                        </Button>
                    )}
                    <Button className="w-full" variant="outline" asChild>
                        <Link to="/settings/profile">My Profile</Link>
                    </Button>
                    <Button className="w-full" variant="outline" onClick={handleLogout}>
                        Logout
                    </Button> */
    }
    // Render mobile auth buttons
    const renderMobileAuthButtons = () => {
        if (user) {
            return (
                <div className="flex flex-col space-y-2 pt-4">
                    <Button variant="ghost" className="w-full" asChild>
                        <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                        <Link to="/settings/account">Account Settings</Link>
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            )
        } else {
            return (
                <div className="flex flex-col space-y-2 pt-4">
                    <Button className="w-full" asChild>
                        <Link to="/login">
                            <LogIn className="mr-2 h-4 w-4" /> Sign In
                        </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/register">
                            <User className="mr-2 h-4 w-4" /> Sign Up
                        </Link>
                    </Button>
                </div>
            )
        }
    }

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 z-40 w-full transition-all duration-200 px-4 sm:px-6 lg:px-8",
                    isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
                )}
            >
                <div className="container mx-auto">
                    {/* Top bar with logo and auth buttons */}
                    <div className="flex items-center flex-row-reverse justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">أتحاد شباب تحيا مصر</span>
                            <img src={Logo} alt="Logo" className="h-28 w-28" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-4 ">
                            <NavigationMenu>
                                <NavigationMenuList className={" md:flex-row-reverse "}>
                                    <NavigationMenuItem>
                                        <NavLink to="/" className={({ isActive }) => cn(navigationMenuTriggerStyle(), isActive ? "font-medium" : "")}>
                                            الرئيسية
                                        </NavLink>
                                    </NavigationMenuItem>

                                    {/* <Route path="/" element={<LandingPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/public/news" element={<PublicNewsPage />} />
                            <Route path="/public/events" element={<PublicEventsPage />} /> */}

                                    <NavigationMenuItem>
                                        <NavLink
                                            to="/news"
                                            className={({ isActive }) => cn(navigationMenuTriggerStyle(), isActive ? "font-medium" : "")}
                                        >
                                            الاخبار
                                        </NavLink>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavLink
                                            to="/events"
                                            className={({ isActive }) => cn(navigationMenuTriggerStyle(), isActive ? "font-medium" : "")}
                                        >
                                            الفعاليات
                                        </NavLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavLink
                                            to="/about"
                                            className={({ isActive }) => cn(navigationMenuTriggerStyle(), isActive ? "font-medium" : "")}
                                        >
                                            من نحن
                                        </NavLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavLink
                                            to="/contact"
                                            className={({ isActive }) => cn(navigationMenuTriggerStyle(), isActive ? "font-medium" : "")}
                                        >
                                            اتصل بنا
                                        </NavLink>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>

                            {/* <Button variant="ghost" size="icon" aria-label="Search" onClick={toggleSearch}>
                                <Search className="h-5 w-5" />
                            </Button> */}

                            {/* Render auth buttons based on login state */}
                        </div>
                        <div className="hidden md:flex md:items-center md:flex-row-reverse md:space-x-4">{renderAuthButtons()}</div>
                        {/* Mobile menu and search buttons */}
                        <div className="flex items-center md:hidden">
                            {user && (
                                <Button variant="ghost" size="icon" className="relative mr-1" aria-label="Notifications">
                                    <Bell size={18} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
                                </Button>
                            )}

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" aria-label="Menu">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right">
                                    <SheetHeader>
                                        <SheetTitle>Tahya Misr</SheetTitle>
                                    </SheetHeader>
                                    <div id="sheetHeader" className="flex flex-col space-y-2">
                                        <NavigationMenu className="w-full max-w-full justify-start">
                                            <NavigationMenuList className="flex flex-col w-full space-y-1">
                                                <NavigationMenuItem className="w-full">
                                                    <NavLink
                                                        to="/"
                                                        className={({ isActive }) =>
                                                            cn(
                                                                navigationMenuTriggerStyle(),
                                                                isActive ? "font-medium w-full justify-normal" : "w-full justify-normal"
                                                            )
                                                        }
                                                    >
                                                        Home
                                                    </NavLink>
                                                </NavigationMenuItem>
                                                <NavigationMenuItem className="w-full">
                                                    <NavLink
                                                        to="/public/news"
                                                        className={({ isActive }) =>
                                                            cn(
                                                                navigationMenuTriggerStyle(),
                                                                isActive ? "font-medium w-full justify-normal" : "w-full justify-normal"
                                                            )
                                                        }
                                                    >
                                                        News
                                                    </NavLink>
                                                </NavigationMenuItem>
                                                <NavigationMenuItem className="w-full">
                                                    <NavLink
                                                        to="/public/events"
                                                        className={({ isActive }) =>
                                                            cn(
                                                                navigationMenuTriggerStyle(),
                                                                isActive ? "font-medium w-full justify-normal" : "w-full justify-normal"
                                                            )
                                                        }
                                                    >
                                                        Events
                                                    </NavLink>
                                                </NavigationMenuItem>
                                                <NavigationMenuItem className="w-full">
                                                    <NavLink
                                                        to="/about"
                                                        className={({ isActive }) =>
                                                            cn(
                                                                navigationMenuTriggerStyle(),
                                                                isActive ? "font-medium w-full justify-normal" : "w-full justify-normal"
                                                            )
                                                        }
                                                    >
                                                        About
                                                    </NavLink>
                                                </NavigationMenuItem>
                                                <NavigationMenuItem className="w-full">
                                                    <NavLink
                                                        to="/contact"
                                                        className={({ isActive }) =>
                                                            cn(
                                                                navigationMenuTriggerStyle(),
                                                                isActive ? "font-medium w-full justify-normal" : "w-full justify-normal"
                                                            )
                                                        }
                                                    >
                                                        Contact
                                                    </NavLink>
                                                </NavigationMenuItem>
                                            </NavigationMenuList>
                                        </NavigationMenu>

                                        {/* Render mobile auth buttons */}
                                        {renderMobileAuthButtons()}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
