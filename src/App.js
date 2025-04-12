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
      navigate("/") // Redirect to home page if not authenticated or not an admin
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
  const [locationInput, setLocationInput] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const { currentUser, isAdmin, loading } = useAuth()

  const handlePermissionGranted = () => {
    setLocationPermissionGranted(true)
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationPermissionGranted(true)
      },
      (error) => {
        alert("Failed to detect location.")
        console.error("Geolocation error:", error)
      }
    )
  }

  const handleLocationInputChange = (e) => {
    setLocationInput(e.target.value)
  }

  const handleManualLocationSubmit = () => {
    if (locationInput.trim() !== "") {
      setUserLocation({ address: locationInput.trim() })
      setLocationPermissionGranted(true)
    }
  }

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <div className="app">
      {!locationPermissionGranted && !isAdmin && (
        <div className="location-selection-container">
          <h2>Find hospitals near you</h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Enter your location manually"
              value={locationInput}
              onChange={handleLocationInputChange}
              style={{ padding: "8px", width: "60%" }}
            />
            <button onClick={handleManualLocationSubmit}>Search</button>
            <button onClick={handleDetectLocation}>Detect My Location</button>
          </div>
        </div>
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
