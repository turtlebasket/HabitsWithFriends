import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Alert, View } from 'react-native';
import { Avatar, Button, Card, IconButton, Surface, Text } from 'react-native-paper';
import { useMutation, useQuery } from 'react-query';
import { fetchUserData, setUserData } from '../api/userData';
import styles from '../style/styles';
import Settings from './Settings';
import UserSetup from './UserSetup';

const Stack = createStackNavigator();

export default function User() {

  const navigation = useNavigation();
  
  return (
    <Stack.Navigator initialRouteName="ProfileView" screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProfileView" component={ProfileView}/>
      <Stack.Screen name="ProfileEdit" component={UserSetupUserspace}/>
      <Stack.Screen name="Settings" component={Settings}/>
    </Stack.Navigator>
  );
}

const ProfileView = () => {

  const navigation = useNavigation();

  const { data: userData } = useQuery('userData', fetchUserData)
  if (userData == null) navigation.navigate("ProfileEdit")
  const {full_name, description} = userData;

  // options
  const avatarSize=80

  return (

    <>
      <Avatar.Icon size={avatarSize} icon="account" style={{alignSelf: 'center', marginTop: 16, marginBottom: 8}}/>
      <Card style={styles.card}>
        <Card.Title title={full_name} subtitle={description} 
        right={() => (
          <View style={{flexDirection: 'row' }}>
            <IconButton icon="pencil" onPress={() => {
              navigation.navigate("ProfileEdit");
            }}/>
            {/* if user = me */}
            <IconButton icon="cog" onPress={() => {
              navigation.navigate("Settings");
            }}/>
          </View>
        )}
        />
      </Card>
    </>
  )
}

const UserSetupUserspace = () => (
  <UserSetup userSpace={true}/>
)