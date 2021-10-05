import {View, Text, ScrollView, Button} from "react-native"
import React from "react"
import LISTS_DUMMY_DATA from "../dummyData.js"
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

const fetchUserLists = async ()=>{
  const uid = await AsyncStorage.getItem("uid")
  const profile = await AsyncStorage.getItem("profile").then(profileString=>JSON.parse(profileString))
  var user = await prisma.user.findFirst({where:{id:uid}})
  if(!user){
    user = await prisma.user.create({data:{
      id:uid,
      name:profile.name,
      email:profile.email
    }})
  }
  const groups = await prisma.group.findMany({where:{members:{has:{id:uid}}}})
  return groups
}

const Lists = ({navigation})=>{
  const [loading, setloading] = React.useState(true)
  // fetchUserLists.then(usersLists=>{
  //   lists = usersLists
  //   setloading(false)
  // })
    
  const lists = LISTS_DUMMY_DATA.lists 
  var listsElements
  if(!loading){
    listsElements = lists.map(list=>(
      <Button title={list.name} key={list.key} onPress={()=>navigation.navigate("List", {items:list.items})}/>
    ))
  }
  return (
    <View >
{loading?<Text>Loading...</Text>:
      <ScrollView>
        <Text>My Lists</Text>
        {listsElements}
      </ScrollView>}
    </View>
  )
}

export default Lists