import React from "react"
import { Avatar,Text} from "react-native-paper"
import {Pressable, View} from "react-native"
const ProfileButton = ({profile, navigation})=>{

  const goToProfile = ()=>{
    navigation.navigate("Account")
  }

  return (
    <Pressable style={{flexDirection:"row", alignItems:"center", marginEnd:10}} onPress={goToProfile}>
      <Text style={{marginEnd:10}}>{profile.name}</Text>
      <Avatar.Image source={{uri:profile.picture}} size={40}/>
    </Pressable>
  )
}

export default ProfileButton