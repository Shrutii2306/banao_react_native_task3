import {getAuth } from 'firebase/auth';
import React, { useEffect ,useState} from 'react';
import {View, StyleSheet, Text, TextInput, Button, FlatList, TouchableOpacity, ToastAndroid} from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';
import {doc,getDocs,query,where,documentId,setDoc,getDoc, collection, Timestamp, addDoc, orderBy, serverTimestamp, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

const ChatScreen = ({route}) => {

    const auth = getAuth();
    const currentUid = auth.currentUser.uid;
    const db = FIREBASE_DB;
    const {id,type }= route.params;
    const docId = currentUid+'_'+id;
    const docId2 = id+'_'+currentUid;
    // console.log('id',docId)
    // console.log('id2',docId2)
    const [chatWindowID, setChatWindowID] = useState('');
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    // const [sender,setSender] = useState('');
    // const [receiver,setReceiver] = useState('');
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
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            setChatWindowID(doc.id);
            console.log(chatWindowID);
            f=1;
        });
        console.log(f)
         if(f==0){
           createDB();
        }           
        
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
    //    const senderWindowRef =doc(db, "users", where('uid','==', currentUid));

    //    await updateDoc(senderWindowRef,{
       
    //     lastText: serverTimestamp()
    //    });

    //    console.log('sender updated')
    //    const receiverWindowRef = doc(db, "users",where('uid','==', id));

    //    await updateDoc(receiverWindowRef,{
       
    //     lastText: serverTimestamp()
    //    });
    //     console.log(activeUsers);
    //     const batch = writeBatch(db);
    //     const senderRef = doc(db,'users',where('uid','==',currentUid));
    //     batch.update(senderRef,{
    //         lastText : serverTimestamp()
    //     })
    //    await batch.commit(;

    // 
    
       console.log("message created using id :",res.id);
       getMessageCollection();
       setMessage('');
    }catch(err){
        console.log(err.message);
    }
}

 const getMessageCollection = async() => {

    try
    {
        console.log('first');
        const docRef = collection(db, "messagesDB",chatWindowID,'messages')
        const q= query(docRef, orderBy('timeStamp'));
        let messagesRes = [];
        const querySnapshot = await getDocs(q,orderBy("timeStamp"));
            console.log('querySnapshot',querySnapshot);
        querySnapshot.forEach((doc) => {
            //console.log(doc.id, " => ", doc.data());
            //setChatWindowID(doc.id);
            //console.log(chatWindowID);
            messagesRes.push(doc.data());
        });
        console.log('messagesssssss',messagesRes);
        setAllMessages(messagesRes);
        console.log(allMessages);
        
        {allMessages.map((messageItem,index) => {

            console.log(messageItem.message)
           
        })}
    }catch(err){
        console.log(err.message);
    }

 }
    useEffect(() => {

        getMessageCollection();
         getDB();
        
    },[]);
    return (
        <View style={styles.container}>
             <Text>{currentUid} {id}</Text>
            
            <FlatList 
                data={allMessages}
                renderItem={({item}) => (
                    <TouchableOpacity style={item.sender==currentUid? styles.senderContainer : styles.receiverContainer}>
                       <Text>{item.message}</Text> 
                    </TouchableOpacity>
                )}
            />
            <TextInput value={message} placeholder='Enter text to send' onChangeText={(message) => setMessage(message)}
            />
            <Button title='Send' onPress={addMessageCollection}/>
        </View>
    );
}

const styles = StyleSheet.create({

    container:{

        flex:1,
        justifyContent:'center',
        marginHorizontal:20,
        marginTop:100,
    },
    senderContainer:{
        borderWidth:2
    }
})

export default ChatScreen;
