// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyALnZh8Rf23bt4YevxONmz9rs1G4qZxpPM",
    authDomain: "w23april4b.firebaseapp.com",
    projectId: "w23april4b",
    storageBucket: "w23april4b.appspot.com",
    messagingSenderId: "317725215791",
    appId: "1:317725215791:web:71bd3911a91f76fc3d4ada"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app)

const auth = getAuth(app)

export {db, auth}