import {View, Text, ScrollView, Button} from "react-native"
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "react-native-config";
import CreateListModal from "../List/CreateListModal.js";
import ActionButton from 'react-native-action-button';
import ListCard from "./ListCard.js";

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
  const [lists, setLists] = React.useState([])
  const [createListModalOpen, setCreateListModalOpen] = React.useState(false)
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

  var listsElements = (<Text>You have no lists</Text>)
  if(!loading){
    if(lists.length > 0){
      listsElements = lists.map(list=>(
        <ListCard key={list.id} data={list} loadList={loadList}/>
      ))
    }
  }
  return (
    <View style={{flex:1}}>
      {loading?<Text>Loading...</Text>:
      <ScrollView>
        {listsElements}
      </ScrollView>}
      <ActionButton onPress={()=>setCreateListModalOpen(!createListModalOpen)} />
      {createListModalOpen && <CreateListModal closeModal={()=>setCreateListModalOpen(false)} groups={groups} createdGroup={loadList}/>}
    </View>
  )
}

export default Lists