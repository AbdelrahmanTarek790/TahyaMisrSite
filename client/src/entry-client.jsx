import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import "./index.css"
import "./App.css"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext"
import { LocalizationProvider } from "./hooks/useLocalization.jsx"

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
