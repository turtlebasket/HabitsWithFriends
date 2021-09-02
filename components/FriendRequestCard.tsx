import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { TouchableNativeFeedback, View } from 'react-native';
import { Avatar, Text } from 'react-native-paper';

type props = {
  uid: string,
  name: string,
  pfp?: string
}

const FriendRequestCard = (props: props) => {

  const avatarSize = 40;
  const navigation = useNavigation();
  
  const {uid, name} = props;

  return (
    <>
      <TouchableNativeFeedback onPress={() => {
        console.log(`Navigate to ${uid}.`)
      }}>
        <View style={{flex: 1, flexDirection: 'row', padding: 20}}>
          { props.pfp 
          // ? <Avatar.Image
          ? <Avatar.Icon size={avatarSize} icon="account" style={{alignSelf: 'center', marginTop: 16, marginBottom: 8}}/> 
          : <Avatar.Icon size={avatarSize} icon="account" style={{alignSelf: 'center', marginTop: 16, marginBottom: 8}}/> }
          <Text style={{fontWeight: 'bold'}}>{name}</Text>
        </View>
      </TouchableNativeFeedback>
    </>
  )
}