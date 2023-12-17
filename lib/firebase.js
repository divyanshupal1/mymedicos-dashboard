// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage ,ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE7_gYf1UZ-KgfRS45xPKYkAy0S5GxYbk",
  authDomain: "mymedicosupdated.firebaseapp.com",
  databaseURL: "https://mymedicosupdated-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mymedicosupdated",
  storageBucket: "mymedicosupdated.appspot.com",
  messagingSenderId: "968103235749",
  appId: "1:968103235749:web:403b7c7a79c3846fedbd4c",
  measurementId: "G-B66D4LFS4J"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const storageRef = ref(storage);
const db = getFirestore(app);
export {app,db,auth,storage,storageRef};