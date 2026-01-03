
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDF0j11UMATdPxHn7k3qMYTfSYpAz31464",
  authDomain: "aapk-b76b3.firebaseapp.com",
  projectId: "aapk-b76b3",
  storageBucket: "aapk-b76b3.firebasestorage.app",
  messagingSenderId: "111545315428",
  appId: "1:111545315428:web:56e33ad41e5b3ddf1a6f71",
  measurementId: "G-VF3M6DHX3G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
