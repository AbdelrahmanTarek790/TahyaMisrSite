import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "./App.css"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext"
import { LocalizationProvider } from "./hooks/useLocalization.jsx"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <LocalizationProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </LocalizationProvider>
    </StrictMode>
)
