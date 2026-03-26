import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// You can find these in the Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyC8O7VP8SfOU3gP1M87Ppis5pydgctnEpI",
  authDomain: "trawell-app-b6f3f.firebaseapp.com",
  databaseURL: "https://trawell-app-b6f3f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trawell-app-b6f3f",
  storageBucket: "trawell-app-b6f3f.firebasestorage.app",
  messagingSenderId: "675187781044",
  appId: "1:675187781044:web:00052f984d2d3f0a3dd6e1",
  measurementId: "G-WL216W9WP9"
};

// Initialize Firebase
// We use the compat app for Auth to support legacy/compat Auth methods
const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const auth = firebase.auth();

// Use getFirestore(app) to explicitly use the initialized app instance. 
// This ensures Firestore shares the Auth token state correctly with the compat Auth instance.
export const db = getFirestore(app);
