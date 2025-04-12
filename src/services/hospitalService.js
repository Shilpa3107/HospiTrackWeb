import { db } from "../firebase";
import { ref, get, set, update, push, child, remove } from "firebase/database";
import { Hospital } from "../models/hospital";

export const HospitalService = {
  // Get all hospitals
  async getHospitals() {
    const hospitalsRef = ref(db, "hospitals");
    const snapshot = await get(hospitalsRef);

    if (snapshot.exists()) {
      const hospitalsData = snapshot.val();
      return Object.keys(hospitalsData).map((id) => {
        const data = hospitalsData[id];
        return new Hospital(
          id,
          data.name,
          data.address,
          data.location,
          data.beds,
          data.facilities,
          data.contact,
          data.type,
          data.landmark,
          data.adminId
        );
      });
    }
    return [];
  },


  // Get hospital by ID
  async getHospitalById(id) {
    const hospitalRef = ref(db, `hospitals/${id}`);
    const snapshot = await get(hospitalRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return new Hospital(
        id,
        data.name,
        data.address,
        data.location,
        data.beds,
        data.facilities,
        data.contact,
        data.type,
        data.landmark,
        data.adminId
      );
    }
    return null;
  },

  // Get hospital by admin ID
  async getHospitalByAdminId(adminId) {
    const hospitalsRef = ref(db, "hospitals");
    const snapshot = await get(hospitalsRef);

    if (snapshot.exists()) {
      const hospitalsData = snapshot.val();
      for (const id in hospitalsData) {
        const data = hospitalsData[id];
        if (data.adminId === adminId) {
          return new Hospital(
            id,
            data.name,
            data.address,
            data.location,
            data.beds,
            data.facilities,
            data.contact,
            data.type,
            data.landmark,
            data.adminId
          );
        }
      }
    }
    return null;
  },
  // Add a new hospital
  async addHospital(hospitalData, adminId) {
    try {
      const hospitalsRef = ref(db, "hospitals");
      const newHospitalRef = push(hospitalsRef);
      await set(newHospitalRef, {
        ...hospitalData,
        adminId,
        createdAt: new Date().toISOString(),
      });
      return newHospitalRef.key;
    } catch (error) {
      throw error;
    }
  },

  // Update hospital details
  async updateHospital(hospitalId, hospitalData) {
    try {
      const hospitalRef = ref(db, `hospitals/${hospitalId}`);
      await update(hospitalRef, {
        ...hospitalData,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Update bed availability
  async updateBedAvailability(hospitalId, beds) {
    try {
      const hospitalRef = ref(db, `hospitals/${hospitalId}`);
      await update(hospitalRef, {
        beds,
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      throw error;
    }
  },
  // Book a bed
  async bookBed(hospitalId, bedType) {
    try {
      const hospitalRef = ref(db, `hospitals/${hospitalId}`);
      const snapshot = await get(hospitalRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        if (data.beds[bedType] > 0) {
          // Decrease bed count
          const updatedBeds = { ...data.beds };
          updatedBeds[bedType] = updatedBeds[bedType] - 1;

          await update(hospitalRef, {
            beds: updatedBeds,
            updatedAt: new Date().toISOString(),
          });

          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  },

  // Delete a hospital
  async deleteHospital(hospitalId) {
    try {
      const hospitalRef = ref(db, `hospitals/${hospitalId}`);
      await remove(hospitalRef);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Calculate distance between two coordinates (in km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },
};
