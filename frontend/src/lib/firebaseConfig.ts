import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6LsaEW339fs9fHQqAeYFUhFPrvi4w8YQ",
  authDomain: "skin-chapters.firebaseapp.com",
  projectId: "skin-chapters",
  storageBucket: "skin-chapters.firebasestorage.app",
  messagingSenderId: "557251382970",
  appId: "1:557251382970:web:d36c4ccb305299ea25fc83",
  measurementId: "G-E2FRRFB9DH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();