import React from "react";
import { Pressable, View, Text, Modal,StyleSheet, ToastAndroid,BackHandler } from "react-native";
import config from "react-native-config";
import {Picker} from '@react-native-picker/picker';
import CreateGroupModal from "./CreateGroupModal";
import { useBackHandler } from '@react-native-community/hooks'
import Icon from "react-native-dynamic-vector-icons";
import globalStyles from '../../styles/styles'
import uuid from 'react-native-uuid';
import { Button, Dialog, HelperText, Portal, TextInput } from "react-native-paper";

const createList = async (groupid,name, setLoading, createdGroup,setNameIsInvalid)=>{
  if(name == "")
  return setNameIsInvalid(true)
  setLoading(true)
  try{
    const list = await fetch(APP_CONFIG.API_URL+"lists/create/"+groupid+"?include=items", {
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        name:name,
        key: uuid.v4()
      })
    }).then(r=>r.json()).catch(console.error)
    createdGroup(list)
  }
  catch(e){
    console.error(e)
    ToastAndroid.show(e.toString(), ToastAndroid.SHORT)
  }
  setLoading(false)
}

const CreateListModal = ({open,closeModal, groups, createdGroup})=>{
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [selectedGroup, setSelectedGroup] = React.useState(groups[0] ? groups[0].id:null)
  const [showCreateGroupModal, setShowCreateGroupModal] = React.useState(false)
  const [usersGroups, setUsersGroups] = React.useState(groups)
  const [nameIsInvalid, setNameIsInvalid] = React.useState(false)
  useBackHandler(()=>closeModal())


  const closeGroupModal = async (newGroups=false, createdGroup)=>{
    if(newGroups){
      setUsersGroups(newGroups)
      setSelectedGroup(createdGroup.id)
    }
    setShowCreateGroupModal(false)
  }

  return (
    <Portal>
    <Dialog visible={open} onDismiss={closeModal}>
      <Dialog.Title>Create a list</Dialog.Title>
        <Pressable style={styles.closeButton} onPress={closeModal}>
          <Icon type="MaterialCommunityIcons" name="window-close"/>
        </Pressable>
        <Dialog.Content>
        <View style={styles.container}>
          <Text>Name</Text>
          <TextInput error={nameIsInvalid} onChangeText={name=>{setNameIsInvalid(false); setName(name)}}/>
          <HelperText type="error" visible={nameIsInvalid}>
            List name is required
          </HelperText>
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
          <Button style={{marginBottom:20}} onPress={()=>setShowCreateGroupModal(!showCreateGroupModal)}>
            Create new group
          </Button>
          <CreateGroupModal open={showCreateGroupModal} closeModal={closeGroupModal}/>
          
          {loading ? <Button mode="contained" loading={loading}>Creating list</Button> :
          <Button mode="contained" onPress={()=>createList(selectedGroup,name,setLoading,createdGroup,setNameIsInvalid)}>Create</Button>}
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