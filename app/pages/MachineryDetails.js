import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const MachineryDetails = ({ navigation }) => {
  const goToRForm = () => {
    navigation.navigate("RenterForm");
  };

  const goToChat = () => {
    navigation.navigate("Chat");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20 }}>Rippa R57</Text>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <Entypo style={{ marginLeft: 20, marginTop: 4 }} name="star-outlined" size={20} color="#F2CF63" />
        <Text style={{ fontSize: 20, marginLeft: 5 }}>5.5</Text>
      </View>

      <Image
        source={require('../../assets/images/ex2.webp')}
        style={{ width: 271, height: 181, marginTop: -10, marginLeft: 50 }}
      />

      {/* Header Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, marginLeft: 20 }}>Specification</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 15, marginRight: 5 }}>See All</Text>
        </TouchableOpacity>
        <FontAwesome style={{ marginRight: 20 }} name="angle-right" size={18} color="black" />
      </View>

      {/* Static Specifications */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10, paddingLeft: 20 }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            width: 140,
            height: 60,
            marginRight: 15,
            padding: 8,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Power</Text>
          <Text style={{ fontSize: 12 }}>110 ps @ 2,800 rpm</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            width: 140,
            height: 60,
            marginRight: 15,
            padding: 8,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Machine</Text>
          <Text style={{ fontSize: 12 }}>4,009 cc</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            width: 140,
            height: 60,
            marginRight: 15,
            padding: 8,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Torque</Text>
          <Text style={{ fontSize: 12 }}>28.0 kgm @ 1,800 rpm</Text>
        </View>
      </ScrollView>

      {/* Rental Policy */}
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 20, marginTop: 20 }}>Rental Policy</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            width: 170,
            height: 50,
            marginTop: 20,
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 12 }}>The rental price includes PPh and VAT</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            width: 170,
            height: 50,
            marginTop: 20,
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 12 }}>The rental price includes PPh and VAT</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            width: 170,
            height: 50,
            marginTop: 20,
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 12 }}>The rental price includes PPh and VAT</Text>
        </View>

        <View
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            width: 170,
            height: 50,
            marginTop: 20,
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 12 }}>The rental price includes PPh and VAT</Text>
        </View>
      </View>

      {/* Bottom Section with Buttons */}
      <View
        style={{
          backgroundColor: '#f2f2f2',
          marginTop: 50,
          width: '98%',
          height: 140,
          alignSelf: 'center',
          borderRadius: 8,
          padding: 15,
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Rp. 40,000 / 24 hours</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={goToChat}>
            <View
              style={{
                width: 150,
                height: 40,
                borderWidth: 1,
                borderColor: '#47D6FF',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, color: '#47D6FF' }}>Chat With Admin</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToRForm}>
            <View
              style={{
                width: 150,
                height: 40,
                backgroundColor: '#47D6FF',
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, color: '#fff' }}>Request For Rent</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MachineryDetails;
