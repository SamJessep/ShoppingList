import React from "react"
import { ScrollView,View,Button,Text } from "react-native"
import HoldListItem from "./HoldListItem"
import {CHECK_MODE, EDIT_MODE} from "../../routes/List/Modes"
import {useStateWithDep} from '../../customHooks'


const HoldListInner = ({children,onItemPress,noItemsComponent,onDeletePressed}) =>{
  const [mode, setMode] = React.useState(CHECK_MODE)
  const [listItems, setListItems] = useStateWithDep(children)
  const [selectedCount, setSelectedCount] = React.useState(0)


  const DeleteSelected = async ()=>{
    setMode(CHECK_MODE)
    setSelectedCount(0)
    setListItems(listItems.filter(i=>!i.__selected))
    for(let i of listItems){
      if(i.__selected) RemoveItem(i,false)
    }
  }

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
  return (
    <View>
    <ScrollView>
      {children.length == 0 ? noItemsComponent :
        listItems.map((child,key)=>(
        <HoldListItem 
          key={key}
          index={key}
          selected={child.__selected}
          mode={mode} 
          onItemPress={PressItem} 
          onItemSelect={SelectItem} 
          setMode={(m)=>setMode(m)}
          data={child}>
            {child.component}
        </HoldListItem>
      ))}
    </ScrollView>
    
    {mode == EDIT_MODE && <View>
    <Text>{selectedCount} item{selectedCount>1?"s":""} selected</Text>
      <Button title="Cancel" onPress={CancelSelect}/>
      {selectedCount === listItems.length ? 
        <Button title="Unselect All" onPress={()=>SelectAll(false)}/>
      :<Button title="Select All" onPress={SelectAll}/>
      }
      <Button onPress={()=>onDeletePressed(GetSelectedIndexes())} color="red" title="delete"/>
    </View>}
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