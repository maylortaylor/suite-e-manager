/** @format */

import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCOZt-OqRAUBUIeXkf2b19pj6bRmU5LIhA",
//   authDomain: "social-media-manager-eb123.firebaseapp.com",
//   projectId: "social-media-manager-eb123",
//   storageBucket: "social-media-manager-eb123.firebasestorage.app",
//   messagingSenderId: "258402261914",
//   appId: "1:258402261914:web:ed242db8f0ef7b81503823",
//   measurementId: "G-XYQWC07V25",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence.
// This must be done after the app is initialized but before any other
// Firestore calls.
initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager({}),
  }),
});

// Get the configured Firestore instance
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
