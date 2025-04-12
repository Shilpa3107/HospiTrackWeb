import { collection, getDocs, doc, getDoc, updateDoc, addDoc, query, where, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Hospital } from "../models/hospital"

export const HospitalService = {
  // Get all hospitals
  async getHospitals() {
    const hospitalsCollection = collection(db, "hospitals")
    const hospitalSnapshot = await getDocs(hospitalsCollection)
    return hospitalSnapshot.docs.map((doc) => {
      const data = doc.data()
      return new Hospital(
        doc.id,
        data.name,
        data.address,
        data.location,
        data.beds,
        data.facilities,
        data.contact,
        data.type,
        data.landmark,
        data.adminId,
      )
    })
  },

  // Get hospital by ID
  async getHospitalById(id) {
    const hospitalDoc = doc(db, "hospitals", id)
    const hospitalSnapshot = await getDoc(hospitalDoc)

    if (hospitalSnapshot.exists()) {
      const data = hospitalSnapshot.data()
      return new Hospital(
        hospitalSnapshot.id,
        data.name,
        data.address,
        data.location,
        data.beds,
        data.facilities,
        data.contact,
        data.type,
        data.landmark,
        data.adminId,
      )
    }
    return null
  },

  // Get hospital by admin ID
  async getHospitalByAdminId(adminId) {
    const hospitalsCollection = collection(db, "hospitals")
    const q = query(hospitalsCollection, where("adminId", "==", adminId))
    const hospitalSnapshot = await getDocs(q)

    if (!hospitalSnapshot.empty) {
      const doc = hospitalSnapshot.docs[0]
      const data = doc.data()
      return new Hospital(
        doc.id,
        data.name,
        data.address,
        data.location,
        data.beds,
        data.facilities,
        data.contact,
        data.type,
        data.landmark,
        data.adminId,
      )
    }
    return null
  },

  // Add a new hospital
  async addHospital(hospitalData, adminId) {
    try {
      const hospitalsCollection = collection(db, "hospitals")
      const docRef = await addDoc(hospitalsCollection, {
        ...hospitalData,
        adminId,
        createdAt: new Date().toISOString(),
      })
      return docRef.id
    } catch (error) {
      throw error
    }
  },

  // Update hospital details
  async updateHospital(hospitalId, hospitalData) {
    try {
      const hospitalDoc = doc(db, "hospitals", hospitalId)
      await updateDoc(hospitalDoc, {
        ...hospitalData,
        updatedAt: new Date().toISOString(),
      })
      return true
    } catch (error) {
      throw error
    }
  },

  // Update bed availability
  async updateBedAvailability(hospitalId, beds) {
    try {
      const hospitalDoc = doc(db, "hospitals", hospitalId)
      await updateDoc(hospitalDoc, {
        beds,
        updatedAt: new Date().toISOString(),
      })
      return true
    } catch (error) {
      throw error
    }
  },

  // Book a bed
  async bookBed(hospitalId, bedType) {
    try {
      const hospitalDoc = doc(db, "hospitals", hospitalId)
      const hospitalSnapshot = await getDoc(hospitalDoc)

      if (hospitalSnapshot.exists()) {
        const data = hospitalSnapshot.data()

        if (data.beds[bedType] > 0) {
          // Decrease bed count
          const updatedBeds = { ...data.beds }
          updatedBeds[bedType] = updatedBeds[bedType] - 1

          await updateDoc(hospitalDoc, {
            beds: updatedBeds,
            updatedAt: new Date().toISOString(),
          })

          return true
        }
      }
      return false
    } catch (error) {
      throw error
    }
  },

  // Delete a hospital
  async deleteHospital(hospitalId) {
    try {
      const hospitalDoc = doc(db, "hospitals", hospitalId)
      await deleteDoc(hospitalDoc)
      return true
    } catch (error) {
      throw error
    }
  },

  // Calculate distance between two coordinates (in km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  },
}
