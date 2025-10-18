import { StrictMode } from "react"
import { renderToPipeableStream } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import AppRoutes from "./AppRoutes.jsx"
import { AuthProvider } from "./context/AuthContext"
import { LocalizationProvider } from "./hooks/useLocalization.jsx"
import { ErrorProvider } from "./context/ErrorContext"

// Import styles to ensure they're included in the SSR bundle
import "./index.css"
import "./App.css"

export async function render(url, options = {}) {
    let initialData = null

    // Fetch dynamic data if route starts with /news/
    if (url.startsWith("/news/")) {
        const id = url.split("/news/")[1]
        const res = await fetch(`https://form.codepeak.software/api/v1/news/${id}`)
        initialData = await res.json()
    }

    return new Promise((resolve, reject) => {
        const { pipe, abort } = renderToPipeableStream(
            <StrictMode>
                <LocalizationProvider>
                    <AuthProvider>
                        <ErrorProvider>
                            <MemoryRouter initialEntries={[url]}>
                                <AppRoutes initialData={initialData} />
                            </MemoryRouter>
                        </ErrorProvider>
                    </AuthProvider>
                </LocalizationProvider>
            </StrictMode>,
            {
                onShellReady() {
                    resolve({ pipe, abort, initialData })
                },
                onShellError: reject,
                onError(err) {
                    console.error("SSR Error:", err)
                },
            }
        )
    })
}
