import React from "react"
import { Text, View } from "react-native";
import Tabs from "../components/Tabs";

const Landing = ({navigation})=>{
  return (
    <View style={{flex:1}}>
      <Tabs navigation={navigation}></Tabs>
    </View>
  )
}

export default Landing