import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCqXbHznNaLfAAnydoNSk-Wv4mCxnspVgk',
  authDomain: 'chatai-6a578.firebaseapp.com',
  projectId: 'chatai-6a578',
  storageBucket: 'chatai-6a578.appspot.com',
  messagingSenderId: '359059404392',
  appId: '1:359059404392:web:b0a4898a0c74188aed6ddd',
  measurementId: 'G-C8EQBKPYWL',
  databaseURL: 'https://chatai-6a578-default-rtdb.firebaseio.com',
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const FIREBASE_DB = getDatabase(FIREBASE_APP);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
