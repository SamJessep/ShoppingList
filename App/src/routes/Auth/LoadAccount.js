import React from "react"
import { Text, View, ActivityIndicator } from "react-native";
import Auth0 from "react-native-auth0";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";
const auth0 = new Auth0({ domain: 'dev-j0o6-3-s.au.auth0.com', clientId: 'lugVzLb7SC3bmiD45z0tHc9PLE23ELeQ' });
import { connect } from "react-redux";
import { Button } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import { mongoAtlas } from "../../RealmApp";
import { BSON } from "realm";


const CreateProfile = async(profile) =>{
  profile = {
    _id:BSON.ObjectID.generate(),
    ...profile
  }
  await db("ShoppingList").collection("User").insertOne(profile)
  await db("ShoppingList").collection("Group").insertOne({
    name:profile.name+"'s group",
    members:[profile._id]
  })
}

const MigrateProfile = async ({sub:authid},userid) =>{
  await db("ShoppingList").collection("User").updateOne(
    {_id:userid},
    { $set: { authId: authid } }
  )
}




const LoadAccount = ({navigation,setSetupComplete,setLoggedOut})=>{
  const [stateText, setStateText] = React.useState("loading")
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  var db
  
  const ResetLogin = ()=>{
    RNSecureKeyStore.remove("accessToken"),       
    RNSecureKeyStore.remove("refreshToken"),
    AsyncStorage.removeItem("authid")
    setLoggedOut()
  }

  const SaveAccountID  = async (authid)=>{
    const {_id} = await db("ShoppingList").collection("User").findOne({authId:authid})
    await AsyncStorage.setItem("userid", String(_id))
  }
  
  const SaveAccount = async (profile,userid)=>{
    await AsyncStorage.setItem("profile",JSON.stringify(profile))
    const ok = await CheckAccount(profile,userid).catch(e=>{throw new Error(e)})
    if(ok){
      await SaveAccountID(userid)
      setSetupComplete()
      navigation.navigate("Landing")
    }
  }
  const CheckAccount = async (profile,userid)=>{
    const users = await db("ShoppingList").collection("User").find({authId:userid})
    try{
      if(users.length == 0){
        setStateText("creating profile...")
        await CreateProfile(profile,userid)
      }else{
        if(users[0].authId != userid){
          setStateText("migrating profile...")
          await MigrateProfile(profile, userid)
        }else return true
      }
      return true
    }
    catch{
      return false
    }
  }
    

  const FailedLoad = e =>{
    console.error(e)
    setError(true)
    setLoading(false)
    setStateText(e.toString())
  }

  const offlineLoad = async()=>{
    try{
      const profile = await AsyncStorage.getItem("profile").then(profileString=>JSON.parse(profileString))
      const userID = await AsyncStorage.getItem("authid")
      if(profile && userID){
        setSetupComplete()
        navigation.navigate("Landing",{userid:userID})
      }
    }catch(e){
      setError(e)
    }
  }

  const onlineLoad = async () =>{
    try{
      //connect to mongodb
      const atlas = await mongoAtlas.connect()
      db = atlas.db
      const accessToken = await RNSecureKeyStore.get("accessToken")
      setStateText("Validating login...")
      const userid = await AsyncStorage.getItem("authid")
      setStateText("checking profile...")

      await auth0.auth.userInfo({token:accessToken})
      .then(async profile=>await SaveAccount(profile,userid))
      .catch(async e=>{
        try{
          const refreshToken = await RNSecureKeyStore.get("refreshToken")
          const {accessToken:newAccessToken, refreshToken:newRefreshToken} = await auth0.auth.refreshToken({refresh_token:refreshToken})
          await RNSecureKeyStore.set("accessToken", newAccessToken, {accessible:ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})         
          await RNSecureKeyStore.set("refreshToken", newRefreshToken, {accessible:ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY})
          const profile = await auth0.auth.userInfo({token:newAccessToken})
          await SaveAccount(profile,userid)
        }catch(e){
          FailedLoad(e)
        }
      })
    }
    catch(e){
      FailedLoad(e)
    }
  }

  const TryLoad = ()=>{
    setLoading(true)
    setStateText("Loading")
    NetInfo.fetch().then(state => {
      if(state.isConnected){
        onlineLoad()
      }else{
        offlineLoad()
      }
    })
  }

  const Retry = ()=>{
    setError(false)
    TryLoad()
  }

React.useEffect(() => TryLoad(), [])
return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={[{marginBottom:20, fontSize:20}, error&&{color:"red"}]}>
        {stateText}
      </Text>
      {loading && <ActivityIndicator size="large"/>}
      {error ? 
      <>
        <Button mode="outline" onPress={Retry} style={{marginBottom:15}}>Retry</Button>
        <Button mode="outline" onPress={offlineLoad} style={{marginBottom:15}}>Continue offline</Button>
        <Button mode="contained" onPress={ResetLogin} color="red">Log out</Button>
      </> : 
      <Button mode="outline" onPress={ResetLogin}>Cancel</Button>}
    </View>
  )
}

function mapStateToProps(state){
  return {
    loggedIn:state.loggedIn,
    needsSetup:state.needsSetup
  }
}

function mapDispatchToProps(dispatch){
  return{
    setSetupComplete: ()=>dispatch({type:"SETUP_COMPLETE"}),
    setLoggedOut: ()=>dispatch({type:"LOGGED_OUT"})
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(LoadAccount)