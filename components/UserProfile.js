import React, { useMemo } from 'react';
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
  
  // Get user initials for profile picture placeholder
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`;
    } else if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials();
  
  // Get font size for initials based on profile size
  const getInitialFontSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'medium':
        return 18;
      case 'large':
        return 28;
      case 'xlarge':
        return 36;
      default:
        return 18;
    }
  };

  const initialFontSize = getInitialFontSize();
  
  // Generate cache-busted image URL whenever user?.imageUrl changes
  // This ensures the image refreshes immediately when Redux state updates
  // Using useMemo with Date.now() ensures a fresh timestamp each time imageUrl changes
  const imageSource = useMemo(() => {
    if (user?.imageUrl && user.imageUrl.startsWith('http')) {
      // Add cache busting with timestamp to force fresh load
      // The timestamp is generated fresh each time useMemo runs (when imageUrl changes)
      const separator = user.imageUrl.includes('?') ? '&' : '?';
      const timestamp = Date.now();
      const cacheBustedUrl = `${user.imageUrl}${separator}_v=${timestamp}`;
      console.log('UserProfile: Generated cache-busted URL:', cacheBustedUrl);
      console.log('UserProfile: Image URL changed, timestamp:', timestamp);
      return { uri: cacheBustedUrl };
    }
    return null; // No default image - show initials instead
  }, [user?.imageUrl]); // Re-compute whenever imageUrl changes

  const ProfileContent = () => (
    <View style={[styles.container, style]}>
      {imageSource ? (
        <Image
          key={`profile-img-${user?.uid || 'default'}-${user?.imageUrl || 'no-img'}`}
          source={imageSource}
          style={[
            sizeStyles,
            styles.profileImage,
            imageStyle
          ]}
          onError={(error) => {
            console.error('UserProfile: Error loading image:', error);
            console.error('UserProfile: Failed URL:', user?.imageUrl);
          }}
          onLoad={() => {
            console.log('UserProfile: Image loaded successfully');
          }}
          resizeMode="cover"
        />
      ) : (
        <View style={[
          sizeStyles,
          styles.profileImage,
          styles.initialContainer,
          imageStyle
        ]}>
          <Text style={[
            styles.initialText,
            { fontSize: initialFontSize }
          ]}>
            {initials}
          </Text>
        </View>
      )}
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
  initialContainer: {
    backgroundColor: '#47D6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
  nameText: {
    marginTop: 5,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default UserProfile;
