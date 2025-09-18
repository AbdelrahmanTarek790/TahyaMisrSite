// src/components/ScrollToTop.jsx
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const ScrollToTop = ({ children }) => {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth", // Optional: for smooth scrolling; use 'auto' for instant jump
        })
    }, [pathname]) // Re-run effect whenever pathname changes

    return children
}

export default ScrollToTop
