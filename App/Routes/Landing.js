import React from "react"
import { Text, View } from "react-native";
import Auth0 from "react-native-auth0";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tabs from "../Tabs.js";
const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });

const Landing = ({navigation})=>{
  
  return (
    <View style={{flex:1}}>
      <Tabs></Tabs>
    </View>
  )
}

export default Landing