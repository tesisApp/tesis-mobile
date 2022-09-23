import * as firebase from "firebase"
import React, {useState} from 'react'
import {db} from './firebase'
import 'firebase/firestore'

export const prueba= () => {
  //console.log(db)
  firebase.default.auth().onAuthStateChanged((user)=> {
    if(user){
        //setValidarSesion(true);
        console.log('usuario logueado')
    }else {
        //setValidarSesion(false);
        console.log('No ha iniciado sesion')
    }
  })
    
//     firebase.auth().onAuthStateChanged((user)=>{
//         if(user){
//             //setValidarSesion(true);
//             console.log('usuario logueado')
//         }else {
//             //setValidarSesion(false);
//             console.log('No ha iniciado sesion')
//         }
//    })
}