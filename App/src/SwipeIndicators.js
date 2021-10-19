import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import Icon from 'react-native-dynamic-vector-icons';

const SwipeIndicators = ({children})=>{
  const { width } = useWindowDimensions();
  return(
    <>   
      <View style={[{left:-width, backgroundColor:"green", width:width, alignItems:"flex-end"}, styles.indicator]}>
        <Icon name="plus"
              type="MaterialCommunityIcons"
              size={30}
              color="white"
              style={styles.icon}
              />
      </View>
      {children}
      <View style={[{right:-width, backgroundColor:"red", width:width, alignItems:"flex-start"},styles.indicator]} >
        <Icon name="delete"
              type="MaterialCommunityIcons"
              size={30}
              color="white"
              style={styles.icon}  
              />
      </View>
    </>
  ) 
}

const styles = StyleSheet.create({
  icon:{
    marginHorizontal:20
  },
  indicator:{
    top:0,
    bottom:0,
    justifyContent:"center",
    position:"absolute"
  }
})

export default SwipeIndicators