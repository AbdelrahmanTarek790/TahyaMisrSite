"use client"

import { useEffect } from "react"

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ!</h2>
                <p className="text-gray-600 mb-6">عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.</p>
                <button onClick={reset} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
                    حاول مرة أخرى
                </button>
            </div>
        </div>
    )
}
