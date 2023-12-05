import { Button, Text } from "react-native-paper";
import { Image, StyleSheet, View } from "react-native"
import React, { useContext } from 'react'
import { UserContext, initialUserState } from "../context/UserContext";
import { getAuth, signOut } from "firebase/auth";

export default function HomeScreen({navigation}) {
    const auth = getAuth();
    const userContext = useContext(UserContext);
    function onClickSignOut(){
        signOut(auth).then(() => {
            userContext.setUserState(initialUserState);
            console.log("Log out success");
            // Sign-out successful.
          }).catch((error) => {
            console.error(error);
            // An error happened.
          });
    }



    return <View style={styles.view}>
        <Image
            style={styles.image}
            source={require('../assets/official_logo.png')}
        />
        <Text variant="displaySmall"style={styles.text} >Welcome to Crescendo</Text>
        <Text variant="headlineMedium" style={styles.text} >{userContext.user.name}</Text>
        <Text variant="headlineSmall" style={styles.text}>{userContext.user.bandName}</Text>
        <Text variant="titleMedium" style={styles.text}>Your band code is: {userContext.user.bandCode}</Text>
        <Button title="Log Out" mode="elevated" onPress={onClickSignOut}>Log Out</Button>
    </View>
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 150,
        height: 150
    },
    text: {
        color: "#230047",
        marginBottom: 5
    }
})