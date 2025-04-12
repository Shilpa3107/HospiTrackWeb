"use client"

import { useState, useEffect } from "react"
import { HospitalService } from "../services/hospitalService"
import { LocationService } from "../services/locationService"
import HospitalCard from "./HospitalCard"
import "./HospitalList.css"

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user location
        const location = await LocationService.getCurrentPosition()
        setUserLocation(location)

        // Get hospitals
        const hospitalData = await HospitalService.getHospitals()

        // Calculate distance for each hospital
        const hospitalsWithDistance = hospitalData.map((hospital) => {
          const distance = HospitalService.calculateDistance(
            location.latitude,
            location.longitude,
            hospital.location.latitude,
            hospital.location.longitude,
          )
          return { ...hospital, distance }
        })

        // Filter hospitals with at least one free bed
        const availableHospitals = hospitalsWithDistance.filter((hospital) => hospital.hasAnyFreeBeds())

        // Sort by distance
        const sortedHospitals = availableHospitals.sort((a, b) => a.distance - b.distance)

        setHospitals(sortedHospitals)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Loading hospitals...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="hospital-list">
      <h2>Nearby Hospitals with Available Beds</h2>
      {hospitals.length === 0 ? (
        <p>No hospitals with available beds found nearby.</p>
      ) : (
        hospitals.map((hospital) => <HospitalCard key={hospital.id} hospital={hospital} />)
      )}
    </div>
  )
}

export default HospitalList
