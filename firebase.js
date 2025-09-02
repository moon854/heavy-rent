// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
    apiKey: "AIzaSyAlGwcCqEWD74fzM2e5rz0LfO4u3aPoqyU",
    authDomain: "heavyrent-f6435.firebaseapp.com",
    projectId: "heavyrent-f6435",
    storageBucket: "heavyrent-f6435.firebasestorage.app",
    messagingSenderId: "371723438381",
    appId: "1:371723438381:web:d8a40803d5e62ac6452ba4",
    measurementId: "G-JPJRGFK53B"
};

// Initialize Firebase
try {
    var app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };