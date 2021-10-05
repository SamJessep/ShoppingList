import React from "react";
import { Pressable,TextInput, View, Text, Modal, Button,StyleSheet } from "react-native";
import config from "react-native-config";
import {Picker} from '@react-native-picker/picker';
import CreateGroupModal from "./CreateGroupModal";

const createList = async (groupid,name)=>{
  fetch(config.API_URL+"lists/create/"+groupid, {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      name:name
    })
  })
}

const CreateListModal = ({closeModal, groups})=>{
  const [name, setName] = React.useState("")
  const [buttonText, setButtonText] = React.useState("Create")
  const [selectedGroup, setSelectedGroup] = React.useState(null)
  const [showCreateGroupModal, setShowCreateGroupModal] = React.useState(false)

  const refreshGroups = async ()=>{
  }
  return (
    <Modal animationType="fade" transparent={false}>
      <Pressable style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>X</Text>
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Create a list</Text>
        <Text>Name</Text>
        <TextInput style={styles.textField} onChangeText={setName}/>

        <Button title="Create new group" onPress={()=>setShowCreateGroupModal(!showCreateGroupModal)}/>
        {showCreateGroupModal && <CreateGroupModal closeModal={()=>setShowCreateGroupModal(false)}/>}
        {groups.length == 0 && <Text>You have no groups</Text>}
        <Picker 
          selectedValue={selectedGroup}
          onValueChange={group =>setSelectedGroup(group)}>
        {groups.map(group=>(
          <Picker.Item label={group.name} value={group.id}/>
        ))}
        </Picker>

        <Button title={buttonText} disabled={buttonText!="Create"} onPress={()=>createList(groupid,name)}/>
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