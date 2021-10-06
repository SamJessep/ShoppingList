import React from "react"
import { Text, View, ActivityIndicator } from "react-native";
import Auth0 from "react-native-auth0";
import AsyncStorage from '@react-native-async-storage/async-storage';
const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });

import config from "react-native-config";

const LoadAccount = ({navigation})=>{
  const [stateText, setStateText] = React.useState("loading")
  React.useEffect(async () => {
    AsyncStorage.getItem("accessToken").then(async accessToken=>{
      const userId = await AsyncStorage.getItem("userId")
      const profile = await auth0.auth.userInfo({token:accessToken})
      await AsyncStorage.setItem("profile",JSON.stringify(profile))
      console.log(profile)
      setStateText("checking profile...")
      try{
        var url = config.API_URL+"users/email/"+profile.email
        const users = await fetch(url).then(res=>res.json())
        if(users.length == 0){
          setStateText("creating profile...")
          url = config.API_URL+"users/create"
          await fetch(url,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:JSON.stringify({
              name:profile.name,
              email:profile.email,
              authId:userId
            })
          })
        }else{
          if(users[0].authId != userId){
            setStateText("migrating profile...")
            url = config.API_URL+"users/"+userId+"/update"
            await fetch(url, {
              method:"POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body:JSON.stringify({
                authId:userId
              })
            })
          }
        }
        setStateText("Done")
        navigation.navigate("Landing")
        // setTimeout(()=>navigation.navigate("Landing"), 1500)
      }catch(e){
        console.error(e)
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

export default LoadAccount