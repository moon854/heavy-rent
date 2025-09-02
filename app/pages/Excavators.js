import { Image, Text, TouchableOpacity, View } from 'react-native';

const Excavators = ({navigation}) => {
    const goToMachineryDetails = () => {
        navigation.navigate("MachineryDetails");
    }

    
    return (
        <>
            <View style={{ backgroundColor: '#47D6FF', justifyContent: 'center', alignItems: 'center', width: '100%', height: 80 }}>
                <Text>Excavators</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignSelf: "center", backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', width: '95%', height: 160, marginTop: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.35)', borderBottomEndRadius: 20 }}>
                <View> <TouchableOpacity onPress={goToMachineryDetails}>

                    <Image source={require('../../assets/images/ex2.webp')} style={{ width: 162, height: 108, marginTop: -10, marginRight: 60 }} />
                </TouchableOpacity>
                </View>
                <View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Rippa R57</Text></View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>$250/Day</Text></View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Karachi</Text></View>

                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignSelf: "center", backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', width: '95%', height: 160, marginTop: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.35)', borderBottomEndRadius: 20 }}>
                <View> <TouchableOpacity>

                    <Image source={require('../../assets/images/ex3.webp')} style={{ width: 162, height: 108, marginTop: -10, marginRight: 60 }} />
                </TouchableOpacity>
                </View>
                <View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Mitsubishi </Text></View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>$450/Day</Text></View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Lahore</Text></View>
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignSelf: "center", backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', width: '95%', height: 160, marginTop: 20, boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.35)', borderBottomEndRadius: 20 }}>
                <View> <TouchableOpacity>

                    <Image source={require('../../assets/images/ex4.png')} style={{ width: 162, height: 108, marginTop: -10, marginRight: 60 }} />
                </TouchableOpacity>
                </View>
                <View>
                    <View> 
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Hitachi Exc</Text></View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>$300/Day</Text></View>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Islamabad</Text></View>
                </View>
            </View>
        </>

    )
}

export default Excavators