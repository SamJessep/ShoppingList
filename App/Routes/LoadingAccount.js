import React from "react"
import { Text, View, ActivityIndicator } from "react-native";
import Auth0 from "react-native-auth0";
import AsyncStorage from '@react-native-async-storage/async-storage';
const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });

import Config from "react-native-config";
console.log(Config.API_URL)

const LoadingAccount = ({navigation})=>{
  const [stateText, setStateText] = React.useState("loading")
  AsyncStorage.getItem("accessToken").then(async accessToken=>{
    setStateText("checking profile...")
    console.log(API_URL)
    const users = await fetch(process.env.API_URL)
  })
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={{marginBottom:20, fontSize:20}}>
        {stateText}
      </Text>
      <ActivityIndicator size="large"/>
    </View>
  )
}

export default LoadingAccount