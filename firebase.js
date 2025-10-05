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
    // Try to continue with a fallback configuration
    try {
        var app = initializeApp(firebaseConfig, 'fallback');
        console.log('Firebase initialized with fallback config');
    } catch (fallbackError) {
        console.error('Fallback Firebase initialization also failed:', fallbackError);
    }
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
let auth, db;
try {
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase services initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase services:', error);
    // Create fallback services
    auth = getAuth();
    db = getFirestore();
    console.log('Using fallback Firebase services');
}

export { auth, db };