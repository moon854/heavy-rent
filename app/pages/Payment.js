import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'

const Payment = ({ navigation }) => {
    const goToSuccess = () => {
        navigation.navigate("Success");
    }
    const [amount, setAmount] = useState("40,000")
    const [senderAcc, setSenderAcc] = useState("")
    const [receiverAcc, setReceiverAcc] = useState("03277490073")
    const [file, setFile] = useState(null)

    const pickFile = async () => {
        let result = await DocumentPicker.getDocumentAsync({})
        if (result.type === "success") {
            setFile(result.name)
        }
    }

    return (
        <>
            <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 20 }}>
                {/* Heading */}
                <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Payment</Text>
                <Text style={{ fontSize: 15, textAlign: "center", marginBottom: 20 }}>Select payment method</Text>

                {/* Logos */}
                <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/images/jazz.png')} style={{ width: 120, height: 40, resizeMode: "contain" }} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../../assets/images/easy.png')} style={{ width: 120, height: 40, resizeMode: "contain" }} />
                    </TouchableOpacity>
                </View>

                {/* Amount */}
                <TextInput
                    placeholder="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 }}
                />

                {/* Sender Account */}
                <TextInput
                    placeholder="Sender Account Number"
                    value={senderAcc}
                    onChangeText={setSenderAcc}
                    keyboardType="numeric"
                    style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 }}
                />

                {/* Receiver Account */}
                <TextInput
                    placeholder="Receiver Account Number"
                    value={receiverAcc}
                    onChangeText={setReceiverAcc}
                    keyboardType="numeric"
                    style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15 }}
                />

                {/* File Picker */}
                <TouchableOpacity
                    onPress={pickFile}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,
                        padding: 12,
                        alignItems: "center",
                        marginBottom: 20,
                        backgroundColor: "#f9f9f9"
                    }}
                >
                    <Text style={{ color: "#555" }}>{file ? file : "Select File"}</Text>
                </TouchableOpacity>

                {/* Confirm Button */}
                <TouchableOpacity
                    onPress={goToSuccess}
                    style={{
                        backgroundColor: "#47D6FF",
                        padding: 15,
                        borderRadius: 8,
                        alignItems: "center"
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Confirm</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    )
}

export default Payment
