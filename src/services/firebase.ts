import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC88oKMTH6NXoHIS0yS-lGtvrmoWkGQYLI",
  authDomain: "naadi-4fc32.firebaseapp.com",
  projectId: "naadi-4fc32",
  storageBucket: "naadi-4fc32.firebasestorage.app",
  messagingSenderId: "1043324414859",
  appId: "1:1043324414859:web:fe865457f7bd01f0fc9d8e",
  measurementId: "G-56W53M05ER"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);