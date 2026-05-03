// Route-based preloading utilities
export const preloadRoute = (routeImport) => {
    const componentImport = routeImport()
    return componentImport
}

// Preload critical routes on user interaction
export const preloadCriticalRoutes = () => {
    // Preload most commonly accessed routes
    const routesToPreload = [
        () => import("../pages/public/AboutPage"),
        () => import("../pages/public/ContactPage"),
        () => import("../pages/public/PublicNewsPage"),
        () => import("../pages/public/PublicEventsPage"),
    ]

    // Preload on hover or focus of navigation links
    routesToPreload.forEach((routeImport) => {
        preloadRoute(routeImport)
    })
}

// Preload admin routes only for admin users
export const preloadAdminRoutes = () => {
    const adminRoutes = [
        () => import("../pages/admin/NewsManagement"),
        () => import("../pages/admin/EventsManagement"),
        () => import("../pages/admin/UserManagement"),
    ]

    adminRoutes.forEach((routeImport) => {
        preloadRoute(routeImport)
    })
}

// Intersection Observer for preloading on scroll
export const usePreloadOnScroll = (callback, threshold = 0.1) => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    callback()
                    observer.unobserve(entry.target)
                }
            })
        },
        { threshold }
    )

    return observer
}
