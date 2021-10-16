import React from "react"
import { View,Text, TextInput, Button, Switch, StyleSheet } from "react-native"
import globalStyles from "../styles/styles"

const Settings = ()=>{
  const [config, setConfig] = React.useState(APP_CONFIG)
  const [useProductionAPI, setUseProductionAPI] = React.useState(config.API_URL === APP_CONFIG.API_URL)

  if(useProductionAPI && config.API_URL != APP_CONFIG.API_URL_PROD){
    setConfig({...config, API_URL:APP_CONFIG.API_URL_PROD})
  }else if (!useProductionAPI && (config.API_URL != APP_CONFIG.API_URL_DEV)){
    setConfig({...config, API_URL:APP_CONFIG.API_URL_DEV})
  }

  const Save = ()=>{
    APP_CONFIG={
      ...APP_CONFIG,
      ...config
    }
  }

  const Cancel = ()=>{
    setConfig(APP_CONFIG)
  }

  return(
    <View style={{flex:1, margin:10}}>
      <View style={styles.control_row}>
        <Text>Server Address:</Text>
        <Text style={{fontWeight:"700"}}>{config.API_URL}</Text>
      </View>
      <View style={styles.control_row}>
        <Text>Use Production API</Text>
        <Switch value={useProductionAPI} onValueChange={setUseProductionAPI}/>
      </View>
      <Button title="Save" onPress={Save}/>
      <Button title="Discard Changes" onPress={Cancel}/>
    </View>
  )
}

const styles = StyleSheet.create({
  control_row:{flexDirection:"row", justifyContent:"space-between"}
})


export default Settings