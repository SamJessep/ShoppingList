import React from "react"
import { Pressable , Text, View, StyleSheet } from "react-native"
import { Surface } from "react-native-paper"
import {CHECK_MODE, EDIT_MODE} from "./Modes"

const Item = ({data})=>{
  return (
    <Surface style={[styles.container, data.checked&&styles.checked]}>
      <Text style={[styles.name, styles.flexItem, data.checked ? styles.checked : styles.notChecked]}>{data.name}</Text>
    </Surface>    
  )
} 

const styles = StyleSheet.create({
  container:{
    elevation:2,
    marginLeft: 15,
    marginRight: 15,
    flexDirection:"row",
    padding:10,
    borderRadius:10,
    marginBottom:10
  },
  name:{
    fontSize:30,
    flex:8
  },
  flexItem:{
  },
  button:{
    flex:1,
    width:"100%",
    height:"100%",
    backgroundColor:"red",
    borderRadius:10,
  },
  buttonText:{
    fontSize:25,
    textAlign:"center",
    textAlignVertical:"center",
    color:"white"
  },
  checked:{
    textDecorationLine: 'line-through',
    color:"grey"
  },
  notChecked:{
    textDecorationLine:"none"
  },
  selected:{
    backgroundColor:"red"
  },
  checkedBackground:{
    backgroundColor:"#06a30659"
  }
})

export default Item