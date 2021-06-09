import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import { Appbar, Card, IconButton, ProgressBar, Surface, Text } from 'react-native-paper';
import { useQuery } from 'react-query';
import { fetchHabits } from '../api/habits';
import styles from '../style/styles';
import { LineChart, ProgressCircle } from 'react-native-svg-charts';
import { AppTheme } from '../style/themes';

export default function HabitView(props: {route: any}) {

  const route = props.route
  const navigation = useNavigation();

  const {data: habits, status: habitsStatus} = useQuery("habits", fetchHabits)
  const {title, description} = habits?.filter((item) => {
    return item.id == route.params.id;
  })[0];

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
            <IconButton icon="pencil" onPress={() => navigation.navigate("HabitEdit", {id: route.params.id})}/>
            <IconButton icon="close" onPress={navigation.goBack}/>
          </View>
        )}/>
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