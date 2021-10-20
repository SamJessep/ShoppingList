import React from 'react'
import Icon from 'react-native-dynamic-vector-icons';
import { Text } from 'react-native-paper';
const SyncStatus = ({status="offline"})=>{
  const icons = {
    offline:"sync-off",
    online:"check"
  }
  return(
    <>
    <Text>{status}</Text>
    <Icon name={icons[status]}
    type="MaterialCommunityIcons"
    size={30}
    color="black"
    />

    </>
  )
}

export default SyncStatus