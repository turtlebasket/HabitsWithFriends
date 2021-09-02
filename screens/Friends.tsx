import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { ScrollView } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import FriendCard from '../components/FriendCard';
import styles from '../style/styles';

const Friends = () => {
  
  const navigation = useNavigation();
  
  const displayFriendRequestItem = ({item}: any) => {
  }
  
  const displayFriendItem = ({item}: any) => {
    return <FriendCard uid={item.id} name={item.name}/>;
  }
  
  return (
    <>
      <Appbar>
        <Appbar.BackAction onPress={navigation.goBack}/>
        <Appbar.Content title="Friends"  /* subtitle="Displayed publicly on your profile" */ />
      </Appbar>

      <ScrollView>
        {/* Flatlist of friend requests (show/hide) */}
        {/* Flatlist of friends */}
      </ScrollView>

      <FAB style={styles.fab} icon="account-multiple-plus" onPress={() => navigation.navigate("FindFriends")}/>

    </>
  );
}

export default Friends;