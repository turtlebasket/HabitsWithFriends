import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { supabase, userId } from '../api/supabase';
import { isDefined } from '../util/varUtil';

const Loading = () => {

  const navigation = useNavigation();

  supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_IN') navigation.navigate("HomeSpace")
    else navigation.navigate("SignIn")
    console.log(`EVENT: ${event}`);
    console.log(`SESSION: ${session}`);
  })

  useEffect(() => {
    if (!isDefined(userId())) navigation.navigate("SignIn");
  })

  return (
    <View style={{margin: 'auto', flexGrow: 1}}>
      <Text>Loading</Text>
    </View>
  )

}

export default Loading;