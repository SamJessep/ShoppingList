import Realm from 'realm';
import {appId, baseUrl} from '../realm';
import config from "react-native-config";
const {REALM_API_KEY} = config

if (!appId) {
  throw 'Missing Realm App ID. Set appId in realm.json';
}
if (!baseUrl) {
  throw 'Missing Realm base URL. Set baseUrl in realm.json';
}

const appConfiguration = {
  id: appId,
  baseUrl,
};

export const realmApp = new Realm.App(appConfiguration);

export const partitionKeys={
  PUBLIC:"PUBLIC"
}


export const mongoAtlas = {
  connect:async ()=>{
    var user = realmApp.currentUser
    if(!user){
      const credentials = Realm.Credentials.serverApiKey(REALM_API_KEY)
      await realmApp.logIn(credentials)
      user = realmApp.currentUser
    }
    const mongodb = user.mongoClient("mongodb-atlas");
    return mongodb
  }
}