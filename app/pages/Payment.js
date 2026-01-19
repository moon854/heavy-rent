import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { uploadImageToCloudinary } from '../Helper/firebaseHelper'
import { notifyAdminRentRequest } from '../Helper/adminNotifications'
import { useSelector } from 'react-redux'

const Payment = ({ navigation, route }) => {
    const paymentData = route?.params?.paymentData || {};
    const machineryData = route?.params?.machineryData || {}; // Machinery details
    const [selectedImage, setSelectedImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const user = useSelector((state) => state?.home?.user)

    const pickImage = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to your photos to upload payment proof.');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const handleSubmit = async () => {
        if (!selectedImage) {
            Alert.alert('Required', 'Please attach payment proof/screenshot before submitting.');
            return;
        }

        try {
            setLoading(true);

            // Upload payment proof image to Cloudinary
            const paymentProofUrl = await uploadImageToCloudinary(selectedImage.uri);

            // Create rent request object
            const userId = user?.uid || user?.id || '';
            console.log('Payment: Creating rent request for user:', userId);
            
            const rentRequest = {
                userId: userId,
                userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown User',
                userEmail: user?.email || '',
                userPhone: user?.phone || paymentData.rentalInfo?.phone || 'N/A',
                userAddress: paymentData.rentalInfo?.address || user?.address || 'N/A',
                
                // Machinery details
                machineryId: machineryData?.id || '',
                machineryName: machineryData?.name || 'N/A',
                machineryOwnerId: machineryData?.userId || machineryData?.ownerId || '',
                machineryOwnerName: machineryData?.ownerName || 'Unknown Owner',
                machineryOwnerPhone: machineryData?.ownerPhone || 'N/A',
                machineryOwnerCNIC: machineryData?.ownerCNIC || 'N/A',
                machineryOwnerAddress: machineryData?.address || machineryData?.location || 'N/A',
                machineryImages: machineryData?.imageUrls || [machineryData?.imageUrl] || [],
                
                // Rental details
                rentalStartDate: paymentData.rentalInfo?.rentalStartDate || 'N/A',
                rentalDuration: paymentData.rentalInfo?.rentalDuration || '1 Day',
                numberOfDays: paymentData.numberOfDays || 1,
                deliveryLocation: paymentData.rentalInfo?.deliveryLocation || 'N/A',
                projectType: paymentData.rentalInfo?.projectType || 'Construction',
                operatorRequired: paymentData.rentalInfo?.operatorRequired || 'No',
                
                // Payment details
                rentPerDay: paymentData.rentPerDay || 0,
                totalRent: paymentData.totalRent || 0,
                securityDeposit: paymentData.securityDeposit || 0,
                advancePayment: paymentData.advancePayment || 0,
                remainingPayment: paymentData.remainingPayment || 0,
                grandTotal: paymentData.grandTotal || 0,
                paymentProofUrl: paymentProofUrl || '',
                
                // Request status
                status: 'pending', // pending, approved, rejected
                requestedAt: serverTimestamp(),
                approvedAt: null,
                approvedBy: null
            };

            console.log('Rent request data before saving:', rentRequest);

            // Save rent request to Firebase
            const docRef = await addDoc(collection(db, 'rentRequests'), rentRequest);
            console.log('Rent request saved:', docRef.id);

            // Notify admin about new rent request
            await notifyAdminRentRequest({
                ...rentRequest,
                id: docRef.id
            });

            setLoading(false);
            navigation.navigate("Success");
        } catch (error) {
            console.error('Error submitting rent request:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to submit request. Please try again.');
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 20 }}>
            
            {/* Logo */}
            <View style={{ alignItems: 'center', marginVertical: 30 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 12, position: 'relative' }}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: '#47D6FF', position: 'absolute' }} />
                        <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#47D6FF', position: 'absolute' }} />
                        <View style={{ width: 16, height: 16, backgroundColor: '#47D6FF', borderRadius: 8 }} />
                    </View>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', letterSpacing: 1 }}>RENT</Text>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#666', letterSpacing: 0.5 }}>TO</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', letterSpacing: 1 }}>BUILD</Text>
                    </View>
                </View>
            </View>

            {/* Heading */}
            <Text style={{ fontSize: 24, fontWeight: "700", textAlign: "center", marginBottom: 8, color: '#333' }}>
                Payment Proof
            </Text>
            <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 30, color: '#666' }}>
                Please attach payment screenshot or transaction image
            </Text>

            {/* Payment Details */}
            <View style={{ backgroundColor: '#f9f9f9', borderRadius: 12, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#e0e0e0' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 20, textAlign: 'center' }}>
                    Payment Details
                </Text>

                {/* Payment Amount */}
                {paymentData.advancePayment && (
                    <View style={{ backgroundColor: '#47D6FF10', borderRadius: 8, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#47D6FF' }}>
                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Advance Payment Amount:</Text>
                        <Text style={{ fontSize: 28, fontWeight: '700', color: '#47D6FF' }}>
                            Rs. {paymentData.advancePayment?.toLocaleString()} <Text style={{ fontSize: 16, color: '#47D6FF', opacity: 0.8 }}>(PKR)</Text>
                        </Text>
                    </View>
                )}

                {/* Account Details */}
                <View style={{ backgroundColor: '#e8f5e9', borderRadius: 8, padding: 15, borderLeftWidth: 4, borderLeftColor: '#4caf50' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="wallet" size={20} color="#4caf50" />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#2e7d32', marginLeft: 8 }}>
                            Send Payment To (EasyPaisa):
                        </Text>
                    </View>
                    
                    <View style={{ backgroundColor: '#fff', borderRadius: 6, padding: 12, marginBottom: 8 }}>
                        <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>EasyPaisa Account Number:</Text>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#333', letterSpacing: 1 }}>
                            03107635052
                        </Text>
                    </View>

                    <View style={{ backgroundColor: '#fff', borderRadius: 6, padding: 12 }}>
                        <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Account Title:</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                            Muhammad Noor
                        </Text>
                    </View>
                </View>
            </View>

            {/* Image Upload Section */}
            <View style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15, textAlign: 'center' }}>
                    Attach Payment/Transaction Image
                </Text>

                {/* Image Preview */}
                {selectedImage ? (
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <Image 
                            source={{ uri: selectedImage.uri }} 
                            style={{ 
                                width: '100%', 
                                height: 300, 
                                borderRadius: 12, 
                                marginBottom: 15,
                                borderWidth: 2,
                                borderColor: '#47D6FF'
                            }} 
                            resizeMode="contain"
                        />
                        <TouchableOpacity 
                            onPress={pickImage}
                            style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center',
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#47D6FF',
                                backgroundColor: '#fff'
                            }}
                        >
                            <Ionicons name="images" size={20} color="#47D6FF" />
                            <Text style={{ marginLeft: 8, color: '#47D6FF', fontWeight: '600' }}>Change Image</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={pickImage}
                        style={{
                            borderWidth: 2,
                            borderColor: "#47D6FF",
                            borderStyle: 'dashed',
                            borderRadius: 12,
                            padding: 40,
                            alignItems: "center",
                            backgroundColor: "#f9f9f9"
                        }}
                    >
                        <Ionicons name="cloud-upload-outline" size={60} color="#47D6FF" />
                        <Text style={{ color: "#47D6FF", fontSize: 16, fontWeight: "600", marginTop: 15 }}>
                            Tap to Upload Image
                        </Text>
                        <Text style={{ color: "#999", fontSize: 12, marginTop: 5 }}>
                            (Screenshot or Transaction Proof)
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Instructions */}
            <View style={{ backgroundColor: '#fff3cd', borderRadius: 10, padding: 15, marginBottom: 30, borderLeftWidth: 4, borderLeftColor: '#ffc107' }}>
                <Text style={{ fontSize: 14, color: '#856404', fontWeight: '600', marginBottom: 8 }}>
                    📌 Instructions:
                </Text>
                <Text style={{ fontSize: 12, color: '#856404', lineHeight: 18 }}>
                    • Make payment via JazzCash or EasyPaisa{'\n'}
                    • Take screenshot of successful transaction{'\n'}
                    • Upload the screenshot here{'\n'}
                    • Your request will be verified within 24 hours
                </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!selectedImage || loading}
                style={{
                    backgroundColor: selectedImage && !loading ? "#47D6FF" : "#ccc",
                    padding: 16,
                    borderRadius: 10,
                    alignItems: "center",
                    marginBottom: 30,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    shadowColor: selectedImage ? '#47D6FF' : '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5
                }}
            >
                {loading ? (
                    <>
                        <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                            Submitting...
                        </Text>
                    </>
                ) : (
                    <>
                        <Ionicons name="checkmark-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                            Submit Payment Proof
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
    )
}

export default Payment
