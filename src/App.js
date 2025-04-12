"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline, Box, Container, Paper, Typography, Button, TextField, CircularProgress } from "@mui/material"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SearchIcon from "@mui/icons-material/Search"
import HospitalList from "./components/HospitalList"
import HospitalMap from "./components/HospitalMap"
import LocationPermission from "./components/LocationPermission"
import AdminButton from "./components/admin/AdminButton"
import AdminDashboard from "./components/admin/AdminDashboard"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import "./App.css"

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "8px 16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
})

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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!currentUser || !isAdmin) {
    return null
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <AnimatePresence mode="wait">
            {!locationPermissionGranted && !isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    mb: 4,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                    Find Hospitals Near You
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                    Enter your location or allow us to detect it automatically
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter your location manually"
                      value={locationInput}
                      onChange={handleLocationInputChange}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
                      }}
                      sx={{ maxWidth: 400 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleManualLocationSubmit}
                      startIcon={<SearchIcon />}
                      sx={{ minWidth: 120 }}
                    >
                      Search
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleDetectLocation}
                      startIcon={<LocationOnIcon />}
                      sx={{ minWidth: 120 }}
                    >
                      Detect
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>

          <Routes>
            <Route
              path="/"
              element={
                isAdmin ? (
                  <Navigate to="/admin" replace />
                ) : locationPermissionGranted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HospitalList />
                  </motion.div>
                ) : (
                  <div className="permission-prompt-container" />
                )
              }
            />
            <Route
              path="/map/:hospitalId"
              element={
                locationPermissionGranted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HospitalMap />
                  </motion.div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AdminDashboard />
                  </motion.div>
                </ProtectedRoute>
              }
            />
          </Routes>

          {!window.location.pathname.startsWith("/admin") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AdminButton />
            </motion.div>
          )}
        </Container>
      </Box>
    </ThemeProvider>
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
