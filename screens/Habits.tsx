import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HabitEdit from './HabitEdit';
import HabitList from './HabitList';
import HabitView from './HabitView';

const Stack = createStackNavigator();

export default function HabitsScreen() {

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HabitList" component={HabitList}/>
      <Stack.Screen name="HabitView" component={HabitView}/>
      <Stack.Screen name="HabitEdit" component={HabitEdit}/>
    </Stack.Navigator>
  )
}
