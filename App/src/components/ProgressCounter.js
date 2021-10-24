import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

const ProgressCounter = ({completed,total, visible})=>{
  return (
    <View>
    <View style={{opacity:visible?1:0}}>
      <Text>{completed}/{total}</Text>
    </View>
    </View>
  )
}

export default ProgressCounter