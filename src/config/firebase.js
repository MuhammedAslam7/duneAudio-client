// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-commerce-34a15.firebaseapp.com",
  projectId: "e-commerce-34a15",
  storageBucket: "e-commerce-34a15.firebasestorage.app",
  messagingSenderId: "495506653692",
  appId: "1:495506653692:web:c0690184bb96a2bd717279",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
