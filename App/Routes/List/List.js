import uuid from 'react-native-uuid';
import React from 'react'
import AddItem from './AddItem';
import Confirm from '../../Components/Confirm';
import Item from './Item.js'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Modal,
  Button
} from 'react-native';
import config from "react-native-config";
import {CHECK_MODE, EDIT_MODE} from "./Modes"


const List = ({route})=>{
  const list = route.params.list
  const [items, setitems] = React.useState(list.items.map(i=>{return {...i,selected:false}}))
  const [mode, setMode] = React.useState(CHECK_MODE)
  const [selectedCount, setSelectedCount] = React.useState(0)

  
  const AddItemToItems = async (item,listid) =>{
    await fetch(config.API_URL+`lists/id/${listid}/add`, {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(item)
    }).then(r=>r.json()).catch(console.error)
    const newList = await fetch(config.API_URL+`lists/id/${listid}`).then(r=>r.json())
    setitems(newList.items)
    console.log(newList.items)
  }
  
  const RemoveItem = async (item) =>{
      const newItems = items.filter(i=>i.id!=item.id)
      setitems(newItems)
      setConfirmShown(false)
      await fetch(config.API_URL+`lists/id/${list.id}/delete/${item.id}`, {method:"DELETE"})
      const newList = await fetch(config.API_URL+`lists/id/${list.id}`).then(r=>r.json())
      setitems(newList.items)
  }

  const TryRemoveItem = item =>{
    setSelectedItem(item)
    setConfirmShown(true)
  }

  const SelectItem = (item,selectState) =>{
    const newItems = items.map(i=>{
      if(i.id===item.id){
        item.selected=selectState
      }
      return i
    })
    setitems(newItems)
    setSelectedCount(CountSelected())
  }

  const DeleteSelected = async ()=>{
    setMode(CHECK_MODE)
    setSelectedCount(0)
    for(let i of items){
      if(i.selected) await RemoveItem(i)
    }
  }

  const CancelSelect = ()=>{
    const newItems = items.map(i=>{
      i.selected=false
      return i
    })
    setitems(newItems)
    setSelectedCount(CountSelected())
    setMode(CHECK_MODE)
  }

  const CountSelected = ()=>{
    const count = items.filter(i=>i.selected).length
    console.log(count)
    return count
  }
  const deleteButtonText = `Delete ${selectedCount} item${selectedCount>1?"s":""}`
  const listItems = items.map((item) =>
    <Item data={item} key={item.id} RemoveItem={TryRemoveItem} mode={mode} setMode={setMode} setSelected={SelectItem} selected={item.selected}></Item>
  );
  const [ConfirmShown, setConfirmShown] = React.useState(false)
  const [SelectedItem, setSelectedItem] = React.useState(null)
  return(
  <View>
    <Text style={styles.title}>{list.name}</Text>
    <AddItem onAddItem={AddItemToItems} list={list}></AddItem>
    <View style={styles.divider}></View>
    <Text>Items</Text>
    <ScrollView>
    {listItems.length == 0 ? <Text>No Items</Text> : listItems}
    </ScrollView>
    {mode === EDIT_MODE &&
    <View style={styles.itemControls}>
      <Button title="Cancel" color="orange" onPress={CancelSelect}/>
      <Button title={deleteButtonText} color="red" onPress={DeleteSelected}/>
      {selectedCount==1&&<Button title="Edit" color="orange" onPress={DeleteSelected}/>}
    </View>}
    {ConfirmShown && <Confirm message={"are you sure you want to delete this item?"} onNo={()=>setConfirmShown(false)} onYes={()=>RemoveItem(SelectedItem)}/>}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  divider:{
    marginBottom:20
  },
  title:{
    fontSize:20,
    textAlign:"center",
    padding:5
  },
  itemControls:{
    flexDirection:"row",
    width:"100%",
    justifyContent:"space-around"
  }
});

export default List