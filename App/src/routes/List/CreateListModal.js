import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import {Picker} from '@react-native-picker/picker';
import Icon from "react-native-dynamic-vector-icons";
import { Button, Dialog, HelperText, Portal, TextInput } from "react-native-paper";


const CreateListModal = ({open,openList,closeModal, groups, createList, openGroupModal})=>{
  const [name, setName] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [selectedGroup, setSelectedGroup] = React.useState(null)
  const [nameIsInvalid, setNameIsInvalid] = React.useState(false)
  const [newList, setNewList] = React.useState(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)


React.useEffect(() => {
  if(groups.length>0){
    setSelectedGroup(groups[0]._id)
  }
}, [groups])

  const tryCreateList = async ()=>{
    if(name == "")
    return setNameIsInvalid(true)
    setLoading(true)
    const listID = new Realm.BSON.ObjectId()
    const list = {
      _id: listID,
      name:name,
      groupID: new Realm.BSON.ObjectId(selectedGroup),
      partition:String(selectedGroup),
      key:listID.toHexString()
    }
    setNewList(list)
    createList(list)
    setLoading(false)
    setDialogOpen(true)
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
          <TextInput error={nameIsInvalid} onChangeText={name=>{setNameIsInvalid(false); setName(name)}} mode="outlined" label="List name"/>
          <HelperText type="error" visible={nameIsInvalid}>
            List name is required
          </HelperText>
          <Text>Group</Text>
          {groups.length == 0 ? <Text>You have no groups</Text> :
          <Picker style={styles.textField}
            mode="dropdown"
            selectedValue={selectedGroup}
            onValueChange={setSelectedGroup}
          >
          {groups.map(group=>(
            <Picker.Item label={group.name} value={String(group._id)} key={String(group._id)}/>
          ))}
          </Picker>}
          <Button style={{marginBottom:20}} onPress={openGroupModal}>
            Create new group
          </Button>
          
          {loading ? <Button mode="contained" loading={loading}>Creating list</Button> :
          <Button mode="contained" onPress={tryCreateList}>Create</Button>}
        </View>
        </Dialog.Content>
        
        {newList&&
        <Dialog visible={open && dialogOpen} onDismiss={()=>setDialogOpen(false)}>
          <Dialog.Content><Text>Do you want to open "{newList.name}"</Text></Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>{openList(newList); setDialogOpen(false); closeModal()}}>Yes</Button>
            <Button onPress={()=>setDialogOpen(false)}>No</Button>
          </Dialog.Actions>
        </Dialog>}
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