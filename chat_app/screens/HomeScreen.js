import React, { useEffect, useState } from 'react';
import {View,Alert,BackHandler, StyleSheet, Text, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import {useFocusEffect,useIsFocused} from '@react-navigation/native'
import { collection,get, doc ,getDocs, query, onSnapshot, where, orderBy } from "firebase/firestore"; 
import { FIREBASE_DB } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { Button } from '@rneui/base';
const HomeScreen = ({navigation}) => {

    const auth = getAuth();
    const userID = auth.currentUser.uid;
    const db = FIREBASE_DB;
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    let newUserList = [];
    const [activeChat, setActiveChat] = useState('');
    const getUsers = async() =>
    {
        setLoading(true);
        
       
        try{
          
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

    const isFocus = useIsFocused();
    useEffect(() => {

        console.log('inside useffect');
        getUsers();
        const backAction = () => {
            getUsers();
          };
      
          const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
          );
      
          return () => backHandler.remove();
        
    },[userList]);
   

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontWeight:'bold',fontSize:20}}>Home</Text>
            <Text>
                {userList.map((item,index) => {
                    <Text key={index}>{item.uid}</Text>
                })}
            </Text>
            <FlatList 

                data={userList}
                renderItem={({item}) =>(

                    <TouchableOpacity style={styles.userList} onPress={item.type=='individual'?() => navigation.navigate('Chat',{id:item.uid,type : item.type, userName : item.userName}): () =>navigation.navigate('GroupChat',{id:item.uid,type : item.type, userName : item.name})}>
                        <Text>
                            {item.type=='individual'?item.userName:item.name}
                        </Text>
                    </TouchableOpacity>
    )}      
                keyExtractor={item=> item.uid}
            />        
              <Button
              title="Log out"
              loading={false}
              loadingProps={{ size: 'small', color: 'white' }}
              buttonStyle={{
                backgroundColor: 'rgba(111, 202, 186, 1)',
                borderRadius: 5,
              }}
              titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
              containerStyle={{
                marginHorizontal: 50,
                height: 50,
                width: 200,
                marginVertical: 10,
              }}
              onPress={() => auth.signOut()}
            />
            
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({

    container :{

        flex:1,
        marginHorizontal:20,
        paddingTop:50
    },
    userList:{

        height:50,
        borderWidth:1,
        borderColor:'gray',
        borderRadius:30,
        justifyContent:'center',
        marginVertical: 10,
        paddingLeft:30,
        backgroundColor:'#A8A8A8'
    }
})

export default HomeScreen;
