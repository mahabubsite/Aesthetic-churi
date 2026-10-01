import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyC42ixw1H_j4mdq4V3n_mXSeofPi_JUbWA",
  authDomain: "aestheticcustomizedchuri.firebaseapp.com",
  projectId: "aestheticcustomizedchuri",
  storageBucket: "aestheticcustomizedchuri.firebasestorage.app",
  messagingSenderId: "972899987852",
  appId: "1:972899987852:web:afc24a13ed6c87837166a9"
};

export const ADMIN_EMAILS = [
  "robiuletc@gmail.com",
  "mdmahbubsite@gmail.com"
];
export const ADMIN_EMAIL = ADMIN_EMAILS[0];

// Initialize Firebase Client App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

export const signInAdminWithEmail = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Email/Password Sign-In error:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase Sign-Out error:", error);
  }
};

export const isAuthorizedAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === normalized);
};
