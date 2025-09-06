import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const RentalHistory = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 15 }}>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Card 1 */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          marginBottom: 20,
          elevation: 5,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <View style={{
            backgroundColor: '#47D6FF',
            padding: 10
          }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              Unit rental history
            </Text>
          </View>

          {/* Body */}
          <View style={{ padding: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Mitsubishi Fuso</Text>
            <Text style={{ marginTop: 5 }}>May 1, 2023</Text>
            <Text style={{ marginTop: 5 }}>
              Jl. Kurma Blok Gg1 No.21 RT10/RW20, Kel. Sukatani, 
              Kec. Tapos, Depok City
            </Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          marginBottom: 20,
          elevation: 5,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <View style={{
            backgroundColor: '#47D6FF',
            padding: 10
          }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              Unit rental history
            </Text>
          </View>

          {/* Body */}
          <View style={{ padding: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Mitsubishi Fuso</Text>
            <Text style={{ marginTop: 5 }}>May 1, 2023</Text>
            <Text style={{ marginTop: 5 }}>
              Jl. Kurma Blok Gg1 No.21 RT10/RW20, Kel. Sukatani, 
              Kec. Tapos, Depok City
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  )
}

export default RentalHistory;
