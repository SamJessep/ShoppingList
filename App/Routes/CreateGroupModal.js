import React from "react";
import { Pressable,TextInput, View, Text, Modal, Button,StyleSheet } from "react-native";
import config from "react-native-config";
import {Picker} from '@react-native-picker/picker';

const createGroup = async (name, userid)=>{
  fetch(config.API_URL+"group/create/", {
    method:"POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({
      name:name,
      creatorid:userid
    })
  })
}

const CreateGroupModal = ({closeModal, userid})=>{
  const [name, setName] = React.useState("")
  const [buttonText, setButtonText] = React.useState("Create")

  return (
    <Modal animationType="fade" transparent={false}>
      <Pressable style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>X</Text>
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Create a group</Text>
        <Text>Name</Text>
        <TextInput style={styles.textField} onChangeText={setName}/>
        <Button title={buttonText} disabled={buttonText!="Create"} onPress={()=>createGroup(name,userid)}/>
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

export default CreateGroupModal