import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const UserInfo = ({ 
  showEmail = false, 
  showPhone = false,
  style = {},
  nameStyle = {},
  emailStyle = {},
  phoneStyle = {}
}) => {
  const user = useSelector((state) => state.home.user);
  
  const displayName = user?.firstName || 'User';
  const displayEmail = user?.email || '';
  const displayPhone = user?.phone || '';

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.name, nameStyle]}>
        {displayName}
      </Text>
      
      {showEmail && displayEmail && (
        <Text style={[styles.email, emailStyle]}>
          {displayEmail}
        </Text>
      )}
      
      {showPhone && displayPhone && (
        <Text style={[styles.phone, phoneStyle]}>
          {displayPhone}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  phone: {
    fontSize: 12,
    color: '#666',
    marginTop: 1,
  },
});

export default UserInfo;






