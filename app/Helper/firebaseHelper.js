// firestoreService.js
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    PhoneAuthProvider,
    signInWithCredential
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
export const handleSignUp = async (email, password, extraData = {}, sendEmailVerificationLink = true) => {
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

        // Send email verification only if requested
        let verificationEmailSent = false;
        let verificationError = null;
        
        if (sendEmailVerificationLink) {
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






// ✅ Send OTP to Phone Number
export const sendPhoneOTP = async (phoneNumber) => {
    try {
        // Format phone number with country code if not present
        let formattedPhone = phoneNumber.trim();
        
        // If phone doesn't start with +, assume it's a Pakistani number and add +92
        if (!formattedPhone.startsWith('+')) {
            // Remove any leading 0
            if (formattedPhone.startsWith('0')) {
                formattedPhone = formattedPhone.substring(1);
            }
            // Add Pakistan country code
            formattedPhone = '+92' + formattedPhone;
        }
        
        console.log('Sending OTP to phone:', formattedPhone);
        
        // Generate a 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store phone verification request in Firestore with OTP
        const verificationData = {
            phoneNumber: formattedPhone,
            otpCode: otpCode, // Store OTP for verification
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes expiry
            verified: false,
            attempts: 0
        };
        
        const { addDoc, collection } = await import('firebase/firestore');
        const { db } = await import('../../firebase');
        
        const docRef = await addDoc(collection(db, 'phoneVerifications'), verificationData);
        
        // ============================================
        // 🔴 IMPORTANT: SMS Service Integration Required
        // ============================================
        // Currently, OTP is only stored in Firestore but NOT sent via SMS
        // You need to integrate one of the following SMS services:
        //
        // OPTION 1: Twilio (Recommended for Pakistan)
        // 1. Sign up at https://www.twilio.com
        // 2. Get Account SID and Auth Token
        // 3. Install: npm install twilio
        // 4. Uncomment and configure the code below:
        /*
        const twilio = require('twilio');
        const client = twilio('YOUR_ACCOUNT_SID', 'YOUR_AUTH_TOKEN');
        await client.messages.create({
            body: `Your OTP code is: ${otpCode}. Valid for 10 minutes.`,
            from: 'YOUR_TWILIO_PHONE_NUMBER', // e.g., '+1234567890'
            to: formattedPhone
        });
        */
        
        // OPTION 2: Backend API (Recommended - More Secure)
        // ============================================
        // ✅ ACTIVE: Send SMS via Backend API
        // ============================================
        // IMPORTANT: 
        // - For Android Emulator: use 'http://10.0.2.2:3000'
        // - For iOS Simulator: use 'http://localhost:3000'
        // - For Physical Device: use 'http://YOUR_COMPUTER_IP:3000' (e.g., 'http://192.168.1.100:3000')
        // - For Production: use 'https://your-backend-api.com'
        // 
        // To find your computer's IP address:
        // Windows: ipconfig (look for IPv4 Address)
        // Mac/Linux: ifconfig (look for inet)
        // Or use: https://whatismyipaddress.com/
        
        // ⚠️ CONFIGURE THIS URL BASED ON YOUR SETUP:
        // Physical device ke liye computer ka Wi-Fi IP address use karein
        const BACKEND_API_URL = __DEV__ 
            ? 'http://10.89.67.96:3000'  // Your computer's Wi-Fi IP for physical device
            : 'https://your-backend-api.com'; // Production URL
        
        // Alternative URLs:
        // Android Emulator: 'http://10.0.2.2:3000'
        // iOS Simulator: 'http://localhost:3000'
        
        try {
            console.log(`📡 Attempting to send SMS via: ${BACKEND_API_URL}`);
            
            // Create AbortController for timeout (compatible with React Native)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
                console.warn('⏱️ Request timeout after 30 seconds');
            }, 30000); // 30 second timeout (increased for network delays)
            
            let response;
            try {
                response = await fetch(`${BACKEND_API_URL}/api/send-otp`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        phone: formattedPhone, 
                        otp: otpCode
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId); // Clear timeout if request completes
            } catch (fetchError) {
                clearTimeout(timeoutId);
                throw fetchError;
            }
            
            const result = await response.json();
            
            if (!response.ok || !result.success) {
                console.error('❌ SMS API Error:', result.error || 'Failed to send SMS');
                console.warn('⚠️ OTP is stored in Firestore. SMS was not sent. Check backend server.');
                // Don't fail registration if SMS fails, but log it
                // OTP is still stored in Firestore, user can verify manually
            } else {
                console.log('✅ SMS sent successfully via backend API');
            }
        } catch (smsError) {
            // Handle different error types
            if (smsError.name === 'AbortError' || smsError.message === 'Aborted') {
                console.error('❌ SMS Request Timeout - Request took too long');
                console.error('🔴 Possible causes:');
                console.error('   1. Backend server is not running or not accessible');
                console.error('   2. Network connectivity issue');
                console.error('   3. Firewall blocking connection');
                console.error('   4. Device and computer not on same network');
                console.error(`   5. Backend URL might be wrong: ${BACKEND_API_URL}`);
                console.error('\n💡 Troubleshooting:');
                console.error('   - Check if backend server is running');
                console.error('   - Verify phone and computer are on same WiFi');
                console.error('   - Test backend URL in browser: ' + BACKEND_API_URL);
            } else if (smsError.message?.includes('Network request failed') || smsError.name === 'TypeError') {
                console.error('🔴 Network Error - Possible causes:');
                console.error('   1. Backend server is not running');
                console.error('   2. Wrong API URL (localhost won\'t work on physical device)');
                console.error('   3. Firewall blocking connection');
                console.error('   4. Device and computer not on same network');
                console.error(`   Current URL: ${BACKEND_API_URL}`);
                console.error('   💡 For physical device, use your computer\'s IP address instead of localhost');
            } else {
                console.error('❌ SMS sending error:', smsError.message || smsError);
            }
            
            console.warn('⚠️ OTP is stored in Firestore but SMS was not sent.');
            console.warn('⚠️ Check backend API server and URL configuration.');
            // Don't fail registration if SMS fails, but log it
        }
        
        // OPTION 3: Firebase Cloud Functions
        // Create a Cloud Function that sends SMS using Twilio or other service
        // Then call it from here:
        /*
        const functions = getFunctions();
        const sendSMS = httpsCallable(functions, 'sendOTPSMS');
        await sendSMS({ phone: formattedPhone, otp: otpCode });
        */
        
        // OPTION 4: AWS SNS (If using AWS)
        // Use AWS SDK to send SMS via SNS
        
        // ============================================
        // 📝 Logging (for debugging)
        // ============================================
        console.log(`📱 OTP generated for ${formattedPhone} (Verification ID: ${docRef.id})`);
        
        return { 
            success: true, 
            verificationId: docRef.id,
            phoneNumber: formattedPhone,
            message: `OTP code has been sent to ${formattedPhone}. Please check your messages.`
        };
        
    } catch (error) {
        console.error("Error sending phone OTP:", error);
        throw new Error(error?.message || "Failed to send OTP. Please try again.");
    }
};

