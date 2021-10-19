import React from "react"
import { Pressable, StyleSheet, Switch, Text,useWindowDimensions,View } from "react-native"
import { Checkbox, TouchableRipple } from 'react-native-paper';
import Dragable from "../../Dragable";
import {CHECK_MODE, EDIT_MODE} from "../../routes/List/Modes"
import SwipeIndicators from "../../SwipeIndicators";
const HoldListItem = ({index,children,mode, onItemPress, onItemSelect, setMode,selected,data,dragableOptions}) =>{
  
  const LongPress = ()=>{
    setMode(EDIT_MODE)
    onItemSelect(index,true)
  }

  const ShortPress = ()=>{
    if(mode == EDIT_MODE){
      onItemSelect(index,!selected)
    }else{
      onItemPress(index)
      data.onClick()
    }
  }
  return (
    <View style={styles.rowOuter}>
    <Dragable {...dragableOptions} extra={{index:index}}>
      <SwipeIndicators>
        <TouchableRipple onPress={ShortPress} onLongPress={LongPress} style={[selected&&styles.selected]}>
          <View style={styles.rowInner}>
            <View style={styles.contentContainer}>
              {children}
            </View>
            <View style={styles.selectedContainer}>
            {mode == EDIT_MODE && <Checkbox status={selected ? 'checked' : 'unchecked'}/>}
            </View>
          </View>
        </TouchableRipple>
      </SwipeIndicators>
    </Dragable>
    </View>
  )
}

const styles = StyleSheet.create({
  selected:{
    backgroundColor:"grey"
  },
  rowInner:{
    flexDirection:"row"
  },
  rowOuter:{
    marginBottom:10
  },
  contentContainer:{
    flex:1
  },
  selectedContainer:{
    // paddingRight:10,
    alignSelf:"center"
  }
})

export default HoldListItem