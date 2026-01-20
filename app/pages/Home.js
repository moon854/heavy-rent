import { Ionicons, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { getAllCategories } from '../Helper/firebaseHelper';
import UserProfile from '../../components/UserProfile';
import { useTheme } from '../../contexts/ThemeContext';

const Home = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      console.log('📦 Fetched categories:', categoriesData);
      
      // Debug: Log icon information for each category
      categoriesData?.forEach(cat => {
        if (cat.iconLibrary && cat.iconName) {
          console.log(`✅ Category "${cat.name}": Icon = ${cat.iconLibrary}/${cat.iconName}`);
        } else {
          console.warn(`⚠️ Category "${cat.name}": No icon set`);
        }
      });
      
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array as fallback
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  // Function to render icon based on library and name
  const renderIcon = (iconLibrary, iconName, size = 30, color = colors.primary) => {
    if (!iconLibrary || !iconName) {
      console.log('⚠️ Icon missing:', { iconLibrary, iconName });
      return <MaterialIcons name="category" size={size} color={color} />;
    }

    // Clean and normalize icon name
    const cleanIconName = String(iconName).trim();

    // Get the correct icon component
    let IconComponent;
    switch (iconLibrary) {
      case 'Ionicons':
        IconComponent = Ionicons;
        break;
      case 'MaterialIcons':
        IconComponent = MaterialIcons;
        break;
      case 'MaterialCommunityIcons':
        IconComponent = MaterialCommunityIcons;
        break;
      case 'FontAwesome':
        IconComponent = FontAwesome;
        break;
      default:
        console.warn(`❌ Unknown icon library: ${iconLibrary}`);
        return <MaterialIcons name="category" size={size} color={color} />;
    }

    // Render the icon - React Native icons silently fail if icon doesn't exist
    // So we just render it directly
    return <IconComponent name={cleanIconName} size={size} color={color} />;
  };

  // Function to get fallback icon for existing categories without icons
  const getFallbackIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    
    // Fallback icons for existing categories
    if (name.includes('excavator')) {
      return { library: 'MaterialCommunityIcons', name: 'excavator' };
    } else if (name.includes('concrete')) {
      return { library: 'MaterialCommunityIcons', name: 'tow-truck' };
    } else if (name.includes('crane')) {
      return { library: 'MaterialCommunityIcons', name: 'crane' };
    } else if (name.includes('building')) {
      return { library: 'Ionicons', name: 'business' };
    } else if (name.includes('road')) {
      return { library: 'FontAwesome', name: 'road' };
    } else if (name.includes('surface')) {
      return { library: 'Ionicons', name: 'layers' };
    }
    
    // Default fallback
    return { library: 'MaterialIcons', name: 'category' };
  };

  // Navigate to category
  const goToCategory = (category) => {
    if (!category) return;
    
    navigation.getParent()?.navigate("Excavators", {
      categoryId: category.id || category.name?.toLowerCase().replace(/\s+/g, '-'),
      categoryName: category.name || "Category"
    });
  };

  // Render categories in rows of 2
  const renderCategoriesGrid = () => {
    if (!categories || categories.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: colors.text, fontSize: 14 }}>No categories available</Text>
        </View>
      );
    }

    const rows = [];
    for (let i = 0; i < categories.length; i += 2) {
      const category1 = categories[i];
      const category2 = categories[i + 1];

      rows.push(
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '80%', marginTop: i === 0 ? 20 : 50 }}>
          {/* First category */}
          <TouchableOpacity onPress={() => goToCategory(category1)}>
            <View style={{ width: 113, height: 80, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
              {(() => {
                if (category1.iconLibrary && category1.iconName) {
                  console.log(`🎨 Rendering icon for "${category1.name}": ${category1.iconLibrary}/${category1.iconName}`);
                  return renderIcon(category1.iconLibrary, category1.iconName);
                } else {
                  const fallback = getFallbackIcon(category1.name);
                  console.log(`⚠️ Using fallback icon for "${category1.name}": ${fallback.library}/${fallback.name}`);
                  return renderIcon(fallback.library, fallback.name);
                }
              })()}
              <Text style={{ fontSize: 10, color: colors.primary, marginTop: 3, textAlign: 'center', fontWeight: '600' }}>
                {category1.name}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Second category (if exists) */}
          {category2 && (
            <TouchableOpacity onPress={() => goToCategory(category2)}>
              <View style={{ width: 113, height: 80, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card }}>
                {(() => {
                  if (category2.iconLibrary && category2.iconName) {
                    console.log(`🎨 Rendering icon for "${category2.name}": ${category2.iconLibrary}/${category2.iconName}`);
                    return renderIcon(category2.iconLibrary, category2.iconName);
                  } else {
                    const fallback = getFallbackIcon(category2.name);
                    console.log(`⚠️ Using fallback icon for "${category2.name}": ${fallback.library}/${fallback.name}`);
                    return renderIcon(fallback.library, fallback.name);
                  }
                })()}
                <Text style={{ fontSize: 10, color: colors.primary, marginTop: 3, textAlign: 'center', fontWeight: '600' }}>
                  {category2.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return rows;
  };

  const goToAdForm = () => {
    navigation.getParent()?.navigate("AdForm");
  };

  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  // Legacy functions for backward compatibility (keeping them for now but they use the dynamic approach)
  const goToSubCat = () => {
    const excavatorCategory = categories?.find(cat => 
      cat.name === 'Excavators' || 
      cat.name === 'Excavator' ||
      cat.id === 'excavators'
    );
    goToCategory(excavatorCategory || { id: 'excavators', name: 'Excavators' });
  };

  const goToBuildingEquipment = () => {
    const buildingCategory = categories?.find(cat => 
      cat.name === 'Building Equipment' || 
      cat.name === 'Building' ||
      cat.id === 'building-equipment'
    );
    goToCategory(buildingCategory || { id: 'building-equipment', name: 'Building Equipment' });
  };

  const goToSurfaceFinishing = () => {
    const surfaceCategory = categories?.find(cat => 
      cat.name === 'Surface Finishing' || 
      cat.name === 'Surface' ||
      cat.id === 'surface-finishing'
    );
    goToCategory(surfaceCategory || { id: 'surface-finishing', name: 'Surface Finishing' });
  };

  const goToCranes = () => {
    const craneCategory = categories?.find(cat => 
      cat.name === 'Cranes' || 
      cat.name === 'Crane' ||
      cat.id === 'cranes'
    );
    goToCategory(craneCategory || { id: 'cranes', name: 'Cranes' });
  };

  const goToConcreteEquipment = () => {
    const concreteCategory = categories?.find(cat => 
      cat.name === 'Concrete Equipment' || 
      cat.name === 'Concrete' ||
      cat.id === 'concrete-equipment'
    );
    goToCategory(concreteCategory || { id: 'concrete-equipment', name: 'Concrete Equipment' });
  };

  const goToRoadConstruction = () => {
    const roadCategory = categories?.find(cat => 
      cat.name === 'Road Construction' || 
      cat.name === 'Road' ||
      cat.id === 'road-construction'
    );
    goToCategory(roadCategory || { id: 'road-construction', name: 'Road Construction' });
  };

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: colors.background }} 
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
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
          }}>Rent-To-Build</Text>
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

      {/* Dynamic Categories Grid */}
      {renderCategoriesGrid()}
    </ScrollView>
  )
}

export default Home
