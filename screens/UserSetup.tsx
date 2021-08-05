import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Appbar, Button, Card, HelperText, IconButton, TextInput } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { supabase, userId } from '../api/supabase';
import { fetchUserData, setUserData } from '../api/userData';
import styles from '../style/styles';
import { isDefined } from '../util/varUtil';

type props = {
  userSpace?: boolean 
}

export default function UserSetup(props: props) {

  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const {userSpace} = props;

  const [handle, setHandle] = useState("");
  const [fullName, setFullName] = useState("");
  const [description, setDescription] = useState("");
  const [dob, setDob] = useState("");
  
  const [handleIsTaken, setHandleIsTaken] = useState<boolean>(false);
  const [lettersNumbersOnly, setLettersNumbersOnly] = useState<boolean>(false);

  const { data: userData , error } = useQuery('userData', fetchUserData);
  const userDataMutation = useMutation('userData', setUserData, {onSuccess: data => {
    queryClient.invalidateQueries('userData');
    if (userSpace) navigation.navigate("ProfileView");
    else navigation.navigate("HomeSpace");
  }})

  useEffect(() => {
    setHandle(userData?.handle)
    setFullName(userData?.full_name);
    setDescription(userData?.description);
    setDob(userData?.dob)
  }, [])

  return (
    <View>
      <Appbar>
        <Appbar.BackAction onPress={navigation.goBack}/>
        <Appbar.Content title="Personal Information"  /* subtitle="Displayed publicly on your profile" */ />
      </Appbar>
      <Card style={styles.card}>
        <Card.Content>
          <HelperText type="error" style={{display: handleIsTaken ? 'flex' : 'none'}}>Username is already taken!</HelperText>
          <HelperText type="error" style={{display: !lettersNumbersOnly ? 'flex' : 'none'}}>Can only contain letters, numbers,  and ._-</HelperText>
          <TextInput label="Username" value={handle} 
          onChangeText={text => {
            setHandleIsTaken(false);
            setHandle(text);
            if (text.match(/^[a-zA-Z0-9_.-]*$/i)) setLettersNumbersOnly(true) 
            else setLettersNumbersOnly(false)
          }}
          mode="flat" style={styles.textBox}
          />
          <TextInput label="Name" value={fullName} 
          onChangeText={text => setFullName(text)} 
          mode="flat" style={styles.textBox}
          />
          <TextInput label="Bio" value={description} 
          onChangeText={text => setDescription(text)} 
          mode="flat" style={styles.textBox}
          multiline={true}
          />
          <View style={{height: 10}}/>
          <Button mode="contained" icon="content-save" 
          labelStyle={styles.buttonLabel} 
          contentStyle={styles.fillButton} 
          onPress={() => {
            // Search for handle being used by other users
            supabase.from('user_data')
            .select('handle, id')
            .eq('handle', handle)
            .neq('id', userId())
            .then(({data}) => {
              if (!isDefined(data) || data?.length == 0)
                userDataMutation.mutateAsync({ handle: handle, full_name: fullName, description: description, dob: dob })
              else setHandleIsTaken(true);
              })
          }}
          >Save Info</Button>
        </Card.Content>
      </Card>
    </View>
  );
}