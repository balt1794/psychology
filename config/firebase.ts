// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnhgJwHZL3w6S2Q99wCuhtA9mxB6Sl0Dg",
  authDomain: "psychology-8d9af.firebaseapp.com",
  projectId: "psychology-8d9af",
  storageBucket: "psychology-8d9af.firebasestorage.app",
  messagingSenderId: "119598674679",
  appId: "1:119598674679:web:fab77a4f231b9afd9619f2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()

export const storage =  getStorage(app);
export const db = getFirestore(app);