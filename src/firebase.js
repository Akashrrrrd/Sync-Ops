import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdJtpQlX9F_jmASjjZhMlSV-RUpk32dLs",
  authDomain: "syncops-b6980.firebaseapp.com",
  projectId: "syncops-b6980",
  storageBucket: "syncops-b6980.firebasestorage.app",
  messagingSenderId: "567120163013",
  appId: "1:567120163013:web:0dda98d33c123fe9e340ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Enhanced user creation function with comprehensive error handling
const createUserProfile = async (user, additionalData) => {
  if (!user) {
    console.error('No user provided for profile creation');
    throw new Error('User creation failed: No user data');
  }

  try {
    const userRef = doc(firestore, 'users', user.uid);
    
    // Comprehensive user data with robust defaults
    const userData = {
      uid: user.uid,
      email: user.email,
      firstName: additionalData.firstName || '',
      lastName: additionalData.lastName || '',
      adminBoard: additionalData.adminBoard || 'members',
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
      roles: [additionalData.adminBoard || 'members']
    };

    // Set user document with merge to allow partial updates
    await setDoc(userRef, userData, { merge: true });

    return userData;
  } catch (error) {
    console.error("Detailed error creating user profile:", error);
    throw error;
  }
};

// Function to check user authentication state
const checkUserAuthStatus = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          callback(userDoc.data());
        } else {
          console.error('User document not found');
          callback(null);
        }
      } catch (error) {
        console.error('Error checking user auth status:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Google Sign-In method
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create or update user profile
    const userData = await createUserProfile(user, {
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ')[1] || '',
      adminBoard: 'members'
    });

    return userData;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export { 
  app,
  auth, 
  firestore,
  createUserProfile,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  googleProvider,
  signInWithGoogle,
  checkUserAuthStatus,
  doc,
  setDoc,
  getDoc
};