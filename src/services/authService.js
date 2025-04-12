import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { ref, set, get, child } from "firebase/database"; 
import { auth, db } from "../firebase"

export const AuthService = {
  // Register a new hospital admin
  async registerHospitalAdmin(email, password, hospitalName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with hospital name
      const hospitalAdminRef = ref(db, `hospitalAdmins/${user.uid}`); // Reference to hospital admin
      await set(hospitalAdminRef, {
        email,
        hospitalName,
        role: "admin",
        createdAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      throw error;
    }
  },

  // Sign in
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      await signOut(auth)
      return true
    } catch (error) {
      throw error
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch (error) {
      throw error
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser
  },

  // Check if user is a hospital admin
  async isHospitalAdmin(userId) {
    try {
      const adminRef = ref(db, `hospitalAdmins/${userId}`); // Reference to a specific admin's data
      const snapshot = await get(adminRef);
      return snapshot.exists() && snapshot.val().role === "admin"; // Check role
    } catch (error) {
      return false;
    }
  },

  // Get hospital admin data
   async getHospitalAdminData(userId) {
    try {
      const adminRef = ref(db, `hospitalAdmins/${userId}`); // Reference to admin data
      const snapshot = await get(adminRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
};