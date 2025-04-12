"use client"

import { useState, useEffect } from "react"
import { HospitalService } from "../../services/hospitalService"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import "./AdminDashboard.css"

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  return position ? <Marker position={position} /> : null
}

const HospitalForm = ({ hospital, adminId, onHospitalUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    landmark: "",
    type: "General",
    facilities: [],
    contact: {
      phone: "",
      email: "",
    },
    beds: {
      emergency: 0,
      icu: 0,
      delivery: 0,
      general: 0,
      pediatric: 0,
    },
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
  })

  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [facilityInput, setFacilityInput] = useState("")

  // Available facility options
  const facilityOptions = [
    "ICU",
    "Emergency",
    "Surgery",
    "Radiology",
    "Pediatrics",
    "Birth Center",
    "Dialysis",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Physical Therapy",
    "Geriatrics",
    "Maternity",
    "Oncology",
    "Psychiatry",
    "Trauma Center",
    "Burn Unit",
    "Neurosurgery",
  ]

  useEffect(() => {
    if (hospital) {
      setFormData({
        name: hospital.name || "",
        address: hospital.address || "",
        landmark: hospital.landmark || "",
        type: hospital.type || "General",
        facilities: hospital.facilities || [],
        contact: hospital.contact || { phone: "", email: "" },
        beds: hospital.beds || {
          emergency: 0,
          icu: 0,
          delivery: 0,
          general: 0,
          pediatric: 0,
        },
        location: hospital.location || {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      })

      if (hospital.location) {
        setPosition({
          lat: hospital.location.latitude,
          lng: hospital.location.longitude,
        })
      }
    }
  }, [hospital])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleBedChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      beds: {
        ...formData.beds,
        [name]: Number.parseInt(value) || 0,
      },
    })
  }

  const handleAddFacility = () => {
    if (facilityInput && !formData.facilities.includes(facilityInput)) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput],
      })
      setFacilityInput("")
    }
  }

  const handleRemoveFacility = (facility) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((f) => f !== facility),
    })
  }

  const handlePositionChange = (newPosition) => {
    setPosition(newPosition)
    setFormData({
      ...formData,
      location: {
        latitude: newPosition.lat,
        longitude: newPosition.lng,
      },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
  
    try {
      if (!formData.name || !formData.address || !position) {
        throw new Error("Please fill in all required fields and select a location on the map")
      }
  
      if (hospital) {
        await HospitalService.updateHospital(hospital.id, formData)
        const updatedHospital = await HospitalService.getHospitalById(hospital.id)
        onHospitalUpdate(updatedHospital)
        setSuccess("Hospital information updated successfully")
      } else {
        const hospitalId = await HospitalService.addHospital(formData, adminId)
        const newHospital = await HospitalService.getHospitalById(hospitalId)
        onHospitalUpdate(newHospital)
        setSuccess("Hospital added successfully")
        // Reset form data to show the updated hospital
        setFormData({
          ...formData,
          name: newHospital.name,
          address: newHospital.address,
          landmark: newHospital.landmark,
          type: newHospital.type,
          facilities: newHospital.facilities,
          contact: newHospital.contact,
          beds: newHospital.beds,
          location: newHospital.location,
        })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="hospital-form">
      <h2>{hospital ? "Edit Hospital Information" : "Add New Hospital"}</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="name">Hospital Name*</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="type">Hospital Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleInputChange}>
              <option value="General">General</option>
              <option value="Specialty">Specialty</option>
              <option value="Teaching">Teaching</option>
              <option value="Community">Community</option>
              <option value="Clinic">Clinic</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address*</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="landmark">Landmark</label>
            <input type="text" id="landmark" name="landmark" value={formData.landmark} onChange={handleInputChange} />
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>
          <div className="form-group">
            <label htmlFor="contact.phone">Phone Number</label>
            <input
              type="tel"
              id="contact.phone"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact.email">Email</label>
            <input
              type="email"
              id="contact.email"
              name="contact.email"
              value={formData.contact.email}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Facilities</h3>
          <div className="facility-input-group">
            <select
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              className="facility-select"
            >
              <option value="">Select a facility</option>
              {facilityOptions
                .filter((facility) => !formData.facilities.includes(facility))
                .map((facility) => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
            </select>
            <button type="button" onClick={handleAddFacility} className="add-facility-btn">
              Add
            </button>
          </div>

          <div className="facilities-list">
            {formData.facilities.map((facility) => (
              <div key={facility} className="facility-tag">
                {facility}
                <button type="button" onClick={() => handleRemoveFacility(facility)} className="remove-facility-btn">
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Bed Information</h3>
          <div className="beds-grid">
            <div className="form-group">
              <label htmlFor="emergency">Emergency Beds</label>
              <input
                type="number"
                id="emergency"
                name="emergency"
                min="0"
                value={formData.beds.emergency}
                onChange={handleBedChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="icu">ICU Beds</label>
              <input type="number" id="icu" name="icu" min="0" value={formData.beds.icu} onChange={handleBedChange} />
            </div>
            <div className="form-group">
              <label htmlFor="delivery">Delivery Beds</label>
              <input
                type="number"
                id="delivery"
                name="delivery"
                min="0"
                value={formData.beds.delivery}
                onChange={handleBedChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="general">General Beds</label>
              <input
                type="number"
                id="general"
                name="general"
                min="0"
                value={formData.beds.general}
                onChange={handleBedChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="pediatric">Pediatric Beds</label>
              <input
                type="number"
                id="pediatric"
                name="pediatric"
                min="0"
                value={formData.beds.pediatric}
                onChange={handleBedChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Location on Map*</h3>
          <p>Click on the map to set your hospital's location</p>
          <div className="map-container" style={{ height: "400px" }}>
            <MapContainer center={position || [37.7749, -122.4194]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker position={position} setPosition={handlePositionChange} />
            </MapContainer>
          </div>
          {position && (
            <p className="location-coordinates">
              Selected coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : hospital ? "Update Hospital" : "Add Hospital"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default HospitalForm
