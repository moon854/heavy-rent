import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { getAllCategories } from '../Helper/firebaseHelper';
import UserProfile from '../../components/UserProfile';
import { useTheme } from '../../contexts/ThemeContext';

const Home = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      console.log('Fetched categories:', categoriesData);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array as fallback
    }
  };

  const goToSubCat = () => {
    const excavatorCategory = categories?.find(cat => 
      cat.name === 'Excavators' || 
      cat.name === 'Excavator' ||
      cat.id === 'excavators'
    );
    navigation.getParent()?.navigate("Excavators", { 
      categoryId: excavatorCategory?.id || 'excavators', 
      categoryName: excavatorCategory?.name || "Excavators" 
    });
  }

  const goToAdForm = () => {
    navigation.getParent()?.navigate("AdForm");
  }

  const goToProfile = () => {
    navigation.navigate("Profile");
  }

  const goToBuildingEquipment = () => {
    const buildingCategory = categories?.find(cat => 
      cat.name === 'Building Equipment' || 
      cat.name === 'Building' ||
      cat.id === 'building-equipment'
    );
    navigation.getParent()?.navigate("Excavators", { 
      categoryId: buildingCategory?.id || 'building-equipment', 
      categoryName: buildingCategory?.name || "Building Equipment" 
    });
  }

  const goToSurfaceFinishing = () => {
    const surfaceCategory = categories?.find(cat => 
      cat.name === 'Surface Finishing' || 
      cat.name === 'Surface' ||
      cat.id === 'surface-finishing'
    );
    navigation.getParent()?.navigate("Excavators", { 
      categoryId: surfaceCategory?.id || 'surface-finishing', 
      categoryName: surfaceCategory?.name || "Surface Finishing" 
    });
  }

  const goToCranes = () => {
    const craneCategory = categories?.find(cat => 
      cat.name === 'Cranes' || 
      cat.name === 'Crane' ||
      cat.id === 'cranes'
    );
    navigation.getParent()?.navigate("Excavators", { 
      categoryId: craneCategory?.id || 'cranes', 
      categoryName: craneCategory?.name || "Cranes" 
    });
  }

  const goToConcreteEquipment = () => {
    const concreteCategory = categories?.find(cat => 
      cat.name === 'Concrete Equipment' || 
      cat.name === 'Concrete' ||
      cat.id === 'concrete-equipment'
    );
    navigation.getParent()?.navigate("Excavators", { 
      categoryId: concreteCategory?.id || 'concrete-equipment', 
      categoryName: concreteCategory?.name || "Concrete Equipment" 
    });
  }

  const goToRoadConstruction = () => {
    const roadCategory = categories?.find(cat => 
      cat.name === 'Road Construction' || 
      cat.name === 'Road' ||
      cat.id === 'road-construction'
    );
    navigation.getParent()?.navigate("Excavators", { 
      categoryId: roadCategory?.id || 'road-construction', 
      categoryName: roadCategory?.name || "Road Construction" 
    });
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%', marginTop: 30 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: '800', 
            color: colors.primary, 
            textAlign: 'left', 
            letterSpacing: 2,
            textShadowColor: colors.primary + '30',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4
          }}>HeavyRent</Text>
        </View>
        <UserProfile 
          size="medium" 
          showName={false} 
          onPress={goToProfile}
          style={{ marginRight: 0 }}
        />
      </View>

      <TouchableOpacity onPress={goToAdForm}>
        <View style={{ width: 120, height: 45, backgroundColor: colors.primary, borderRadius: 10, marginTop: 40, alignSelf: 'center' }}>
          <Text style={{ fontSize: 15, color: colors.textInverse, textAlign: 'center', paddingTop: 10 }}>+Post New Ad</Text>
        </View>
      </TouchableOpacity>

      <View style={{ width: '90%', backgroundColor: colors.card, borderRadius: 15, marginTop: 35, marginBottom: 15, paddingVertical: 15, paddingHorizontal: 20, alignSelf: 'center', shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: colors.border }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, textAlign: 'center', letterSpacing: 1 }}>CATEGORIES</Text>
      </View>

      {/* Categories Rows */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%' }}>
        <TouchableOpacity onPress={goToSubCat}>
          <View style={{ width: 113, height: 80, marginTop: 20, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
            <Ionicons name="construct" size={30} color={colors.primary} />
            <Text style={{ fontSize: 10, color: colors.primary, marginTop: 3, textAlign: 'center', fontWeight: '600' }}>Excavators</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToConcreteEquipment}>
          <View style={{ width: 113, height: 80, marginTop: 20, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
            <Ionicons name="cube" size={30} color={colors.primary} />
            <Text style={{ fontSize: 10, color: colors.primary, marginTop: 3, textAlign: 'center', fontWeight: '600' }}>Concrete Equipment</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%' }}>
        <TouchableOpacity onPress={goToCranes}>
          <View style={{ width: 113, height: 80, marginTop: 50, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
            <Ionicons name="git-network" size={30} color={colors.primary} />
            <Text style={{ fontSize: 10, color: colors.primary, marginTop: 3, textAlign: 'center', fontWeight: '600' }}>Crane</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToBuildingEquipment}>
          <View style={{ width: 113, height: 80, marginTop: 50, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
            <Ionicons name="business" size={30} color={colors.primary} />
            <Text style={{ fontSize: 10, color: colors.primary, marginTop: 3, textAlign: 'center', fontWeight: '600' }}>Building Equipment</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%' }}>
        <TouchableOpacity onPress={goToRoadConstruction}>
          <View style={{ width: 113, height: 80, marginTop: 50, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
            <Ionicons name="car" size={30} color={colors.primary} />
            <Text style={{ fontSize: 10, color: colors.primary, marginTop: 3, textAlign: 'center', fontWeight: '600' }}>Road Construction</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToSurfaceFinishing}>
          <View style={{ width: 113, height: 80, marginTop: 50, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
            <Ionicons name="layers" size={30} color={colors.primary} />
            <Text style={{ fontSize: 10, color: colors.primary, marginTop: 3, textAlign: 'center', fontWeight: '600' }}>Surface Finishing</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Home

