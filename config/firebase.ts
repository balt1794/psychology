// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC4ISsmAHJ5oi-eA7MCN_21qzkxO_ldp70",
    authDomain: "propertylistingsai.firebaseapp.com",
    projectId: "propertylistingsai",
    storageBucket: "propertylistingsai.appspot.com",
    messagingSenderId: "31474835808",
    appId: "1:31474835808:web:20f7643ae5cbf40169be05"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()

export const storage =  getStorage(app);
export const db = getFirestore(app);