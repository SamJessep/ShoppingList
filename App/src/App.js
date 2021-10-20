import React, { useState, useEffect } from "react"
import { Provider } from "react-redux";
import { createStore } from "redux";
import ShoppingListApp from "./ShoppingListApp.js";
import { Button, Provider as PaperProvider, Subheading, Text } from 'react-native-paper';
import { AppRegistry, View } from 'react-native';
import { name as appName } from '../app.json';
import config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  loggedIn:false,
  needsSetup:true
}
const reducer = (state=initialState, action)=>{
  switch(action.type){
    case "LOGGED_OUT":
      return {
        loggedIn:false,
        needsSetup:true
      }
    case "LOGGED_IN":
      return {
        loggedIn:true,
        needsSetup:true
      }
    case "SETUP_COMPLETE":
      return {
        loggedIn:true,
        needsSetup:false
      }
    case "NEEDS_SETUP":
      return {
        needsSetup:true,
        loggedIn:true
      }
  }
  return state
}
const store = createStore(reducer)

const App = () => {
  useState(async ()=>{
    try{
      const app_config_string = await AsyncStorage.getItem('app-config')
      global.APP_CONFIG = JSON.parse(app_config_string) || {}
    }catch{
      global.APP_CONFIG={
        ...config
      }
    }
  },[])
  
  return (
    <Provider store={store}>
      <PaperProvider>
        <ShoppingListApp/> 
      </PaperProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Main);

export default App;
