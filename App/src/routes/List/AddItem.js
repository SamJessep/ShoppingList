import {
  StyleSheet,
  View,
  Pressable,
  Animated,
} from 'react-native';
import * as React from 'react';
import uuid from 'react-native-uuid';
import globalStyles from '../../styles/styles'
import { Dialog, HelperText, Portal, Text, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-dynamic-vector-icons';

const AddItem = ({onAddItem:saveItem, list, closeModal, open})=>{
  
  const [text, setText] = React.useState("")
  const [itemAdded, setItemAdded] = React.useState(false)
  const [itemError, setItemError] = React.useState({hasErrors:false,errorMessage:""})

  React.useEffect(() => {
    var timer
    if(itemAdded){
      timer = setTimeout(()=>setItemAdded(false), 2000)
    }
    return () => {
      if(timer) clearTimeout(timer)
    }
  }, [itemAdded])

  const checkItemInput = ()=>{
    const result ={
      hasErrors:false,
      errorMessage:""
    }
    if(text === ""){
      result.hasErrors=true
      result.errorMessage="Item name cannot be empty"
    }
    setItemError(result)
    return result
  }

  const sendItem = ()=>{
    if(!checkItemInput().hasErrors){
      const item = {
        partition:list.id,
        name:text,
        checked:false,
        key:uuid.v4(),
        createdAt:new Date(),
        listID: new Realm.BSON.ObjectID(list.id)
      }
      saveItem(item,list.id)
      setText("")
      setItemAdded(true)
    }
  }

  const TextChanged = t=>{
    if(itemAdded) setItemAdded(false)
    setItemError({hasErrors:false})
    setText(t)
  }

  return (
  <Portal>
    <Dialog visible={open} onDismiss={closeModal}>
      <Dialog.Title>Add an item</Dialog.Title>
        <Pressable style={styles.closeButton} onPress={closeModal}>
          <Icon type="MaterialCommunityIcons" name="window-close"/>
        </Pressable>
        <Dialog.Content>
          <TextInput
          style={styles.input}
          returnKeyType="send"
          onSubmitEditing={sendItem}
          blurOnSubmit={false}
          value={text}
          onChangeText={TextChanged}
          placeholder="Item Name"  
          />
          <HelperText type="error" visible={itemError.hasErrors} style={{marginBottom:10}}>
            {itemError.errorMessage}
          </HelperText>
        <Button onPress={sendItem} mode="contained">Add</Button>

        {itemAdded && 
        <Animated.View style={{padding:20, marginTop:10, backgroundColor:"#a5f9a5", flexDirection:"row", alignItems:"center"}}>
          <Icon 
            name="check"
            type="MaterialCommunityIcons"
            size={30}
            color="green"
            style={{marginRight:10}}
          />
          <Text style={{color:"green"}}>Item added</Text>
        </Animated.View>}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  input:{
    margin:10
  },
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

export default AddItem;