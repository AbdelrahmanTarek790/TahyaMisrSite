import { BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ErrorProvider } from "./context/ErrorContext"
import AppRoutes from "./AppRoutes"
import "./index.css"

function App() {
    return (
        <ErrorProvider>
            <Router>
                <AppRoutes />
            </Router>
        </ErrorProvider>
    )
}

export default App
