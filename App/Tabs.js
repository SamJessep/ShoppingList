import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from "react"
import Account from './Routes/Account';
import Lists from './Routes/Lists';
import Settings from './Routes/Settings';

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator initialRouteName="Lists">
      <Tab.Screen name="Lists" component={Lists} />
      <Tab.Screen name="My Account" component={Account} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

export default Tabs