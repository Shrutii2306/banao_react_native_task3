import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text, Button, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native'
import { collection,get, doc ,getDocs, query, onSnapshot, where, orderBy } from "firebase/firestore"; 
import { FIREBASE_DB } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const HomeScreen = ({navigation}) => {

    const auth = getAuth();
    const userID = auth.currentUser.uid;
    const db = FIREBASE_DB;
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    let newUserList = [];
    const getUsers = async() =>
    {
        setLoading(true);
        
        // const userRef = collection(FIREBASE_DB, 'users');
        // const subscriber = onSnapshot(userRef,{
        //     next: (snapshot) =>{
        //         const users =[];
        //         snapshot.docs.forEach(doc => {
        //             console.log(doc);
        //             users.push({
        //                 ...doc.data(),
        //             })
        //         })
        //         setUserList(users);
        //     }
        // })
        // return() => subscriber();
        try{
            // console.log('inside userrrrrrrr');
            // const userRef =(collection(db,"users"))
            // const q = query(userRef,orderBy('lastText','desc'))
            // const querySnapshot = await getDocs(q);
            // console.log("querySnapshot",querySnapshot);
            // querySnapshot.forEach((doc) => {
            //     console.log(doc.id,"=>",doc.data());
            //     if(userID!= doc.data().uid)
            //     newUserList.push(doc.data())
            // });
            // setUserList(newUserList);
            // console.log("userList : ",userList);
            // userList.forEach((item) =>{
            //     console.log(item)
            // })
           //console.log("user 1 : ",userList[0].type);
           console.log('inside user');
           const userRef = (collection(db,'userConnections','userConnections',userID))
           const q = query(userRef,orderBy('lastText','desc'))
           const querySnapshot = await getDocs(q);
            console.log("querySnapshot",querySnapshot);
            querySnapshot.forEach((doc) => {
                console.log(doc.id,"=>",doc.data());
                if(userID!= doc.data().uid)
                newUserList.push(doc.data())
            });
            setUserList(newUserList);
            console.log("userList : ",userList);
            userList.forEach((item) =>{
                console.log(item)
            })


           setLoading(false);
           }catch(err){
            console.log(err.message);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {

        console.log('inside useffect');
        getUsers();
    },[]);
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //       // The screen is focused
    //       // Call any action and update data
    //       getUsers();
    //     });
    
    //     // Return the function to unsubscribe from the event so it gets removed on unmount
    //     return unsubscribe;
    //   }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <Text>HomeScreen</Text>
            <Text>
                {userList.map((item,index) => {
                    <Text key={index}>{item.uid}</Text>
                })}
            </Text>
           {!loading? <FlatList 

                data={userList}
                renderItem={({item}) =>(

                    <TouchableOpacity style={{height:50,borderWidth:2}} onPress={item.type=='individual'?() => navigation.navigate('Chat',{id:item.uid,type : item.type}): () =>navigation.navigate('GroupChat',{id:item.uid,type : item.type})}>
                        <Text>
                            {item.type=='individual'?item.userName:item.name}
                        </Text>
                    </TouchableOpacity>
    )}      
                keyExtractor={item=> item.uid}
            />   : null
            }       
            <Button title='Chat' onPress={() => auth.signOut()}/>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({

    container :{

        flex:1,
        marginHorizontal:20,
        justifyContent:'center',
        paddingTop:50
    }
})

export default HomeScreen;
