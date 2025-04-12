import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

export const AuthService = {
  // Register a new hospital admin
  async registerHospitalAdmin(email, password, hospitalName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with hospital name
      await updateProfile(user, {
        displayName: hospitalName,
      })

      // Create a hospital admin document
      await setDoc(doc(db, "hospitalAdmins", user.uid), {
        email,
        hospitalName,
        role: "admin",
        createdAt: new Date().toISOString(),
      })

      return user
    } catch (error) {
      throw error
    }
  },

  // Sign in
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      throw error
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
      const adminDoc = await getDoc(doc(db, "hospitalAdmins", userId))
      return adminDoc.exists() && adminDoc.data().role === "admin"
    } catch (error) {
      return false
    }
  },

  // Get hospital admin data
  async getHospitalAdminData(userId) {
    try {
      const adminDoc = await getDoc(doc(db, "hospitalAdmins", userId))
      if (adminDoc.exists()) {
        return adminDoc.data()
      }
      return null
    } catch (error) {
      throw error
    }
  },
}
