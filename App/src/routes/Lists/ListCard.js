import React from 'react'
import { Pressable,Text,StyleSheet, View } from 'react-native'
import { humanFriendlyTime } from '../../util'


const ListCard = ({data:list, loadList})=>{
  const secondsSinceCreation = (Date.now() - new Date(list.createdAt).getTime())/1000
  return (
    <View style={styles.card}>
      <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
        <Text style={styles.name}>{list.name}</Text>
        <Text>{list.items.length} items</Text>
      </View>
      <Text>Created {humanFriendlyTime(secondsSinceCreation)} ago</Text>
      {/* <Text style={styles.groupName}>Group: {list.group.name}</Text> */}
    </View>
  )
}

const styles = StyleSheet.create({
  card:{
    padding:10,
    backgroundColor:"#cccccc",
    margin:10,
    borderRadius:10
  },
  name:{
    fontSize:20
  }
})

export default ListCard