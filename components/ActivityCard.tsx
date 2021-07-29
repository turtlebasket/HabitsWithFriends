import React, { useState } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useQuery } from 'react-query';
import { fetchHabits, setHabit } from '../api/habits';
import { supabase, userId } from '../api/supabase';
import { fetchUserData } from '../api/userData';

type props = {
  user_id: string,
  habit_id: string,
  timestamp: string
}

export default function ActivityCard(props: props) {
  const { user_id, habit_id, timestamp } = props;

  const {data: habits, status: habitsStatus} = useQuery("habits", fetchHabits);
  const {data: userData} = useQuery('userData', fetchUserData);

  const [userName, setUserName] = useState<string>("");
  const [habitName, setHabitName] = useState<string>("");
  const [isOwn, setIsOwn] = useState<boolean>(false);

  useEffect(() => {
    const {title: habitTitle} = habits?.filter((item) => {
      return item.id == habit_id;
    })[0];
    if (user_id == userId()) {
      // setUserName(userData.full_name);
      setUserName("You")
      setHabitName(habitTitle);
      setIsOwn(true);
    } else {
      setUserName("Personholder")
      setHabitName("Habit Placeholder")
    }
  })

  return (
    <View style={{flex: 1, flexDirection: 'row', padding: 20}}>
      <Text><Text style={{fontWeight: isOwn ? 'normal' : 'bold'}}>{userName}</Text> completed habit <Text style={{fontWeight: 'bold'}}>{habitName}</Text>.</Text>
    </View>
  )
}