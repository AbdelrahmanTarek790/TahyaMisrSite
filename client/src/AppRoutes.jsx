import { Routes, Route, Navigate } from "react-router-dom"
import { lazy, Suspense } from "react"
import { useAuth } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import ErrorDisplay from "./components/ui/ErrorDisplay"
import LoadingPage from "./components/LoadingPage"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import PublicLayout from "./components/layout/PublicPagesLayout"
import ScrollToTop from "./components/ScrollToTop"

// Lazy load public pages (high priority)
const Home = lazy(() => import("./pages/Home"))
const AboutPage = lazy(() => import("./pages/public/AboutPage"))
const ContactPage = lazy(() => import("./pages/public/ContactPage"))
const TeamPage = lazy(() => import("./pages/public/TeamPage"))
const PublicNewsPage = lazy(() => import("./pages/public/PublicNewsPage"))
const PublicEventsPage = lazy(() => import("./pages/public/PublicEventsPage"))
const NewsDetailPage = lazy(() => import("./pages/public/NewsDetailPage"))
const EventDetailPage = lazy(() => import("./pages/public/EventDetailPage"))
const JoinRequestPage = lazy(() => import("./pages/public/JoinRequestPage"))

// Lazy load secondary public pages (lower priority)
const Journy = lazy(() => import("./pages/public/Journy"))
const HelpPage = lazy(() => import("./pages/public/HelpPage"))
const TermsPage = lazy(() => import("./pages/public/TermsPage"))
const PrivacyPage = lazy(() => import("./pages/public/PrivacyPage"))
const FAQPage = lazy(() => import("./pages/public/FAQPage"))

// Lazy load auth pages
const Login = lazy(() => import("./pages/auth/Login"))
const Register = lazy(() => import("./pages/auth/Register"))
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"))
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"))

// Lazy load dashboard pages
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"))
const News = lazy(() => import("./pages/News"))
const Events = lazy(() => import("./pages/Events"))
const MediaPage = lazy(() => import("./pages/MediaPage"))
const Profile = lazy(() => import("./pages/Profile"))
const Settings = lazy(() => import("./pages/Settings"))

// Lazy load admin pages (loaded only when needed)
const NewsManagement = lazy(() => import("./pages/admin/NewsManagement"))
const EventsManagement = lazy(() => import("./pages/admin/EventsManagement"))
const UserManagement = lazy(() => import("./pages/admin/UserManagement"))
const PositionsManagement = lazy(() => import("./pages/admin/PositionsManagement"))
const NotificationsManagement = lazy(() => import("./pages/admin/NotificationsManagement"))
const TimelineManagement = lazy(() => import("./pages/admin/TimelineManagement"))
const JoinRequestManagement = lazy(() => import("./pages/admin/JoinRequestManagement"))
const HeroImagesManagement = lazy(() => import("./pages/admin/HeroImagesManagement"))
const AchievementsManagement = lazy(() => import("./pages/admin/AchievementsManagement"))
const ActivitiesManagement = lazy(() => import("./pages/admin/ActivitiesManagement"))

export default function AppRoutes() {
    const { isAuthenticated, user } = useAuth()

    return (
        <ScrollToTop>
            <Suspense fallback={<LoadingPage />}>
                <Routes>
                    <Route element={<PublicLayout />}>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/team" element={<TeamPage />} />
                        <Route path="/news" element={<PublicNewsPage />} />
                        <Route path="/news/:id" element={<NewsDetailPage />} />
                        <Route path="/events" element={<PublicEventsPage />} />
                        <Route path="/events/:id" element={<EventDetailPage />} />
                        <Route path="/journey" element={<Journy />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/join" element={<JoinRequestPage />} />
                        {/* Auth Routes */}
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/register" element={<Navigate to="/join" replace />} />
                    </Route>

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
                        path="/dashboard/news"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <News />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/events"
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
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Profile />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <Settings />
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
                    <Route
                        path="/admin/positions"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <DashboardLayout>
                                    <PositionsManagement />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/notifications"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <DashboardLayout>
                                    <NotificationsManagement />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/join-requests"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <DashboardLayout>
                                    <JoinRequestManagement />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/timeline"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <DashboardLayout>
                                    <TimelineManagement />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/hero-images"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <DashboardLayout>
                                    <HeroImagesManagement />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/achievements"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <DashboardLayout>
                                    <AchievementsManagement />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/activities"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <DashboardLayout>
                                    <ActivitiesManagement />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Suspense>
            <ErrorDisplay />
        </ScrollToTop>
    )
}
