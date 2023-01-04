import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyBAxuCCdTnUhh7HQ3IzEB8rb6nnp9Nc8Gg",
    authDomain: "bytelink-ip-grabber.firebaseapp.com",
    projectId: "bytelink-ip-grabber",
    storageBucket: "bytelink-ip-grabber.appspot.com",
    messagingSenderId: "532293748588",
    appId: "1:532293748588:web:1667148e39e8e79c259549",
    measurementId: "G-YL4CR5F5ZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);