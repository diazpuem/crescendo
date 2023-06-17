import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

import { CheckBox } from "react-native-elements";
import { RehearsalContext } from "../context/RehearsalContext";
import { UserContext } from "../context/UserContext";
import { getKeyName } from "../model/SongKeys";
import { setupSongsListener } from "../db/fb-store";

const PickSongs = ({ navigation }) => {
    const userContext = useContext(UserContext);
    const rehearsalContext = useContext(RehearsalContext);
    const [songs, setSongs] = useState([])
    
    const isChecked = (item) => {
        return rehearsalContext.rehearsal.songs.includes(item);
    };

    const toggleItem = (item) => {
        if (isChecked(item)) {
            rehearsalContext.setRehearsalState({ songs: rehearsalContext.rehearsal.songs.filter(member => member.id !== item.id) });
        } else {
            rehearsalContext.setRehearsalState({ songs: [...rehearsalContext.rehearsal.songs, item]});
        }
      };

    const comparator = (item1, item2) => {
        return item1.name.toLowerCase() > item2.name.toLowerCase();
    };

    const renderSongs = ({ index, item }) => {
        return (
        <Pressable onPress={() => toggleItem(item)}>
            <CheckBox
            title={item.name + " - " + getKeyName(item.key)} 
            checked={isChecked(item)}
            onPress={() => {
                toggleItem(item);
            }}
          />
        </Pressable>
          
        );
    };

    useEffect(() => {
        setupSongsListener(userContext.user.bandCode, (items) => {
            setSongs(items.sort(comparator));
        });
    }, []);
      
    return(
        <View style= {styles.container}>
           <FlatList
                keyExtractor={(item) => item.id}
                data={songs}
                renderItem={renderSongs}
                extraData={songs}
            />
        </View>
    );
};

export default PickSongs;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    text: {
        textAlign: 'center',
    },
    buttonStyle: {
        margin: 10,
        color: "blue",
    },
});