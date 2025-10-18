import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import "./index.css"
import "./App.css"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext"
import { LocalizationProvider } from "./hooks/useLocalization.jsx"
import Clarity from "@microsoft/clarity"

// Microsoft Clarity initialization for SSR
// Only runs in browser environment (client-side hydration)
function initializeClarity() {
    // SSR Safety Check: Only run in browser environment
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return
    }

    try {
        const CLARITY_ID = import.meta.env.VITE_CLARITY_ID
        const CLARITY_ENABLE_DEV = import.meta.env.VITE_CLARITY_ENABLE_DEVELOPMENT === "true"

        // Exit early if no project ID
        if (!CLARITY_ID) {
            console.info("Clarity: No project ID provided. Analytics disabled.")
            return
        }

        // Respect user-level Do Not Track
        const dnt = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack
        if (dnt === "1" || dnt === "yes") {
            console.info("Clarity: Do Not Track enabled. Analytics disabled.")
            return
        }

        // Only load in production unless explicitly enabled for development
        const shouldLoadClarity = import.meta.env.PROD || CLARITY_ENABLE_DEV
        if (!shouldLoadClarity) {
            console.info("Clarity: Development mode. Set VITE_CLARITY_ENABLE_DEVELOPMENT=true to enable.")
            return
        }

        // Initialize Clarity with the project ID
        Clarity.init(CLARITY_ID)
        console.info("Clarity: Successfully initialized with project ID:", CLARITY_ID)
    } catch (error) {
        // Fail silently — analytics shouldn't break the app
        console.warn("Clarity: Failed to initialize:", error)
    }
}

// Initialize Clarity before hydration
initializeClarity()

// Hydrate the SSR-rendered HTML
hydrateRoot(
    document.getElementById("root"),
    <StrictMode>
        <LocalizationProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </LocalizationProvider>
    </StrictMode>
)
