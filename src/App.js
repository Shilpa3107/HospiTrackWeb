"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import HospitalList from "./components/HospitalList"
import HospitalMap from "./components/HospitalMap"
import LocationPermission from "./components/LocationPermission"
import AdminButton from "./components/admin/AdminButton"
import AdminDashboard from "./components/admin/AdminDashboard"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import "./App.css"

// Protected route component with loading state
const ProtectedRoute = ({ children }) => {
  const { currentUser, isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && (!currentUser || !isAdmin)) {
      navigate("/")
    }
  }, [currentUser, isAdmin, loading, navigate])

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!currentUser || !isAdmin) {
    return null // Navigation is handled by useEffect
  }

  return children
}

function AppContent() {
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const { currentUser, isAdmin, loading } = useAuth()

  const handlePermissionGranted = () => {
    setLocationPermissionGranted(true)
  }

  // Don't show anything until auth state is initialized
  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <div className="app">
      {!locationPermissionGranted && !isAdmin && (
        <LocationPermission onPermissionGranted={handlePermissionGranted} />
      )}

      <Routes>
        <Route
          path="/"
          element={
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : locationPermissionGranted ? (
              <HospitalList />
            ) : (
              <div className="permission-prompt-container" />
            )
          }
        />
        <Route
          path="/map/:hospitalId"
          element={locationPermissionGranted ? <HospitalMap /> : <Navigate to="/" replace />}
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Only show admin button if not on admin route */}
      {!window.location.pathname.startsWith("/admin") && <AdminButton />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App