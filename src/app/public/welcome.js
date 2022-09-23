import React, { useEffect, useState } from "react"
import {View, Text,StyleSheet} from "react-native"
import * as firebase from "firebase"
import { Button } from "native-base"
import { useIsFocused, useNavigation } from "@react-navigation/native"

const Welcome=()=>{
    const navigation = useNavigation()
    const [isCoordinate, setIsCoordinate]= useState(false)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const isFocused = useIsFocused()

    useEffect(async() => {
        const userCurrent = firebase.default.auth().currentUser
        //console.log(userCurrent)
        await firebase.default.firestore().collection('usuario').where('uid','==', userCurrent.uid).get().then((user) => {
            user.forEach((doc) => {
            //console.log(doc.id)
                //console.log("data",doc.data())
                setLatitude(doc.data().latitude)
                setLongitude(doc.data().longitude)
                setIsCoordinate( doc.data().latitude != "" && doc.data().longitude != "" ? true : false)
                console.log("is coordinate", isCoordinate)
            })
        }).catch((err)=>{
            console.log("error", err)
        })
    },[isFocused])

    const goMaps = () => {
        navigation.navigate('Maps', {
            lat: latitude,
            lng: longitude
        })
    }

    const goAddress = () => {
        navigation.navigate('FormCoordinates')
    }
    return(
        <View style={{flex:1, justifyContent:"center", alignItems: "center"}}>
            <View style={{width:'70%'}}>
                <Button 
                    rounded
                    block
                    style={styles.boton}
                    onPress={() => goMaps()}
                    disabled={!isCoordinate}
                >
                    <Text style={styles.botonTexto}>Ver Mapa</Text>
                </Button>
            </View>
            <View style={{marginTop: 10, width: '70%'}}>
                <Button 
                    rounded
                    block
                    style={styles.boton}
                    onPress={() => goAddress()}
                >
                    <Text style={styles.botonTexto}>Establecer dirección</Text>
                </Button>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    contenedor: {
        //flex: 1,
        backgroundColor: "#9b59b6",
    },
  
    contenedorLogin: {
      flex: 1,
      height: "70%",
      marginHorizontal: "5%",
      backgroundColor: "white",
      borderRadius: 15,
      marginTop: 40,
      paddingBottom: 40,
    },
    boton: {
      marginTop: 15,
      alignItems: "center",
      backgroundColor: "black",
    },
    botonTexto: {
      //textTransform: "uppercase",
      fontWeight: "bold",
      color: "#fff",
      fontSize: 15,
    },
    login: {
      marginTop: 20,
    },
    titulo: {
      textAlign: "center",
      marginBottom: 5,
      marginTop: 30,
      fontSize: 30,
      fontWeight: "bold",
    },
    register: {
      textAlign: "center",
      color: "#fff",
      marginTop: 10,
  
      fontSize: 18,
    },
  })
export default Welcome