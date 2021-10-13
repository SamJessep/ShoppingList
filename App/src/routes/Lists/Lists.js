import {View, Text, ScrollView, Button, StyleSheet} from "react-native"
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "react-native-config";
import CreateListModal from "../List/CreateListModal.js";
import ListCard from "./ListCard.js";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateGroupModal from "../List/CreateGroupModal.js";
import HoldList from "../../components/HoldList/HoldList";
import ActionButton from "./ActionButton.js";

const fetchUserLists = async uid=>{
  const lists = await fetch(config.API_URL+"lists/user/"+uid+"?include=group").then(res=>res.json())
  return lists
}


const fetchGroups = async uid=>{
  const groups = await fetch(config.API_URL+"groups/user/"+uid).then(res=>res.json())
  return groups
}

const Lists = ({navigation})=>{
  const [loading, setloading] = React.useState(true)
  const [updating, setUpdating] = React.useState(false)
  const [lists, setLists] = React.useState([])
  const [createListModalOpen, setCreateListModalOpen] = React.useState(false)
  const [createGroupModalOpen, setCreateGroupModalOpen] = React.useState(false)
  const [groups, setGroups] = React.useState([])
  
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
      const uid = await AsyncStorage.getItem("userId")
      setUpdating(true)
      await fetchUserLists(uid).then(usersLists=>setLists(usersLists))
      setUpdating(false)
    });
    return unsubscribe;
  }, [navigation]);
  
  var listsElements
  if(!loading){
    if(lists.length > 0){
      listsElements = lists.map(list=>{
        return{
          component:(<ListCard key={list.id} data={list} loadList={loadList}/>),
          onClick:()=>loadList(list)
        }
      })
    }
  }
  return (
    <View style={{flex:1}}>
      {updating && <Text>Updating...</Text>}
      {loading?<Text>Loading...</Text>:
      <HoldList onItemPress={console.log} noItemsComponent={<Text>No Lists</Text>}>
        {listsElements}
      </HoldList>
      }
      <ActionButton actions={{
        createList:setCreateListModalOpen,
        createGroup:setCreateGroupModalOpen
      }}/>
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