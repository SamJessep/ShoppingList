import React from "react"
import { Pressable , Text, View, StyleSheet } from "react-native"
import {CHECK_MODE, EDIT_MODE} from "./Modes"

const Item = ({data,RemoveItem,mode,setMode, setSelected, selected})=>{
  console.log(selected)
  const [checked, setChecked] = React.useState(data.checked)

  const CheckItem = ()=>{
    if(mode === CHECK_MODE){
      setChecked(!checked)
    }
  }

  const LongPress = ()=>{
    setMode(EDIT_MODE)
    setSelected(data,true)
  }

  const ShortPress = ()=>{
    if(mode == EDIT_MODE){
      setSelected(data,!selected)
    }else{
      CheckItem()
    }
  }
  
  return (
    <View>
      <Pressable onPress={ShortPress} style={[styles.container, selected&&styles.selected, (checked&&!selected)&&styles.checkedBackground]} onLongPress={LongPress}>
        <Text style={[styles.name, styles.flexItem, checked ? styles.checked : styles.notChecked]}>{data.name}</Text>
        {(mode == EDIT_MODE && selected) &&         
        <Pressable style={[styles.button, styles.flexItem]}>
          <Text style={styles.buttonText}>X</Text>
        </Pressable>
        }
      </Pressable>     
    </View>
  )
} 

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#eeeeee",
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
    textDecorationLine: 'line-through'
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