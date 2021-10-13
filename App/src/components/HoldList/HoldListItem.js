import React from "react"
import { Pressable, StyleSheet, Switch, Text,View } from "react-native"
import { Checkbox, TouchableRipple } from 'react-native-paper';
import {CHECK_MODE, EDIT_MODE} from "../../routes/List/Modes"
const HoldListItem = ({index,children,mode, onItemPress, onItemSelect, setMode,selected,data}) =>{

  const LongPress = ()=>{
    console.log("Long Press")
    setMode(EDIT_MODE)
    onItemSelect(index,true)
  }

  const ShortPress = ()=>{
    console.log("Short Press")
    if(mode == EDIT_MODE){
      onItemSelect(index,!selected)
    }else{
      onItemPress(index)
      data.onClick()
    }
  }
  console.log(selected)
  return (
    <TouchableRipple onPress={ShortPress} onLongPress={LongPress} style={[selected&&styles.selected]}>
      <View style={styles.row}>
        <View style={styles.contentContainer}>
          {children}
        </View>
        <View style={styles.selectedContainer}>
        {mode == EDIT_MODE && <Checkbox status={selected ? 'checked' : 'unchecked'}/>}
        </View>
      </View>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  selected:{
    backgroundColor:"grey"
  },
  row:{
    flexDirection:"row"
  },
  contentContainer:{
    flex:1
  },
  selectedContainer:{
    paddingRight:10,
    alignSelf:"center"
  }
})

export default HoldListItem