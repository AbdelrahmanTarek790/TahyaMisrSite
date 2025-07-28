import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ErrorProvider } from './context/ErrorContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorDisplay from './components/ui/ErrorDisplay'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import News from './pages/News'
import Events from './pages/Events'
import MediaPage from './pages/MediaPage'
import NewsManagement from './pages/admin/NewsManagement'
import EventsManagement from './pages/admin/EventsManagement'
import UserManagement from './pages/admin/UserManagement'
import LandingPage from './pages/public/LandingPage'
import AboutPage from './pages/public/AboutPage'
import ContactPage from './pages/public/ContactPage'
import PublicNewsPage from './pages/public/PublicNewsPage'
import PublicEventsPage from './pages/public/PublicEventsPage'
import './index.css'

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/public/news" element={<PublicNewsPage />} />
              <Route path="/public/events" element={<PublicEventsPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/news"
                element={
                  <ProtectedRoute>
                    <News />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/media"
                element={
                  <ProtectedRoute>
                    <MediaPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin/news"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <NewsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <EventsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ErrorDisplay />
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorProvider>
  )
}

export default App
