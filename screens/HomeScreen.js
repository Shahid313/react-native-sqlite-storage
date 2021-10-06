import React,{useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, TextInput, Keyboard, Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
        name:'MainDB',
        location:'default'
    },
    () => {},
    error => {console.log(error)}
);

const HomeScreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [updateName, setUpdateName] = useState('');

    useEffect(() => {
        selectData();
    })

    const selectData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT Name, Age FROM Users",
                [],
                (tx, results) => {
                    var len = results.rows.length;
                    if(len > 0){
                        var userName = results.rows.item(0).Name;
                        var userAge = results.rows.item(0).Age;
                        setName(userName);
                        setAge(userAge);
                    }
                }
            )
        })
    }

    const updateData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE Users SET Name = ?",
                [updateName],
                () => {Alert.alert("Success!","The update was succesful")},
                error => {console.log(error)}
            )
        })
    }

    const removeData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM Users",
                [],
                () => {navigation.navigate('SignIn')},
                error => {error}
            )
        })
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => Keyboard.dismiss()}>
            <View>
            <Text>{name}</Text>
            <Text>{age}</Text>
            <TextInput placeholder="Name" onChangeText={(e) => setUpdateName(e)}/>
            <TouchableOpacity onPress={() => updateData()} style={styles.UpdateButton}>
                <Text style={styles.UpdateButtonText}>UPDATE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeData()} style={styles.DeleteButton}>
                <Text style={styles.DeleteButtonText}>DELETE</Text>
            </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    UpdateButton:{
        width:120,
        height:40,
        borderRadius:10,
        backgroundColor:'green',
        justifyContent:'center',
        alignItems:'center'
    },
    UpdateButtonText:{
        color:'#fff'
    },
    DeleteButton:{
        width:120,
        height:40,
        borderRadius:10,
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center'
    },
    DeleteButtonText:{
        color:'#fff'
    }
})

export default HomeScreen;