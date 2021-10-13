import React from "react"
import { Text, View, ActivityIndicator } from "react-native";
import Auth0 from "react-native-auth0";
import AsyncStorage from '@react-native-async-storage/async-storage';
const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });

import config from "react-native-config";
import { connect } from "react-redux";
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

const CheckAccount = async (profile,userid,setStateText)=>{
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


const LoadAccount = ({navigation,setSetupComplete,setLoggedOut})=>{
  const [stateText, setStateText] = React.useState("loading")
  React.useEffect(async () => {
    AsyncStorage.getItem("accessToken").then(async accessToken=>{
      setStateText("Validating login...")
      const userid = await AsyncStorage.getItem("userId")
      setStateText("checking profile...")
      try{
        const profile = await auth0.auth.userInfo({token:accessToken})
        await AsyncStorage.setItem("profile",JSON.stringify(profile))
        await CheckAccount(profile,userid, setStateText)
        setSetupComplete()
        navigation.navigate("Landing")
      }
      catch(e){
        console.error(e)
        AsyncStorage.removeItem("accessToken")
        AsyncStorage.removeItem("refreshToken")
        AsyncStorage.removeItem("userId")
        setLoggedOut()
      }
    })
  }, [])
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={{marginBottom:20, fontSize:20}}>
        {stateText}
      </Text>
      {stateText != "Done" && <ActivityIndicator size="large"/>}
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