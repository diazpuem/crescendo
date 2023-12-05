import { Alert, StyleSheet } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { acceptMusicianRequest, getMusicianRequest, getRehearsalData } from "../db/fb-store";
import { useContext, useEffect, useState } from "react";

import CustomClickableIcon from "../components/CustomClickableIcon";
import { SummaryEntry } from "./ConfirmationScreen";
import Toast from "react-native-root-toast";
import { UserContext } from "../context/UserContext";
import { View } from "react-native";
import { getKeyName } from "../model/SongKeys";
import { getUserBandRoleName } from "../model/UserBandRoles"

export default function MusicianRequestSummary ({ route, navigation }) {
  const userContext = useContext(UserContext);

  const [musicianRequest, setMusicianRequest] = useState({ rehearsalId: "", bandName: "" , bandCode: 0, description: "", state: ""});
  const [rehearsal, setRehearsal] = useState({ name: "", rehearsalDate:0 , members: [], songs: []});

  useEffect(()=> {
    if (route.params?.id) {
      getMusicianRequest(route.params?.id, (data) => {
        setMusicianRequest(data);
        getRehearsalData(data.bandCode, data.rehearsalId, (rehearsalData) => {
          console.log("ESTO");
          console.log(rehearsalData);
          setRehearsal(rehearsalData);
        });
      });
    }
  }, [route.params?.id])

  
  const showLocation = () => {
    if (rehearsal.location) {
      navigation.navigate("Location", {location: rehearsal.location});
    }
  };

  function getMemberUser() {
    const user = userContext.user
    return {
        "bandCode": user.bandCode,
        "bandName": user.bandName,
        "userBandRole": user.userBandRole,
        "name": user.name
    }
  }


  function formatRehearsalMembers(rehearsal) {
    var members = [];
    for (const key of Object.keys(rehearsal.members)) {
      members.push(rehearsal.members[key].name + " - " + getUserBandRoleName(rehearsal.members[key].userBandRole)); 
    }
    return members.join("\n");
  }
  

  const confirmRequest = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to accept the musician request ",
      [
        {
          text: "Yes",
          onPress: () => {
              acceptMusicianRequest(musicianRequest, getMemberUser(), (response) => {
                  Toast.show(`Musician Request Accepted!`, {
                      duration: Toast.durations.LONG,
                      animation: true,
                      hideOnPress: true,
                    });
                  console.log("Respuesta:", response)
                    navigation.navigate("MusicianRequestScreen")
              });
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  useEffect(() => {
    navigation.getParent().setOptions({
      headerRight: () => (
        <CustomClickableIcon
            icon="arrow-back"
            onPress={() => navigation.goBack()}
            size={24}
            style={{ color: "#0041C3" , marginRight: 10 }}
        />
      ),
    });
  });
  
  return (
    <View style={styles.container}>
      <SummaryEntry name={musicianRequest.bandName} label={"Band Name"} />
      <SummaryEntry name={getUserBandRoleName(musicianRequest.bandRole)} label={"Band Role"} />
      <SummaryEntry name={musicianRequest.description} label={"Description"} />
      <SummaryEntry name={rehearsal.name} label={"Rehearsal name"} />
      <SummaryEntry name={new Date(rehearsal.rehearsalDate).toUTCString()} label={"Date"} />
      <View style={styles.locationView}>
        <Text variant="titleMedium">Location</Text>
        <Button
          onPress={showLocation}
          mode="elevated"
          style={styles.button}
        >
          Show
        </Button>
      </View>
      <Divider/>
      <View style={[{flexDirection: "row" , alignItems: 'center', marginRight: 65, justifyContent:'space-between', marginBottom: 8, marginTop: 8 }]}>
          <Text variant="titleMedium">Members</Text>
          <View style = {{flexDirection: "column", alignContent: 'center', alignItems: 'center'}}>
            <Text variant="titleSmall">{formatRehearsalMembers(rehearsal)}</Text>
          </View>
      </View>
      <Divider/>
      <View style={[{flexDirection: "row" , alignItems: 'center', marginRight: 65, justifyContent:'space-between', marginBottom: 8, marginTop: 8 }]}>
        <Text variant="titleMedium">Songs</Text>
        <View style = {{flexDirection: "column", alignContent: 'center', alignItems: 'center'}}>
            {rehearsal.songs.map((item)=> 
                <View key={item.id} style={[{flexDirection: "row" , alignItems: 'center'}]}>
                  <Text variant="titleSmall" >{item.name + " - " + getKeyName(item.key) + " - " + item.bpm + " BPM"}</Text>
                  <CustomClickableIcon
                      icon="play-circle"
                      onPress={() => navigation.navigate('Video Viewer', {videoId: item.video.videoId, lockedMode: true})}
                      size={24}
                      style={{ color: "#FF0000" , marginLeft: 10 }}
                  />
                </View>
            )}
        </View>
      </View>
      <Divider/>
      <Button
          onPress={confirmRequest}
          mode="elevated"
          style={styles.button}
          disabled = {userContext.user.bandCode == musicianRequest.bandCode || musicianRequest.state == 2}
        >
          Accept Request
        </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16 
  },
  button: {
    margin: 8,
    zIndex: 0,
  },
  locationView:{
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
  
});