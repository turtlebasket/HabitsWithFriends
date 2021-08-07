import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Appbar } from 'react-native-paper';

const Friends = () => {
  
  const navigation = useNavigation();
  
  return (
    <>
      <Appbar>
        <Appbar.BackAction onPress={navigation.goBack}/>
        <Appbar.Content title="Friends"  /* subtitle="Displayed publicly on your profile" */ />
      </Appbar>
      

    </>
  );
}

export default Friends;