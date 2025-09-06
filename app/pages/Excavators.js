import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';

const Excavators = ({ navigation }) => {
  const goToMachineryDetails = () => {
    navigation.navigate("MachineryDetails");
  }

  return (
    <>
      {/* Header */}
      <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 80 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Excavators</Text>
      </View>

      {/* Scrollable list */}
      <ScrollView style={{ flex: 1 }}>
        {/* Card 1 */}
        <View style={{
          flexDirection: 'row', alignSelf: "center", backgroundColor: 'white',
          justifyContent: 'center', alignItems: 'center', width: '95%', height: 160,
          marginTop: 20, borderRadius: 12, elevation: 5
        }}>
          <TouchableOpacity onPress={goToMachineryDetails}>
            <Image source={require('../../assets/images/ex2.webp')} style={{ width: 162, height: 108, marginRight: 20 }} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Rippa R57</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>$250/Day</Text>
            <Text style={{ fontSize: 16 }}>Karachi</Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={{
          flexDirection: 'row', alignSelf: "center", backgroundColor: 'white',
          justifyContent: 'center', alignItems: 'center', width: '95%', height: 160,
          marginTop: 20, borderRadius: 12, elevation: 5
        }}>
          <TouchableOpacity>
            <Image source={require('../../assets/images/ex3.webp')} style={{ width: 162, height: 108, marginRight: 20 }} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Mitsubishi</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>$450/Day</Text>
            <Text style={{ fontSize: 16 }}>Lahore</Text>
          </View>
        </View>

        {/* Card 3 */}
        <View style={{
          flexDirection: 'row', alignSelf: "center", backgroundColor: 'white',
          justifyContent: 'center', alignItems: 'center', width: '95%', height: 160,
          marginTop: 20, borderRadius: 12, elevation: 5, marginBottom: 20
        }}>
          <TouchableOpacity>
            <Image source={require('../../assets/images/ex4.png')} style={{ width: 162, height: 108, marginRight: 20 }} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Hitachi Exc</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>$300/Day</Text>
            <Text style={{ fontSize: 16 }}>Islamabad</Text>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export default Excavators
