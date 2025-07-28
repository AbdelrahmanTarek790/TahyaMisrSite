import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, roles = [] }) => {
    const { isAuthenticated, user, isLoading } = useAuth()
    const location = useLocation()
    

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
      // console.log("ProtectedRoute:", { isAuthenticated, user, isLoading, roles })
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default ProtectedRoute
