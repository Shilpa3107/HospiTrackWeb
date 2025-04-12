"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { HospitalService } from "../../services/hospitalService"
import HospitalForm from "./HospitalForm"
import BedManagement from "./BedManagement"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const { currentUser, signOut } = useAuth()
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHospital = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        const fetchedHospital = await HospitalService.getHospitalByAdminId(currentUser.uid)
        setHospital(fetchedHospital)
        setError(null)
      } catch (err) {
        console.error("Error fetching hospital:", err)
        setError("Failed to load hospital data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchHospital()
  }, [currentUser])

  const handleHospitalUpdate = (updatedHospital) => {
    setHospital(updatedHospital)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Hospital Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Hospital Details
        </button>
        {hospital && (
          <button className={`tab-btn ${activeTab === "beds" ? "active" : ""}`} onClick={() => setActiveTab("beds")}>
            Bed Management
          </button>
        )}
      </div>

      <div className="admin-content">
        {activeTab === "details" && (
          <HospitalForm 
            hospital={hospital} 
            adminId={currentUser?.uid} 
            onHospitalUpdate={handleHospitalUpdate} 
          />
        )}
        {activeTab === "beds" && hospital && (
          <BedManagement hospital={hospital} onHospitalUpdate={handleHospitalUpdate} />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
