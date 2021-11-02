import React from "react";
import { Pressable, View, Text, Modal, StyleSheet,ToastAndroid,BackHandler } from "react-native";
import config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBackHandler } from '@react-native-community/hooks'
import Icon from "react-native-dynamic-vector-icons";
import globalStyles from "../../styles/styles"
import { Button, Dialog, HelperText, Portal, TextInput } from "react-native-paper";
import uuid from 'react-native-uuid';
import Realm from 'realm';


const CreateGroupModal = ({open,closeModal, createGroup})=>{
  const [name, setName] = React.useState("")
  const [loading, setloading] = React.useState(false)
  const [nameIsInvalid, setNameIsInvalid] = React.useState(false)
  useBackHandler(()=>closeModal())
  
  const tryCreateGroup = async ()=>{
    if(name == "") return setNameIsInvalid(true)
    setloading(true)
    const userid = await AsyncStorage.getItem("userid")
    console.log(userid)
    const groupID=new Realm.BSON.ObjectID()
    const group = {
      _id: groupID,
      name:name,
      members:[userid],
      partition:userid
    }
    createGroup(group)
    setloading(false)
    closeModal()
  }


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
            <Button mode="contained" onPress={tryCreateGroup}>Create</Button>}
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