import {getAuth } from 'firebase/auth';
import React, { useEffect ,useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';
import {doc,query,addDoc,getDocs,setDoc,getDoc, collection } from 'firebase/firestore';

const ChatScreen = ({route}) => {

    const auth = getAuth();
    const currentUid = auth.currentUser.uid;
    const db = FIREBASE_DB;
    const {id }= route.params;
    const docId = currentUid+'_'+id;
    console.log(docId)
    const [messageWindow, setMessageWindow] = useState([]);
    const createDB = async() => {

        console.log("inside createDB");
       const docRef = doc(db,'messagesDB',docId)
       await setDoc(docRef,{
            sender : currentUid,
            receiver : id,
        });
        console.log("new doc id",docRef.id);
    }
    
    const getDB = async() => {
       
        try{
            
            const Query= doc(db,"messagesDB" ,docId);
            const querySnapshot = await getDoc(Query);
            console.log("querySnapshot",querySnapshot.data());
          if(querySnapshot.exists()) 
         setMessageWindow(querySnapshot.data());
         else{
            createDB();
         }           
        
        }catch(err){
            console.log(err.message);
        }

}
   
    useEffect(() => {
         getDB();
        
    },[]);
    return (
        <View style={styles.container}>
            <Text>{currentUid}{id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container:{

        flex:1,
        justifyContent:'center',
    }
})

export default ChatScreen;
