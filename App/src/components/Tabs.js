import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from "react"
import Account from '../routes/Auth/Account';
import Lists from '../routes/Lists/Lists';
import Settings from '../routes/Settings';
import Icon from "react-native-dynamic-vector-icons";
import { Text } from 'react-native-paper';
import ProfileButton from './ProfileButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

function Tabs({navigation}) {
  const [profile, setProfile] = React.useState({})
  AsyncStorage.getItem("profile")
    .then(profileString=>setProfile(JSON.parse(profileString)))

  return (
    <Tab.Navigator initialRouteName="Lists">
      <Tab.Screen 
        name="Lists" 
        component={Lists}
        options={{
          headerRight:()=><ProfileButton profile={profile} navigation={navigation}/>,
          tabBarLabel:"Lists",
          tabBarIcon: ({ color, size }) => (
            <Icon type="MaterialCommunityIcons" name="file-document" color={color} size={size} />
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