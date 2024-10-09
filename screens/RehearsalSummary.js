import { Button, Divider, Text } from "react-native-paper";
import { useContext, useEffect, useState } from "react";

import CustomClickableIcon from "../components/CustomClickableIcon";
import { StyleSheet } from "react-native";
import { SummaryEntry } from "./ConfirmationScreen";
import { UserContext } from "../context/UserContext";
import { View } from "react-native";
import { getKeyName } from "../model/SongKeys";
import { getRehearsalData } from "../db/fs-store";
import { getUserBandRoleName } from "../model/UserBandRoles";

export default function RehearsalSummary ({ route, navigation }) {
  const userContext = useContext(UserContext);
  const [rehearsal, setRehearsal] = useState({ name: "", rehearsalDate:0 , members: [], songs: []});
  useEffect(()=>{
    if (route.params?.id) {
      getRehearsalData(userContext.user.bandCode, route.params?.id, (data) => {
        setRehearsal(data);
      });
    }
  }, [route.params?.id])

  
  const showLocation = () => {
    if (rehearsal.location) {
      navigation.navigate("Location", {location: rehearsal.location});
    }
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

  function formatRehearsalMembers(rehearsal) {
    var members = [];
    for (const key of Object.keys(rehearsal.members)) {
      members.push(rehearsal.members[key].name + " - " + getUserBandRoleName(rehearsal.members[key].userBandRole)); 
    }
    return members.join("\n");
  }
  
  return (
    <View style={styles.container}>
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