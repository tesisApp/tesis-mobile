import firebase from 'firebase/app';
import 'firebase/firestore';
//import 'firebase/firestore'

//import firebaseConfig from './config'
const firebaseConfig = {
    apiKey: "AIzaSyDm-rFOuuaC59mAcEcTrE62BIBC1mRYmf4",
    authDomain: "tesisarduinogps.firebaseapp.com",
    databaseURL: "https://tesisarduinogps-default-rtdb.firebaseio.com",
    projectId: "tesisarduinogps",
    storageBucket: "tesisarduinogps.appspot.com", 
    messagingSenderId: "36682550904",
    appId: "1:36682550904:web:90315c681789996a1ce78d",
    measurementId: "G-NS9L2RNE6C"
}

const firebaseapp = firebase.initializeApp(firebaseConfig)
export const db = firebaseapp.database()

// class Firebase{
//   constructor(){
//     if(!firebase.apps.length){
//         firebase.initializeApp({firebaseConfig})
//     } else
//     this.db=firebase.firestore()
//   }
// }
// const firebaseapp=new Firebase()
// export default firebaseapp