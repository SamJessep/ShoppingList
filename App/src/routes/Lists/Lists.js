import {View, Text, ScrollView, Button, StyleSheet} from "react-native"
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateListModal from "../List/CreateListModal.js";
import ListCard from "./ListCard.js";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateGroupModal from "../List/CreateGroupModal.js";
import HoldList from "../../components/HoldList/HoldList";
import ActionButton from "./ActionButton.js";
import Dragable from "../../Dragable.js";
import { Snackbar } from "react-native-paper";
import { useHistory } from "../../customHooks.js";


const fetchUserLists = async uid=>{
  const lists = await fetch(APP_CONFIG.API_URL+"lists/user/"+uid+"?include=group").then(res=>res.json())
  return lists
}


const fetchGroups = async uid=>{
  const groups = await fetch(APP_CONFIG.API_URL+"groups/user/"+uid).then(res=>res.json())
  return groups
}

const Lists = ({navigation})=>{
  const [loading, setloading] = React.useState(true)
  const [updating, setUpdating] = React.useState(false)
  const { state:lists, set:setLists, undo:undoListChange, canUndo, canRedo } = useHistory([]);
  const [createListModalOpen, setCreateListModalOpen] = React.useState(false)
  const [createGroupModalOpen, setCreateGroupModalOpen] = React.useState(false)
  const [groups, setGroups] = React.useState([])
  
  const [undoDeleteVisable, setUndoDeleteVisable] = React.useState(false)
  const [onUndoDissmissed, setOnUndoDissmissed] = React.useState(()=>console.log("undo dismissed"))
  const [onUndoPressed, setonUndoPressed] = React.useState(()=>console.log("undo pressed"))
  
  
  const loadList = async list =>{
    navigation.navigate("List", {list:list})
  }

  React.useEffect(async () => {
    const uid = await AsyncStorage.getItem("userId")
    Promise.all([
      fetchUserLists(uid).then(usersLists=>setLists(usersLists)),
      fetchGroups(uid).then(groups=>{setGroups(groups)})
    ]).then(_=>setloading(false))
  }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await Refresh()
    });
    return unsubscribe;
  }, [navigation]);

  const RemoveListFromDB = async (list,syncLocal=false)=>{
    const userid = await AsyncStorage.getItem("userId")
    const newLists = await fetch(APP_CONFIG.API_URL+`lists/${userid}/${list.id}`, {method:"DELETE"})
    if(syncLocal){
      await Refresh()
    }
    return newLists
  }

  const DeleteLists = async (indexes, localOnly=false)=>{
    var listsToDelete = lists.filter((_,index)=>indexes.includes(index))
    const newLists = lists.filter((_,index)=>!indexes.includes(index))
    setLists(newLists)
    if(indexes.length == 1) setUndoDeleteVisable(true)
    if(!localOnly){
      for(let list of listsToDelete){
        await RemoveListFromDB(list)
      }
      await Refresh()
    }
    console.log(listsToDelete)
    return listsToDelete
  }

  const Refresh = async ()=>{
    setUpdating(true)
    const uid = await AsyncStorage.getItem("userId")
    const dbLists = await fetchUserLists(uid)
    if(JSON.stringify(dbLists) !== JSON.stringify(lists)){
      setLists(dbLists)
    }
    setUpdating(false)
  }

  const HandleRowSwipe = async ({direction, extra})=>{
    if(direction == "left"){
      await DeleteLists([extra.index])
    }else if (direction == "right"){

    }
  }
  
  var listsElements
  if(!loading){
    if(lists.length > 0){
      listsElements = lists.map(list=>{
        return{
          key:list.id,
          component:(<ListCard key={list.id} data={list} loadList={loadList}/>),
          onClick:()=>loadList(list)
        }
      })
    }
  }
  return (
    <View style={{flex:1}}>
      <HoldList 
        noItemsComponent={<Text>No Lists</Text>} 
        onDeletePressed={DeleteLists} 
        onRefresh={Refresh} 
        refreshable refreshing={updating||loading}
        dragableOptions={{
          onSwipeProgress:()=>{},
          onSwipeRelease:HandleRowSwipe,
          swipeActions:{left:"SLIDE",right:"RESET"}
        }}
      >
        {listsElements}
      </HoldList>
      <ActionButton actions={{
        createList:setCreateListModalOpen,
        createGroup:setCreateGroupModalOpen
      }}/>
      <Snackbar
        duration={4000}
        visible={undoDeleteVisable}
        onDismiss={setUndoDeleteVisable}
        action={{
          label: 'Undo',
          onPress: undoListChange
        }}
      >List Deleted
      </Snackbar>
      {createListModalOpen && <CreateListModal closeModal={()=>setCreateListModalOpen(false)} groups={groups} createdGroup={loadList}/>}
      {createGroupModalOpen && <CreateGroupModal closeModal={()=>setCreateGroupModalOpen(false)} />}
    </View>
  )
}


const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})
export default Lists