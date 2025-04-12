"use client"

import { useState } from "react"
import { HospitalService } from "../../services/hospitalService"
import "./AdminDashboard.css"

const BedManagement = ({ hospital, onHospitalUpdate }) => {
  const [beds, setBeds] = useState(
    hospital.beds || {
      emergency: 0,
      icu: 0,
      delivery: 0,
      general: 0,
      pediatric: 0,
    },
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleBedChange = (e) => {
    const { name, value } = e.target
    setBeds({
      ...beds,
      [name]: Number.parseInt(value) || 0,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await HospitalService.updateBedAvailability(hospital.id, beds)
      const updatedHospital = await HospitalService.getHospitalById(hospital.id)
      onHospitalUpdate(updatedHospital)
      setSuccess("Bed availability updated successfully")
    } catch (err) {
      console.error("Error updating beds:", err)
      setError("Failed to update bed availability. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bed-management">
      <h2>Manage Bed Availability</h2>
      <p>Update the number of available beds for each type</p>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="beds-grid">
          <div className="form-group">
            <label htmlFor="emergency">Emergency Beds</label>
            <input
              type="number"
              id="emergency"
              name="emergency"
              min="0"
              value={beds.emergency}
              onChange={handleBedChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="icu">ICU Beds</label>
            <input type="number" id="icu" name="icu" min="0" value={beds.icu} onChange={handleBedChange} />
          </div>
          <div className="form-group">
            <label htmlFor="delivery">Delivery Beds</label>
            <input
              type="number"
              id="delivery"
              name="delivery"
              min="0"
              value={beds.delivery}
              onChange={handleBedChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="general">General Beds</label>
            <input type="number" id="general" name="general" min="0" value={beds.general} onChange={handleBedChange} />
          </div>
          <div className="form-group">
            <label htmlFor="pediatric">Pediatric Beds</label>
            <input
              type="number"
              id="pediatric"
              name="pediatric"
              min="0"
              value={beds.pediatric}
              onChange={handleBedChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Bed Availability"}
        </button>
      </form>
    </div>
  )
}

export default BedManagement
