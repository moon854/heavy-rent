import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const RentalHistory = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 15 }}>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Rental (Ongoing) */}
        <View style={{
          backgroundColor: colors.card,
          borderRadius: 10,
          marginBottom: 20,
          elevation: 5,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border
        }}>
          {/* Header */}
          <View style={{
            backgroundColor: colors.primary,
            padding: 10
          }}>
            <Text style={{ color: colors.textInverse, fontSize: 16, fontWeight: 'bold' }}>
              Current vehicle on rent
            </Text>
          </View>

          {/* Body */}
          <View style={{ padding: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.textPrimary }}>Mitsubishi Fuso</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>Started: Sep 25, 2025</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>Duration: Ongoing</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>Status: On rent</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>
              Jl. Kurma Blok Gg1 No.21 RT10/RW20, Kel. Sukatani, 
              Kec. Tapos, Depok City
            </Text>
          </View>
        </View>
        
        {/* Card 1 */}
        <View style={{
          backgroundColor: colors.card,
          borderRadius: 10,
          marginBottom: 20,
          elevation: 5,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border
        }}>
          {/* Header */}
          <View style={{
            backgroundColor: colors.primary,
            padding: 10
          }}>
            <Text style={{ color: colors.textInverse, fontSize: 16, fontWeight: 'bold' }}>
              Unit rental history
            </Text>
          </View>

          {/* Body */}
          <View style={{ padding: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.textPrimary }}>Mitsubishi Fuso</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>May 1, 2023</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>Duration: 4 hours</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>
              Jl. Kurma Blok Gg1 No.21 RT10/RW20, Kel. Sukatani, 
              Kec. Tapos, Depok City
            </Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={{
          backgroundColor: colors.card,
          borderRadius: 10,
          marginBottom: 20,
          elevation: 5,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border
        }}>
          {/* Header */}
          <View style={{
            backgroundColor: colors.primary,
            padding: 10
          }}>
            <Text style={{ color: colors.textInverse, fontSize: 16, fontWeight: 'bold' }}>
              Unit rental history
            </Text>
          </View>

          {/* Body */}
          <View style={{ padding: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.textPrimary }}>Mitsubishi Fuso</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>May 1, 2023</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>Duration: 2 days</Text>
            <Text style={{ marginTop: 5, color: colors.textSecondary }}>
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
