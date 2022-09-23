import React from "react"
import "react-native-gesture-handler"
import { NativeBaseProvider} from "native-base"
import { StyleSheet, Text, View, LogBox, } from "react-native"

import {createStackNavigator} from "@react-navigation/stack"
import { createDrawerNavigator } from "@react-navigation/drawer"
import {NavigationContainer} from "@react-navigation/native"
import Login from "./src/app/public/login"
import DrawerContent from "./src/app/components/ui/drawerContent"
import Welcome from "./src/app/public/welcome"
import Maps from "./src/app/main/maps"
import Register from "./src/app/public/register"
import FormCoordinates from "./src/app/main/formCoordinates"
import Profile  from "./src/app/main/profile"
//import {encode,decode} from 'base-64'
LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs([
  "Failed prop type",
]);
//if (!global.btoa) { global.btoa = encode }if (!global.atob) { global.atob = decode }

const StackApp=createStackNavigator()
const Drawer=createDrawerNavigator()
const Stack=createStackNavigator()

const App=()=> {
  
  const navOptionHandler=()=>({
    headerShown: false
  })

  const StackMain=()=> {
    return(
      <Stack.Navigator initialRouteName="Welcome" 
        screenOptions={{
          headerTitleAlign:"center",
          headerStyle:{
            backgroundColor:'#8854d0'
          },
          headerTitleStyle:{
            fontWeight:'bold',
            color:'#fff'
          },
        }}>
        <Stack.Screen name="Welcome" component={Welcome} options={{ title: "Bienvenidos", headerTintColor:'#fff'}}></Stack.Screen>
        <Stack.Screen name="Maps" component={Maps} options={{ title: "Mapa", headerTintColor:'#fff'}}></Stack.Screen>
        <Stack.Screen name="FormCoordinates" component={FormCoordinates} options={{ title: "Dirección", headerTintColor:'#fff'}}></Stack.Screen>
        <Stack.Screen name="Profile" component={Profile} options={{ title: "Perfil", headerTintColor:'#fff'}}></Stack.Screen>
      </Stack.Navigator>
    )
  }
  
  const DrawerApp=()=>{
    return(
      <Drawer.Navigator drawerContent={(props)=><DrawerContent {...props}></DrawerContent>}
      screenOptions={{ 
        headerShown:false
      }} 
      > 
        <Drawer.Screen name="Inital" component={StackMain}></Drawer.Screen>
      </Drawer.Navigator>
    )
  }

  return(
    //<NativeBaseProvider>
      <NavigationContainer>
        <StackApp.Navigator initialRouteName="Login">
          <StackApp.Screen name="Login" component={Login} options={navOptionHandler}></StackApp.Screen>
          <StackApp.Screen name="Register" component={Register} options={navOptionHandler}></StackApp.Screen>
          <StackApp.Screen name="DrawerApp" component={DrawerApp} options={navOptionHandler}></StackApp.Screen>
        </StackApp.Navigator>
      </NavigationContainer>
    //</NativeBaseProvider>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
export default App