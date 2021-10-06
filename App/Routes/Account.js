import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react"
import { ActivityIndicator, Alert, Button, Image, StyleSheet, Text, View } from "react-native"
import Auth0 from 'react-native-auth0';
import { connect } from "react-redux";
const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });

const Account = ({navigation,setLoggedOut})=>{
  const [profile, setProfile] = React.useState(null)
  React.useEffect(() => AsyncStorage.getItem("profile").then(profileString=>setProfile(JSON.parse(profileString))), [])

  AsyncStorage.getItem("userId").then(uid=>console.log("UID", uid))
  const LogOut = ()=>{
    auth0.webAuth
    .clearSession({})
    .then(async (success) => {
        await AsyncStorage.clear()
        setLoggedOut()
    })
    .catch(error => {
        console.error(error);
    });
  }
  return(
    <View>
    {profile == null? 
      <ActivityIndicator size="large"></ActivityIndicator>
      :
      <View>
        <Text>{profile.name}</Text>
        <Image style={styles.profilePicture} source={{uri:profile.picture}}/>
        {Object.keys(profile).map(key=>(
            <View style={{flexDirection:"row"}} key={key}>
              <Text style={{fontWeight:"800"}}>{key}:</Text>
              <Text>{profile[key]}</Text>
            </View>
        ))}
        <Button color="red" title="Log out" onPress={LogOut}></Button>
      </View>
    }
    </View>
  )
}

const styles = StyleSheet.create({
  profilePicture:{
    width:100,
    height:100
  }
})

function mapStateToProps(state){
  return {
    loggedIn:state.loggedIn
  }
}

function mapDispatchToProps(dispatch){
  return{
    setLoggedOut: ()=>dispatch({type:"LOGGED_OUT"})
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Account)