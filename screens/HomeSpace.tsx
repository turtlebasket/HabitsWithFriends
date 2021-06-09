import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { fetchUserData } from '../api/userData';
import Activity from './Activity';
import HabitsScreen from './Habits';
import User from './User';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppTheme } from '../style/themes';
import { fetchHabit, fetchHabits } from '../api/habits';

export default function HomeSpace() {

  const queryClient = useQueryClient();
  queryClient.prefetchQuery("habits", fetchHabits);
  queryClient.prefetchQuery("userData", fetchUserData);

  const navigation = useNavigation();

  const BottomTab = createMaterialBottomTabNavigator();

  return (
    <BottomTab.Navigator shifting={true}>
      <BottomTab.Screen name="Habits" component={HabitsScreen}
      options={{tabBarIcon: ({color}) => <MaterialCommunityIcons name="text-box-check" color={color} size={25}/>}}
      />
      <BottomTab.Screen name="Activity" component={Activity}
      options={{tabBarIcon: ({color}) => <MaterialCommunityIcons name="heart" color={color} size={25}/>}}
      />
      <BottomTab.Screen name="You" component={User}
      options={{tabBarIcon: ({color}) => <MaterialCommunityIcons name="account" color={color} size={25}/>}}
      />
    </BottomTab.Navigator>
  )
}