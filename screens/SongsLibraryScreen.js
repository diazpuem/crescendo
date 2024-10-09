import { ALPHABETICAL_COMPARATOR, AlphabeticalComparator } from "../util/Util";
import { Alert, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import CustomClickableIcon from "../components/CustomClickableIcon";
import CustomList from "../components/CustomList";
import Toast from "react-native-root-toast";
import { UserContext } from "../context/UserContext";
import { deleteSong } from "../db/fs-store";
import { setupSongsListener } from "../db/fs-store";
import { useIsFocused } from "@react-navigation/native";

const SongsLibraryScreen = ({ navigation }) => {
    const [songs, setSongs] = useState([])
    
    const isFocused = useIsFocused();
    const userContext = useContext(UserContext);
    
    useEffect(() => {
        navigation.getParent().setOptions({
          headerRight: () => (
            <CustomClickableIcon
                icon="add"
                onPress={() => navigation.navigate("Add Song")}
                size={24}
                style={{ color: "#663399" , marginRight: 10 }}
            />
          ),
        });
    },[isFocused]);
    useEffect(() => {
        setupSongsListener(userContext.user.bandCode, (items) => {
          setSongs(items.sort(AlphabeticalComparator));
        });
    }, []);

    onDelete = (songId, songName) => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to remove this song?",
            [
              {
                text: "Yes",
                onPress: () => {
                    deleteSong(userContext.user.bandCode, songId, () =>{
                        Toast.show(`Deleted ${songName}!`, {
                            duration: Toast.durations.LONG,
                            animation: true,
                            hideOnPress: true,
                          });
                    });
                },
              },
              {
                text: "No",
              },
            ]
        );
    }; 
      
    return(
        <View style= {styles.container}>
           <CustomList items= {songs} deleteFunction={onDelete} />
        </View>
    );
};

export default SongsLibraryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    text: {
        textAlign: 'center',
    },
});