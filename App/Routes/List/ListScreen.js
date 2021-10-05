import uuid from 'react-native-uuid';
import React from 'react'
import AddItem from './AddItem';
import Confirm from '../../Components/Confirm';
import Item from './Item.js'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Modal,
  Button
} from 'react-native';

import {CHECK_MODE, EDIT_MODE} from "./Modes"


const List = ({route})=>{
  const [items, setitems] = React.useState(route.params.items)
  const [mode, setMode] = React.useState(CHECK_MODE)

  
  const AddItemToItems = item =>{
    const keyedItem = {
      ...item,
      key:uuid.v4()
    }
    setitems([...items,keyedItem])
  }
  
  const RemoveItem = item =>{
      const newItems = items.filter(i=>i.key!=item.key)
      setitems(newItems)
      setConfirmShown(false)
  }

  const TryRemoveItem = item =>{
    setSelectedItem(item)
    setConfirmShown(true)
  }

  const listItems = items.map((item) =>
    <Item data={item} key={item.key} RemoveItem={TryRemoveItem} mode={mode}></Item>
  );
  const [ConfirmShown, setConfirmShown] = React.useState(false)
  const [SelectedItem, setSelectedItem] = React.useState(null)
  return(
  <View>
      <AddItem onAddItem={AddItemToItems}></AddItem>
      <Button title={mode == EDIT_MODE ? "Done" : "Edit"} onPress={()=>setMode(mode==EDIT_MODE?CHECK_MODE:EDIT_MODE)}/>
      <View style={styles.divider}></View>
      <Text>Items</Text>
      <ScrollView>
      {listItems}
      </ScrollView>
      {ConfirmShown && <Confirm message={"are you sure you want to delete this item?"} onNo={()=>setConfirmShown(false)} onYes={()=>RemoveItem(SelectedItem)}/>}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  divider:{
    marginBottom:20
  }
});

export default List