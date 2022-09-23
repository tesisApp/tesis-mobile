import "react-native-gesture-handler"
import React,{useState} from "react"
import {View,TouchableOpacity,Text,StyleSheet,Image,ScrollView} from 'react-native'
import {useNavigation} from "@react-navigation/native"
import { Item ,Input,Icon, Content, H1,Container,Button, Form} from 'native-base'
//import { prueba } from "../../utils/firebase/action"
import {validateEmail} from "../../utils/validation"
import * as firebase from "firebase"

export default function( )  {

  const navigation=useNavigation()
  const [correo,guardarCorreo]=useState("")
  
  //state para errores
  const [error,guardarError]=useState({})
  const [boton,guardarBoton]=useState(false)
  const [userError, setUserError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [email, setEmail] = useState("")
  const [pass,setPass] = useState("")

  const login= () => {
      let errors={}
      guardarBoton(true)
      if (email === "" || pass === "" ){
        if (email === "" ) errors.correo=true
        if (pass === "" ) errors.pass=true
      } else if (!validateEmail(email)){
        errors.correo=true
      } else {
        firebase.default.auth().signInWithEmailAndPassword(email,pass).then((response) => {
          navigation.navigate("DrawerApp")
        })
        .catch((error)=>{
          console.log(error.code)
          console.log(error.message)
          error.code === 'auth/user-not-found' ? setUserError('Usuario incorrecto') : setPasswordError('Contraseña incorrecta')
          guardarError({
            correo:true,
            pass:true
          })
        })
        guardarError(errors)
      }
  }
  
  return(

    <Container style={styles.contenedor}>
      <View style={styles.contenedorImagen}>
          <Image style={styles.imagen} resizeMode="contain" size="sm"
              source={{uri:"https://cdn.pixabay.com/photo/2017/05/15/00/35/mental-health-2313428_960_720.png"}}
          ></Image>
      </View>
      <Content style={{backgroundColor:'#8854d0'}}>
        <View style={styles.contenedorLogin}>
          <H1 style={styles.titulo}>ALZHEIMER APP</H1>
          <Form style={{marginHorizontal:'2.5%',marginRight:20}}>
            <Item style={styles.login}>
              <Icon active name="mail-sharp"></Icon>
              <Input placeholder="Correo electrónico" 
                onChangeText={texto=>setEmail(texto)}
                keyboardType="email-address"
                value={email}
              ></Input>
              {error.correo ? 
                <Icon active name="close-circle" style={{color:'red'}}/>
                :(boton ?
                    <Icon active name="checkmark-circle" style={{color:'green'}}/>
                    :
                    null
                )
              }
            </Item>
              {/* { error.correo && 
                <Text>{userError}</Text>
              } */}
              <Item style={styles.login}>
                <Icon active name="lock-closed-sharp"></Icon>
                <Input placeholder="Contraseña"
                  onChangeText={texto=>setPass(texto)}
                  secureTextEntry={true}
                  value={pass}
                ></Input>
                {error.pass  ? 
                  <Icon active name="close-circle" style={{color:'red'}}/>
                  : ( boton ?
                      <Icon active name="checkmark-circle" style={{color:'green'}}/>
                      :
                      null
                  )
                }
              </Item>
              {/* { error.pass && 
                <Text>{passwordError}</Text>
              } */}
          </Form>
          <View style={{justifyContent:'center',alignItems:'center',marginHorizontal:'3%', marginTop: '5%', marginBottom: '5%'}}>
            <Button rounded block style={styles.boton} 
                onPress={()=>login()}
            >
              <Text style={styles.botonTexto}>Ingresar</Text>
            </Button>
          </View>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate('Register')}>
          <Text style={styles.register}>¿No tenés cuenta? Regístrate</Text>
        </TouchableOpacity>
      </Content>
    </Container>
  )
}

const styles=StyleSheet.create({
  contenedor:{
    flex:1,
    backgroundColor:"#8854d0",
      
  },
  contenedorImagen:{
    height:"40%",
  },
  imagen:{
    height:270,
    width:"100%"
  },
  contenedorLogin:{
    //height:"60%",
    marginHorizontal:"2%",
    backgroundColor:"white",
    borderRadius:15,
    marginTop:15,
    paddingVertical: 2,
    marginBottom:40  
  },
  boton:{
    //marginTop:1,
    alignItems:"center",
    backgroundColor:"black",
    marginHorizontal: "5%",
  },
  botonTexto:{
    textTransform:"uppercase",
    fontWeight:"bold",
    color:"#fff",
    fontSize:15,
  },
  login:{
    marginTop:10
  },
  titulo:{
    textAlign:"center",
    marginTop:10,
    fontSize:30,
    fontWeight:"bold"
  },
  register:{
    textAlign:"center",
    color:"#fff",
    marginTop:10,
    fontSize:16
  },
  inputLogin:{
    marginHorizontal: "5%",
    backgroundColor:"#ffff"
  }
})
