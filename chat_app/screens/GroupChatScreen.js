import { getAuth } from 'firebase/auth';
import {serverTimestamp,addDoc,updateDoc,increment,orderBy, collection,where,documentId, query,getDocs,doc,setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {View,ToastAndroid, StyleSheet, Text,TextInput,FlatList,TouchableOpacity} from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';

import { Input, Icon } from '@rneui/themed';
import { Button } from '@rneui/base';
const GroupChatScreen = ({route}) => {

    const auth = getAuth();
    const currentUid =auth.currentUser.uid;
    
    const {id,type} = route.params;
    const [loading, setLoading] = useState(false);
    const [chatWindowID, setChatWindowID] = useState('');
   
    const db = FIREBASE_DB;
    const [currentUser,setCurrentUser] =useState([])
    const [user1,setUser1] =useState([])
    const [user2,setUser2] =useState([])
    const [message, setMessage] = useState('');
    const [allMessages,setAllMessages] = useState([]);
    const [sender,setSender] = useState('');
    const [receivers,setReceiver] = useState([]);


    const getGroupMembers = async() => {

        setLoading(true);
       try{ docRef = collection(db,'users',id,'members');
        const q = query(docRef);
        userRes = await getDocs(docRef);
        let num = 0;
        userRes.forEach((doc) => {
                 
           if(currentUid == doc.data().memberID)
            {
                console.log('inside if')
                
                    let user=[];
                    user.push(doc.data().memberID);
                    user.push(doc.data().memberName) 
                
                setCurrentUser(user);
                console.log(user);
            }
            
            else if(num==0){
                console.log('inside else if')
                let user=[];
                user.push(doc.data().memberID);
                user.push(doc.data().memberName) 
                setUser1(user)

                console.log(user1);
                num++;
                
            }else{
                console.log('inside else')
                let user=[];
                    user.push(doc.data().memberID);
                    user.push(doc.data().memberName) 
                console.log(user2);
                setUser2(user)
            }
           console.log(doc.id ,'===>',doc.data());

        });
      
        }catch(err){
            console.log(err.message);
        }finally{
            setLoading(false);
        }
    }

    const createDB = async() => {

        console.log("inside createDB");
       const docRef = doc(db,'messagesDB',id)
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
                where(documentId(), "==",id),
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
            console.log(id);
            const docRef = collection(db, "messagesDB",id,'messages')
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
            member2 : user1[0],
            member3 : user2[0],
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
        updateUserID();

        console.log("message created using id :",res.id);
        getMessageCollection();
        setMessage('');
        }catch(err){
            console.log(err.message);
        }
    }

    const updateUserID = async() => {

        try{
            
                const user1Ref = doc(db, 'userConnections','userConnections',currentUid,id);
                await updateDoc(user1Ref,{
                    lastText : serverTimestamp()
                 });
                 
                 const user2Ref = doc(db, 'userConnections','userConnections',user1[0],id);
                await updateDoc(user2Ref,{
                    lastText : serverTimestamp()
                 });

                 const user3Ref = doc(db, 'userConnections','userConnections',user2[0],id);
                await updateDoc(user3Ref,{
                    lastText : serverTimestamp()
                 });
                console.log('user db ')
            // }catch(err){
            //     console.log(err.message);
            // }
        }catch(err){
            console.log(err.message);
        }
    
    }
    useEffect(()=>{
        getGroupMembers();
        getDB();
        getMessageCollection();
    },[]);

    return (
        <View style={styles.container}>
           <Text style={{fontWeight:'bold',fontSize:20}}> Group Chat</Text>

            <FlatList 
                data={allMessages}
                renderItem={({item}) => (
                    <TouchableOpacity style={item.sender==currentUid? styles.senderContainer : styles.receiverContainer}>
                       <Text>{item.message}</Text> 
                    </TouchableOpacity>
                )}
            />
              <Input value={message} placeholder='Enter text to send' onChangeText={(message) => setMessage(message)}/>
            {/* <TextInput value={message} placeholder='Enter text to send...' onChangeText={(message) => setMessage(message)}/> */}
            <Button
              title="Send"
              loading={false}
              loadingProps={{ size: 'small', color: 'white' }}
              buttonStyle={{
                backgroundColor: 'rgba(111, 202, 186, 1)',
                borderRadius: 5,
              }}
              titleStyle={{ fontSize: 18 }}
              containerStyle={{
                marginHorizontal: 73,
                height: 40,
                width: 150,
                marginVertical: 5,
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
        
        backgroundColor:'#B2D1B8',
        height:40,
        justifyContent : 'center',
        paddingHorizontal :10,
        borderRadius :20,
        marginVertical: 5,
        
    },
    receiverContainer:{
        
        backgroundColor:'#EEEED4',
        height:40,
        justifyContent : 'center',
        paddingHorizontal :10,
        borderRadius :20,
        marginVertical: 5,
        
    }
})

export default GroupChatScreen;
