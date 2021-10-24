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
        <Text>Server Address</Text>
        <Text style={{fontWeight:"700"}}>{APP_CONFIG.API_URL}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  control_row:{}
})


export default Settings