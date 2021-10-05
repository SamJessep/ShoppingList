import {View, Text, ScrollView, Button} from "react-native"
import React from "react"
import LISTS_DUMMY_DATA from "../dummyData.js"
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "react-native-config";
import CreateListModal from "./CreateListModal.js";

const fetchUserLists = async uid=>{
  const lists = await fetch(config.API_URL+"lists/user/"+uid).then(res=>res.json())
  return lists
}

const fetchGroups = async uid=>{
  console.log()
  const groups = await fetch(config.API_URL+"groups/"+uid).then(res=>res.json())
  return groups
}

const Lists = ({navigation})=>{
  const [loading, setloading] = React.useState(true)
  const [lists, setLists] = React.useState([])
  const [createListModalOpen, setCreateListModalOpen] = React.useState(false)
  const [groups, setGroups] = React.useState([])

  React.useEffect(async () => {
    const uid = await AsyncStorage.getItem("userId")
    Promise.all([
      fetchUserLists(uid).then(usersLists=>setLists(usersLists)),
      fetchGroups(uid).then(groups=>setGroups(groups))
    ]).then(_=>setloading(false)) 
  }, [])

  var listsElements = (<Text>You have no lists</Text>)
  if(!loading){
    if(lists.length > 0){
      listsElements = lists.map(list=>(
        <Button title={list.name} key={list.key} onPress={()=>navigation.navigate("List", {items:list.items})}/>
      ))
    }
  }
  return (
    <View >
      {loading?<Text>Loading...</Text>:
      <ScrollView>
        {listsElements}
      </ScrollView>}
      <Button title="Create list" onPress={()=>setCreateListModalOpen(!createListModalOpen)}/>
      {createListModalOpen && <CreateListModal closeModal={()=>setCreateListModalOpen(false)} groups={groups}/>}
    </View>
  )
}

export default Lists