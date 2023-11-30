import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDtTLjP1LgU9nSYLu0QRObvsrWDVYlkUy0",
    authDomain: "finalproject-dsw.firebaseapp.com",
    projectId: "finalproject-dsw",
    storageBucket: "finalproject-dsw.appspot.com",
    messagingSenderId: "213981631733",
    appId: "1:213981631733:web:e2bcaf1d536ea29aeee1bc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const GoogleProvider = new GoogleAuthProvider();
export const FacebookProvider = new FacebookAuthProvider();

export default app;