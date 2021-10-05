import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
} from 'react-native';
import * as React from 'react';

const AddItem = ({onAddItem:saveItem})=>{
  
  const [text, setText] = React.useState("")
  const sendItem = ()=>{
    const item = {
      name:text
    }
    saveItem(item)
    setText("")
  }
  return (
    <View>
      <Text style={styles.title}>Shopping List</Text>
      <TextInput 
        returnKeyType="send"
        onSubmitEditing={sendItem}
        style={styles.input} 
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
    borderWidth:1,
    margin:10
  },

  title:{
    fontSize:20,
    textAlign:"center",
    padding:5
  }
})

export default AddItem;