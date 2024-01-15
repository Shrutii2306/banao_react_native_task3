import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import { collection, addDoc } from "firebase/firestore"; 

const HomeScreen = ({navigation}) => {
    return (
        <View>
            <Text>HomeScreen</Text>
            <Button title='Chat' onPress={() => navigation.navigate('Chat')}/>
        </View>
    );
}

const styles = StyleSheet.create({})

export default HomeScreen;
