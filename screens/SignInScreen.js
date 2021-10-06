import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
        name:'MainDB',
        location:'default'
    },
    () => {},
    error => {console.log(error)}
);

const SignInScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        createTable();
        checkUserData();
    }, [])

    const createTable = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS "
                +"Users "
                +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Age INTEGER);"
            )
        })
    }

    const checkUserData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT Name, Age FROM Users",
                [],
                (tx, results) => {
                    var len = results.rows.length;
                    if(len > 0) {
                        navigation.navigate('Home');
                    }
                }
            )
        })
    }

    const Login = async () => {
        await db.transaction( async (tx) => {
            await tx.executeSql(
                "INSERT INTO users (Name, Age) VALUES (?,?)",
                [name, age]
            );
        });
        navigation.navigate('Home');
    }
    return (
        <TouchableOpacity style={styles.container} onPress={() => Keyboard.dismiss()}>
            <View>
            <TextInput placeholder="Name" onChangeText={(e) => setName(e)}/>
            <TextInput placeholder="Age" onChangeText={(e) => setAge(e)}/>
            <TouchableOpacity onPress={() => {Login()}} style={styles.LoginButton}>
                <Text style={styles.LoginButtonText}>LOGIN</Text>
            </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column'
    },

    LoginButton:{
        width:120,
        height:40,
        borderRadius:10,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center'
    },
    LoginButtonText:{
        color:'#fff'
    }
})

export default SignInScreen;