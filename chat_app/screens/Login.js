import React, { useState } from 'react';
import {View, Text,StyleSheet, Image, TextInput, Button, KeyboardAvoidingView} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebaseConfig';
import { addDoc, collection,getDoc } from "firebase/firestore"; 
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
        console.log(response);
        try{
            const userResponse = await addDoc(collection(db,"users"),{
                uid : response.uid,
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
            <Text>login</Text>
            <TextInput style={styles.input} placeholder='email'
            value={email}
            onChangeText={(email) => setEmail(email)}
            autoCapitalize='none'/>
            <TextInput 
                style={styles.input}
                placeholder='username'
                value={userName}
                onChangeText={(userName) => setUserName(userName)}
                autoCapitalize='none'
            />
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
