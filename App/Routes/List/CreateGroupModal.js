import React from "react";
import { Pressable,TextInput, View, Text, Modal, Button,StyleSheet,ToastAndroid,BackHandler } from "react-native";
import config from "react-native-config";
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingOverlay from "../../Components/LoadingOverlay";
import { useBackHandler } from '@react-native-community/hooks'
import Icon from "react-native-dynamic-vector-icons";
import globalStyles from "../../styles"

const createGroup = async (name,setloading, closeModal,setNameIsInvalid)=>{
  if(name == "") return setNameIsInvalid(true)
  try{
    setloading(true)
    const userid = await AsyncStorage.getItem("userId")
    const group = await fetch(config.API_URL+"groups/create", {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        name:name,
        creatorid:userid
      })
    }).then(res=>res.json())
    ToastAndroid.show("created group: "+group.name, ToastAndroid.SHORT)
    setloading(false)
  
    const newGroups = await fetch(config.API_URL+"groups/user/"+userid).then(res=>res.json())
  
    console.dir(newGroups)
    closeModal(newGroups,group)
  }catch(e){
    console.error(e)
  }
}

const CreateGroupModal = ({closeModal})=>{
  const [name, setName] = React.useState("")
  const [loading, setloading] = React.useState(false)
  const [nameIsInvalid, setNameIsInvalid] = React.useState(false)
  useBackHandler(()=>closeModal())



  return (
    <Modal animationType="fade" transparent={false}>
      <Pressable style={styles.closeButton} onPress={()=>closeModal()}>
        <Icon type="MaterialCommunityIcons" name="window-close"/>
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.title}>Create a group</Text>
        <Text>Name</Text>
        <TextInput style={[globalStyles.textField, nameIsInvalid&&(globalStyles.textFieldInvalid)]} onChangeText={setName}/>
        {loading ? <Button title="Please wait" disabled={true}/> :
        <Button title="Create" onPress={()=>{createGroup(name,setloading,closeModal,setNameIsInvalid)}}/>}
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