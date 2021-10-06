import React from "react"
import { View,Text, TextInput, Button } from "react-native"
import config from "react-native-config";
import globalStyles from "../styles"

const Settings = ()=>{
  return(
    <View style={{flex:1, margin:10}}>
      <Text>Server Address</Text>
      <TextInput value={config.API_URL} style={globalStyles.textField}></TextInput>
      <Button title="Save"/>
    </View>
  )
}


export default Settings