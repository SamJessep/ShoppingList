import { ActivityIndicator, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import List from './routes/List/List';
import Landing from './routes/Landing'
import LoadAccount from './routes/Auth/LoadAccount'
import React, { useState, useEffect } from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './routes/Auth/Login.js';
import Auth0 from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });
const Stack = createNativeStackNavigator();

const ShoppingListApp = (props) => {
  const [loading, setLoading] = useState(true)
  useEffect( async() => {
    const refreshToken = await AsyncStorage.getItem("refreshToken")
    try{
      await auth0.auth.refreshToken({refreshToken: refreshToken})
      props.setLoggedIn()
    }catch(e){
      props.setLoggedOut()
    }
    setLoading(false)
  }, [])
  return (
    <SafeAreaView style={{flex:1}}>
      {loading ? 
        <View style={{flex:1, justifyContent:"center"}}>
          <ActivityIndicator size="large"/>
        </View> : 

        <NavigationContainer>
          <Stack.Navigator initialRouteName={!props.loggedIn ? "Login" : (props.needsSetup ? "LoadAccount" : "Landing")}>
          {!props.loggedIn ? 
            <Stack.Screen name="Login" component={Login}/>: 
          <>
          {props.needsSetup && <Stack.Screen name="LoadAccount" component={LoadAccount} options={{headerShown:false}}/>}
            <Stack.Screen name="Landing" component={Landing} options={{headerShown:false}}/>
            <Stack.Screen name="List" component={List}/>
          </>  
          }
          </Stack.Navigator>
        </NavigationContainer>
      }
    </SafeAreaView>
  );
};

function mapStateToProps(state){
  return {
    loggedIn:state.loggedIn,
    needsSetup:state.needsSetup
  }
}

function mapDispatchToProps(dispatch){
  return{
    setLoggedIn: ()=>dispatch({type:"LOGGED_IN"}),
    setLoggedOut: ()=>dispatch({type:"LOGGED_OUT"})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShoppingListApp);
