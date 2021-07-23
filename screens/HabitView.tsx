import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { Appbar, Button, Card, Checkbox, IconButton, ProgressBar, Subheading, Surface, Text, ToggleButton } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchHabits, fetchOwnHabitHistory7, habitHistoryAdd, habitHistoryRemove, setHabit } from '../api/habits';
import styles from '../style/styles';
import { LineChart, ProgressCircle } from 'react-native-svg-charts';
import { AppTheme } from '../style/themes';
import { FlatList } from 'react-native-gesture-handler';
import { getISO8601, yyyymmdd } from '../util/dateUtil';

export default function HabitView(props: {route: any}) {

  const route = props.route
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {data: habits, status: habitsStatus} = useQuery("habits", fetchHabits)
  const {title, description, public: isPublic} = habits?.filter((item) => {
    return item.id == route.params.id;
  })[0];

  const { data: historyData } = useQuery("activity_habits_self", fetchOwnHabitHistory7);

  const [history7, setHistory7] = useState<string[]>([]);
  useEffect(() => {
    // historyData?.forEach((item: any) => {if (item.habit_id == route.params.id) setHistory7(history7.concat(yyyymmdd(item.timestamp)))});
    let history7Temp: string[] = [];
    historyData?.forEach((item: any) => {if (item.habit_id == route.params.id) history7Temp.push(yyyymmdd(item.timestamp))});
    setHistory7(history7Temp);
    setTodayChecked(history7Temp.includes(yyyymmdd()));
  }, [historyData]);

  const [last5Days, setLast5Days] = useState<string[]>([]);
  const [todayChecked, setTodayChecked] = useState<boolean>(history7.includes(yyyymmdd()) ?? true);

  const [successRateLast5Days, setSuccessRateLast5Days] = useState(0.0);
  const [successRateLast7Days, setSuccessRateLast7Days] = useState(0.0);

  const habitSetMutation = useMutation('habits', setHabit, {onSuccess: () => {
    queryClient.invalidateQueries('habits');
  }})

  const historyAddMutation = useMutation('activity_habits_self', habitHistoryAdd, {onSuccess: () => {
    queryClient.invalidateQueries('activity_habits_self');
  }})

  const historyRemoveMutation = useMutation('activity_habits_self', habitHistoryRemove, {onSuccess: () => {
    queryClient.invalidateQueries('activity_habits_self');
  }})

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function updateSuccessRate() {
    let successesLast5Days = 0
    for (let item of last5Days) {
      if (history7.includes(item)) {
        successesLast5Days += 1
      }
    }
    setSuccessRateLast7Days(Math.round(successesLast5Days / 7 * 100 ) / 100);
  }

  useEffect(() => {

    // horribly messy, fix later
    const today = new Date();
    let l5d: string[] = [];
    l5d.push(yyyymmdd(today));
    l5d.push(yyyymmdd(new Date(today.setUTCDate(today.getUTCDate()-1))));
    l5d.push(yyyymmdd(new Date(today.setUTCDate(today.getUTCDate()-1))));
    l5d.push(yyyymmdd(new Date(today.setUTCDate(today.getUTCDate()-1))));
    l5d.push(yyyymmdd(new Date(today.setUTCDate(today.getUTCDate()-1))));

    setLast5Days(l5d);

  }, [])

  const initCheck = useRef(false);
  useEffect(() => {

    if (!initCheck.current) return;

    // check what kind of action on history should be performed
    if (todayChecked) historyAddMutation.mutate(route.params.id);
    else historyRemoveMutation.mutate(route.params.id);

    // recalculate success rate
  }, [todayChecked])

  useEffect(() => {
    updateSuccessRate();
  }, [last5Days])

  useEffect(() => {
    updateSuccessRate();
  }, [history7])

  const renderDayItem = ({item, index}: {item: string, index: number}) => {
    const isToday = item === yyyymmdd();

    return (
    <View style={{flexDirection: 'column', paddingHorizontal: 8, paddingBottom: 4, alignItems: 'center'}}>
      <Text>{days[new Date(item).getUTCDay()]}</Text>
      <Checkbox status={isToday 
        ? (todayChecked ? 'checked' : 'unchecked') 
        : (history7.includes(item) ? 'checked' : 'unchecked' ?? 'unchecked')} 
      disabled={!isToday}
      onPress={() => { 
        initCheck.current = true;
        setTodayChecked(!todayChecked);
      }}
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
        <Card.Title title={`${(successRateLast7Days * 100).toFixed()}% success rate`} subtitle="Past week" left={() => (
          <ProgressCircle style={{height: 40}} strokeWidth={5} progress={successRateLast7Days} 
          progressColor={AppTheme.colors.primary} 
          backgroundColor={AppTheme.colors.border}
          animate={true}/>
        )}/>
      </Card>
    </View> }
    </>
  );
}