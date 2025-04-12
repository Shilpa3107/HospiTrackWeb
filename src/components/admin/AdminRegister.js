"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import "./AdminLogin.css"

const AdminRegister = ({ onClose, onLoginClick }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [hospitalName, setHospitalName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password || !confirmPassword || !hospitalName) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)
      await register(email, password, hospitalName)
      onClose()
    } catch (error) {
      setError("Failed to create an account. " + error.message)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-header">
        <h2>Hospital Admin Registration</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="hospitalName">Hospital Name</label>
          <input
            type="text"
            id="hospitalName"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <div className="admin-login-footer">
        <p>
          Already have an account?{" "}
          <button className="register-link" onClick={onLoginClick}>
            Login
          </button>
        </p>
      </div>
    </div>
  )
}

export default AdminRegister
