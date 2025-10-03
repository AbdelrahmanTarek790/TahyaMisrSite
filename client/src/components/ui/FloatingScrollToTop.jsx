import { useState, useEffect, useCallback } from "react"
import { ChevronUp } from "lucide-react"

const FloatingScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)

    // Throttle scroll events for better performance
    const throttle = (func, delay) => {
        let timeoutId
        let lastExecTime = 0
        return function (...args) {
            const currentTime = Date.now()

            if (currentTime - lastExecTime > delay) {
                func.apply(this, args)
                lastExecTime = currentTime
            } else {
                clearTimeout(timeoutId)
                timeoutId = setTimeout(() => {
                    func.apply(this, args)
                    lastExecTime = Date.now()
                }, delay - (currentTime - lastExecTime))
            }
        }
    }

    // Show button when page is scrolled down and calculate scroll progress
    const handleScroll = useCallback(
        throttle(() => {
            const scrollTop = window.pageYOffset
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
            const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100)

            setScrollProgress(scrollPercent)
            setIsVisible(scrollTop > 300)
        }, 16),
        []
    ) // ~60fps

    // Scroll to top smoothly with progress tracking
    const scrollToTop = useCallback(() => {
        setIsScrolling(true)

        // Smooth scroll with custom easing
        const scrollDuration = 600
        const scrollStep = -window.scrollY / (scrollDuration / 15)

        const scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep)
            } else {
                clearInterval(scrollInterval)
                setIsScrolling(false)
            }
        }, 15)

        // Fallback - use native smooth scroll
        setTimeout(() => {
            clearInterval(scrollInterval)
            window.scrollTo({ top: 0, behavior: "smooth" })
            setIsScrolling(false)
        }, scrollDuration)
    }, [])

    // Keyboard support
    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                scrollToTop()
            }
        },
        [scrollToTop]
    )

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [handleScroll])

    // Don't render if not needed
    if (!isVisible && scrollProgress === 0) {
        return null
    }

    return (
        <div className="fixed bottom-6 right-6  z-50">
            <div className="group relative">
                {/* Progress ring */}
                <svg
                    className={`absolute inset-0 w-14 h-14 -rotate-90 transition-all duration-300 ${
                        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
                    viewBox="0 0 56 56"
                    aria-hidden="true"
                >
                    {/* Background circle */}
                    <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="2" />
                    {/* Progress circle */}
                    <circle
                        cx="28"
                        cy="28"
                        r="26"
                        fill="none"
                        stroke="rgb(179,29,29)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 26}`}
                        strokeDashoffset={`${2 * Math.PI * 26 * (1 - scrollProgress / 100)}`}
                        className="progress-ring transition-all duration-200 ease-out"
                        style={{
                            filter: isScrolling ? "drop-shadow(0 0 6px rgb(59, 130, 246))" : "none",
                        }}
                    />
                </svg>

                {/* Main button */}
                <button
                    type="button"
                    onClick={scrollToTop}
                    onKeyDown={handleKeyDown}
                    disabled={isScrolling}
                    className={`
                        relative inline-flex items-center justify-center mt-1 mr-1
                        w-12 h-12 rounded-full
                        bg-[linear-gradient(135deg,_rgb(179,29,29),_rgb(255,215,0))]
                        text-white shadow-lg hover:shadow-xl
                        transition-all duration-300 ease-in-out
                        transform hover:scale-105 active:scale-95
                        
                        ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"}
                        ${isScrolling ? "animate-pulse" : ""}
                    `}
                    aria-label="العودة إلى أعلى الصفحة"
                    title={`العودة إلى الأعلى `} //(${Math.round(scrollProgress)}% من الصفحة)
                    role="button"
                    tabIndex={isVisible ? 0 : -1}
                >
                    <ChevronUp className={`w-5 h-5 transition-all duration-200 ${isScrolling ? "animate-bounce" : "group-hover:-translate-y-0.5"}`} />
                </button>

                {/* Tooltip */}
                <div
                    className={`
                    absolute bottom-full right-0 mb-2 px-3 py-1
                    bg-gray-900 text-white text-xs rounded-lg
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-200
                    pointer-events-none whitespace-nowrap
                    before:content-[''] before:absolute before:top-full before:right-3
                    before:border-l-4 before:border-r-4 before:border-t-4
                    before:border-l-transparent before:border-r-transparent before:border-t-gray-900
                    ${isVisible ? "group-hover:opacity-100" : "opacity-0"}
                `}
                >
                    العودة إلى الأعلى
                </div>

                {/* Initial appearance animation */}
                {isVisible && scrollProgress < 10 && (
                    <div className="absolute inset-0 w-12 h-12 rounded-full bg-egypt-gold/30 animate-ping pointer-events-none" />
                )}
            </div>
        </div>
    )
}

export default FloatingScrollToTop
