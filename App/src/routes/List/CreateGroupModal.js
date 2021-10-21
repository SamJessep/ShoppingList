import React from "react";
import { Pressable, View, Text, Modal, StyleSheet,ToastAndroid,BackHandler } from "react-native";
import config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBackHandler } from '@react-native-community/hooks'
import Icon from "react-native-dynamic-vector-icons";
import globalStyles from "../../styles/styles"
import { Button, Dialog, HelperText, Portal, TextInput } from "react-native-paper";
import uuid from 'react-native-uuid';

const createGroup = async (name,setloading, closeModal,setNameIsInvalid)=>{
  if(name == "") return setNameIsInvalid(true)
  try{
    setloading(true)
    const userid = await AsyncStorage.getItem("userId")
    const createRes = await fetch(APP_CONFIG.API_URL+"groups/create", {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        name:name,
        key: uuid.v4()
      })
    })
    if(!createRes.ok) throw new Error(`error code:${createRes.status}. text:${createRes.statusText}`)
    const group = await createRes.json()
    ToastAndroid.show("created group: "+group.name, ToastAndroid.SHORT)
    setloading(false)
    const newGroups = await fetch(APP_CONFIG.API_URL+"groups/user/"+userid).then(_=>_.json())
    closeModal(newGroups,group)
  }catch(e){
    setloading(false)
    ToastAndroid.show(e.toString(), ToastAndroid.SHORT)
    console.error(e)
  }
}

const CreateGroupModal = ({open,closeModal})=>{
  const [name, setName] = React.useState("")
  const [loading, setloading] = React.useState(false)
  const [nameIsInvalid, setNameIsInvalid] = React.useState(false)
  useBackHandler(()=>closeModal())



  return (
    <Portal>
      <Dialog visible={open} onDismiss={closeModal}>
        <Dialog.Title>Create a group</Dialog.Title>
        <Pressable style={styles.closeButton} onPress={()=>closeModal()}>
          <Icon type="MaterialCommunityIcons" name="window-close"/>
        </Pressable>
        <Dialog.Content>
          <View style={styles.container}>
            <TextInput onChangeText={setName} mode="outlined" label="Group name"/>
            <HelperText type="error" visible={nameIsInvalid}>
              Group name is required
            </HelperText>
            {loading ? <Button mode="contained" loading={loading}>Creating group</Button> :
            <Button mode="contained" onPress={()=>{createGroup(name,setloading,closeModal,setNameIsInvalid)}}>Create</Button>}
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container:{
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