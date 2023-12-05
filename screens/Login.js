import { Button, Text, TextInput } from 'react-native-paper';
import { Image, StyleSheet, View } from "react-native"
import React, { useContext, useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { UserContext } from '../context/UserContext';
import { getUserIfExists } from '../db/fb-store';

export default function Loginscreen({ route, navigation }) {
    const [state, setState] = useState({
        email: "",
        password: ""
    })

    const updateStateObject = (vals) => {
        setState({
            ...state,
            ...vals,
        });
    };

    const userContext = useContext(UserContext);
    function Login() {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, state.email, state.password)
            .then(() => {
                getUserIfExists(state.email,(userResponse) => {
                    if (userResponse) {
                        const userKey = Object.keys(userResponse)[0];
                        const userObject = Object.values(userResponse)[0];
                        console.log("LOGIN");
                        console.log(userObject);
                        userObject.userKey = userKey;
                        userContext.setUserState(userObject);
                    }
                });
            })
            .catch((error) => {
                alert(error.message)
            });
    }

    return <View style={styles.view}>
        <Image
            style={styles.image}
            source={require('../assets/official_logo.png')}
        />
        <Text style={styles.titleText} variant="displayMedium" >Crescendo</Text>
        <View style={styles.inputView}>
            <TextInput 
                placeholder="Email Address" 
                onChangeText={(val) => updateStateObject({email: val})}
                style={styles.input} 
            />
            <TextInput 
                placeholder="Password" 
                onChangeText={(val) => updateStateObject({password: val})} 
                secureTextEntry={true} 
                style={styles.input} 
            />
        </View>
        <View style={styles.buttonsView}>
            <Button 
                mode="elevated"
                onPress={() => Login()} 
                style={styles.button}
            >
                Login
            </Button>
            <Button 
                onPress={() => navigation.navigate("Sign Up")} 
                mode="elevated"
                style={styles.button}
            >
                Sign Up
            </Button>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleText: {
        color: "#230047"
    },
    button: {
      margin: 8,
      zIndex: 0,
      flex: 1
    },
    inputView : {
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
    },
    input: {
        width: 350
    },
    buttonsView:{ 
        justifyContent: "space-between", 
        flexDirection: "row",
    },
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 100,
        height: 100
    }
})
