import {
  StyleSheet,
  Button,
  View,
} from 'react-native';
import * as React from 'react';
import uuid from 'react-native-uuid';
import globalStyles from '../../styles/styles'
import { TextInput } from 'react-native-paper';

const AddItem = ({onAddItem:saveItem, list})=>{
  
  const [text, setText] = React.useState("")
  const sendItem = ()=>{
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
  }
  return (
    <View>
      <TextInput
        style={styles.input}
        returnKeyType="send"
        onSubmitEditing={sendItem}
        value={text} 
        onChangeText={setText}
        placeholder="Item Name"  
        />
      <Button title="Add Item" onPress={sendItem}/>
    </View>
  );
}

const styles = StyleSheet.create({
  input:{
    margin:10
  }
})

export default AddItem;