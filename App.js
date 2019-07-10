import React from 'react';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { GoogleSignin } from 'react-native-google-signin';
import Profile from './components/Profile';
import Home from './components/Home';

const MainNavigator = createBottomTabNavigator(
  {
    Home: { screen: Home },
    Profile: { screen: Profile },
  },
  {
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: 'white',
      inactiveBackgroundColor: '#a5e6d1',
      activeBackgroundColor: '#b9eddc',
      labelStyle: {
        fontSize: 15,
        paddingBottom: 12,
      }
    }
  }
)

const App = createAppContainer(MainNavigator);

export default App;
