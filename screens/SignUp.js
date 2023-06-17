import { Button, TextInput } from 'react-native-paper';
import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View } from "react-native"

import { UserContext } from '../context/UserContext';

export default function SignUpScreen({ navigation }) {
    const userContext = useContext(UserContext);

    const [values, setValues] = useState({
        email: "",
        pwd: "",
        pwd2: ""
    })

    function handleChange(text, eventName) {
        setValues(prev => {
            return {
                ...prev,
                [eventName]: text
            }
        })
    }

    function SignUp() {

        const { email, pwd, pwd2 } = values

        if (pwd == pwd2) {
            userContext.setUserState({ email: email, pwd: pwd });
            navigation.navigate("Step 1");
        } else {
            alert("Passwords are different!")
        }
    }

    return <View style={styles.view}>
        <Text style={{ fontSize: 34, fontWeight: "800", marginBottom: 20 }}>Sign Up</Text>
        <View style={styles.inputView}>
            <TextInput 
                placeholder="Email Address" 
                onChangeText={text => handleChange(text, "email")} 
                style={styles.input} />
            <TextInput 
                placeholder="Password" 
                secureTextEntry={true}  
                onChangeText={text => handleChange(text, "pwd")} 
                style={styles.input} 
            />
            <TextInput 
                placeholder="Confirm Password" 
                secureTextEntry={true}  
                onChangeText={text => handleChange(text, "pwd2")} 
                style={styles.input} />
        </View>
        <View style={styles.buttonsView}>
            <Button 
                mode="elevated"
                onPress={() => navigation.navigate("Login")} 
                style={styles.button}
            >
                Back
            </Button>
            <Button 
                onPress={SignUp} 
                mode="elevated"
                style={styles.button}
            >
                Save
            </Button>
        </View>
    </View>
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        width: 350
    },
    buttonsView:{ 
        justifyContent: "space-between", 
        flexDirection: "row",
    },
    inputView : {
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
    },
    button: {
        margin: 8,
        zIndex: 0,
        flex: 1
      },
})