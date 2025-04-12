"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import AdminLogin from "./AdminLogin"
import AdminRegister from "./AdminRegister"
import "./AdminButton.css"

const AdminButton = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const { currentUser, isAdmin, signOut } = useAuth()

  const handleAdminClick = () => {
    if (currentUser && isAdmin) {
      // If already logged in as admin, do nothing (will be redirected by App.js)
      return
    }
    setShowLogin(true)
  }

  const handleLoginClose = () => {
    setShowLogin(false)
  }

  const handleRegisterClose = () => {
    setShowRegister(false)
  }

  const switchToRegister = () => {
    setShowLogin(false)
    setShowRegister(true)
  }

  const switchToLogin = () => {
    setShowRegister(false)
    setShowLogin(true)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <>
      <button className="admin-button" onClick={handleAdminClick}>
        {currentUser && isAdmin ? "Admin Dashboard" : "Hospital Admin?"}
      </button>

      {currentUser && isAdmin && (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}

      {showLogin && (
        <div className="modal-overlay">
          <AdminLogin onClose={handleLoginClose} onRegisterClick={switchToRegister} />
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay">
          <AdminRegister onClose={handleRegisterClose} onLoginClick={switchToLogin} />
        </div>
      )}
    </>
  )
}

export default AdminButton
