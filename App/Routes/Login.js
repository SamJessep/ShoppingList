import React from 'react'
import { ActivityIndicator, Button, Text, View } from 'react-native';
import Auth0 from 'react-native-auth0';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });
const Login = ({navigation})=>{
  const [accessToken, setAccessToken] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState("")
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const startLogin = ()=>{
      auth0
      .webAuth
      .authorize({scope: 'openid profile email offline_access'})
      .then(credentials =>{
        // Successfully authenticated
        // Store the accessToken
        const jwt = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
        Promise.all([
          AsyncStorage.setItem("accessToken", credentials.accessToken),
          AsyncStorage.setItem("refreshToken", credentials.refreshToken),
          AsyncStorage.setItem("userId", jwt.sub)
        ]).then(()=>{
          setIsLoggedIn(true)
          navigation.navigate("Landing")
        })
      })
      .catch(error => {
        setErrorMessage(error)
        console.log(error)
      });
    }
  return(
  <View>
    <Button onPress={startLogin} title="Login" color="green"></Button>
    {Boolean(accessToken) && <ActivityIndicator color="green"/>}
    {Boolean(errorMessage)&&<Text>Login failed: {errorMessage}</Text>}
  </View>
  )
}

export default Login