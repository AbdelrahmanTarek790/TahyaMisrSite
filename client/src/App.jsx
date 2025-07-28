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
import NewsManagement from './pages/admin/NewsManagement'
import EventsManagement from './pages/admin/EventsManagement'
import UserManagement from './pages/admin/UserManagement'
import './index.css'

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <ErrorDisplay />
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorProvider>
  )
}

export default App