// ✅ Verify Phone OTP
export const verifyPhoneOTP = async (verificationId, otpCode) => {
    try {
        if (!otpCode || otpCode.length !== 6) {
            throw new Error('OTP code must be 6 digits');
        }
        
        const { getDoc, doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('../../firebase');
        
        const verificationDoc = await getDoc(doc(db, 'phoneVerifications', verificationId));
        
        if (!verificationDoc.exists()) {
            throw new Error('Verification ID not found. Please request a new OTP.');
        }
        
        const verificationData = verificationDoc.data();
        
        // Check if OTP has expired (10 minutes)
        const expiresAt = new Date(verificationData.expiresAt);
        if (new Date() > expiresAt) {
            throw new Error('OTP code has expired. Please request a new one.');
        }
        
        // Check if already verified
        if (verificationData.verified) {
            throw new Error('This phone number has already been verified.');
        }
        
        // Check attempt limit (max 5 attempts)
        if (verificationData.attempts >= 5) {
            throw new Error('Too many verification attempts. Please request a new OTP.');
        }
        
        // Verify OTP code
        if (verificationData.otpCode === otpCode) {
            // Update verification status
            await updateDoc(doc(db, 'phoneVerifications', verificationId), {
                verified: true,
                verifiedAt: new Date().toISOString(),
                attempts: (verificationData.attempts || 0) + 1
            });
            return { success: true, verified: true };
        } else {
            // Increment attempt count
            await updateDoc(doc(db, 'phoneVerifications', verificationId), {
                attempts: (verificationData.attempts || 0) + 1
            });
            throw new Error('Invalid OTP code. Please try again.');
        }
    } catch (error) {
        console.error("Error verifying phone OTP:", error);
        throw new Error(error?.message || "Failed to verify OTP. Please try again.");
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




