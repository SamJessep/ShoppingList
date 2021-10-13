import React from "react"
import { FAB } from 'react-native-paper';
const ActionButton = ({actions})=>{
  const [state, setState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setState({ open });
  const {open} = state;
  return(
  <FAB.Group
    open={open}
    icon={open ? 'close' : 'plus'}
    actions={[
      {
        icon: 'playlist-plus',
        label: 'Create list',
        onPress: () => actions.createList(true),
      },
      {
        icon: 'account-multiple-plus',
        label: 'Create group',
        onPress: () => actions.createGroup(true),
      },
    ]}
    onStateChange={onStateChange}
    onPress={() => {
      if (open) {
        // do something if the speed dial is open
      }
    }}
  />
  )
}

export default ActionButton