import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text } from 'react-native';
import { Avatar, Card, Title } from 'react-native-paper';
import { Icon } from 'react-native-paper/lib/typescript/components/Avatar/Avatar';
import styles from '../style/styles';
import { ActivityAll } from './ActivityAll';
import { ActivityYou } from './ActivityYou';
import { AppTheme } from '../style/themes';

const ActivityTab = createMaterialTopTabNavigator();

export default function Activity() {
  return (
    <ActivityTab.Navigator tabBarOptions ={{labelStyle: {fontWeight: 'bold'}}}>
      <ActivityTab.Screen name="All" component={ActivityAll}/>
      <ActivityTab.Screen name="You" component={ActivityYou}/>
    </ActivityTab.Navigator>
  );
}