"use client"

import { useState, useEffect } from "react"
import { LocationService } from "../services/locationService"
import "./LocationPermission.css"

const LocationPermission = ({ onPermissionGranted }) => {
  const [permissionStatus, setPermissionStatus] = useState("checking")

  useEffect(() => {
    checkPermission()
  }, [])

  const checkPermission = async () => {
    const status = await LocationService.checkLocationPermission()
    setPermissionStatus(status)

    if (status === "granted") {
      onPermissionGranted()
    }
  }

  const requestPermission = async () => {
    try {
      await LocationService.getCurrentPosition()
      setPermissionStatus("granted")
      onPermissionGranted()
    } catch (error) {
      setPermissionStatus("denied")
    }
  }

  if (permissionStatus === "checking") {
    return <div className="loading">Checking location permission...</div>
  }

  if (permissionStatus === "granted") {
    return null // Permission already granted, component will unmount
  }

  return (
    <div className="location-permission">
      <div className="permission-container">
        <h2>Location Access Required</h2>
        <p>
          This app needs access to your location to find nearby hospitals with available beds. Please grant location
          access to continue.
        </p>
        <button onClick={requestPermission} className="grant-permission-btn">
          Grant Location Access
        </button>
        {permissionStatus === "denied" && (
          <div className="permission-error">
            <p>Location access was denied. Please enable location services in your browser settings and try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationPermission
