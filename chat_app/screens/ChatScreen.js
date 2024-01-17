import {getAuth } from 'firebase/auth';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const ChatScreen = ({route}) => {

    const auth = getAuth();
    const currentUid = auth.currentUser.uid;

    const {id }= route.params;
    return (
        <View style={styles.container}>
            <Text>{currentUid}{id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container:{

        flex:1,
        justifyContent:'center',
    }
})

export default ChatScreen;
