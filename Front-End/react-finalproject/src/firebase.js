import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDRgwuJWF-_NutR3J7ZUo-BJtNk7q4ofJw",
    authDomain: "flashy-webapp.firebaseapp.com",
    projectId: "flashy-webapp",
    storageBucket: "flashy-webapp.appspot.com",
    messagingSenderId: "986581173537",
    appId: "1:986581173537:web:b856081a006691467e6a60",
    measurementId: "G-68SPEWHGES"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const GoogleProvider = new GoogleAuthProvider();
export const FacebookProvider = new FacebookAuthProvider();

export default app;