import 'react-native-gesture-handler';

import React, { useState } from 'react';

import AddNewMusicianRequest from './screens/AddNewMusicianRequest';
import AddNewRehearsal from './screens/AddNewRehearsal';
import AddNewSong from './screens/AddNewSong';
import ConfirmationScreen from './screens/ConfirmationScreen';
import  HomeScreen  from './screens/Home'
import { Ionicons } from '@expo/vector-icons';
import  LoginScreen  from './screens/Login'
import MembersScreen from './screens/MembersScreen';
import MusicianRequestScreen from './screens/MusicianRequestScreen';
import MusicianRequestSummary from './screens/MusicianRequestSummary';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import PickMembers from './screens/PickMembers';
import PickSongs from './screens/PickSongs';
import RehearsalContextProvider from './context/RehearsalContext';
import RehearsalLocationPicker from './screens/RehearsalLocationPicker';
import RehearsalSummary from './screens/RehearsalSummary';
import RehearsalsScreen from './screens/RehearsalsScreen';
import  SignUpScreen  from './screens/SignUp'
import SongsLibraryScreen from './screens/SongsLibraryScreen';
import Step1Screen  from "./screens/Step1Screen";
import Step2aScreen from './screens/Step2aScreen';
import Step2bScreen from './screens/Step2bScreen';
import { StyleSheet } from 'react-native';
import UserContextProvider from './context/UserContext';
import VideoListScreen from './screens/VideoListScreen';
import YTViewerScreen from './screens/YTViewerScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from "firebase/auth";
import { initCrescendoApp } from './db/fb-store';

export default function App() {
  const app = initCrescendoApp();
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const auth = getAuth(app);
  auth.onAuthStateChanged((user) => {
    if (user != null) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false);
    }
  });

  function Home() {
    return (
      <Drawer.Navigator>
          <Drawer.Screen name="HomePage" component={HomeScreen}
            options={{ 
              title: 'Home', 
              drawerIcon: ({color, size}) => 
              (
                <Ionicons name="home" color={color} size={size}/>
              ),
            }}
          />
          <Drawer.Screen name="SongsLibraryStack" component={SongLibraryStack}
            options={{ 
              title: 'Songs Library', 
              drawerIcon: ({color, size}) =>
              (
                <Ionicons name="musical-notes" color={color} size={size}/>
              ),
            }}
          />
          <Drawer.Screen name="RehearsalStack" component={RehearsalStack}
            options={{ 
              title: 'Rehearsals', 
              drawerIcon: ({color, size}) => 
              (
                <Ionicons name="calendar" color={color} size={size}/>
              ),
            }}
          /> 
          <Drawer.Screen name="MembersScreen" component={MembersScreen}
            options={{ 
              title: 'Members', 
              drawerIcon: ({color, size}) => 
              (
                <Ionicons name="people" color={color} size={size}/>
              ),
            }}
          />
          <Drawer.Screen name="MusicianRequestStack" component={MusicianRequestStack}
            options={{ 
              title: 'Musician Requests', 
              drawerIcon: ({color, size}) => 
              (
                <Ionicons name="person-add" color={color} size={size}/>
              ),
            }}
          />
      </Drawer.Navigator>
    );
  };

  function SongLibraryStack() {
    return(
      <Stack.Navigator screenOptions={
        {
          headerShown: false
        }
      }>
        <Stack.Screen name="SongsLibrary" component={SongsLibraryScreen}/>
        <Stack.Screen name="Add Song" component={AddNewSong}/>
        <Stack.Screen
          name='Browse Videos'
          component={VideoListScreen}
        />
        <Stack.Screen
          name='Video Viewer'
          component={YTViewerScreen}
          options={{
            title: '',
          }}
        />
      </Stack.Navigator>
    );
  }

  function RehearsalStack() {
    return(
      <RehearsalContextProvider>
        <Stack.Navigator screenOptions={
          {
            headerShown: false
          }
        }>
          <Stack.Screen name="RehearsalsList" component={RehearsalsScreen} 
            options={{
              title: 'Rehearsals'
            }}
          />
          <Stack.Screen name="AddRehearsal" component={AddNewRehearsal}
            options={{
              title: 'Add new rehearsal'
            }}
          />
          <Stack.Screen name="PickMembers" component={PickMembers}
            options={{
              title: 'Pick members'
            }}
          />
          <Stack.Screen name="PickSongs" component={PickSongs}
            options={{
              title: 'Pick songs'
            }}
          />
          <Stack.Screen name="Location" component={RehearsalLocationPicker}
            options={{ 
              title: 'Location'
            }} /> 
          <Stack.Screen name="RehearsalSummary" component={RehearsalSummary}
            options={{ 
              title: 'Location'
            }} /> 
          <Stack.Screen name='Video Viewer'component={YTViewerScreen}
            options={{
              title: '',
            }}
        />
        </Stack.Navigator>
      </RehearsalContextProvider>
    );
  }

  function MusicianRequestStack() {
    return(
      <Stack.Navigator screenOptions={
        {
          headerShown: false
        }
      }>
        <Stack.Screen name="MusicianRequestScreen" component={MusicianRequestScreen} 
          options={{
            title: 'Musician Requests'
          }}
        />
        <Stack.Screen name="AddNewMusicianRequest" component={AddNewMusicianRequest}
          options={{
            title: 'Add new Musician Request'
          }}
        />
        <Stack.Screen name="MusicianRequestSummary" component={MusicianRequestSummary}
          options={{
            title: 'Summary'
          }}
        />
        <Stack.Screen name="Location" component={RehearsalLocationPicker}
            options={{ 
              title: 'Location'
            }} 
        /> 
      </Stack.Navigator>
    );
  }
    return (
      <UserContextProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {isLoggedIn ? (
                  <Stack.Screen name="Home" component={Home} options={{ headerShown : false}}/> ) 
                : (
                  <>
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Sign Up" component={SignUpScreen} />
                    <Stack.Screen name="Step 1" component={Step1Screen} />
                    <Stack.Screen name="Step 2a" component={Step2aScreen} />
                    <Stack.Screen name="Step 2b" component={Step2bScreen} />
                    <Stack.Screen name="Confirmation" component={ConfirmationScreen}/>
                  </>
                )
              }
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </UserContextProvider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
