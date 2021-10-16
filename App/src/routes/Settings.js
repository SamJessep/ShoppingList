import React from "react"
import { View,Text, TextInput, Button, Switch } from "react-native"
import globalStyles from "../styles/styles"

const Settings = ()=>{
  const [config, setConfig] = React.useState(APP_CONFIG)
  const [useProductionAPI, setUseProductionAPI] = React.useState(false)

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
      <Text>Server Address</Text>
      <TextInput value={config.API_URL} style={globalStyles.textField} onChangeText={(t)=>setConfig({...config, API_URL:t})}></TextInput>
      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text>Use Production API</Text>
        <Switch value={useProductionAPI} onValueChange={setUseProductionAPI}/>
      </View>
      <Button title="Save" onPress={Save}/>
      <Button title="Discard Changes" onPress={Cancel}/>
    </View>
  )
}


export default Settings