import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Routes/Home.js';
import List from './Routes/List/List';
import Landing from './Routes/Landing'
import LoadAccount from './Routes/LoadAccount'
import React, { useState, useEffect } from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Routes/Login.js';
import Auth0 from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });
const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [loginState, setLoginState] = useState()
  useEffect(() => {
    if(loginState==null){
      AsyncStorage.getItem("refreshToken").then(refreshToken=>{
        console.log(refreshToken)
        auth0.auth
        .refreshToken({refreshToken: refreshToken})
        .then(res =>{
          console.log("Logged in")
          setLoginState("LOGGED IN")
        })
        .catch(async error=>{
          console.error("not Logged in")
          setLoginState("NOT LOGGED IN")
        });
      })
    }
  }, [])
  return (
    <View style={{flex:1}}>
    {loginState == null ? 
      <View style={{justifyContent:"center", alignContent:"center", flex:1}}>
      <ActivityIndicator size="large"/>
    </View>: 
    <NavigationContainer>
      <Stack.Navigator initialRouteName={loginState == "LOGGED IN" ? "LoadAccount" : "Login"}>
      {!["LOGGED IN",null].includes(loginState) && <Stack.Screen name="Login" component={Login}/>}
        <Stack.Screen name="LoadAccount" component={LoadAccount} options={{headerShown:false}}/>
        <Stack.Screen name="Landing" component={Landing} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="List" component={List}/>
      </Stack.Navigator>
    </NavigationContainer>
    }
    </View>
  );
};



export default App;
