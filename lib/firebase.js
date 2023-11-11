// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage ,ref } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzjfXyZ31YOwl3_zlUjeJV6ED_afHY9Vg",
  authDomain: "mymedicos-a5ecc.firebaseapp.com",
  databaseURL: "https://mymedicos-a5ecc-default-rtdb.firebaseio.com",
  projectId: "mymedicos-a5ecc",
  storageBucket: "mymedicos-a5ecc.appspot.com",
  messagingSenderId: "78883571163",
  appId: "1:78883571163:web:0341c8b9130377673f13fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const storageRef = ref(storage);
const db = getFirestore(app);
export {app,db,auth,storage,storageRef};