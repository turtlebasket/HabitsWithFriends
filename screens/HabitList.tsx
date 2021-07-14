import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { Appbar, Card, DefaultTheme, FAB, Searchbar, Text } from 'react-native-paper';
import { useQuery } from 'react-query';
import { fetchHabits, setHabits } from '../api/habits';
import styles from '../style/styles';
import { AppDarkTheme, AppDefaultTheme, AppTheme } from '../style/themes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HabitList() {

  const navigation = useNavigation();

  const {data: habits, status: habitsStatus} = useQuery('habits', fetchHabits);

  type HabitCard = {
    id: string,
    title: string,
    public: boolean
  }
  
  const renderItem = ({item, index, drag, isActive}: RenderItemParams<HabitCard>) => {

    return (
      <Card style={styles.card} onPress={() => {
        navigation.navigate("HabitView", {id: item.id})
      }}>
        <Card.Title title={item.title} 
        right={ () => (!item.public && <MaterialCommunityIcons name="eye-off" 
        color={AppTheme.colors.disabled} size={24} style={{marginRight: 14}}/>
        )}/>
      </Card>
    )
  }

  return (
    <>
      { habitsStatus == "success" && <DraggableFlatList
      contentContainerStyle={{paddingBottom: 10}}
      renderItem={renderItem}
      dragItemOverflow={false}
      data={habits as HabitCard[]}
      keyExtractor={(item: any, index) => `draggable-item-${item.id}`}
      /> }
      <FAB style={[styles.fab, {backgroundColor: AppTheme.colors.primary}]} icon="plus" onPress={() => navigation.navigate("HabitEdit", {id: undefined})}/>
    </>
  )
}