import React, { useState, useEffect } from "react"
import { Provider } from "react-redux";
import { createStore } from "redux";
import ShoppingListApp from "./ShoppingListApp.js";

const initialState = {
  loggedIn:false,
  needsSetup:true
}
const reducer = (state=initialState, action)=>{
  switch(action.type){
    case "LOGGED_OUT":
      return {
        loggedIn:false,
        needsSetup:true
      }
    case "LOGGED_IN":
      return {
        loggedIn:true,
        needsSetup:true
      }
    case "SETUP_COMPLETE":
      return {
        loggedIn:true,
        needsSetup:false
      }
  }
  return state
}
const store = createStore(reducer)

const App = () => {
  
  return (
    <Provider store={store}>
      <ShoppingListApp/>
    </Provider>
  );
};



export default App;
