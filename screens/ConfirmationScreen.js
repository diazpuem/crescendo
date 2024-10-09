import {
  Button,
  Dialog,
  Divider,
  MD3Colors,
  Portal,
  ProgressBar,
  Text
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {useContext, useEffect, useLayoutEffect, useState} from "react";

import { UserContext } from "../context/UserContext";
import {createNewUserAndBand} from "../db/fs-store"
import { getUserBandRoleName } from "../model/UserBandRoles";
import { getUserRoleName } from "../model/UserRoles";
import { useIsFocused } from "@react-navigation/native";

export default function ConfirmationScreen({ navigation, route}) {
  // keep back arrow from showing
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const userContext = useContext(UserContext);

  const saveUserBandData = () => {
    const auth = getAuth()
    createNewUserAndBand(userContext.user, (response) => {
      createUserWithEmailAndPassword(auth, userContext.user.email, userContext.user.pwd)
      .then((userCredential) => {
        alert(response);
      })
      .catch((error) => {
        console.log(error);
      });
    });
  };
    
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && userContext.setUserState({progress: 100});
  }, [isFocused]);


  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={userContext.user.progress / 100}
        color={MD3Colors.primary60}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <SummaryEntry name={userContext.user.name} label={"Full Name"} />
        <SummaryEntry name={getUserRoleName(userContext.user.userRole)} label={"Role"} />
        <SummaryEntry name={getUserBandRoleName(userContext.user.userBandRole)} label={"Band Role"} />
        <SummaryEntry name={userContext.user.bandName} label={"Band Name"} />
        <Button
          style={styles.button}
          mode="elevated"
          onPress={() => saveUserBandData()}
        >
          Save
        </Button>
      </View>
    </View>
  );
}

export const SummaryEntry = ({ name, label }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>{label}</Text>
      <Text style={{ marginBottom: 8 }}>{name}</Text>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 8,
  },
  formEntry: {
    margin: 8,
  },
  container: {
    flex: 1,
  },
  progressBar: {
    marginBottom: 16,
  },
});
