// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, initializeAuth, getReactNativePersistence} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSMnKE_nJMK-j9G60VZ59-pBj-9dRqf6Y",
  authDomain: "chatapp-7b939.firebaseapp.com",
  projectId: "chatapp-7b939",
  storageBucket: "chatapp-7b939.appspot.com",
  messagingSenderId: "755209015344",
  appId: "1:755209015344:web:68003e41c2dada98015df5",
  measurementId: "G-TS5B4DBYW0"
};

// Initialize Firebase

export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP,{
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
export const FIREBASE_DB = getFirestore(FIREBASE_APP);