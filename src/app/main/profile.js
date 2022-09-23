import React, { useState, useEffect } from "react"
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native"
import {
  Item,
  Input,
  Icon,
  Content,
  H1,
  Container,
  Button,
  Form,
  Label
} from "native-base"
import { useNavigation } from "@react-navigation/native"
import * as firebase from "firebase"
import { validateEmail } from "../../utils/validation"

const Profile = () => {

    const [address, setAddress] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [docId, setDocId] = useState('')
    const navigation = useNavigation()

    useEffect(async() => {
        const userCurrent = firebase.default.auth().currentUser
        await firebase.default.firestore().collection('usuario').where('uid','==', userCurrent.uid).get().then((user) => {
            user.forEach((doc) => {
                setDocId(doc.id)
                setFirstName(doc.data().firstName)
                setLastName(doc.data().lastName)
                setEmail(doc.data().email)
            })
        }).catch((err)=>{
            console.log("error", err)
        })
    },[])

    const updateProfile = async() => {
        console.log(firstName,lastName,email)
        await firebase.default.auth().currentUser.updateEmail(email).then(async(response) => {
            console.log("update email")
            await firebase.default.firestore().collection('usuario').doc(docId).update({
                firstName: firstName,
                lastName: lastName,
                email: email
            })
            navigation.navigate("Welcome")
        })
    }

    return(
        <Container style={styles.contenedor}>
            <Content style={{marginTop:50}}>
                <Form style={{marginRight:13}}>
                    <Item floatingLabel>
                        <Label style={{color:'#9b59b6'}}>Nombre</Label>
                        <Input value={firstName} onChangeText={(texto) => setFirstName(texto)} />
                    </Item>
                    <Item floatingLabel>
                        <Label style={{color:'#9b59b6'}}>Apellido</Label>
                        <Input value={lastName} onChangeText={(texto) => setLastName(texto)}/>
                    </Item>
                    <Item floatingLabel>
                        <Label style={{color:'#9b59b6'}}>Correo electrónico</Label>
                        <Input value={email} onChangeText={(texto) => setEmail(texto)} keyboardType="email-address" />
                    </Item>
                    
                </Form>
                
            </Content>
            <View  style={{marginBottom:100, padding: 10}}>
                    <Button 
                        rounded
                        block
                        style={styles.boton}
                        onPress={() => updateProfile()}
                    >
                        <Text style={styles.botonTexto}>Editar perfil</Text>
                    </Button>
                </View>
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
    title:{
        textAlign:'center',
        marginLeft: 5,
        marginTop:10,
        fontSize:15,
        fontWeight:'bold'
    }
})

export default Profile