// firestoreService.js
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification
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
            emailVerified: !!user.emailVerified,
            ...extraData, // merge additional data (e.g. name, phone, etc.)
        };

        // Save user data first
        await setDoc(doc(db, "users", user.uid), userData);

        // Send email verification with proper error handling
        let verificationEmailSent = false;
        let verificationError = null;
        try {
            // For React Native, sendEmailVerification works without ActionCodeSettings
            // The email will contain a link that opens in browser and redirects to app
            // Note: User must be signed in to send verification email
            await sendEmailVerification(user);
            console.log('✅ Email verification sent successfully to:', user.email);
            verificationEmailSent = true;
        } catch (e) {
            console.error('❌ Error sending email verification:', e?.message, e?.code);
            verificationEmailSent = false;
            // Provide user-friendly error messages
            if (e?.code === 'auth/too-many-requests') {
                verificationError = 'Too many requests. Please wait a few minutes before requesting another verification email.';
            } else if (e?.code === 'auth/user-not-found') {
                verificationError = 'User not found. Please try again.';
            } else {
                verificationError = e?.message || 'Failed to send verification email. Please try again later.';
            }
        }

        return { ...userData, verificationEmailSent, verificationError };
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

// ✅ Sync Firebase Auth emailVerified with Firestore isVerified
export const syncEmailVerificationStatus = async (userId, authUser) => {
    try {
        if (!authUser || !userId) {
            console.log('No user provided for sync');
            return;
        }

        // Check if Firebase Auth email is verified
        if (authUser.emailVerified) {
            // Get current Firestore data
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // If Firestore says not verified but Firebase Auth says verified, update Firestore
                if (!userData.isVerified || userData.emailVerified !== true) {
                    await updateDoc(userDocRef, {
                        isVerified: true,
                        emailVerified: true,
                        verifiedAt: new Date().toISOString(),
                        verifiedBy: 'email-verification',
                        lastVerifiedSync: new Date().toISOString()
                    });
                    console.log('✅ Synced email verification status: Firestore updated to verified');
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        console.error('Error syncing email verification status:', error);
        return false;
    }
};

// ✅ Resend Email Verification
export const resendVerificationEmail = async (email, password) => {
    try {
        // Sign in the user first (required to send verification email)
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        if (!user) {
            throw new Error("User not found");
        }

        // Check if email is already verified
        if (user.emailVerified) {
            throw new Error("Email is already verified");
        }

        // Send verification email
        await sendEmailVerification(user);
        
        console.log('✅ Verification email resent successfully to:', user.email);
        
        // Sign out after sending email (for security, since user needs to verify first)
        await signOut(auth);
        
        return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
        console.error("Error resending verification email:", error.message, error.code);
        // Provide user-friendly error messages
        if (error?.code === 'auth/too-many-requests') {
            throw new Error('Too many requests. Please wait a few minutes before requesting another verification email.');
        } else if (error?.code === 'auth/user-not-found') {
            throw new Error('User not found. Please check your email and password.');
        } else if (error?.code === 'auth/wrong-password') {
            throw new Error('Incorrect password. Please check your password and try again.');
        } else if (error?.code === 'auth/invalid-email') {
            throw new Error('Invalid email address. Please check your email and try again.');
        } else {
            throw new Error(error?.message || 'Failed to resend verification email. Please try again later.');
        }
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




