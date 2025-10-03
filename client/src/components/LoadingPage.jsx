import React from "react"

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-white">
            <div className="text-center">
                {/* Optimized loading spinner */}
                <div className="inline-block w-12 h-12 border-4 border-yellow-200 border-t-egypt-gold rounded-full animate-spin mb-4"></div>

                {/* Loading text with fade animation */}
                <p className="text-egypt-gold font-medium animate-pulse">جاري التحميل...</p>

                {/* Progress indicator */}
                <div className="w-32 h-1 bg-yellow-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-egypt-gold rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}

export default LoadingPage
