import React from 'react'
import AddItem from './AddItem';
import Item from './Item.js'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import config from "react-native-config";
import HoldList from '../../components/HoldList/HoldList';
import { realmApp } from '../../RealmApp';
import {ItemSchema, ListSchema, MakeSafe} from "../../ObjectSchemas"
import {BSON} from 'realm';
import { ActivityIndicator, Button, Dialog, Paragraph, Portal } from 'react-native-paper';
import SyncStatus from '../../SyncStatus';
import {useNetInfo} from "@react-native-community/netinfo";
import ProgressCounter from '../../components/ProgressCounter';


const {REALM_API_KEY} = config
const List = ({route, navigation})=>{
  const list = route.params.list
  const [items, setItems] = React.useState([])
  const [loadingItems, setLoadingItems] = React.useState(true)
  const [deleteWaring, setDeleteWaring] = React.useState({showDialog:false})
  const [resetDrag, setResetDrag] = React.useState(false)
  const [addModalOpen, setAddModalOpen] = React.useState(false)
  const netInfo = useNetInfo()

  React.useLayoutEffect(()=>{
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => setAddModalOpen(true)}
        >Add Item</Button>
      )}
    )
  })
  
  const realmReference = React.useRef(null);
  React.useEffect(() => {
    const credentials = Realm.Credentials.serverApiKey(REALM_API_KEY)
    realmApp.logIn(credentials).then(()=>{
      const config = {
        schema: [ItemSchema],
        sync: {
          user: realmApp.currentUser,
          partitionValue: list.id,
          newRealmFileBehavior:{type: "openImmediately"},
          existingRealmFileBehavior:{type: "openImmediately"}
        },
      };
      
      Realm.open(config)
        .then(realmInstance => {
          realmReference.current = realmInstance;
          const realm = realmReference.current;
          if (realm) {
            const sortedItems = realmReference.current
              .objects('Item')
              .sorted("createdAt",true)
            setItems([...sortedItems]);

            sortedItems.addListener(() => {
              setItems([...sortedItems]);
            });
          }
        })
        .catch(err => {
          console.log(`an error occurred opening the realm ${err}`);
          console.error(err)
        }).finally(()=>setLoadingItems(false));
    })

    // cleanup function to close realm after component unmounts
    return () => {
      const realm = realmReference.current;
      // if the realm exists, close the realm
      if (realm) {
        realm.close();
        // set the reference to null so the realm can't be used after it is closed
        realmReference.current = null;
        setItems([]); // set the Items state to an empty array since the component is unmounting
      }
    };
  }, [realmReference, setItems]);
  
  const AddItemToItems = async (item,listid) =>{
    const realm = realmReference.current
    if(realm){
      realm.write(()=>{
        realm.create("Item", {
          _id: new BSON.ObjectID(),
          ...item
        })
      })
    }
  }
  

  const RemoveItem = async (item) =>{
    const realm = realmReference.current
    if(realm){
      realm.write(()=>{
        item = realm.objectForPrimaryKey('Item', item._id);
        realm.delete(item)
        item = null
      })
    }
  }

  const DeleteMany = indexes =>{
    setDeleteWaring({
      showDialog:true,
      target:indexes.length == 1 ? items[indexes[0]].name : indexes.length+" items",
      onConfirm:()=>{
        var itemsToDelete = items.filter((_,index)=>indexes.includes(index))
        itemsToDelete.forEach(item=>RemoveItem(item))
        setDeleteWaring({showDialog:false})
      },
      onCancel:()=>{
        setResetDrag(true)
        setDeleteWaring({showDialog:false})
        setTimeout(()=>setResetDrag(false),500)
      }
    })
  }

  const ListItemClicked = async (item)=>{
    const realm = realmReference.current
    if(realm){
      item = realm.objectForPrimaryKey('Item', item._id);
      realm.write(()=>{
        item.checked = !item.checked
      })
    }
  }

  const HandleRowSwipe = async ({direction, extra})=>{
    if(direction == "left"){
      DeleteMany([extra.index])
    }else if (direction == "right"){
      ListItemClicked(items[extra.index])
    }
  }

  const listItems = items.filter(i=>i.isValid()).map((listItem) =>{
    return {
      key:listItem.key,
      component:<Item data={listItem} key={listItem.key}/>,
      onClick:()=>ListItemClicked(listItem)
    }
  });

  const checkedCount = items.filter(i=>i.checked).length

  return(
  <View style={{flex:1}}>
    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:10, alignItems:"center"}}>
      <ProgressCounter total={items.length} completed={checkedCount} visible={!loadingItems && items.length>0}/>
      <SyncStatus status={netInfo.isConnected?"online":"offline"}/>
    </View>
    <AddItem onAddItem={AddItemToItems} list={list} open={addModalOpen} closeModal={()=>setAddModalOpen(false)} />
    {loadingItems? 
    <View>
      <Text style={styles.loadingText}>Fetching items</Text>
      <ActivityIndicator size="large"/>
    </View> :
    <HoldList 
      noItemsComponent={<Text>No Items</Text>} 
      onDeletePressed={DeleteMany}
      dragableOptions={{
          onSwipeProgress:()=>{},
          onSwipeRelease:HandleRowSwipe,
          swipeActions:{left:"SLIDE",right:"RESET"}
      }}
      resetDrag={resetDrag}
      >
      {listItems}
    </HoldList>
    }
    <Portal>
      <Dialog visible={deleteWaring.showDialog} onDismiss={()=>setDeleteWaring({showDialog:false})} onDismiss={deleteWaring.onCancel}>
        <Dialog.Title>Warning</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Are you sure you want to delete {deleteWaring.target}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={deleteWaring.onConfirm} mode="contained" color="red" style={{marginHorizontal:10, paddingHorizontal:10}}>Yes</Button>
          <Button onPress={deleteWaring.onCancel} mode="contained" color="green" style={{marginHorizontal:10, paddingHorizontal:10}}>No</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
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
  },
  title:{
    fontSize:20,
    textAlign:"center",
    padding:5
  },
  itemControls:{
    flexDirection:"row",
    width:"100%",
    justifyContent:"space-around"
  },
  loadingText:{
    alignSelf:"center",
    marginBottom:20
  }
});

export default List