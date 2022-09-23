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
} from "native-base"
import { useNavigation } from "@react-navigation/native"
import * as firebase from "firebase"
import { validateEmail } from "../../utils/validation"

const Register = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [passRep, setPassRep] = useState("")
  const [error, setError] = useState({})
  const [button, setButton] = useState(false)
  const navigation = useNavigation()

  const register = () => {
    
    setButton(true)
    let errors = {}
    
    if (
      email.trim() === "" ||
      pass.trim() === "" ||
      passRep.trim() === "" ||
      firstName.trim() === "" ||
      lastName.trim() === ""
    ) {
      console.log("campos vacios")
      if (email.trim() === "") errors.email = true
      if (pass.trim() === "") errors.pass = true
      if (passRep.trim() === "") errors.passRep = true
      if (firstName.trim() === "") errors.firstName = true
      if (lastName.trim() === "") errors.lastName = true
    } else if (!validateEmail(email)) {
      errors.email = true
      console.log("error correo")
    } else if (pass.length < 6) {
      console.log("pass menos q 6")
      errors.pass = true
      errors.passRep = true
    } else if (pass !== passRep) {
      errors.passRep = true
    } else {
      firebase.default
        .auth()
        .createUserWithEmailAndPassword(email, pass)
        .then((result) => {
          console.log("cuenta creada", result)
          saveUser(result.user)
          navigation.navigate("Login")
        })
        .catch(() => {
          showAlert()
          setEmail("")
          setPass("")
          setPassRep("")
          setButton(false)
        })
    }
    setError(errors)
  }

  const saveUser = async (user) => {
    await firebase.default.firestore().collection("usuario").add({
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      uid: user.uid,
      latitude: "",
      longitude: "",
      createdAt: new Date(),
    })
  }

  const showAlert = () => {
    Alert.alert("Error...", "Correo Electronico ya utilizado", [
      { text: "OK" },
    ])
  }
  return (
    <Container style={styles.contenedor}>
      <Content style={{ backgroundColor: "#8854d0" }}>
        <View style={styles.contenedorLogin}>
          <H1 style={styles.titulo}>Registro</H1>
          <Form style={{ marginHorizontal: "2.5%", marginRight: 20 }}>
            <Item style={styles.login}>
              <Icon active name="person-add"></Icon>
              <Input
                placeholder="Nombre"
                onChangeText={(texto) => setFirstName(texto)}
                keyboardType="default"
                value={firstName}
              ></Input>
              {error.firstName ? (
                <Icon active name="close-circle" style={{ color: "red" }} />
              ) : button ? (
                <Icon
                  active
                  name="checkmark-circle"
                  style={{ color: "green" }}
                />
              ) : null}
            </Item>

            <Item style={styles.login}>
              <Icon active name="person-add"></Icon>
              <Input
                placeholder="Apellido"
                onChangeText={(texto) => setLastName(texto)}
                keyboardType="default"
                value={lastName}
              ></Input>
              {error.lastName ? (
                <Icon active name="close-circle" style={{ color: "red" }} />
              ) : button ? (
                <Icon
                  active
                  name="checkmark-circle"
                  style={{ color: "green" }}
                />
              ) : null}
            </Item>

            <Item style={styles.login}>
              <Icon active name="mail-sharp"></Icon>
              <Input
                placeholder="Correo electrónico"
                onChangeText={(texto) => setEmail(texto)}
                keyboardType="email-address"
                value={email}
              ></Input>
              {error.email ? (
                <Icon active name="close-circle" style={{ color: "red" }} />
              ) : button ? (
                <Icon
                  active
                  name="checkmark-circle"
                  style={{ color: "green" }}
                />
              ) : null}
            </Item>
            <Item style={styles.login}>
              <Icon active name="lock-closed-sharp"></Icon>
              <Input
                placeholder="Contraseña"
                onChangeText={(texto) => setPass(texto)}
                secureTextEntry={true}
                value={pass}
              ></Input>
              {error.pass ? (
                <Icon active name="close-circle" style={{ color: "red" }} />
              ) : button ? (
                <Icon
                  active
                  name="checkmark-circle"
                  style={{ color: "green" }}
                />
              ) : null}
            </Item>
            <Text
              style={{
                textAlign: "center",
                marginTop: 5,
                color: "red",
                marginLeft: 15,
              }}
            >
              Contraseña de al menos 6 caracteres
            </Text>
            <Item style={styles.login}>
              <Icon active name="lock-closed-sharp"></Icon>
              <Input
                placeholder="Repetir Contraseña"
                onChangeText={(texto) => setPassRep(texto)}
                secureTextEntry={true}
                value={passRep}
              ></Input>
              {error.passRep ? (
                <Icon active name="close-circle" style={{ color: "red" }} />
              ) : button ? (
                <Icon
                  active
                  name="checkmark-circle"
                  style={{ color: "green" }}
                />
              ) : null}
            </Item>
          </Form>
          <View style={{ marginHorizontal: "10%", marginBottom: 0 }}>
            <Button
              rounded
              block
              style={styles.boton}
              onPress={() => register()}
            >
              <Text style={styles.botonTexto}>CREAR CUENTA</Text>
            </Button>
          </View>
        </View>
      </Content>
    </Container>
  )
}
const styles = StyleSheet.create({
  contenedor: {
    //flex: 1,
    backgroundColor: "#8854d0",
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
    textTransform: "uppercase",
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
export default Register
