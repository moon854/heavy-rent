import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import { Keyboard } from 'react-native';
import { verifyPhoneOTP, sendPhoneOTP } from '../Helper/firebaseHelper';

const Verfication = ({navigation, route}) => {
    const params = route?.params || {};
    const [verificationId, setVerificationId] = useState(params.verificationId);
    const [phoneNumber, setPhoneNumber] = useState(params.phoneNumber);
    const [email] = useState(params.email);
    const [otpCode, setOtpCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (!verificationId || !phoneNumber) {
            Alert.alert('Error', 'Verification information missing. Please register again.');
            navigation.navigate('Register');
        }
    }, []);

    const handleVerify = async () => {
        if (!otpCode || otpCode.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit OTP code');
            return;
        }

        if (!verificationId) {
            Alert.alert('Error', 'Verification ID not found');
            return;
        }

        try {
            setIsVerifying(true);
            const result = await verifyPhoneOTP(verificationId, otpCode);
            
            if (result.success && result.verified) {
                // Update user's phone verification status in Firestore
                try {
                    const { updateDoc, doc } = await import('firebase/firestore');
                    const { db } = await import('../../firebase');
                    const { getDocs, collection, query, where } = await import('firebase/firestore');
                    
                    // Find user by phone number
                    const usersRef = collection(db, 'users');
                    const q = query(usersRef, where('phone', '==', phoneNumber));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        await updateDoc(doc(db, 'users', userDoc.id), {
                            phoneVerified: true,
                            phoneVerifiedAt: new Date().toISOString()
                        });
                    }
                } catch (updateError) {
                    console.error('Error updating user phone verification:', updateError);
                    // Don't fail the verification if update fails
                }
                
                Alert.alert(
                    'Success', 
                    'Phone number verified successfully! You can now login.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Verification error:', error);
            Alert.alert('Error', error.message || 'Failed to verify OTP. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Phone number not found');
            return;
        }

        try {
            setIsResending(true);
            const result = await sendPhoneOTP(phoneNumber);
            
            if (result.success) {
                Alert.alert('Success', `OTP code has been resent to ${result.phoneNumber}`);
                // Update verificationId for new OTP
                if (result.verificationId) {
                    setVerificationId(result.verificationId);
                }
            } else {
                Alert.alert('Error', 'Failed to resend OTP. Please try again.');
            }
        } catch (error) {
            console.error('Resend error:', error);
            Alert.alert('Error', error.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const goToLogin = () => {
        navigation.navigate("Login");
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', paddingTop: 45, fontWeight: 'bold' }}>
                    Phone Number Verification
                </Text>
                <View>
                    <Text style={{textAlign:'center', marginTop: 28, fontSize: 14, color: '#666'}}>
                        We have sent a 6-digit verification code to {phoneNumber || 'your phone number'}
                    </Text>
                </View>
                <OtpInput
                    numberOfDigits={6}
                    focusColor="#47D6FF"
                    focusStickBlinkingDuration={500}
                    onTextChange={(text) => {
                        setOtpCode(text);
                        if (text.length === 6) {
                            Keyboard.dismiss();
                        }
                    }}
                    onFilled={(text) => {
                        Keyboard.dismiss();
                        setOtpCode(text);
                    }}
                    textInputProps={{
                        accessibilityLabel: 'One-Time Password',
                    }}
                    theme={{
                        containerStyle: {
                            marginTop: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        pinCodeContainerStyle: {
                            width: 50,
                            height: 50,
                            margin: 5,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: '#ccc',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        pinCodeTextStyle: {
                            fontSize: 18,
                            color: '#000',
                        },
                        focusStickStyle: {
                            height: 2.5,
                            width: 50,
                            backgroundColor: '#47D6FF',
                        },
                        focusedPinCodeContainerStyle: {
                            borderColor: '#47D6FF',
                        },
                    }}
                />
                <TouchableOpacity 
                    onPress={handleResendCode}
                    disabled={isResending}
                    style={{ marginTop: 20, alignItems: 'center' }}
                >
                    {isResending ? (
                        <ActivityIndicator size="small" color="#47D6FF" />
                    ) : (
                        <Text style={{textAlign:'center', color:'#47D6FF', fontSize: 14, fontWeight: '600'}}>
                            Re-Send Code
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={handleVerify} 
                    disabled={isVerifying || otpCode.length !== 6}
                    style={{
                        width: "50%", 
                        height: 50,
                        backgroundColor: (isVerifying || otpCode.length !== 6) ? "#ccc" : "#47D6FF",
                        alignSelf: 'center',
                        borderRadius: 10, 
                        marginTop: 50,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isVerifying ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>
                            Verify
                        </Text>
                    )}
                </TouchableOpacity>

                {email && (
                    <View style={{ marginTop: 30, padding: 15, backgroundColor: '#f0f0f0', borderRadius: 10 }}>
                        <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
                            Note: Please also check your email ({email}) for verification link if you selected email verification.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default Verfication