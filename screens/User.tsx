import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Alert, View } from 'react-native';
import { Avatar, Button, Card, IconButton, Surface, Text } from 'react-native-paper';
import { useMutation, useQuery } from 'react-query';
import { fetchHabits } from '../api/habits';
import { fetchUserData, setUserData } from '../api/userData';
import styles from '../style/styles';
import FindFriends from './FindFriends';
import Friends from './Friends';
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
      <Stack.Screen name="Friends" component={Friends}/>
      <Stack.Screen name="FindFriends" component={FindFriends}/>
    </Stack.Navigator>
  );
}

const ProfileView = () => {

  const navigation = useNavigation();

  const { data: userData } = useQuery('userData', fetchUserData);
  const { data: habitData } = useQuery('habits', fetchHabits);
  if (userData == null) navigation.navigate("ProfileEdit")
  const {full_name, description, friends} = userData;

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

      <Card style={styles.card} onPress={() => navigation.navigate("Friends")}>
        <Card.Title title={`Friends (${friends.length})`}
        left={() => <IconButton icon="account-multiple"/>}
        right={() => <IconButton icon="arrow-right"/>}/>
      </Card>
      
      <Card style={styles.card} onPress={() => navigation.navigate("Habits")}>
        <Card.Title title={`Habits (${habitData?.length})`} 
        left={() => <IconButton icon="text-box-check"/>}
        right={() => <IconButton icon="arrow-right"/>}/>
      </Card>
    </>
  )
}

const UserSetupUserspace = () => (
  <UserSetup userSpace={true}/>
)