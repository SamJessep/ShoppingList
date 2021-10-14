import React from "react"
import { Text, View, ActivityIndicator } from "react-native";
import Auth0 from "react-native-auth0";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });

import config from "react-native-config";
import { connect } from "react-redux";
import { Button } from "react-native-paper";
const CreateProfile = async(profile, userid) =>{
  url = config.API_URL+"users/create"
  await fetch(url,{
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      name:profile.name,
      email:profile.email,
      authId:userid
    })
  })
}

const MigrateProfile = async (userid) =>{
    url = config.API_URL+"users/"+userid+"/update"
    await fetch(url, {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        authId:userid
      })
    })
    return account
}




const LoadAccount = ({navigation,setSetupComplete,setLoggedOut})=>{
  const [stateText, setStateText] = React.useState("loading")
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  
  const ResetLogin = ()=>{
    AsyncStorage.removeItem("accessToken")
    AsyncStorage.removeItem("refreshToken")
    AsyncStorage.removeItem("userId")
    setLoggedOut()
  }
  
  const SaveAccount = async (profile,userid)=>{
    await AsyncStorage.setItem("profile",JSON.stringify(profile))
    await CheckAccount(profile,userid)
  }
  const CheckAccount = async (profile,userid)=>{
    var url = config.API_URL+"users/email/"+profile.email
    const users = await fetch(url).then(res=>res.json())
    if(users.length == 0){
      setStateText("creating profile...")
      await CreateProfile(profile,userid)
    }else{
      if(users[0].authId != userid){
        setStateText("migrating profile...")
        await MigrateProfile(profile, userid)
      }
    }
  }
  React.useEffect(async () => {
    try{
      const accessToken = await RNSecureKeyStore.get("accessToken")
      setStateText("Validating login...")
      const userid = await AsyncStorage.getItem("userId")
      setStateText("checking profile...")

      auth0.auth.userInfo({token:accessToken})
      .then(async profile=>await SaveAccount(profile,userid))
      .catch(async e=>{
        const refreshToken = await RNSecureKeyStore.get("refreshToken")
        const {accessToken:newAccessToken, refreshToken:newRefreshToken} = await auth0.auth.refreshToken({refresh_token:refreshToken})
        await RNSecureKeyStore.set("accessToken", newAccessToken, {accessible:ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})         
        await RNSecureKeyStore.set("refreshToken", newRefreshToken, {accessible:ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
        const profile = await auth0.auth.userInfo({token:newAccessToken})
        await SaveAccount(profile,userid)
      })
      setSetupComplete()
      navigation.navigate("Landing")
    }
    catch(e){
      console.error(e)
      setError(true)
      setLoading(false)
      setStateText(e.toString())
    }
  }, [])
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={[{marginBottom:20, fontSize:20}, error&&{color:"red"}]}>
        {stateText}
      </Text>
      {error&&<Button mode="contained" onPress={ResetLogin}>Log out</Button>}
      {loading && <ActivityIndicator size="large"/>}
    </View>
  )
}

function mapStateToProps(state){
  return {
    loggedIn:state.loggedIn,
    needsSetup:state.needsSetup
  }
}

function mapDispatchToProps(dispatch){
  return{
    setSetupComplete: ()=>dispatch({type:"SETUP_COMPLETE"}),
    setLoggedOut: ()=>dispatch({type:"LOGGED_OUT"})
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(LoadAccount)