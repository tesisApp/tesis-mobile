import React, { useState,useContext,useEffect } from "react"
import {View,StyleSheet,Text,Image} from "react-native"
import {DrawerContentScrollView} from "@react-navigation/drawer"
import {Icon,Button,Container} from "native-base"
import { Ionicons,FontAwesome5 } from "@expo/vector-icons"
import *as firebase from "firebase"
import { useIsFocused, useNavigation } from "@react-navigation/native"
//import PedidoContext from "../../context/pedido/pedidoContext"

    
const DrawerContent=(props)=>{
 
  //console.log(props)
    const {navigation}=props
    const [user, setUser] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const isFocused = useIsFocused()

    //const navigation=useNavigation()
  //context
  //const {usuario,guardarUsuario}=useContext(PedidoContext)
  //const {email}=usuario.email
  //STATE USER
  //const [user,guardarUser]=useState(null)
  //autenticacion
  // useEffect(()=>{
  //     guardarUser(usuario)
  // //     // firebase.auth().onAuthStateChanged((response)=>{
  // //     // //guardarUser(response)
  // //     // //guardarUser(response)
  // //     // //console.log(user.email)
  // //     // })
      
  // },[usuario])
  //if (user ===  undefined) return null
  //console.log(user.email)


  //cerrar sesion del usuario y volver a screen de login

    useEffect(async() => {
        const userCurrent = firebase.default.auth().currentUser
        
        setUser(userCurrent)
        console.log(user)
        await firebase.default.firestore().collection('usuario').where('uid','==', userCurrent.uid).get().then((user) => {
            user.forEach((doc) => {
                setLatitude(doc.data().latitude)
                setLongitude(doc.data().longitude)
            })
        }).catch((err)=>{
            console.log("error", err)
        })
    },[])

    const salirApp=()=>{
        console.log("logout")
            firebase.default.auth().signOut().then(function(){
                navigation.navigate("Login")
                
            })
            .catch(function(error){
                console.log("error")
            })
    }

    
    return(
        <Container style={{flex:1}}>
            <View style={styles.contenedorImage}>
                <Text style={styles.textImage}>ALZHEIMER APP</Text>
                <Image resizeMode="contain" source={require("../../../utils/images/logo2.png")} style={{width:200,height:100}}/>
                <Text style={styles.textEmail}>{user.email}</Text>
            </View>
            <View style={styles.contenedorDrawer}>
                <DrawerContentScrollView style={{marginHorizontal:"5%",marginTop:7}}>
                <View style={styles.opcionDrawer}>
                    <Icon name="person" style={styles.icon} />
                    <Text style={styles.textDrawer} onPress={()=> navigation.navigate("Profile")}>Perfil</Text>
                </View>
                <View style={styles.opcionDrawer}>
                    <Icon name="location" style={styles.icon} />
                    <Text style={styles.textDrawer} onPress={()=> navigation.navigate("Maps", { lat: latitude, lng: longitude})}>
                        Mapa
                    </Text>
                </View>
                </DrawerContentScrollView>
                <View style={{marginLeft:200}}>
                    <Button
                        onPress={()=>salirApp()}
                        transparent
                    >
                        <Text style={{color:"#000",fontSize:15,fontWeight:"bold"}}>Salir</Text>
                        <Icon name="exit" style={{color:'#000'}}></Icon>
                    </Button>  
                </View>
            </View>
        </Container>
    )
}
const styles=StyleSheet.create({
    contenedorDrawer:{
        width: "100%",
        flex:1,
        justifyContent:"space-between",
        backgroundColor:"#fff",
        borderBottomColor:"#000",
        borderBottomWidth:4   
    },
    contenedorImage:{
        //justifyContent:"center",
        paddingTop:20,
        alignItems:"center",
        width:"100%",
        height:"35%",
        backgroundColor:"#8854d0",
        borderBottomColor:"black",
        borderBottomWidth:4.,
        marginTop: 15
    },
    textImage:{
        color:"#fff",
        fontWeight:"bold",
        //marginTop:10,
        fontSize:18,
        marginBottom:10
    },
    textEmail:{
        color:"#fff",
        fontSize:15,
        marginTop:5,
        fontWeight:"bold"
    },
    textDrawer:{
        color:"#000",
        //fontWeight:"bold",
        marginLeft:10,
        fontSize:16
    },
    opcionDrawer:{
        flexDirection:"row",
        alignItems:"center",
        marginVertical:5
    },
    icon:{
        color:"#000",
        fontSize:22
    }

})
export default DrawerContent