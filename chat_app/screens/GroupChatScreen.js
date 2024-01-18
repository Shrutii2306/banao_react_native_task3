import { getAuth } from 'firebase/auth';
import {serverTimestamp,addDoc,updateDoc,increment,orderBy, collection,where,documentId, query,getDocs,doc,setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {View,ToastAndroid, StyleSheet, Text, Button, TextInput,FlatList,TouchableOpacity} from 'react-native';
import { FIREBASE_DB } from '../firebaseConfig';

const GroupChatScreen = ({route}) => {

    const auth = getAuth();
    const currentUid =auth.currentUser.uid;
    const {id,type} = route.params;
    const [loading, setLoading] = useState(false);
    const [chatWindowID, setChatWindowID] = useState('');
    //console.log(currentUid,';;;;;',id);
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
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
            // const userRef2 = collection(db, 'users');
            // const q = query(userRef2,where('uid','in',[currentUid,user1[0],user2[0]]))
            // const userSnapshot = await getDocs(q);
            // let sen = [];
            // userSnapshot.forEach((doc) => {
     
            //  console.log(doc.id ,'=====>',doc.data());
            //  if(doc.data().uid == currentUid)
            //  {
            //      setSender(doc.id);
            //  }
            //  if(doc.data().uid == user1[0]){
            //      sen.push(doc.data().uid)
            //  }
            //  if(doc.data().uid == user2[0]){
            //     sen.push(doc.data().uid)
            // }
            // })
            // setSender(sen);
            // try{
    
                const senderRef = doc(db,'users',id);
                await updateDoc(senderRef,{
                    lastText : serverTimestamp()
                })  
                // const receiverRef = doc(db, 'users',receivers[0]);
                // await updateDoc(receiverRef,{
                //     lastText : serverTimestamp()
                // })
    
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
            <Text>Group chat</Text>
           {!loading? <View>{console.log(currentUser)}<Text>{currentUser[1]}</Text>
            <Text>{user1[1]}</Text>
            <Text>{user2[1]}</Text></View>: null}

            {!loading? <FlatList 
                data={allMessages}
                renderItem={({item}) => (
                    <TouchableOpacity style={item.sender==currentUid? styles.senderContainer : styles.receiverContainer}>
                       <Text>{item.message}</Text> 
                    </TouchableOpacity>
                )}
            />: null}
            <TextInput value={message} placeholder='Enter text to send...' onChangeText={(message) => setMessage(message)}/>
            <Button title='Send' onPress={addMessageCollection}/>
        </View>
    );
}

const styles = StyleSheet.create({

    container:{

        flex:1,
        justifyContent:'center',
        marginHorizontal:20
    },
    senderContainer:{
        borderWidth:2
    }
})

export default GroupChatScreen;
