"use client"

import { useState } from "react"
import { HospitalService } from "../services/hospitalService"
import { useNavigate } from "react-router-dom"
import "./HospitalCard.css"


const HospitalCard = ({ hospital }) => {
  const [view, setView] = useState("default")
  const [selectedBedType, setSelectedBedType] = useState(null)
  const [selectedTransport, setSelectedTransport] = useState(null)
  const [bookingStatus, setBookingStatus] = useState(null)

  const handleBookBed = () => {
    setView("bookBed")
  }

  const handleNavigate = () => {
    setView("navigate")
  }

  const navigate = useNavigate()

  const handleBedTypeSelect = async (bedType) => {
    try {
      const success = await HospitalService.bookBed(hospital.id, bedType)
      if (success) {
        setSelectedBedType(bedType)
        setBookingStatus("success")
        // Update the hospital object to reflect the change
        hospital.beds[bedType] -= 1
      } else {
        setBookingStatus("error")
      }
    } catch (error) {
      console.error("Error booking bed:", error)
      setBookingStatus("error")
    }
  }

  const handleTransportSelect = (transport) => {
    const distance = hospital.distance.toFixed(2)
    navigate(`/map/${hospital.id}?transport=${transport}&distance=${distance}`)  }
  

  const renderDefaultView = () => (
    <div className="hospital-card-actions">
      <button className="book-bed-btn" onClick={handleBookBed} disabled={!hospital.hasAnyFreeBeds}>
        Book Bed
      </button>
      <button className="navigate-btn" onClick={handleNavigate}>
        Navigate
      </button>
    </div>
  )

  const renderBedTypeView = () => (
    <div className="hospital-card-actions bed-type-selection">
      <h4>Select Bed Type:</h4>
      <div className="bed-type-buttons">
        {Object.entries(hospital.beds).map(([type, count]) => (
          <button
            key={type}
            onClick={() => handleBedTypeSelect(type)}
            disabled={count <= 0}
            className={`bed-type-btn ${count <= 0 ? "disabled" : ""}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} ({count})
          </button>
        ))}
      </div>
      {bookingStatus === "success" && (
        <div className="booking-status success">Successfully booked a {selectedBedType} bed!</div>
      )}
      {bookingStatus === "error" && <div className="booking-status error">Failed to book bed. Please try again.</div>}
      <button className="back-btn" onClick={() => setView("default")}>
        Back
      </button>
    </div>
  )

  const renderNavigateView = () => (
    <div className="hospital-card-actions transport-selection">
      <h4>Select Transport:</h4>
      <div className="transport-buttons">
        <button onClick={() => handleTransportSelect("foot")}>On Foot</button>
        <button onClick={() => handleTransportSelect("bicycle")}>Bicycle</button>
        <button onClick={() => handleTransportSelect("car")}>Car</button>
      </div>
      <button className="back-btn" onClick={() => setView("default")}>
        Back
      </button>
    </div>
  )

  return (
    <div className="hospital-card">
      <div className="hospital-card-header">
        <h3>{hospital.name}</h3>
        <span className="distance">{hospital.distance.toFixed(1)} km away</span>
      </div>
      <div className="hospital-card-body">
        <p className="address">{hospital.address}</p>
        <div className="facilities">
          {hospital.facilities.map((facility) => (
            <span key={facility} className="facility-tag">
              {facility}
            </span>
          ))}
        </div>
        <div className="bed-availability">
          <h4>Available Beds:</h4>
          <ul>
            {Object.entries(hospital.beds).map(([type, count]) => (
              <li key={type} className={count > 0 ? "available" : "unavailable"}>
                {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hospital-card-footer">
        {view === "default" && renderDefaultView()}
        {view === "bookBed" && renderBedTypeView()}
        {view === "navigate" && renderNavigateView()}
      </div>
    </div>
  )
}

export default HospitalCard
