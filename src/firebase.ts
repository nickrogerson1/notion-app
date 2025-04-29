import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBazTSvQQ_FR7Er1J5MyJxgudYAALOmaNU",
  authDomain: "notion-app-3a1d2.firebaseapp.com",
  projectId: "notion-app-3a1d2",
  storageBucket: "notion-app-3a1d2.firebasestorage.app",
  messagingSenderId: "840317376159",
  appId: "1:840317376159:web:c6e60c8729d5aa84a3f4aa"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app);

export { db };