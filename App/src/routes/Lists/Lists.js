import {View, ScrollView, StyleSheet} from "react-native"
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateListModal from "../List/CreateListModal.js";
import ListCard from "./ListCard.js";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateGroupModal from "../List/CreateGroupModal.js";
import HoldList from "../../components/HoldList/HoldList";
import ActionButton from "./ActionButton.js";
import Dragable from "../../Dragable.js";
import { Dialog, Paragraph, Portal, Snackbar, Button, Text, ActivityIndicator } from "react-native-paper";
import { useHistory } from "../../customHooks.js";
import { Picker } from "@react-native-picker/picker";
import { realmApp, partitionKeys, mongoAtlas } from '../../RealmApp';
import {Schema} from "../../ObjectSchemas"
import {BSON} from 'realm';
import config from "react-native-config";
const {REALM_API_KEY} = config



const fetchGroups = async (uid)=>{
  try{
    const {db} = await mongoAtlas.connect()
    const dbUID = "616e76ad009dcba30005f811"
    const groups = await db("ShoppingList").collection("Group").find({members:{$in:[dbUID]}})
    return groups
  }catch(e){
    console.error(e)
    console.warn("user may be offline")
    return []
  }
}


const Lists = ({navigation})=>{
  const [loading, setloading] = React.useState(true)
  const [updating, setUpdating] = React.useState(false)
  const { state:lists, set:setLists, undo:undoListChange, canUndo, canRedo } = useHistory([]);
  const [createListModalOpen, setCreateListModalOpen] = React.useState(false)
  const [createGroupModalOpen, setCreateGroupModalOpen] = React.useState(false)
  const [groups, setGroups] = React.useState([])
  const [deleteWaring, setDeleteWaring] = React.useState({showDialog:false})
  const [undoDeleteVisable, setUndoDeleteVisable] = React.useState(false)
  const [resetDrag, setResetDrag] = React.useState(false)

  const [selectedGroupID, setselectedGroupID] = React.useState()
  
  const loadList = async list =>{
    const safeList = JSON.stringify(list)
    navigation.navigate("List", {list:JSON.parse(safeList)})
  }


  const realmReference = React.useRef(null);


  const openListRealm = async (groupID)=>{
    groupID=String(groupID)
    Realm.App.Sync.setLogger(realmApp, (level, message) => console.log(`[${level}] ${message}`));
    if(realmApp.currentUser === null){
      const credentials = Realm.Credentials.serverApiKey(REALM_API_KEY)
      await realmApp.logIn(credentials)
    }
    const configGroupID = {
      schema: [Schema.Item, Schema.List, Schema.Group],
      sync: {
        user: realmApp.currentUser,
        partitionValue: groupID,
        newRealmFileBehavior:{type: "openImmediately"},
        existingRealmFileBehavior:{type: "openImmediately"}
      },
    };
    Realm.open(configGroupID)
    .then(realmInstance => {
      realmReference.current = realmInstance;
      const realm = realmReference.current;
      if (realm) {
        const sortedLists = realmReference.current
          .objects('List')
          .sorted("createdAt",true)
        setLists([...sortedLists]);
        sortedLists.addListener(() => {
          setLists([...sortedLists]);
        });
      }
    })
    .catch(err => {
      console.log(`an error occurred opening the realm ${err}`);
      console.error(err)
    }).finally(()=>setloading(false));

  }
  
  const closeListRealm = async()=>{
    const realm = realmReference.current;
    if (realm) {
      realm.deleteAll()
      realm.close();
      // set the reference to null so the realm can't be used after it is closed
      realmReference.current = null;
      setLists([]); // set the Items state to an empty array since the component is unmounting
    }
  }

  React.useEffect(async() => {

    setloading(true)
    const uid = await AsyncStorage.getItem("userId")
    const dbGroups = await fetchGroups(uid)
    setGroups(dbGroups);
    const credentials = Realm.Credentials.serverApiKey(REALM_API_KEY)
    await realmApp.logIn(credentials).then(()=>openListRealm(selectedGroupID?selectedGroupID: dbGroups[0]._id))
    setloading(false)
    return closeListRealm;
  }, [realmReference, setLists, selectedGroupID]);

  const RemoveList = async (list)=>{
    const realm = realmReference.current
    if(realm){
      realm.write(()=>{
        list = realm.objectForPrimaryKey('List', list._id);
        realm.delete(list)
        list = null
      })
    }
  }

  const DeleteLists = async (indexes)=>{
    setDeleteWaring({
      showDialog:true,
      target:indexes.length == 1 ? lists[indexes[0]].name : indexes.length+" lists",
      onConfirm:async ()=>{
        var listsToDelete = lists.filter((_,index)=>indexes.includes(index))
        listsToDelete.forEach(list=>RemoveList(list))
        setDeleteWaring({showDialog:false})
      },
      onCancel:()=>{
        setResetDrag(true)
        setDeleteWaring({showDialog:false})
        setTimeout(()=>setResetDrag(false),500)
      }
    })
  }

  const AddList = list=>{
    const realm = realmReference.current
    if(realm){
      realm.write(()=>{
        realm.create("List", {
          _id: new BSON.ObjectID(),
          ...list
        })
      })
    }
  }
  const AddGroup = async group=>{
    const {db} = await mongoAtlas.connect()
    await db("ShoppingList").collection("Group").insertOne(group)
    const groups = await db("ShoppingList").collection("Group").find()
    setGroups(groups)
  }

  const HandleRowSwipe = async ({direction, extra})=>{
    if(direction == "left"){
      await DeleteLists([extra.index])
    }else if (direction == "right"){

    }
  }
  var listsElements
  if(!loading){
    if(lists.length > 0){
      listsElements = lists.map(list=>{
        return{
          key:list._id,
          component:(<ListCard key={list._id} data={list} loadList={loadList}/>),
          onClick:()=>loadList(list)
        }
      })
    }
  }
  return (
    <View style={{flex:1}}>
      <Picker mode="dropdown" onValueChange={setselectedGroupID} selectedValue={selectedGroupID} >
        {groups.map(g=>(
          <Picker.Item key={g._id} value={String(g._id)} label={g.name+"'s lists"}/>
        ))}
      </Picker>
      {loading? 
      <View style={{flexDirection:"row",alignItems:"center", justifyContent:"center"}}>
        <Text>Loading lists</Text>
         <ActivityIndicator style={{marginLeft:10}}/>
      </View> : 
      <HoldList 
        noItemsComponent={<Text style={{alignSelf:"center"}}>No Lists</Text>} 
        onDeletePressed={DeleteLists} 
        resetDrag={resetDrag}
        dragableOptions={{
          onSwipeProgress:()=>{},
          onSwipeRelease:HandleRowSwipe,
          swipeActions:{left:"SLIDE",right:"RESET"}
        }}
      >
        {listsElements}
      </HoldList>}
      <ActionButton actions={{
        createList:setCreateListModalOpen,
        createGroup:setCreateGroupModalOpen
      }}/>
      <Snackbar
        duration={4000}
        visible={undoDeleteVisable}
        onDismiss={setUndoDeleteVisable}
        action={{
          label: 'Undo',
          onPress: undoListChange
        }}
      >List Deleted
      </Snackbar>
    
      
      <CreateListModal 
        open={createListModalOpen}
        openList={loadList} 
        closeModal={()=>setCreateListModalOpen(false)} 
        groups={groups} 
        createList={AddList}
        openGroupModal={()=>setCreateGroupModalOpen(true)}
      />
      <CreateGroupModal 
        open={createGroupModalOpen} 
        closeModal={()=>setCreateGroupModalOpen(false)} 
        createGroup={AddGroup}
      />
      <Portal>

      <Dialog visible={deleteWaring.showDialog} onDismiss={deleteWaring.onCancel}>
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})
export default Lists