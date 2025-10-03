import { lazy, Suspense } from "react"

// Lazy load only the icons we need
const icons = {
    // Navigation and UI
    ArrowLeft: lazy(() => import("lucide-react").then((module) => ({ default: module.ArrowLeft }))),
    Search: lazy(() => import("lucide-react").then((module) => ({ default: module.Search }))),
    Menu: lazy(() => import("lucide-react").then((module) => ({ default: module.Menu }))),
    X: lazy(() => import("lucide-react").then((module) => ({ default: module.X }))),
    ChevronDown: lazy(() => import("lucide-react").then((module) => ({ default: module.ChevronDown }))),
    ChevronUp: lazy(() => import("lucide-react").then((module) => ({ default: module.ChevronUp }))),

    // Common icons
    Calendar: lazy(() => import("lucide-react").then((module) => ({ default: module.Calendar }))),
    MapPin: lazy(() => import("lucide-react").then((module) => ({ default: module.MapPin }))),
    Users: lazy(() => import("lucide-react").then((module) => ({ default: module.Users }))),
    User: lazy(() => import("lucide-react").then((module) => ({ default: module.User }))),
    Mail: lazy(() => import("lucide-react").then((module) => ({ default: module.Mail }))),
    Phone: lazy(() => import("lucide-react").then((module) => ({ default: module.Phone }))),
    Clock: lazy(() => import("lucide-react").then((module) => ({ default: module.Clock }))),

    // Actions
    Plus: lazy(() => import("lucide-react").then((module) => ({ default: module.Plus }))),
    Edit: lazy(() => import("lucide-react").then((module) => ({ default: module.Edit }))),
    Trash2: lazy(() => import("lucide-react").then((module) => ({ default: module.Trash2 }))),
    Eye: lazy(() => import("lucide-react").then((module) => ({ default: module.Eye }))),
    Save: lazy(() => import("lucide-react").then((module) => ({ default: module.Save }))),

    // Status
    CheckCircle: lazy(() => import("lucide-react").then((module) => ({ default: module.CheckCircle }))),
    AlertCircle: lazy(() => import("lucide-react").then((module) => ({ default: module.AlertCircle }))),
    AlertTriangle: lazy(() => import("lucide-react").then((module) => ({ default: module.AlertTriangle }))),

    // Media and content
    Image: lazy(() => import("lucide-react").then((module) => ({ default: module.Image }))),
    FileText: lazy(() => import("lucide-react").then((module) => ({ default: module.FileText }))),
    Newspaper: lazy(() => import("lucide-react").then((module) => ({ default: module.Newspaper }))),

    // Social
    Facebook: lazy(() => import("lucide-react").then((module) => ({ default: module.Facebook }))),
    Twitter: lazy(() => import("lucide-react").then((module) => ({ default: module.Twitter }))),
    Linkedin: lazy(() => import("lucide-react").then((module) => ({ default: module.Linkedin }))),
    Share2: lazy(() => import("lucide-react").then((module) => ({ default: module.Share2 }))),

    // Settings and security
    Settings: lazy(() => import("lucide-react").then((module) => ({ default: module.Settings }))),
    Lock: lazy(() => import("lucide-react").then((module) => ({ default: module.Lock }))),
    Shield: lazy(() => import("lucide-react").then((module) => ({ default: module.Shield }))),

    // Special icons
    Crown: lazy(() => import("lucide-react").then((module) => ({ default: module.Crown }))),
    Heart: lazy(() => import("lucide-react").then((module) => ({ default: module.Heart }))),
    Target: lazy(() => import("lucide-react").then((module) => ({ default: module.Target }))),
    Award: lazy(() => import("lucide-react").then((module) => ({ default: module.Award }))),
    Globe: lazy(() => import("lucide-react").then((module) => ({ default: module.Globe }))),
    BookOpen: lazy(() => import("lucide-react").then((module) => ({ default: module.BookOpen }))),
}

const IconFallback = ({ size = 24, className = "" }) => (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`} style={{ width: size, height: size }} />
)

export const Icon = ({ name, size = 24, className = "", ...props }) => {
    const IconComponent = icons[name]

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in IconLoader`)
        return <IconFallback size={size} className={className} />
    }

    return (
        <Suspense fallback={<IconFallback size={size} className={className} />}>
            <IconComponent size={size} className={className} {...props} />
        </Suspense>
    )
}

export default Icon
