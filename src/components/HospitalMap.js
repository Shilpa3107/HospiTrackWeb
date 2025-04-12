"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import { useParams, useSearchParams } from "react-router-dom"
import { HospitalService } from "../services/hospitalService"
import { LocationService } from "../services/locationService"
import "./HospitalMap.css"

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Component to handle routing
const RoutingMachine = ({ userLocation, hospitalLocation, transportType }) => {
  const map = useMap()

  useEffect(() => {
    if (!userLocation || !hospitalLocation) return

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.latitude, userLocation.longitude),
        L.latLng(hospitalLocation.latitude, hospitalLocation.longitude),
      ],
      routeWhileDragging: false,
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: getProfile(transportType),
      }),
    }).addTo(map)

    return () => {
      map.removeControl(routingControl)
    }
  }, [map, userLocation, hospitalLocation, transportType])

  return null
}

// Helper function to get the routing profile based on transport type
const getProfile = (transportType) => {
  switch (transportType) {
    case "foot":
      return "foot"
    case "bicycle":
      return "bike"
    case "car":
    default:
      return "car"
  }
}

// Helper function to calculate ETA
const calculateETA = (distance, transportType) => {
  let speed = 0
  switch (transportType) {
    case "foot":
      speed = 5
      break
    case "bicycle":
      speed = 60 // average of 50-70
      break
    case "car":
    default:
      speed = 47
      break
  }
  const timeInHours = distance / speed
  const minutes = Math.ceil(timeInHours * 60)
  return minutes
}


const HospitalMap = () => {
  const { hospitalId } = useParams()
  const [searchParams] = useSearchParams()
  const transportType = searchParams.get("transport") || "car"
  const distance = parseFloat(searchParams.get("distance") || "0")
  const [hospital, setHospital] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user location
        const location = await LocationService.getCurrentPosition()
        setUserLocation(location)

        // Get hospital data
        const hospitalData = await HospitalService.getHospitalById(hospitalId)
        if (hospitalData) {
          setHospital(hospitalData)
        } else {
          setError("Hospital not found")
        }

        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [hospitalId])

  if (loading) {
    return <div className="loading">Loading map...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!hospital || !userLocation) {
    return <div className="error">Missing data to display the map</div>
  }

  const center = [
    (userLocation.latitude + hospital.location.latitude) / 2,
    (userLocation.longitude + hospital.location.longitude) / 2,
  ]

  const eta = distance > 0 ? calculateETA(distance, transportType) : null

  return (
    <div className="hospital-map-container">
      <div className="map-header">
        <h2>Navigation to {hospital.name}</h2>
        <p>Transport mode: {transportType.charAt(0).toUpperCase() + transportType.slice(1)}</p>
        {eta && <p>Estimated time to reach: {eta} minutes</p>}
        <button onClick={() => window.history.back()} className="back-btn">
          Back to List
        </button>
      </div>
      <MapContainer center={center} zoom={13} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[userLocation.latitude, userLocation.longitude]}>
          <Popup>Your Location</Popup>
        </Marker>
        <Marker position={[hospital.location.latitude, hospital.location.longitude]}>
          <Popup>
            <div>
              <h3>{hospital.name}</h3>
              <p>{hospital.address}</p>
            </div>
          </Popup>
        </Marker>
        <RoutingMachine
          userLocation={userLocation}
          hospitalLocation={hospital.location}
          transportType={transportType}
        />
      </MapContainer>
    </div>
  )
}

export default HospitalMap