// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8tCPeZi3sP_447J2boym6p7V-qHfKY3M",
  authDomain: "plai-c72e4.firebaseapp.com",
  projectId: "plai-c72e4",
  storageBucket: "plai-c72e4.appspot.com",
  messagingSenderId: "127784059643",
  appId: "1:127784059643:web:8541f6c9b771d6b76b665e"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()

export const storage =  getStorage(app);
export const db = getFirestore(app);