import React, { useEffect, useState } from "react"
import { ScrollView,View,RefreshControl, BackHandler } from "react-native"
import HoldListItem from "./HoldListItem"
import {CHECK_MODE, EDIT_MODE} from "../../routes/List/Modes"
import {useStateWithDep} from '../../customHooks'
import { Checkbox,Button,Text, IconButton, Colors } from "react-native-paper"
import { useFocusEffect } from '@react-navigation/native';


const HoldListInner = ({children,onItemPress,noItemsComponent,onDeletePressed, onRefresh,refreshable=false, refreshing=false,dragableOptions={}, resetDrag}) =>{
  const [mode, setMode] = React.useState(CHECK_MODE)
  const [listItems, setListItems] = useStateWithDep(children)
  const [selectedCount, setSelectedCount] = React.useState(0)
  const [selectAllChecked, setSelectAllChecked] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (mode == EDIT_MODE) {
          CancelSelect()
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [mode])
  );


  
  //Toggle select all switch automatically when changing what items are selected
  useEffect(()=>{
    setSelectAllChecked(selectedCount===children.length)
  }, [selectedCount])

  const PressItem = (item)=>{
    if(onItemPress) onItemPress(item)
  }

  const SelectItem = (index,selectState) =>{
    const newChildren = listItems.map((i,i_index)=>{
      if(i_index == index){
        i.__selected=selectState
      }
      return i
    })
    setSelectedCount(CountSelected())
    setListItems(newChildren)
  }


  const CancelSelect = ()=>{
    Object.keys(listItems).forEach(i=>SelectItem(i,false))
    setMode(CHECK_MODE)
  }

  const SelectAll = (on=true)=>{
    Object.keys(listItems).forEach(i=>SelectItem(i,on))
  }

  const CountSelected = ()=>GetSelectedIndexes().length

  const GetSelectedIndexes = ()=>{
    const selectedIndexes = []
    listItems.forEach((item,index)=>{
      if(item.__selected){
        selectedIndexes.push(index)
      }
    })
    return selectedIndexes
  }
  
  const iconSize=30
  return (
    <View style={{flex:1}}>

    {mode == EDIT_MODE && 
    <>
    <View style={{flexShrink:0, flexDirection:"row", justifyContent:"space-between", marginBottom:10, alignItems:"center"}}>
        <Text>{selectedCount} item{selectedCount>1?"s":""} selected</Text>
        <View style={{flexDirection:"row"}}>
          <IconButton onPress={CancelSelect} icon="close-thick" size={iconSize} color={Colors.grey600}/>
          <IconButton onPress={()=>onDeletePressed(GetSelectedIndexes())} icon="delete" color={Colors.red400} size={iconSize}/>
        </View>
      </View>
      <View style={{justifyContent:"flex-end", flexDirection:"row", alignItems:"center"}}>
        <Text>{selectAllChecked? "Unselect All":"Select All"}</Text>
        <Checkbox 
          onPress={()=>{SelectAll(!selectAllChecked)}} 
          status={selectAllChecked ? "checked" : "unchecked"}
        />
      </View>
      </>}
      <ScrollView style={{}} refreshControl={
        <RefreshControl onRefresh={onRefresh} enabled={refreshable} refreshing={refreshing}/>
      }>
        {children.length > 0 ?
          listItems.map((child,index)=>(
          <HoldListItem
            resetDrag={resetDrag}
            key={child.key}
            index={index}
            selected={child.__selected}
            mode={mode} 
            onItemPress={PressItem} 
            onItemSelect={SelectItem} 
            setMode={(m)=>setMode(m)}
            data={child}
            dragableOptions={dragableOptions}>
              {child.component}
          </HoldListItem> 
        )): refreshing ? <></> : noItemsComponent}
      </ScrollView>
    </View>
  )
}

const HoldList = (props) =>{
  var alteredProps = {...props}
  if(!alteredProps.children) alteredProps.children = []
  alteredProps.children = alteredProps.children.map(c=>{return {...c,__selected:false}})
  return (<HoldListInner {...alteredProps} />)
}

export default HoldList