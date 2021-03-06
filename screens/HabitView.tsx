import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import { Appbar, Button, Card, Checkbox, Dialog, IconButton, Portal, ProgressBar, Subheading, Surface, Text, ToggleButton } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchHabits, fetchOwnHabitHistory7, fetchOwnHabitHistory7All, habitHistoryAdd, habitHistoryRemove, setHabit } from '../api/habits';
import styles from '../style/styles';
import { LineChart, ProgressCircle } from 'react-native-svg-charts';
import { AppTheme } from '../style/themes';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { getISO8601, yyyymmdd } from '../util/dateUtil';

export default function HabitView(props: {route: any}) {

  const route = props.route
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {data: habits, status: habitsStatus} = useQuery("habits", fetchHabits)
  const {title, description, public: isPublic} = habits?.filter((item) => {
    return item.id == route.params.id;
  })[0];

  const { data: historyData } = useQuery(`activity_habit_${route.params.id}_self`, () => fetchOwnHabitHistory7(route.params.id));

  const [history7, setHistory7] = useState<string[]>([]);
  useEffect(() => {
    let history7Temp: string[] = [];
    historyData?.forEach((item: any) => {if (item.habit_id == route.params.id) history7Temp.push(yyyymmdd(item.timestamp))});
    setHistory7(history7Temp);
    setTodayChecked(history7Temp.includes(yyyymmdd()));
  }, [historyData]);

  const [last5Days, setLast5Days] = useState<string[]>([]); // [every item]
  const [lastWeek, setLastWeek] = useState<string[]>([]); // [min & max]
  const [lastMonth, setLastMonth] = useState<string[]>([]); // [min & max]
  const [todayChecked, setTodayChecked] = useState<boolean>(history7.includes(yyyymmdd()) ?? true);

  const [successRateLast5Days, setSuccessRateLast5Days] = useState(0.0);
  const [successRateLast7Days, setSuccessRateLast7Days] = useState(0.0);
  const [uncheckDialog, setUncheckDialog] = useState(false);

  const historyAddMutation = useMutation(`activity_habit_${route.params.id}_self`, habitHistoryAdd, {onSuccess: () => {
    queryClient.invalidateQueries(`activity_habit_${route.params.id}_self`);
    queryClient.invalidateQueries('activity_you');
  }})

  const historyRemoveMutation = useMutation(`activity_habit_${route.params.id}_self`, habitHistoryRemove, {onSuccess: () => {
    queryClient.invalidateQueries(`activity_habit_${route.params.id}_self`);
    queryClient.invalidateQueries('activity_you');
  }})

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function updateSuccessRate() {
    let successesLast7Days = 0
    for (let item of history7) {
      if (item <= lastWeek[0] && item >= lastWeek[lastWeek.length-1])
        successesLast7Days += 1;
    }
    // for (let item of last5Days) {
    //   if (history7.includes(item)) {
    //     successesLast5Days += 1
    //   }
    // }
    setSuccessRateLast7Days(Math.round(successesLast7Days / 7 * 100 ) / 100);
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

    const today2 = new Date();
    let week: string[] = [];
    week.push(yyyymmdd(today2));
    week.push(yyyymmdd(new Date(today2.setUTCDate(today2.getUTCDate()-6))));
    setLastWeek(week);

    const today3 = new Date();
    let month: string[] = []; // approximate to 30 days
    month.push(yyyymmdd(today3));
    month.push(yyyymmdd(new Date(today3.setUTCDate(today3.getUTCDate()-29))));
    setLastMonth(month)

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
  }, [last5Days, lastWeek, history7])

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
        if (!todayChecked) setTodayChecked(true);
        else {
          setUncheckDialog(true);
        }
      }}
      color={AppTheme.colors.primary}/>
    </View>
    )
  }

  return (
    <>
    <Portal>
      <Dialog visible={uncheckDialog} dismissable={true}>
        <Dialog.Title>Mark incomplete?</Dialog.Title>
        <Dialog.Content>
          <Text>You have marked this habit complete for today. This will undo that.</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => {
            setUncheckDialog(false);
          }}>Cancel</Button>
          <Button onPress={() => {
            if (todayChecked) {
              setTodayChecked(false);
            }
            setUncheckDialog(false);
          }}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
    { habitsStatus == "success" && <>
      <Appbar>
        <Appbar.BackAction onPress={navigation.goBack}/>
        <Appbar.Content title={title}/>
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate("HabitEdit", {id: route.params.id})}/>
      </Appbar>
      {/* <Card style={styles.card}>
        <Card.Title title={title} subtitle={description} 
        right={() => (
          <View style={{flexDirection: 'row'}}>
            {!isPublic && <IconButton icon="eye-off" color="gray"/>}
            <IconButton icon="pencil" onPress={() => navigation.navigate("HabitEdit", {id: route.params.id})}/>
            <IconButton icon="close" onPress={navigation.goBack}/>
          </View>
        )}/>
      </Card> */}
      <ScrollView>
      <Card style={[styles.card, {display: description ? 'flex' : 'none'}]}>
        {/* <Card.Title title="Description"/> */}
        <Card.Content>
          <Text>{description}</Text>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="Progress"/>
        <Card.Content>
          <View style={{alignItems: 'center'}}>
            <FlatList renderItem={renderDayItem} data={last5Days} horizontal={true} 
            // contentContainerStyle={{justifyContent: 'space-between', flexGrow: 1}}
            keyExtractor={(item: string, index) => `day-item-${index}`}/>
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title={`${(successRateLast7Days * 100).toFixed()}% Completion`} subtitle="Past week" left={() => (
          <ProgressCircle style={{height: 34}} strokeWidth={5} progress={successRateLast7Days} 
          progressColor={AppTheme.colors.primary} 
          backgroundColor={AppTheme.colors.border}
          animate={true}/>
        )}/>
      </Card>
      </ScrollView>
    </> }
    </>
  );
}