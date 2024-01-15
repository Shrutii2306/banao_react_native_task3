import React, { useState } from 'react';
import {View, Text,StyleSheet, Image, TextInput, Button} from 'react-native';
import {FIREBASE_AUTH} from '../firebaseConfig'
const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    return (
        <View style={styles.container}>
            <Text>login</Text>
            <TextInput style={styles.input} placeholder='email'
            value={email}
            onChangeText={(email) => setEmail(email)}
            autoCapitalize='none'/>
            <TextInput
            style={styles.input}
            placeholder='password'
            value={password}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}            
            />
            <Button title='login'/>
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
