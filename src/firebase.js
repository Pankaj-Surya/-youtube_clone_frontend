// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUGkwsflHURs1g5jprZDOrfEIKSp0_-J8",
  authDomain: "clone-e1b98.firebaseapp.com",
  projectId: "clone-e1b98",
  storageBucket: "clone-e1b98.appspot.com",
  messagingSenderId: "113710471613",
  appId: "1:113710471613:web:3d656ef6c6d76546005ad4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth() 
export const provider = new GoogleAuthProvider()
export default app;