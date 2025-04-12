import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBFt6_jCvwNivg_lzzu7Ovd_nRE45ZPAu4",
  authDomain: "hospitrack-420b6.firebaseapp.com",
  projectId: "hospitrack-420b6",
  storageBucket: "hospitrack-420b6.firebasestorage.app",
  messagingSenderId: "263633545091",
  appId: "1:263633545091:web:44c8930cb327195ea778b6",
  measurementId: "G-YL0D0BSES8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
