// firestoreService.js
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import {
    addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc
} from 'firebase/firestore';
import { auth, db } from '../../firebase'; // make sure you export both `db` and `auth` in firebase.js

//--------------------------------
// 🔹 Firestore Services
//--------------------------------

// ✅ Add data
export const addData = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};


// ✅ Get all data
export const getAllData = async (collectionName) => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (e) {
        console.error("Error getting documents: ", e);
    }
};

// ✅ Get all categories
export const getAllCategories = async () => {
    try {
        console.log('Fetching categories from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categories = [];
        querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
        });
        // Sort by order field
        const sortedCategories = categories.sort((a, b) => (a.order || 0) - (b.order || 0));
        console.log('Fetched categories:', sortedCategories);
        return sortedCategories;
    } catch (e) {
        console.error("Error getting categories: ", e);
        // Return default categories if Firestore is unavailable
        console.log('Returning default categories due to Firestore error');
        return [
            { id: 'excavators', name: 'Excavators' },
            { id: 'cranes', name: 'Cranes' },
            { id: 'concrete-equipment', name: 'Concrete Equipment' },
            { id: 'building-equipment', name: 'Building Equipment' },
            { id: 'road-construction', name: 'Road Construction' },
            { id: 'surface-finishing', name: 'Surface Finishing' }
        ];
    }
};

// ✅ Get machinery by category
export const getMachineryByCategory = async (categoryId) => {
    try {
        console.log('Fetching machinery for category:', categoryId);
        const querySnapshot = await getDocs(collection(db, 'machinery'));
        const machinery = [];
        querySnapshot.forEach((doc) => {
            const data = { id: doc.id, ...doc.data() };
            console.log('Checking machinery item:', {
                id: data.id,
                name: data.name,
                category: data.category,
                categoryId: data.categoryId,
                categoryName: data.categoryName
            });
            // Check if it matches by category ID, category name, or categoryName field
            // Also check for partial matches and case-insensitive matching
            const matchesCategory = data.categoryId === categoryId || 
                data.category === categoryId || 
                data.categoryName === categoryId ||
                data.categoryId?.toLowerCase() === categoryId?.toLowerCase() ||
                data.category?.toLowerCase() === categoryId?.toLowerCase() ||
                data.categoryName?.toLowerCase() === categoryId?.toLowerCase();
                
            if (matchesCategory && data.status === 'approved') {
                console.log('✅ Adding approved machinery to results:', data.name);
                machinery.push(data);
            }
        });
        console.log(`Found ${machinery.length} machinery items for category:`, categoryId);
        return machinery;
    } catch (e) {
        console.error("Error getting machinery by category: ", e);
        return [];
    }
};

// ✅ Get single document
export const getDataById = async (collectionName, id) => {
    try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
    }
};

// ✅ Update document
export const updateData = async (collectionName, id, newData) => {
    try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, newData);
        console.log("Document updated successfully");
    } catch (e) {
        console.error("Error updating document: ", e);
    }
};

// ✅ Delete document
export const deleteData = async (collectionName, id) => {
    try {
        await deleteDoc(doc(db, collectionName, id));
        console.log("Document deleted successfully");
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};

//--------------------------------
// 🔹 Firebase Auth Services
//--------------------------------

// ✅ Sign Up
export const handleSignUp = async (email, password, extraData = {}) => {
    try {

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        const userData = {
            uid: user.uid,
            email: user.email,
            createdAt: new Date().toISOString(),
            ...extraData, // merge additional data (e.g. name, phone, etc.)
        };


        await setDoc(doc(db, "users", user.uid), userData);

        return userData;
    } catch (error) {
        console.error("Error signing up:", error.message);
        throw error;
    }
};

// ✅ Login
export const LoginWithFBase = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};

// ✅ Forgot Password
export const forgotPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent!");
    } catch (error) {
        console.error("Error sending reset email:", error.message);
        throw error;
    }
};

// ✅ Logout
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out successfully");
    } catch (error) {
        console.error("Error logging out:", error.message);
        throw error;
    }
};

// ✅ Change Password
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const user = auth.currentUser;
        
        if (!user) {
            throw new Error("No user is currently signed in");
        }

        // Re-authenticate user with current password
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
        
        console.log("Password updated successfully");
        return true;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};






export const uploadImageToCloudinary = async (imageUri) => {
    const CLOUD_NAME = "dwk8uftzt";
    const UPLOAD_PRESET = "react-native-assets";

    try {
        console.log("Starting Cloudinary upload for:", imageUri);
        
        let data = new FormData();
        data.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "upload.jpg",
        });
        data.append("upload_preset", UPLOAD_PRESET);

        console.log("FormData prepared, sending request...");

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log("Response received, status:", res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Cloudinary API error:", errorText);
            throw new Error(`Cloudinary upload failed: ${res.status} - ${errorText}`);
        }

        const result = await res.json();
        console.log("Cloudinary response:", result);

        if (!result.secure_url) {
            console.error("No secure_url in response:", result);
            throw new Error("No secure_url returned from Cloudinary");
        }

        console.log("Image uploaded successfully:", result.secure_url);
        console.log("URL validation:", {
            url: result.secure_url,
            startsWithHttp: result.secure_url.startsWith('http'),
            length: result.secure_url.length
        });

        return result.secure_url; // 🔥 Cloudinary hosted URL

    } catch (err) {
        console.error("Cloudinary upload failed", err);
        console.error("Error details:", err.message);
        throw err;
    }
};




