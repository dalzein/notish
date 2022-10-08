import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_gE_zSAvdotb3OVr0up6rh4zqtEyoauc",
  authDomain: "notish-1fe8a.firebaseapp.com",
  projectId: "notish-1fe8a",
  storageBucket: "notish-1fe8a.appspot.com",
  messagingSenderId: "749660901455",
  appId: "1:749660901455:web:e291307cf41e136d811a3a",
  measurementId: "G-7V9S2JCK5N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
