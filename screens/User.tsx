import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Alert } from 'react-native';
import { Avatar, Button, Card, IconButton, Text } from 'react-native-paper';
import { useMutation, useQuery } from 'react-query';
import { fetchUserData, setUserData } from '../api/userData';
import styles from '../style/styles';
import UserSetup from './UserSetup';

const Stack = createStackNavigator();

export default function User() {

  const navigation = useNavigation();
  
  return (
    <Stack.Navigator initialRouteName="ProfileView" screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileView" component={ProfileView}/>
      <Stack.Screen name="ProfileEdit" component={UserSetupUserspace}/>
    </Stack.Navigator>
  );
}

const ProfileView = () => {

  const navigation = useNavigation();

  const { data: userData } = useQuery('userData', fetchUserData)
  const {full_name, description} = userData;

  return (

    <>
      <Card style={styles.card}>
        <Card.Title title={full_name} subtitle={description} 
        left={() => {
          if (true) return (
            <Avatar.Icon size={44} icon="account"/>
          )
        }}
        right={() => (<IconButton icon="pencil" onPress={() => {
          navigation.navigate("ProfileEdit");
        }}/>)}
        />
      </Card>
    </>
  )
}

const UserSetupUserspace = () => (
  <UserSetup userSpace={true}/>
)