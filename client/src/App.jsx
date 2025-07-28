import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ErrorProvider } from './context/ErrorContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorDisplay from './components/ui/ErrorDisplay'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import './index.css'

function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
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
