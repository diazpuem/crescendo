import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { Button, Text } from "react-native-paper";
import { Image, Platform, StyleSheet, View } from "react-native"
import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext, initialUserState } from "../context/UserContext";
import { getAuth, signOut } from "firebase/auth";

import Constants from 'expo-constants';

// Expo Notifications Implementation

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen({navigation}) {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

        if (Platform.OS === 'android') {
          Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
        }
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });

        return () => {
        notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
        responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

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
        <Text variant="headlineSmall" style={styles.text}>Title: {notification && notification.request.content.title} </Text>
        <Text variant="headlineSmall" style={styles.text}>Body: {notification && notification.request.content.body}</Text>
        <Text variant="headlineSmall" style={styles.text} >Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        <Button  mode="elevated" onPress={async () => {
          await schedulePushNotification();
        }}>Send Notification</Button>
        <Button mode="elevated" onPress={onClickSignOut}>Log Out</Button>
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

async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here', test: { test1: 'more data' } },
      },
      trigger: { seconds: 2 },
    });
  }

async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    } 
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(token);
      } catch (e) {
        token = `${e}`;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }
  