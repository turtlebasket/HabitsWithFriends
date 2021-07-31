import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import { supabase } from '../api/supabase';
import styles from '../style/styles';

const Settings = () => {

  const navigation = useNavigation();

  return (
  <>
    <Appbar>
      <Appbar.BackAction onPress={navigation.goBack}/>
      <Appbar.Content title="Settings"/>
    </Appbar>
    <ScrollView style={[{flex: 1}, styles.cardContainer]}>
      <Card style={{marginTop: 8}}>
        <Card.Title title="Account"/>
        <Card.Content>
          <Button mode='outlined'
          labelStyle={[styles.buttonLabel, {color: 'red'}]} color={'red'}
          onPress={() => {
            supabase.auth.signOut();
            navigation.navigate("SignIn");
          }}>Sign Out</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  </>
  );
}

export default Settings;