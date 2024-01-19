import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA-obbEnOiwG-5kUjtjE-nEjqkA7mbKAMI",
    authDomain: "flashy-appw.firebaseapp.com",
    projectId: "flashy-appw",
    storageBucket: "flashy-appw.appspot.com",
    messagingSenderId: "303875357960",
    appId: "1:303875357960:web:ef6ced64111f7abfe940bd",
    measurementId: "G-WWTS9H7BRR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const GoogleProvider = new GoogleAuthProvider();
export const FacebookProvider = new FacebookAuthProvider();

export default app;