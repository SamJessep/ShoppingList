import React from 'react'
import { ActivityIndicator, Text, View } from 'react-native';
import Auth0 from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
import jwt_decode from "jwt-decode";
import { connect } from 'react-redux';
import { Subheading,Button, Switch } from 'react-native-paper';
import config from "react-native-config";


const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });
const Login = ({navigation,setLoggedIn})=>{
  const [server,setServer] = React.useState(config.API_URL)
  React.useEffect(()=>{
    global.APP_CONFIG={
      ...config,
      API_URL:server
    }
    AsyncStorage.setItem('app-config', JSON.stringify(APP_CONFIG))
  },[server])

  const [accessToken, setAccessToken] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
    const startLogin = ()=>{
      auth0 
      .webAuth
      .authorize({scope: 'openid profile email offline_access'})
      .then(credentials =>{
        // Successfully authenticated
        // Store the accessToken
        const jwt = jwt_decode(credentials.idToken)
        Promise.all([
          RNSecureKeyStore.set("accessToken", credentials.accessToken, {accessible:ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY}),          
          RNSecureKeyStore.set("refreshToken", credentials.refreshToken, {accessible:ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY}),
          AsyncStorage.setItem("authid", jwt.sub)
        ]).then(()=>{
          setLoggedIn()
          navigation.navigate("LoadAccount")
        })
      })
      .catch(error => {
        setErrorMessage(error.toString())
        console.error(error)
      });
    }
  return(
  <View style={{flex:1, justifyContent:"center"}}>
    <Button mode="contained" onPress={startLogin}>Login</Button>
    {Boolean(accessToken) && <ActivityIndicator color="green"/>}
    {Boolean(errorMessage)&&<Text>Login failed: {errorMessage}</Text>}
    <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:20, marginTop:50}}>
      <Text>Use Dev server</Text>
      <Switch value={server == config.API_URL_DEV} onValueChange={useDevServer=>setServer(useDevServer?config.API_URL_DEV:config.API_URL_PROD)}></Switch>
     </View>
  </View>
  )
}

function mapStateToProps(state){
  return {
    loggedIn:state.loggedIn
  }
}

function mapDispatchToProps(dispatch){
  return{
    setLoggedIn: ()=>dispatch({type:"LOGGED_IN"})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)