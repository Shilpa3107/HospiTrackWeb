"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import "./AdminLogin.css"

const AdminLogin = ({ onClose, onRegisterClick }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
  
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
  
    try {
      setLoading(true)
      await login(email, password)
      // Instead of just closing, we should trigger a page reload or redirect
      window.location.href = "/admin" // or wherever your admin dashboard is
    } catch (error) {
      setError("Failed to log in. Please check your credentials.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-header">
        <h2>Hospital Admin Login</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="admin-login-footer">
        <p>
          Don't have an account?{" "}
          <button className="register-link" onClick={onRegisterClick}>
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
