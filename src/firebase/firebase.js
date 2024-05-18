// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdpsS5nfxLOzpfaP5FzyHru5wxGxNiTQk",
    authDomain: "dataguardians-13157.firebaseapp.com",
    projectId: "dataguardians-13157",
    storageBucket: "dataguardians-13157.appspot.com",
    messagingSenderId: "254040534661",
    appId: "1:254040534661:web:70db1048b1be0ddd6b43ec"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)


export { app,auth};