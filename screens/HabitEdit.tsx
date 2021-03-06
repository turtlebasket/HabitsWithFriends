import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Button, Card, Dialog, IconButton, Portal, Subheading, Switch, TextInput } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchHabits, removeHabit, setHabit } from '../api/habits';
import styles from '../style/styles';
import { AppTheme } from '../style/themes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRef } from 'react';

export default function HabitEdit(props: {route: any}) {

  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { route } = props;

  const [isNew, setIsNew] = useState<boolean>(true);
  const [edited, setEdited] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [habitDeleteDialog, setHabitDeleteDialog] = useState(false);
  const [habitPublicDialog, setHabitPublicDialog] = useState(false);

  const { data: habits, status: habitsStatus } = useQuery("habits", fetchHabits) 
  const habitSetMutation = useMutation('habits', setHabit, {onSuccess: () => {
    queryClient.invalidateQueries('habits');
  }})
  const habitDelMutation = useMutation('habits', removeHabit, {onSuccess: () => {
    queryClient.invalidateQueries('habits');
  }})

  useEffect(() => {
    if (route.params.id) {
      const { title, description, public: isPublic } = habits?.filter(item => {
        if (item.id === route.params.id) setIsNew(false);
        return item.id === route.params.id;
      })[0];
      setTitle(title);
      setDescription(description);
      setIsPublic(isPublic);
    }
  }, []);

  useEffect(() => {
    if (title.length > 0) setEdited(true)
  }, [title])

  return (
    <>
    <Portal>
      <Dialog visible={habitDeleteDialog} dismissable={true}>
        <Dialog.Title>Delete habit "{title}"?</Dialog.Title>
        <Dialog.Actions>
          <Button onPress={() => {
            setHabitDeleteDialog(false);
          }}>Cancel</Button>
          <Button onPress={() => {
            setHabitDeleteDialog(false);
            habitDelMutation.mutateAsync(route.params.id);
            navigation.navigate("HabitList");
          }}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
    <Appbar>
      <Appbar.BackAction onPress={navigation.goBack}/>
      <Appbar.Content title={isNew ? "Create Habit" : "Edit Habit"}/>
    </Appbar>
    <ScrollView>
      <Card style={styles.card}>
        {/* <Card.Title title={route.params.id ? "Edit habit" : "New habit"} right={() => (
          <View style={{flexDirection: 'row'}}>
            <IconButton icon="close" onPress={navigation.goBack}/>
          </View>
        )} rightStyle={{marginRight: 10}}/> */}
        <Card.Content>
        { habitsStatus == 'success' &&
        <>
          <TextInput
          label="Title"
          value={title}
          onChangeText={value => setTitle(value)}
          style={styles.textBox}
          mode="flat"
          />
          <TextInput
          label="Description"
          value={description}
          onChangeText={value => setDescription(value)}
          style={styles.textBox}
          mode="flat"
          multiline={true}
          /> 
        </>}

        <View style={{flexDirection: 'row', marginHorizontal: 2, height: 30, alignItems: 'center'}}>
          <MaterialCommunityIcons name={isPublic ? "eye" : "eye-off"} size={20} color={AppTheme.colors.text} />
          <View style={{width: 5}} />
          <Subheading>{isPublic ? "Public" : "Private"}</Subheading>
          <View style={{marginLeft: 'auto'}}>
            <Switch value={isPublic} onValueChange={setIsPublic} color={AppTheme.colors.primary}/>
          </View>
        </View>

        <View style={{height: 16}}/>

        <Button contentStyle={styles.fillButton} icon="content-save" 
        mode="contained" labelStyle={styles.buttonLabel} onPress={() => {
          habitSetMutation.mutateAsync({id: route.params.id, title, description, public: isPublic});
          navigation.goBack();
        }}>Save</Button>

        <View style={{height: 8}}/>

        <Button contentStyle={styles.fillButton} icon="trash-can-outline" 
        mode="outlined" style={{display: route.params.id ? 'flex' : 'none'}}
        labelStyle={[styles.buttonLabel, 
          {color: 'red'}]} 
          color={'red'}
        onPress={() => setHabitDeleteDialog(true)}>Delete</Button>
      </Card.Content>
      </Card>
      </ScrollView>
    </>
  );
}