import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import { Appbar, Button, Card, Checkbox, IconButton, ProgressBar, Subheading, Surface, Text, ToggleButton } from 'react-native-paper';
import { useQuery } from 'react-query';
import { fetchHabits } from '../api/habits';
import styles from '../style/styles';
import { LineChart, ProgressCircle } from 'react-native-svg-charts';
import { AppTheme } from '../style/themes';
import { FlatList } from 'react-native-gesture-handler';

export default function HabitView(props: {route: any}) {

  const route = props.route
  const navigation = useNavigation();

  const {data: habits, status: habitsStatus} = useQuery("habits", fetchHabits)
  const {title, description, public: isPublic} = habits?.filter((item) => {
    return item.id == route.params.id;
  })[0];
  
  // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [last5Days, setLast5Days] = useState<string[]>();
  const [todayChecked, setTodayChecked] = useState<boolean>(true);
  
  useEffect(() => {

    // horribly messy, fix later

    const today = new Date();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let l5d: number[] = [];
    l5d.push(today.getDay());
    l5d.push(new Date(today.setDate(today.getDate()-1)).getDay())
    l5d.push(new Date(today.setDate(today.getDate()-1)).getDay())
    l5d.push(new Date(today.setDate(today.getDate()-1)).getDay())
    l5d.push(new Date(today.setDate(today.getDate()-1)).getDay())
    let l5d_str: string[] = []
    for (let i of l5d) l5d_str.push(days[i])
    setLast5Days(l5d_str);
  }, [])

  const renderDayItem = ({item, index}: {item: string, index: number}) => {
    const label = item.charAt(0).toLowerCase();
    return (
    <View style={{flexDirection: 'column', paddingHorizontal: 8, paddingBottom: 4, alignItems: 'center'}}>
      <Text>{item}</Text>
      <Checkbox status={todayChecked ? 'checked' : 'unchecked'} 
      onPress={() => {setTodayChecked(!todayChecked)}}
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
          keyExtractor={({index}) => `day-item-${index}`}/>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title="70% success rate" subtitle="Last week" left={() => (
          <ProgressCircle style={{height: 40}} strokeWidth={5} progress={0.7} 
          progressColor={AppTheme.colors.primary} 
          backgroundColor={AppTheme.colors.border}
          animate={true}/>
        )}/>
      </Card>
    </View> }
    </>
  );
}