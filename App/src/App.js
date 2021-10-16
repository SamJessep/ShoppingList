import React, { useState, useEffect } from "react"
import { Provider } from "react-redux";
import { createStore } from "redux";
import ShoppingListApp from "./ShoppingListApp.js";
import { Button, Provider as PaperProvider, Subheading, Text } from 'react-native-paper';
import { AppRegistry, View } from 'react-native';
import { name as appName } from '../app.json';
import config from "react-native-config";

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
  const [server,setServer] = useState("")
  useEffect(()=>{
    global.APP_CONFIG={
      ...config,
      API_URL:server
    }
  },[server])


console.log(server)
  return (
    <Provider store={store}>
      <PaperProvider>
        {server != "" ? <ShoppingListApp/> : <View style={{flex:1, justifyContent:"space-around"}}>
          <Subheading style={{alignSelf:"center"}}>Select Server</Subheading>
          <View>
            <Button mode="contained" style={{marginBottom:10}} onPress={()=>setServer(config.API_URL_DEV)}>Development</Button>
            <Button mode="contained" onPress={()=>setServer(config.API_URL_PROD)}>Production</Button>
          </View>
        </View>} 
      </PaperProvider>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => Main);

export default App;
