// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBHv6VALVkLw388ssC9ZAGAy8hX49G83IY",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "echomed-afri.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "echomed-afri",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "echomed-afri.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "920498897838",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:920498897838:web:75607ef13cd57e7d55be3f",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-7XK6CD889T",
};

console.log("🔥 Firebase Config:", {
  apiKey: firebaseConfig.apiKey?.slice(0, 10) + "...",
  projectId: firebaseConfig.projectId,
  hasEnvVar: !!import.meta.env.VITE_FIREBASE_API_KEY,
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
