/**
 * @format
 */

import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import {name as appName} from './app.json';
import {NativeBaseProvider} from 'native-base';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';

const Root = () => (
  <SafeAreaProvider>
    <NativeBaseProvider>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </NativeBaseProvider>
  </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => Root);
