// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { db } from './firebase';
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGFS82KcU_C8YOW7rPfqB3ileS_fnGV2o",
  authDomain: "hospitrack-b7f63.firebaseapp.com",
  databaseURL: "https://hospitrack-b7f63-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hospitrack-b7f63",
  storageBucket: "hospitrack-b7f63.firebasestorage.app",
  messagingSenderId: "432947553338",
  appId: "1:432947553338:web:5d7a661e84a3e828dcc103",
  measurementId: "G-HYW94DQT7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);