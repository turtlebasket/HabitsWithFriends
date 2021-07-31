import React, { useState } from 'react';
import { View } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Button, Text, Title } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DataProvider, RecyclerListView } from 'recyclerlistview';
import { fetchOwnHabitHistoryPaginate } from '../api/habits';
import ActivityCard from '../components/ActivityCard';
import ListItemSeparator from '../components/ListItemSeparator';

export const ActivityYou = () => {

  const {data: historyCurr} = useQuery('activity_you', fetchOwnHabitHistoryPaginate)

  // history that's being displayed to user
  const [history, setHistory] = useState<object[]>([]);

  const appendToHistory = (items: any[]) => {
    let hTemp = history;
    setHistory(hTemp.concat(items));
  }

  const renderItem = ({item}: any) => {
    const {user_id, habit_id, timestamp} = item;
    return (
      <ActivityCard user_id={user_id} habit_id={habit_id} timestamp={timestamp}/>
    )
  }

  return (
    <>
    <FlatList renderItem={renderItem} data={historyCurr ?? []} keyExtractor={(item, index) => `activity-item-${index}`} ItemSeparatorComponent={ListItemSeparator}/>

    {/* Maybe later */}
    {/* <RecyclerListView  rowRenderer={renderItem}/> */}
    </>
  );
}