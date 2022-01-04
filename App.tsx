import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import DataFetchScreen from './src/screens/DataFetchScreen';
import BleCommScreen from './src/screens/BleCommScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// login stack
const LoginStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="loginScreen"
      component={LoginScreen}
      options={{headerShown: false}}
    />

    <Stack.Screen
      name="homeScreen"
      component={HomeScreen}
      options={{headerTitle: 'Home', headerBackVisible: false}}
    />
  </Stack.Navigator>
);

const App = () => {
  // handling loading state for app
  const [loading, setLoading] = useState(true);
  // using safe area insets hook to configure tab bar options per screen
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Tab.Navigator
      initialRouteName="login"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName = '';
          if (route.name === 'login') {
            iconName = 'account-circle';
          } else if (route.name === 'api') {
            iconName = 'api';
          } else {
            iconName = 'voicemail';
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}>
      <Tab.Screen
        name="login"
        component={LoginStack}
        options={{
          tabBarStyle: {
            height: insets.bottom + 60,
            paddingBottom: 5,
          },
          tabBarLabel: 'Login',
          headerShown: false,
        }}
      />
      <Tab.Screen
        options={{
          tabBarStyle: {
            height: insets.bottom + 60,
            paddingBottom: 5,
          },
          tabBarLabel: 'API',
        }}
        name="api"
        component={DataFetchScreen}
      />
      <Tab.Screen
        options={{
          tabBarStyle: {
            height: insets.bottom + 60,
            paddingBottom: 5,
          },
          tabBarLabel: 'BLE Communication',
        }}
        name="ble"
        component={BleCommScreen}
      />
    </Tab.Navigator>
  );
};

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
