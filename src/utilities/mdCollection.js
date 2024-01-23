import dotenv from "dotenv";
import { initializeApp, getApps, getApp } from "@firebase/app";
import { getFirestore, collection } from "@firebase/firestore";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "inkspiff-c9578.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: "inkspiff-c9578.appspot.com",
  messagingSenderId: "993485008234",
  appId: "1:993485008234:web:54fab3086c334d00064913",
  measurementId: "G-Y9Y81BBMJT",
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference the markdown collection
export const mdCollection = collection(db, "markdowns");
