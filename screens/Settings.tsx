import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Button, Card, Subheading, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
    <ScrollView style={[{flex: 1, marginBottom: 8}]}>
      <Card style={styles.card}>
        <Card.Title title="Application"/>
        <Card.Content>

        {/* Dark theme control */}

        {/* <View style={{flexDirection: 'row', marginHorizontal: 2, height: 30, alignItems: 'center'}}>
          <MaterialCommunityIcons name={isPublic ? "eye" : "eye-off"} size={20} color={AppTheme.colors.text} />
          <View style={{width: 5}} />
          <Subheading>{isPublic ? "Public" : "Private"}</Subheading>
          <View style={{marginLeft: 'auto'}}>
            <Switch value={isPublic} onValueChange={setIsPublic} color={AppTheme.colors.primary}/>
          </View>
        </View> */}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
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