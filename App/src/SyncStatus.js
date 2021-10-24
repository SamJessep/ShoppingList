import React from 'react'
import { View } from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import { Text } from 'react-native-paper';
const SyncStatus = ({status="offline"})=>{
  const icons = {
    offline:"sync-off",
    online:"check"
  }
  return(
    <View>
      <Text>{status}</Text>
      <Icon name={icons[status]}
      type="MaterialCommunityIcons"
      size={30}
      color="black"
      />
    </View>
  )
}

export default SyncStatus