import React from "react";
import { Pressable,TextInput, View, Text, Modal, Button,StyleSheet, ToastAndroid,BackHandler } from "react-native";
import config from "react-native-config";
import {Picker} from '@react-native-picker/picker';
import CreateGroupModal from "./CreateGroupModal";
import { useBackHandler } from '@react-native-community/hooks'

const createList = async (groupid,name, setLoading, createdGroup)=>{

  setLoading(true)
  try{
    const list = await fetch(config.API_URL+"lists/create/"+groupid+"?include=items", {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        name:name
      })
    }).then(r=>r.json())
    createdGroup(list)
  }
  catch(e){
    console.error(e)
    ToastAndroid.show(e.toString(), ToastAndroid.SHORT)
  }
  setLoading(false)
}

const CreateListModal = ({closeModal, groups, createdGroup})=>{
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [selectedGroup, setSelectedGroup] = React.useState(groups[0].id??null)
  const [showCreateGroupModal, setShowCreateGroupModal] = React.useState(false)
  const [usersGroups, setUsersGroups] = React.useState(groups)
  useBackHandler(()=>closeModal())


  const closeGroupModal = async (newGroups=false, createdGroup)=>{
    if(newGroups){
      setUsersGroups(newGroups)
      setSelectedGroup(createdGroup.id)
    }
    setShowCreateGroupModal(false)
  }
  return (
    <Modal animationType="fade" transparent={false} >
      <Pressable style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>X</Text>
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Create a list</Text>
        <Text>Name</Text>
        <TextInput style={styles.textField} onChangeText={setName}/>

        <Text>Group</Text>
        {usersGroups.length == 0 ? <Text>You have no groups</Text> :
        <Picker style={styles.textField} 
          selectedValue={selectedGroup}
          onValueChange={group =>setSelectedGroup(group)}
        >
        {usersGroups.map(group=>(
          <Picker.Item label={group.name} value={group.id} key={group.id}/>
        ))}
        </Picker>}
        <Button title="Create new group" onPress={()=>setShowCreateGroupModal(!showCreateGroupModal)}/>
        {showCreateGroupModal && <CreateGroupModal closeModal={closeGroupModal}/>}
        

        {loading ? <Button title="Please Wait" disabled={true}/> :
        <Button title="Create" onPress={()=>createList(selectedGroup,name,setLoading,createdGroup)}/>}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:20,
    justifyContent:"center"
  },
  textField:{
    backgroundColor:"#dfdfdf",
    borderRadius:10,
    marginBottom:20
  },
  closeButton:{
    position:"absolute",
    right:20,
    top:20,
  },
  closeButtonText:{
    fontSize:25
  },
  title:{
    fontSize:30,
    marginBottom:100,
    textAlign:"center"
  }
})

export default CreateListModal