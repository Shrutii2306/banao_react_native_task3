import {getAuth } from 'firebase/auth';
import React, { useEffect ,useState} from 'react';
import {View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity, ToastAndroid} from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';
import {doc,getDocs,query,where,documentId,setDoc,getDoc, collection, addDoc, orderBy, serverTimestamp, updateDoc, increment,  } from 'firebase/firestore';

import { Input, Icon } from '@rneui/themed';
import { Button } from '@rneui/base';
const ChatScreen = ({route}) => {

    const auth = getAuth();
    const currentUid = auth.currentUser.uid;
    const db = FIREBASE_DB;
    const {id,type, userName }= route.params;
    const docId = currentUid+'_'+id;
    const docId2 = id+'_'+currentUid;
    const [loading, setLoading] = useState(false);
    const [chatWindowID, setChatWindowID] = useState('');
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);
     const [senderID,setSender] = useState('');
     const [receiverID,setReceiver] = useState('');
    const createDB = async() => {

        console.log("inside createDB");
       const docRef = doc(db,'messagesDB',docId)
       await setDoc(docRef,{
        chatType:type,
        latestTimeStamp : new Date(),
            messageCount : 0,
            
        });
        console.log("new doc id",docRef.id);
        
    }
    
    const getDB = async() => {
       
        console.log('inise get')
        try{
            console.log("try")
            var f=0;
            const q= query(
                collection(db, "messagesDB"),
                where(documentId(), "in",
                  [
                    docId,
                    docId2
                  ]
                ),
              );
              const querySnapshot = await getDocs(q);
              
            console.log(querySnapshot);
        querySnapshot.forEach(async(doc) => {
            console.log(doc.id, " => ", doc.data());
            setChatWindowID(doc.id);
            console.log(chatWindowID);
            f=1;
        });
        console.log(f)
         if(f==0){
           createDB();
        }           
        // getMessageCollection();
        }catch(err){
            console.log(err.message);
        }

    }


    const getMessageCollection = async() => {

        setLoading(true);
        try
        {
            console.log('first');
            console.log(docId);
            const docRef = collection(db, "messagesDB",docId,'messages')
            const q= query(docRef, orderBy('timeStamp'));
            let messagesRes = [];
            const querySnapshot = await getDocs(q,orderBy("timeStamp"));
                console.log('querySnapshot',querySnapshot);
            querySnapshot.forEach((doc) => {
    
                messagesRes.push(doc.data());
            });
            console.log('messagesssssss',messagesRes);
            setAllMessages(messagesRes);

            console.log(allMessages);
            
            {allMessages.map((messageItem,index) => {
    
                console.log(messageItem.message)
               
            })}
            setLoading(false);
        }catch(err){
            console.log(err.message);
        }
    
     }

    const addMessageCollection = async() =>{

        if(message==''){
            return (
                ToastAndroid.show('Message cannot be empty',ToastAndroid.SHORT,ToastAndroid.CENTER)
            )
        }
      try{  console.log(chatWindowID);
       const docRef = collection(db,'messagesDB',chatWindowID,'messages');
       const messageData = {
        sender : currentUid,
        receiver : id,
        timeStamp : serverTimestamp(),
        message : message
       };

       const res = await addDoc(docRef,messageData);
       console.log('message saved')
       //updating latest time stamp
       const chatWindowRef = doc(db, "messagesDB",chatWindowID);
       await updateDoc(chatWindowRef,{
        message_count : increment(1),
        latestTimeStamp: serverTimestamp()
       });
    console.log('message db updated');
       //updating latest time stamp for user
      

       console.log("message created using id :",res.id);
       getMessageCollection();
       updateUserID();
       setMessage('');
    }catch(err){
        console.log(err.message);
    }
}

const updateUserID = async() => {

    try{
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const senderRef = doc(db, 'userConnections','userConnections',currentUid,id);
         await updateDoc(senderRef,{
            lastText : serverTimestamp()
         });

         const receiverRef = doc(db, 'userConnections','userConnections',id,currentUid);
         await updateDoc(receiverRef,{
            lastText : serverTimestamp()
         });
        // const q = query(userRef2,where('uid','==',id))
        // const userSnapshot = await getDocs(q);
        // userSnapshot.forEach((doc) => {
 
        //  console.log(doc.id ,'=====>',doc.data());
        //  if(doc.data().uid == currentUid)
        //  {
        //      setSender(doc.id);
        //  }
        //  if(doc.data().uid == id){
        //      setReceiver(doc.id);
        //  }
        // })
        // try{

        //     const senderRef = doc(db,'users',senderID);
        //     await updateDoc(senderRef,{
        //         lastText : serverTimestamp()
        //     })  
        //     const receiverRef = doc(db, 'users',receiverID);
        //     await updateDoc(receiverRef,{
        //         lastText : serverTimestamp()
        //     })

        //     console.log('user db ')
        // }catch(err){
        //     console.log(err.message);
        // }
    }catch(err){
        console.log(err.message);
    }

}
 
    useEffect(() => {
     
         getDB();
         getMessageCollection();
        
    },[]);
    return (
        <View style={styles.container}>
             <Text style={{fontWeight:'bold',fontSize:20}}> {userName}</Text>
            
           {!loading? <FlatList 
                data={allMessages}
                renderItem={({item}) => (
                    <TouchableOpacity style={item.sender==currentUid? styles.senderContainer : styles.receiverContainer}>
                       <Text>{item.message}</Text> 
                    </TouchableOpacity>
                )}
            />: null}
            <Input value={message} placeholder='Enter text to send' onChangeText={(message) => setMessage(message)}/>
            {/* <TextInput value={message} placeholder='Enter text to send' onChangeText={(message) => setMessage(message)}
            /> */}
            <Button
              title="Send"
              loading={false}
              loadingProps={{ size: 'small', color: 'white' }}
              buttonStyle={{
                backgroundColor: 'rgba(111, 202, 186, 1)',
                borderRadius: 5,
              }}
              titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
              containerStyle={{
                marginHorizontal: 40,
                height: 40,
                width: 200,
                marginVertical: 10,
              }} onPress={addMessageCollection}/>
        </View>
    );
}

const styles = StyleSheet.create({

    container:{

        flex:1,
        marginHorizontal:20,
        marginTop:70,
    },
    senderContainer:{
        borderWidth:2,
        backgroundColor:'green'
    }
})

export default ChatScreen;