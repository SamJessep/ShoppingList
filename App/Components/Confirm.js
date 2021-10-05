import React from "react"
import { Button, Modal, Pressable,StyleSheet,Text, View } from "react-native"

const Confirm = ({message, onYes, onNo})=>{
  return (
    <Modal animationType="fade" onRequestClose={onNo} transparent={true} style={{backgroundColor:"red"}}>
    <View style={{backgroundColor:"rgba(0,0,0,0.5)", height:"100%", justifyContent:"center"}}>
      <View style={{backgroundColor:"white", padding:20, borderRadius:10, marginHorizontal:10}}>
        <Text style={styles.title}>Confirm</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          <Pressable style={[styles.button,styles.good]} onPress={onYes}>
            <Text style={styles.buttonText}>Yes</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.bad]} onPress={onNo}>
            <Text style={styles.buttonText}>No</Text>
          </Pressable>
        </View>
      </View>
    </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  title:{
    fontSize:20,
    color:"#2e2e2e",
    alignSelf:"center"
  },
  message:{
    textAlign:"center",
    marginTop:10,
    marginBottom:20,
  },
  button:{
    fontSize:20,
    flex:1,
    padding:10,
    borderRadius:5,
    marginHorizontal:10,
  },
  buttonContainer:{
    flexDirection:"row",
    justifyContent:"space-around"
  },
  buttonText:{
    textAlign:"center",
    color:"white"
  },
  good:{
    backgroundColor:"#43A047"
  },
  bad:{
    backgroundColor:"#E53935"
  }
})

export default Confirm

