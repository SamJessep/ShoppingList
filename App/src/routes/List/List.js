import React from 'react'
import AddItem from './AddItem';
import Confirm from '../../components/Confirm';
import Item from './Item.js'
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import config from "react-native-config";
import HoldList from '../../components/HoldList/HoldList';
import { CHECK_MODE, EDIT_MODE } from './Modes';

const RemoveItemFromDB = async (item,listid) =>{
    await fetch(config.API_URL+`lists/id/${listid}/delete/${item.id}`, {method:"DELETE"})
    const newList = await fetch(config.API_URL+`lists/id/${listid}`).then(r=>r.json())
    return newList.items
}

const UpdateItemInDB = async (newItem, listid, itemid)=>{
  delete newItem["id"]
  delete newItem["listID"]
  const dbItem = await fetch(config.API_URL+`lists/id/${listid}/update/${itemid}`, {
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify(newItem)
  }).then(res=>res.json())
  console.log(dbItem)
  return dbItem
}

const List = ({route})=>{
  const list = route.params.list
  const [updating, setUpdating] = React.useState(false)
  const [items, setitems] = React.useState(list.items.map(i=>{return {...i,selected:false}}))
  const [mode, setMode] = React.useState(CHECK_MODE)
  const [selectedCount, setSelectedCount] = React.useState(0)
  
  const AddItemToItems = async (item,listid) =>{
    setitems([...items,item])
    setUpdating(true)
    await fetch(config.API_URL+`lists/id/${listid}/add`, {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(item)
    }).then(r=>r.json()).catch(console.error)
    const newList = await fetch(config.API_URL+`lists/id/${listid}`).then(r=>r.json())
    if(JSON.stringify(newList.items) !== JSON.stringify(items)){
      setitems(newList.items)
    }
    setUpdating(false)
  }
  

  const RemoveItem = async (item, localUpdate=true) =>{
    if(localUpdate){
      const newItems = items.filter(i=>i.id !== item.id)
      setitems(newItems)
    }
    setUpdating(true)
    const dbItems = await RemoveItemFromDB(item, list.id)
    if(JSON.stringify(dbItems) !== JSON.stringify(items)){
      setitems(dbItems)
    }
    setUpdating(false)
  }

  const DeleteMany = async indexes =>{
    var itemsToDelete = items.filter((_,index)=>indexes.includes(index))
    const newItems = items.filter((_,index)=>!indexes.includes(index))
    setitems(newItems)
    setSelectedCount(0)
    setMode(CHECK_MODE)
    itemsToDelete.forEach(item=>RemoveItem(item,false))
  }

  const ListItemClicked = async (item)=>{
    var newItems = items.map(i=>{
      if(i.key === item.key)i.checked=!i.checked
      return i
    })
    setitems(newItems)
    const dbItem = await UpdateItemInDB({checked:item.checked}, list.id, item.id)
    if(JSON.stringify(dbItem) !== JSON.stringify(item)){
      newItems.map(i=>i.id===dbItem.id?dbItem:i)
      setitems(newItems)
    }
  }
  const deleteButtonText = `Delete ${selectedCount} item${selectedCount>1?"s":""}`
  const listItems = items.map((item) =>{
    return {
      component:<Item data={item} key={item.key}/>,
      onClick:()=>ListItemClicked(item)
    }
  }
  );
  return(
  <View>
    <Text style={styles.title}>{list.name}</Text>
    <AddItem onAddItem={AddItemToItems} list={list}></AddItem>
    <View style={styles.divider}></View>
    <Text>Items</Text>
    {updating && <Text style={{textAlign:"center"}}>Syncing...</Text>}
    <HoldList noItemsComponent={<Text>No Items</Text>} onDeletePressed={DeleteMany}>
      {listItems}
    </HoldList>
    {mode === EDIT_MODE &&
    <View style={styles.itemControls}>
      <Button title="Cancel" color="orange" onPress={CancelSelect}/>
      <Button title={deleteButtonText} color="red" onPress={DeleteSelected}/>
      {selectedCount === items.length ? 
      <Button title="Unselect all" color="red" onPress={()=>SelectAll(false)}/>:
      <Button title="Select all" color="red" onPress={SelectAll}/>}
      {selectedCount==1&&<Button title="Edit" color="orange" onPress={DeleteSelected}/>}
    </View>}
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