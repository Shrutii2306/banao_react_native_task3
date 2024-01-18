import { getAuth } from 'firebase/auth';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

const GroupChatScreen = ({route}) => {

    const auth = getAuth();
    const currentUid =auth.currentUser.uid;
    const {id} = route.params;
    console.log(uid,';;;;;',id);
    return (
        <View>
            <Text>Group chat</Text>
        </View>
    );
}

const styles = StyleSheet.create({})

export default GroupChatScreen;
