import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from "react"
import Account from '../routes/Auth/Account';
import Lists from '../routes/Lists/Lists';
import Settings from '../routes/Settings';
import Icon from "react-native-dynamic-vector-icons";

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator initialRouteName="Lists">
      <Tab.Screen 
        name="Lists" 
        component={Lists}
        options={{
          tabBarLabel:"Lists",
          tabBarIcon: ({ color, size }) => (
            <Icon type="MaterialCommunityIcons" name="file-document" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="My Account" 
        component={Account} 
        options={{
          tabBarLabel:"Account",
          tabBarIcon: ({ color, size }) => (
            <Icon type="MaterialCommunityIcons" name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={Settings}
        options={{
          tabBarLabel:"Settings",
          tabBarIcon: ({ color, size }) => (
            <Icon type="MaterialCommunityIcons" name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Tabs