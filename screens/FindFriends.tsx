import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { useState } from 'react';
import { Appbar, Searchbar } from 'react-native-paper';

const FindFriends = () => {
  
  const navigation = useNavigation();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  return (
    <>
      <Appbar>
        <Appbar.BackAction onPress={navigation.goBack}/>
        {/* <Appbar.Content title="Find New Friends"/> */}
        <Searchbar placeholder="Search for users..." value={searchQuery} onChangeText={val => setSearchQuery(val)}/>

      </Appbar>

    </>
  )
}

export default FindFriends;