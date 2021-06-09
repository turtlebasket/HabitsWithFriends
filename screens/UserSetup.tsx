import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { supabase, userId } from '../api/supabase';
import { fetchUserData, setUserData } from '../api/userData';
import styles from '../style/styles';

type props = {
  userSpace?: boolean 
}

export default function UserSetup(props: props) {

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {userSpace} = props;

  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [dob, setDob] = useState("");

  const { data: userData , error } = useQuery('userData', fetchUserData);
  const userDataMutation = useMutation('userData', setUserData, {onSuccess: data => {
    queryClient.invalidateQueries('userData');
    if (userSpace) navigation.navigate("ProfileView");
    else navigation.navigate("HomeSpace");
  }})

  useEffect(() => {
    setFullName(userData?.full_name);
    setDescription(userData?.description);
    setDob(userData?.dob)
  }, [])

  return (
    <View>
      <Card style={styles.card}>
        <Card.Title title="Personal Information" subtitle="Displayed publicly on your profile"
        right={() => (
          <Button onPress={navigation.goBack}>Cancel</Button>
        )}
        />
        <Card.Content>
          <TextInput label="Name" value={fullName} 
          onChangeText={text => setFullName(text)} 
          mode="outlined" style={styles.textBox}
          />
          <TextInput label="Bio" value={description} 
          onChangeText={text => setDescription(text)} 
          mode="outlined" style={styles.textBox}
          />
          <View style={{height: 10}}/>
          <Button mode="contained" icon="content-save" 
          labelStyle={styles.buttonLabel} 
          contentStyle={styles.fillButton} 
          onPress={() => {
            userDataMutation.mutateAsync({ full_name: fullName, description: description, dob: dob });
          }}
          >Save Info</Button>
        </Card.Content>
      </Card>
    </View>
  );
}