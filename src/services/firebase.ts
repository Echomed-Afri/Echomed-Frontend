import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDhOMKyDfqi5QEWExVpf6qtZUfm_ZVd5B8",
  authDomain: "first-43adc.firebaseapp.com",
  projectId: "first-43adc",
  storageBucket: "first-43adc.firebasestorage.app",
  messagingSenderId: "877569054395",
  appId: "1:877569054395:web:35ff1322396c6becd8bb9e",
  measurementId: "G-0SS3SVE0BR"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;