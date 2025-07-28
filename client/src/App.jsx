import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ErrorProvider } from "./context/ErrorContext"
import ProtectedRoute from "./components/ProtectedRoute"
import ErrorDisplay from "./components/ui/ErrorDisplay"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/dashboard/Dashboard"
import News from "./pages/News"
import Events from "./pages/Events"
import MediaPage from "./pages/MediaPage"
import NewsManagement from "./pages/admin/NewsManagement"
import EventsManagement from "./pages/admin/EventsManagement"
import UserManagement from "./pages/admin/UserManagement"
import LandingPage from "./pages/public/LandingPage"
import AboutPage from "./pages/public/AboutPage"
import ContactPage from "./pages/public/ContactPage"
import PublicNewsPage from "./pages/public/PublicNewsPage"
import PublicEventsPage from "./pages/public/PublicEventsPage"
import "./index.css"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import PublicLayout from "./components/layout/PublicPagesLayout"

function App() {
    return (
        <ErrorProvider>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route element={<PublicLayout />}>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/public/news" element={<PublicNewsPage />} />
                            <Route path="/public/events" element={<PublicEventsPage />} />
                        </Route>

                        {/* Auth Routes */}

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Dashboard />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/news"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <News />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/events"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Events />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/media"
                            element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <MediaPage />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/news"
                            element={
                                <ProtectedRoute roles={["admin"]}>
                                    <DashboardLayout>
                                        <NewsManagement />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/events"
                            element={
                                <ProtectedRoute roles={["admin"]}>
                                    <DashboardLayout>
                                        <EventsManagement />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute roles={["admin"]}>
                                    <DashboardLayout>
                                        <UserManagement />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </Router>
            <ErrorDisplay />
        </ErrorProvider>
    )
}

export default App
