import dotenv from "dotenv";
import { initializeApp, getApps, getApp } from "@firebase/app";
import { getFirestore, collection, doc, getDoc, query, where } from "@firebase/firestore";

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

export const automations = collection(db, "automations");
export const markdowns = collection(db, "markdowns");

export function getAutomations(repoFullName) {
  const [repoOwner, repoName] = repoFullName.split("/");
  console.log(`PR webhook for ${repoFullName} received`)
  const q = query(
    automations,
    where("owner", "==", repoOwner.toLowerCase()),
    where("repo", "==", repoName.toLowerCase()),
  );
  return q;
}

export async function getMdContent(mdID) {
  const mdRef = doc(db, "markdowns", mdID);
  await getDoc(mdRef).then((mdDocSnap) => {
    if (mdDocSnap.exists()) {
      console.log({ g: mdDocSnap.data() });
      const md = {
        id: mdDocSnap.id,
        ...mdDocSnap.data(),
      };
      return md;
    }
  });
}
