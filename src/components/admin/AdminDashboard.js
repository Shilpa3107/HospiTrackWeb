"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { HospitalService } from "../../services/hospitalService"
import HospitalForm from "./HospitalForm"
import BedManagement from "./BedManagement"
import HospitalMap from "./HospitalMap"
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
        {hospital && (
          <button className={`tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
            Hospital Info
          </button>
        )}
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
        {activeTab === "info" && hospital && (
          <div className="hospital-info">
            <div className="info-header">
              <h2>Hospital Information</h2>
              <button 
                  className="manage-beds-btn"
                  onClick={() => setActiveTab("beds")}
                >
                  Manage Beds
                </button>
              <button 
                className="edit-btn"
                onClick={() => setActiveTab("details")}
              >
                Edit Details
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <h3>Basic Details</h3>
                <p><strong>Name:</strong> {hospital.name}</p>
                <p><strong>Type:</strong> {hospital.type}</p>
                <p><strong>Address:</strong> {hospital.address}</p>
                <p><strong>Landmark:</strong> {hospital.landmark}</p>
              </div>
              <div className="info-item">
                <h3>Contact Information</h3>
                <p><strong>Phone:</strong> {hospital.contact.phone}</p>
                <p><strong>Email:</strong> {hospital.contact.email}</p>
                <p><strong>Emergency Contact:</strong> {hospital.contact.emergency}</p>
              </div>

              <div className="info-item">
                <h3>Facilities</h3>
                <ul>
                  {hospital.facilities.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </div>

              <div className="info-item">
                <h3>Location</h3>
                <div className="map-container">
                  <HospitalMap location={hospital.location} />
                </div>
                <div className="coordinates">
                  <p><strong>Latitude:</strong> {hospital.location.latitude}</p>
                  <p><strong>Longitude:</strong> {hospital.location.longitude}</p>
                </div>
              </div>
            </div>
          </div>
        )}
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
