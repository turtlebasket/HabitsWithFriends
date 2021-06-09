/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// no fucking how clue this works, but apparently it adds 
// something that RN is missing that web browsers have
// https://github.com/facebook/react-native/issues/23922#issuecomment-648096619

import 'react-native-url-polyfill/auto';

AppRegistry.registerComponent(appName, () => App);
