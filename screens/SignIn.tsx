import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Card, Text, TextInput, ToggleButton } from 'react-native-paper';
import { supabase, userId } from '../api/supabase';
import { handleEmailLogin, handleEmailSignup } from '../auth/auth';
import styles from '../style/styles';

const SignIn = () => {

  const [loginMode, setLoginMode] = useState('login'); // default = login, else = signup

  const isLogin = () => { return loginMode == 'login' }

  return (
    <View style={{justifyContent: 'center'}}>
      <Card style={styles.card}>
        <Card.Title 
        title={isLogin() ? 'Log In' : 'Sign Up'} 
        subtitle={isLogin() ? "I have an account" : "I'm a new user"}
        right={() => {
          if (!isLogin()) return <Button mode='outlined' onPress={() => setLoginMode('login')} labelStyle={styles.buttonLabel}>Log In</Button>
          else return <Button mode='outlined' onPress={() => setLoginMode('signup')} labelStyle={styles.buttonLabel}>Sign Up</Button>
        }}
        />
        <Card.Content>
          {isLogin() ? <LogInForm/> : <SignUpForm/>}
        </Card.Content>

      </Card>
    </View>
  );
}

const SignUpForm = () => {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const navigation = useNavigation();
  return (
    <>
      <TextInput label="Email" value={email} onChangeText={text => setEmail(text)} mode="flat" style={styles.textBox}/>
      <TextInput label="Password" value={pass} onChangeText={text => setPass(text)} mode="flat" style={styles.textBox} secureTextEntry={true}/>
      <TextInput label="Confirm Password" value={pass2} onChangeText={text => setPass2(text)} mode="flat" style={styles.textBox } secureTextEntry={true}/>
      <Button mode="contained" icon="account" labelStyle={styles.buttonLabel} contentStyle={styles.fillButton} onPress={() => {
        if (pass != pass2) {
          Alert.alert("Error creating user!", "Passwords don't match");
        } else {
          supabase.auth.signUp({email: email, password: pass}).then(({user, session, error}) => {
            if (!error && !user) {
              Alert.alert("Account created!", "Check your inbox for your verification email.")
            } else if (user) {
              Alert.alert("User already exists!", `Please try another email or log in normally as ${email}.`);
            } else Alert.alert("Unknown Error", "Failed to create account.");
          })
        }
      }}>Sign Up</Button>
    </>
  )

}

const LogInForm = () => {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState('');
  const navigation = useNavigation()

  return (
    <>
      <TextInput label="Email" value={email} onChangeText={text => setEmail(text)} mode="flat" style={styles.textBox}/>
      <TextInput label="Password" value={pass} onChangeText={text => setPass(text)} mode="flat" style={styles.textBox} secureTextEntry={true}/>
      <Button mode="contained" icon="login" labelStyle={styles.buttonLabel} contentStyle={styles.fillButton} onPress={() => {
        supabase.auth.signIn({email: email, password: pass}).then(({user, session, data}) => {
          supabase.from('user_data').select('id').eq('id', userId()).then(({data, error}) => {
            if ((data ?? []).length <= 0) navigation.navigate("UserSetup");
            else navigation.navigate("HomeSpace");
          });
        })
      }}>Log In</Button>
    </>
  )
}

export default SignIn