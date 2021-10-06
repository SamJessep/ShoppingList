import React from 'react'
import { ActivityIndicator,Text,View,StyleSheet } from 'react-native'

const LoadingOverlay = ({message})=>{
  return(
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      <ActivityIndicator size="large"/>
    </View>
  ) 
}

const styles = StyleSheet.create({
  container:{
    position:"absolute",
    top:0,
    left:0,
    height:"100%",
    width: "100%",
    backgroundColor:"black",
    elevation:100,
    alignItems:"center",
    justifyContent:"center",
    opacity:0.7
  },
  text:{
    color:"white",
    fontSize:20
  }
})

export default LoadingOverlay