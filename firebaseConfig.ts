import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCqXbHznNaLfAAnydoNSk-Wv4mCxnspVgk",
    authDomain: "chatai-6a578.firebaseapp.com",
    projectId: "chatai-6a578",
    storageBucket: "chatai-6a578.appspot.com",
    messagingSenderId: "359059404392",
    appId: "1:359059404392:web:b0a4898a0c74188aed6ddd",
    measurementId: "G-C8EQBKPYWL"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const ANALYTICS = getAnalytics(FIREBASE_APP);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
