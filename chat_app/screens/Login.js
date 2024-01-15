import React, { useState } from 'react';
import {View, Text,StyleSheet, Image, TextInput, Button, KeyboardAvoidingView} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from '../firebaseConfig';
import { addDoc, collection,getDoc } from "firebase/firestore"; 
const Login = ({navigation}) => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

const signIn = async() => {

    setLoading(true);
    try{
        const response = await signInWithEmailAndPassword(auth,userName,password);
        //alert('Check your emails!');
        try{
            const userResponse = await addDoc(collection(db,"users"),{
                userName : userName,
                password : password,
            });
            console.log("user created successfuly!");
            navigation.navigate('Home');
        }catch(err){
            console.log("cannot store in fireStore",err.message);
        }
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
        const response = await createUserWithEmailAndPassword(auth, userName, password);
        console.log(response);
        alert('Check your userNames!');
        
    }catch(error){
        console.log(error);
        alert('Sign in falied : '+ error.message);
        
    }finally{
        setLoading(false);
    }
}
    return (
        <View style={styles.container}>
        <KeyboardAvoidingView behavior='padding'>
            <Text>login</Text>
            <TextInput style={styles.input} placeholder='userName'
            value={userName}
            onChangeText={(userName) => setUserName(userName)}
            autoCapitalize='none'/>
            <TextInput
            style={styles.input}
            placeholder='password'
            value={password}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}            
            />
            <Button title='login' onPress={signIn}/>
            <Button title='Create Account' onPress={signUp}/>
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
