import React, {useEffect, useState, useRef} from "react"
import MapView, { Circle } from "react-native-maps"
import { Marker } from "react-native-maps"
import { StyleSheet, Text, View, Dimensions, Button, Image } from "react-native"
import * as geolib from "geolib"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import Device from "expo-device"
import { prueba } from "../../utils/firebase/action"
import * as firebase from "firebase"
import {db} from '../../utils/firebase/firebase'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
})

const markerImg = require('../../utils/images/person.png')
const Maps =({route,navigation})=>{
    var insideRadius
    var token
    const [expoPushToken, setExpoPushToken] = useState("")
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [coords, setCoords]=useState({
        latitude: 0,
        longitude: 0
    })
    const [notification, setNotification] = useState(false)
    const notificationListener = useRef()
    const responseListener = useRef()

    

    const getData= async (lat,lng)=> {
        console.log(lat,lng)
        await db.ref(`location/`).on('value', async function (snapshot) {
            setLatitude(snapshot.val().latitude)
            setLongitude(snapshot.val().longitude)
            console.log("real time",latitude)
            console.log("real time",longitude)
            const coordinates = {
                latitude: snapshot.val().latitude,
                longitude: snapshot.val().longitude
            }

            //const userCurrent = firebase.default.auth().currentUser
            // await firebase.default.firestore().collection('usuario').where('uid','==', userCurrent.uid).get().then((user) => {
            //     user.forEach((doc) => {
            //         console.log(doc.id)
            //         console.log("data",doc.data())
            //         setCoords({
            //             latitude: doc.data().latitude,
            //             longitude: doc.data().longitude
            //         })

            //         const centerPoint = coords
            //         insideRadius = geolib.isPointWithinRadius(coordinates, centerPoint, 200)
            //         console.log(insideRadius)
            //         if ( !insideRadius) {
            //         sendMessage(expoPushToken)
            //         console.log("fuera de rango")
            //         }
            //     })
            // }).catch((err)=>{
            //     console.log("error", err)
            // })

            setCoords({
                latitude: lat,
                longitude: lng
            })

            
            const centerPoint = {
                latitude: lat,
                longitude: lng
            }
            console.log("center point", centerPoint)
            console.log("coordinates", coordinates)
            insideRadius = geolib.isPointWithinRadius(coordinates, centerPoint, 200)
            console.log("INSIDE RADIUS",insideRadius)

            if ( !insideRadius) {
                sendMessage(expoPushToken)
                console.log("fuera de rango")
            }    
        
        })

        
    }

    useEffect(()=>{
        notificacion()
        
        getData(route.params.lat, route.params.lng)
        
        
    },[])

    const notificacion = () => {
        //push notification
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
            console.log("token",token)
            token = token
        })

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response)
        })

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current)
            Notifications.removeNotificationSubscription(responseListener.current)

        }
    }

    async function registerForPushNotificationsAsync() {
        let token
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync()
            let finalStatus = existingStatus
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!')
                return
            }
            token = (await Notifications.getExpoPushTokenAsync()).data
        //console.log(token)
        } else {
            alert('Must use physical device for Push Notifications')
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            })
        }

        return token
    }
    const sendMessage = (token) => {
        //console.log("token",token)
        fetch("https://exp.host/--/api/v2/push/send", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip,deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: token,
                title: "Atención",
                body: "El paciente ha salido de su zona segura",
                data: { data: "goes here"},
                _displayInForeground: true,
            })
        })
    }

  return(
    <>
        <View style={styles.container}>

            <MapView 
                    onPress={(e) => console.log(e.nativeEvent.coordinate)}
                    style={styles.map}>
                <Marker
                    coordinate={coords}
                ></Marker>
                <Marker
                    coordinate={{latitude: Number(latitude), longitude: Number(longitude)}}
                    // icon={require('../../utils/images/person.png')}
                >

                    {/* <Image
                    source={markerImg}
                    style={{height: 35, width: 35}}
                    >

                    </Image> */}
                </Marker>
                <Circle
                    center={coords}
                    radius={200}
                    fillColor={"rgba(100,100,200,0.3)"}
                ></Circle>
            </MapView>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        //marginTop: 100
    }
})
export default Maps