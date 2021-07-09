import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { Appbar, Button, Card, Checkbox, IconButton, ProgressBar, Subheading, Surface, Text, ToggleButton } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchHabits, habitHistoryAdd, habitHistoryRemove, setHabit } from '../api/habits';
import styles from '../style/styles';
import { LineChart, ProgressCircle } from 'react-native-svg-charts';
import { AppTheme } from '../style/themes';
import { FlatList } from 'react-native-gesture-handler';
import { getISO8601 } from '../util/dateUtil';
import { supabase } from '../api/supabase';

export default function HabitView(props: {route: any}) {

  const route = props.route
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {data: habits, status: habitsStatus} = useQuery("habits", fetchHabits)
  const {title, description, public: isPublic, history5} = habits?.filter((item) => {
    return item.id == route.params.id;
  })[0];
  
  const [last5Days, setLast5Days] = useState<string[]>([]);
  const [todayChecked, setTodayChecked] = useState<boolean>(history5.includes(getISO8601()) ?? true);

  const [successRateLast5Days, setSuccessRateLast5Days] = useState(0.0);

  const habitSetMutation = useMutation('habits', setHabit, {onSuccess: () => {
    queryClient.invalidateQueries('habits');
  }})

  const historyAddMutation = useMutation('habits', habitHistoryAdd, {onSuccess: () => {
    queryClient.invalidateQueries('habits');
  }})

  const historyRemoveMutation = useMutation('habits', habitHistoryRemove, {onSuccess: () => {
    queryClient.invalidateQueries('habits');
  }})

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function updateSuccessRate() {
    let successesLast5Days = 0
    for (let item of last5Days) {
      if (history5.includes(item))  {
        successesLast5Days += 1
      }
    }
    console.log(`Updating success rate to ${successRateLast5Days}`)
    setSuccessRateLast5Days(Math.round(successesLast5Days / 5 * 100 ) / 100);
  }

  useEffect(() => {

    // horribly messy, fix later
    const today = new Date();
    let l5d: string[] = [];
    l5d.push(getISO8601(today));
    l5d.push(getISO8601(new Date(today.setUTCDate(today.getUTCDate()-1))));
    l5d.push(getISO8601(new Date(today.setUTCDate(today.getUTCDate()-1))));
    l5d.push(getISO8601(new Date(today.setUTCDate(today.getUTCDate()-1))));
    l5d.push(getISO8601(new Date(today.setUTCDate(today.getUTCDate()-1))));
    setLast5Days(l5d);

  }, [])

  // const mounted = useRef();
  const isFirstRender = useRef(true)
  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false // toggle flag after first render/mounting
      return;
    }

    // check what kind of action on history should be performed
    if (todayChecked) historyAddMutation.mutate(route.params.id);
    else if (!todayChecked) historyRemoveMutation.mutate(route.params.id);


    // recalculate success rate
  }, [todayChecked])

  useEffect(() => {
    updateSuccessRate();
  }, [last5Days])

  useEffect(() => {
    updateSuccessRate();
  }, [history5])

  const renderDayItem = ({item, index}: {item: string, index: number}) => {
    const isToday = item === getISO8601();

    return (
    <View style={{flexDirection: 'column', paddingHorizontal: 8, paddingBottom: 4, alignItems: 'center'}}>
      <Text>{days[new Date(item).getDay()]}</Text>
      <Checkbox status={isToday 
        ? (todayChecked ? 'checked' : 'unchecked') 
        : (history5.includes(item) ? 'checked' : 'unchecked' ?? 'unchecked')} 
      disabled={!isToday}
      onPress={() => { setTodayChecked(!todayChecked) }}
      color={AppTheme.colors.primary}/>
    </View>
    )
  }

  return (
    <>
    { habitsStatus == "success" && <View>
      {/* <Appbar>
        <Appbar.BackAction onPress={navigation.goBack}/>
        <Appbar.Content title={title} subtitle={description}/>
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate("HabitEdit", {id: route.params.id})}/>
      </Appbar> */}
      <Card style={styles.card}>
        <Card.Title title={title} subtitle={description} 
        right={() => (
          <View style={{flexDirection: 'row'}}>
            {!isPublic && <IconButton icon="eye-off" color="gray"/>}
            <IconButton icon="pencil" onPress={() => navigation.navigate("HabitEdit", {id: route.params.id})}/>
            <IconButton icon="close" onPress={navigation.goBack}/>
          </View>
        )}/>
      </Card>
      <Card style={styles.card}>
        <Card.Content style={{alignItems: 'center'}}>
          <FlatList renderItem={renderDayItem} data={last5Days} horizontal={true} 
          contentContainerStyle={{justifyContent: 'space-between'}}
          keyExtractor={(item: string, index) => `day-item-${item}`}/>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title={`${successRateLast5Days * 100}% success rate`} subtitle="Last 5 days" left={() => (
          <ProgressCircle style={{height: 40}} strokeWidth={5} progress={successRateLast5Days} 
          progressColor={AppTheme.colors.primary} 
          backgroundColor={AppTheme.colors.border}
          animate={true}/>
        )}/>
      </Card>
    </View> }
    </>
  );
}