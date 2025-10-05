import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const UserProfile = ({ 
  size = 'medium', 
  showName = true, 
  style = {},
  textStyle = {},
  imageStyle = {},
  onPress = null
}) => {
  const user = useSelector((state) => state.home.user);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 30, height: 30, borderRadius: 15 };
      case 'medium':
        return { width: 50, height: 50, borderRadius: 25 };
      case 'large':
        return { width: 80, height: 80, borderRadius: 40 };
      case 'xlarge':
        return { width: 100, height: 100, borderRadius: 50 };
      default:
        return { width: 50, height: 50, borderRadius: 25 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'medium':
        return 14;
      case 'large':
        return 16;
      case 'xlarge':
        return 18;
      default:
        return 14;
    }
  };

  const sizeStyles = getSizeStyles();
  const textSize = getTextSize();

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || 'User';
  const profileImage = user?.imageUrl || require('../assets/images/dp.png.jpg');

  const ProfileContent = () => (
    <View style={[styles.container, style]}>
      <Image
        source={typeof profileImage === 'string' ? { uri: profileImage } : profileImage}
        style={[
          sizeStyles,
          styles.profileImage,
          imageStyle
        ]}
      />
      {showName && (
        <Text style={[
          styles.nameText,
          { fontSize: textSize },
          textStyle
        ]}>
          {displayName}
        </Text>
      )}
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress}>
      <ProfileContent />
    </TouchableOpacity>
  ) : (
    <ProfileContent />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    borderWidth: 2,
    borderColor: '#47D6FF',
  },
  nameText: {
    marginTop: 5,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default UserProfile;


