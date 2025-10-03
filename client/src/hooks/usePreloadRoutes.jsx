import { useAuth } from '../context/AuthContext'
import { preloadCriticalRoutes, preloadAdminRoutes } from '../utils/preloadUtils'
import { useEffect } from 'react'

export const usePreloadRoutes = () => {
    const { user } = useAuth()
    
    useEffect(() => {
        // Preload critical public routes after initial render
        const timer = setTimeout(() => {
            preloadCriticalRoutes()
        }, 1000) // Delay to not interfere with initial page load
        
        return () => clearTimeout(timer)
    }, [])
    
    useEffect(() => {
        // Preload admin routes only for admin users
        if (user?.role === 'admin') {
            const timer = setTimeout(() => {
                preloadAdminRoutes()
            }, 2000) // Later delay for admin routes
            
            return () => clearTimeout(timer)
        }
    }, [user])
}

// Navigation link component with preloading
export const PreloadingNavLink = ({ to, children, onHover, ...props }) => {
    const handleMouseEnter = () => {
        // Preload route on hover
        const routePreloaders = {
            '/about': () => import('../pages/public/AboutPage'),
            '/contact': () => import('../pages/public/ContactPage'),
            '/news': () => import('../pages/public/PublicNewsPage'),
            '/events': () => import('../pages/public/PublicEventsPage'),
            '/join': () => import('../pages/public/JoinRequestPage'),
        }
        
        const preloader = routePreloaders[to]
        if (preloader) {
            preloader()
        }
        
        if (onHover) onHover()
    }
    
    return (
        <a
            href={to}
            onMouseEnter={handleMouseEnter}
            onFocus={handleMouseEnter}
            {...props}
        >
            {children}
        </a>
    )
}