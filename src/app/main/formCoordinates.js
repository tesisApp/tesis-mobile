import React,{useEffect,useState} from 'react'
import {View,StyleSheet,TextInput,Alert, Dimensions} from 'react-native'
import {Container,Text,H1,H3,Button, Content,Form,Item,Label,Input,Icon,Footer,FooterTab} from 'native-base'
import {useNavigation} from '@react-navigation/native'
import MapView, { Circle } from "react-native-maps"
import { Marker } from "react-native-maps"
import * as firebase from "firebase"
import * as Location from 'expo-location'

const FormCoordinates=()=>{
    
    const [latitude, setLatitude]=useState(0)
    const [longitude, setLongitude]=useState(0)
    const [address, setAddress]=useState('')
    const [docId, setDocId]=useState('')
    const [coords, setCoords]=useState({
        latitude: 0,
        longitude: 0
    })

    const [isCoordinate, setIsCoordinate]= useState(false)
    const navigation=useNavigation()
    //let isCoordinate = false

    useEffect(async() => {
        const userCurrent = firebase.default.auth().currentUser
        
        await firebase.default.firestore().collection('usuario').where('uid','==', userCurrent.uid).get().then((user) => {
            user.forEach(async (doc) => {
                console.log("FORM DATA",doc.data())
                setDocId(doc.id)
                setLatitude(doc.data().latitude)
                setLongitude(doc.data().longitude)
                
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied')
                    return
                }
            
                if ( doc.data().latitude != "" && doc.data().longitude != "" ) {
                    setIsCoordinate(true)
                    const position = {
                        latitude: doc.data().latitude,
                        longitude: doc.data().longitude
                    }

                    const address = await Location.reverseGeocodeAsync(position)
                    
                    setCoords({
                        latitude: doc.data().latitude,
                        longitude: doc.data().longitude
                    })
                    setAddress(`${address[0].street} ${address[0].streetNumber}`)
                } else {
                    setIsCoordinate(false)
                    setAddress("")
                }
                
                console.log("FORM COORDINATE", isCoordinate)
            })
        }).catch((err)=>{
          console.log("error", err)
        })
      },[address])

    const saveCoordinates=async (e) => {
        console.log("coordinate",isCoordinate)
        setIsCoordinate(true)
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
        const latitude = e.latitude
        const longitude = e.longitude
       // await Geocoder.fallbackToGoogle('AIzaSyBh2Dr2Xa8GTer63zisBBs1k0rxjExhiDI')
 
        const position = {
            latitude: latitude,
            longitude: longitude
        }

        setCoords(position)
        const address = await Location.reverseGeocodeAsync(position)

        setAddress(`${address[0].street} ${address[0].streetNumber}`)
        await firebase.default.firestore().collection('usuario').doc(docId).update({
            latitude: latitude,
            longitude: longitude
        })
    }
    return(
        <Container style={styles.contenedor}>
            <Content style={{marginVertical:15}}>
                <H1 style={styles.title}>*Establecer dirección del domicilio del paciente</H1>
                <Form style={{marginRight:13}}>
                    <Item floatingLabel>
                        <Label style={{color:'#9b59b6'}}>Direccion</Label>
                        <Input value={address} disabled/>
                    </Item>
                    
                </Form>
                <View>
                <MapView 
                    onPress={(e) => saveCoordinates(e.nativeEvent.coordinate)}
                    style={styles.map}>
                    {
                        isCoordinate === true ? <Marker  coordinate={coords}></Marker> : <></>
                    }
                    {/* <Marker coordinate={coords}></Marker> */}
                </MapView>
            </View>
            </Content>
        </Container>
    )
}
const styles=StyleSheet.create({

    contenedor:{
        flex:1
    },
    titulo:{
        marginTop:10,
        fontSize:10,
        fontWeight:'bold',
        color:'#fff'
    },
    texto:{
        fontSize:24,
        //fontWeight:'bold',
        color:'#fff',

    },
    boton:{
        backgroundColor:'#9b59b6',

    },
    botonTexto:{
        textTransform:'uppercase',
        fontWeight:'bold',
        color:'#fff',
        fontSize:15,
        

    },
    title:{
        textAlign:'center',
        marginLeft: 5,
        marginTop:10,
        fontSize:15,
        fontWeight:'bold'
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        marginTop:15,
        flex: 1
      },
})
export default FormCoordinates