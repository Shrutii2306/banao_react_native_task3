import React, { useState } from 'react';
import {View, Text,StyleSheet, Image, TextInput, KeyboardAvoidingView} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { addDoc, collection,getDoc } from "firebase/firestore"; 

import { Input, Icon } from '@rneui/themed';
import { Button } from '@rneui/base';
const Login = ({navigation}) => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const db = FIREBASE_DB;

const signIn = async() => {

    setLoading(true);
    try{
        const response = await signInWithEmailAndPassword(auth,email,password);
        //alert('Check your emails!');
         navigation.navigate('Home');
        //

    }catch(error){
        console.log(error);
        alert('Sign in falied : '+error.message);

    }finally{
        setLoading(false);
    }
}

const signUp = async() =>{
    setLoading(true);
    try{
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response.user.uid);
        try{
            const userResponse = await addDoc(collection(db,"users"),{
                uid : response.user.uid,
                userName : userName,
            });
            console.log("user created successfuly!");
            navigation.navigate('Home');
        }catch(err){
            console.log("cannot store in fireStore",err.message);
        }
        
    }catch(error){
        console.log(error);
        alert('Sign up falied : '+ error);
        
    }finally{
        setLoading(false);
    }
}
    return (
        <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
            <Text style={{fontWeight:'bold',fontSize:40}}>Login</Text>
            <Input  placeholder='email'
            value={email}
            onChangeText={(email) => setEmail(email)}
            autoCapitalize='none'/>
           
            <Input
            placeholder='password'
            value={password}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}            
            />
             <Button
              title="Login"
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
              }} onPress={signIn}/>
           
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({

    container :{

        flex:1,
        marginHorizontal:20,
        justifyContent:'center'
    }
})

export default Login;
