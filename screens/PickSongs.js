import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import { AlphabeticalComparator } from "../util/Util";
import { CheckBox } from "react-native-elements";
import { RehearsalContext } from "../context/RehearsalContext";
import { TextInput } from "react-native-paper";
import { UserContext } from "../context/UserContext";
import { getKeyName } from "../model/SongKeys";
import { setupSongsListener } from "../db/fs-store";

const PickSongs = ({ navigation }) => {
    const userContext = useContext(UserContext);
    const rehearsalContext = useContext(RehearsalContext);
    const [songs, setSongs] = useState([])


    const [state, setState] = useState({
        search: ""
    })
    
    const updateStateObject = (vals) => {
        setState({
            ...state,
            ...vals,
        });
    };
    
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
            setSongs(items.sort(AlphabeticalComparator));
        });
    }, []);
      
    return(
        <View style= {styles.container}>
            <View>
                <TextInput 
                    placeholder="Enter for Search a Song" 
                    onChangeText={(val) => updateStateObject({search: val})}
                    mode="outlined"
                />
            </View>
            <View>
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={songs}
                    renderItem={renderSongs}
                    extraData={songs}
                />
            </View>
        </View>
    );
};

export default PickSongs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: 'center'
    },
    text: {
        textAlign: 'center',
    },
    buttonStyle: {
        margin: 10,
        color: "blue",
    },
});