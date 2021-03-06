/**
 * App
 * 
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 */

import React from 'react';
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppDarkTheme, AppDefaultTheme, AppTheme } from './style/themes';
import { Theme } from 'react-native-paper/lib/typescript/types';
import HomeSpace from './screens/HomeSpace';
import SignIn from './screens/SignIn';
import UserSetup from './screens/UserSetup';
import Loading from './screens/Loading';
import { LogBox } from 'react-native';

export default function App() {

  const queryClient = new QueryClient();
  const Stack = createStackNavigator();

  // const theme = AppDefaultTheme 
  const theme = AppTheme

  // get rid of https://github.com/facebook/react-native/issues/12981
  LogBox.ignoreLogs(['Setting a timer']);

  return (
    // any ouside info providers go outside
    <>
      <QueryClientProvider client = {queryClient}>
        <PaperProvider theme={theme as Theme}>
          <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen name="Loading" component={Loading}/>
              <Stack.Screen name="SignIn" component={SignIn}/>
              <Stack.Screen name="UserSetup" component={UserSetup}/>
              <Stack.Screen name="HomeSpace" component={HomeSpace}/>
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </>
  );
}