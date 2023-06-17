import { Avatar, Button, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import CustomClickableIcon from "../components/CustomClickableIcon";
import CustomDropdownPicker from "../components/CustomDropdownPicker";
import CustomInput from "../components/CustomInput";
import { SongKeysValues } from "../model/SongKeys";
import { UserContext } from "../context/UserContext";
import { saveNewSong } from "../db/fb-store";
import { useForm } from "react-hook-form";

export default function AddNewSong ({ navigation, route}){

  const userContext = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [videoName, setVideoName] = useState("Please select the video");
  const [videoId, setVideoId] = useState(null);
  //const isFocused = useIsFocused();
  
  useEffect(() => {
    if (route.params?.snippet.title) {
        setVideoName(route.params.snippet.title);
        setVideoId(route.params.id.videoId)
    }
  }, [route.params?.snippet])


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
  


  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();


  const onSubmit = (data) => {
    const video = {
        videoId: videoId,
        videoName: videoName
    };
    data.video = video;
    saveNewSong(data, userContext.user.bandCode, (responseMessage) => {
        alert(responseMessage);
        navigation.navigate("SongsLibrary");
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.formEntry}>
            <CustomInput
                name="name"
                placeholder="Enter the song name"
                control={control}
                rules={{required: 'The song name is required'}}
            />
        </View>
        <View style={[styles.formEntry, styles.comboFormEntry]}>
            <CustomDropdownPicker 
                control={control}
                name="key"
                rules={{required: 'Song key is required'}}
                placeholder="Please choose the song key"
                open = {open}
                setOpen= {setOpen}
                items = {SongKeysValues}
            />
        </View>
        <View style={styles.formEntry}>
            <CustomInput
                name="bpm"
                placeholder="Enter the BPM"
                control={control}
                rules={{required: 'The song name is required', maxLength:3}}
            />
        </View>
        <View style={[styles.formEntry, {flexDirection: "row" , alignItems: 'center', marginRight: 65, justifyContent:'space-between'}]}>
            <Avatar.Image size={35} source={require('../assets/youtube-logo.png')} />
            <Text variant="titleMedium">{videoName}</Text>
            <CustomClickableIcon
                icon="add"
                onPress={() => navigation.navigate("Browse Videos")}
                size={24}
                style={{ color: "#0041C3" , marginRight: 10 }}
            />
        </View>
        <Button
          onPress={handleSubmit(onSubmit)}
          mode="elevated"
          style={styles.button}
        >
          Save
        </Button>
      </View>
    </View>
  );


}

const styles = StyleSheet.create({
    button: {
      margin: 8,
      zIndex: 0
    },
    formEntry: {
      margin: 8,
      
    },
    comboFormEntry: {
      zIndex: 1000
    },
    container: {
      flex: 1,
    },
    progressBar: {
      marginBottom: 16,
      paddingHorizontal: 0,
    },
  });