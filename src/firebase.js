import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdJtpQlX9F_jmASjjZhMlSV-RUpk32dLs",
  authDomain: "syncops-b6980.firebaseapp.com",
  projectId: "syncops-b6980",
  storageBucket: "syncops-b6980.firebasestorage.app",
  messagingSenderId: "567120163013",
  appId: "1:567120163013:web:0dda98d33c123fe9e340ac",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const firestore = getFirestore(app);

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { app, auth, firestore, googleProvider, githubProvider };
