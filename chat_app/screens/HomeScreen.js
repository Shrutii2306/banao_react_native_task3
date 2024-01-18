import React, { useEffect, useState } from 'react';
import {View, StyleSheet, Text, Button, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import { collection,get, doc ,getDocs, query, onSnapshot, where } from "firebase/firestore"; 
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
            
            const userRef = query(collection(db,"users"))
            const querySnapshot = await getDocs(collection(db,"users"));
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
           //console.log("user 1 : ",userList[0].type);
           setLoading(false);
           }catch(err){
            console.log(err.message);
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {

        getUsers();
    },[]);

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

                    <TouchableOpacity style={{height:50,borderWidth:2}} onPress={() => navigation.navigate('Chat',{id:item.uid,type : item.type})}>
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
