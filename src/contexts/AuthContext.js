"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is a hospital admin with memoization
  const checkAdminStatus = useCallback(async (userId) => {
    if (!userId) {
      setIsAdmin(false);
      return false;
    }

    try {
      const adminDoc = await getDoc(doc(db, "hospitalAdmins", userId));
      const isUserAdmin = adminDoc.exists() && adminDoc.data().role === "admin";
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error("Admin check error:", error);
      setError("Failed to verify admin status. Please try again.");
      setIsAdmin(false);
      return false;
    }
  }, []);

  // Register a new hospital admin
  const register = async (email, password, hospitalName) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "hospitalAdmins", user.uid), {
        email,
        hospitalName,
        role: "admin",
        createdAt: new Date().toISOString(),
      });

      // Verify admin status immediately after registration
      await checkAdminStatus(user.uid);
      
      // Set current user and admin status
      setCurrentUser(user);
      setIsAdmin(true);
      
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
      throw error;
    }
  };

  // Sign in
  const login = async (email, password) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Verify admin status immediately after login
      await checkAdminStatus(userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please check your credentials.");
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
      return true;
    } catch (error) {
      console.error("Sign out error:", error);
      setError(error.message || "Failed to sign out. Please try again.");
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          await checkAdminStatus(user.uid);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setError("Authentication error occurred. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [checkAdminStatus]);

  const value = {
    currentUser,
    isAdmin,
    loading,
    error,
    login,
    register,
    signOut,
    checkAdminStatus,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}