import { StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import CustomClickableIcon from "../components/CustomClickableIcon";
import CustomList from "../components/CustomList";
import { UserContext } from "../context/UserContext";
import { getUserBandRoleName } from "../model/UserBandRoles";
import { setupMusicianRequestListener } from "../db/fb-store";
import { useIsFocused } from "@react-navigation/native";

const MusicianRequestScreen = ({ navigation }) => {
    const [musicianRequests, setMusicianRequests] = useState([])
    
    const isFocused = useIsFocused();
    const userContext = useContext(UserContext);

    const comparator = (item1, item2) => {
        date1 = new Date(item1.date);
        date2 = new Date(item2.date);
        return date1.getTime() - date2.getTime()
    };
    
    useEffect(() => {
        navigation.getParent().setOptions({
          headerRight: () => {
            if (userContext.user.userRole == 1) {
                return (
                    <CustomClickableIcon
                        icon="add"
                        onPress={() => navigation.navigate("AddNewMusicianRequest")}
                        size={24}
                        style={{ color: "#0041C3" , marginRight: 10 }}
                    />
                );
            }
          },
        });
    },[isFocused]);

    useEffect(() => {
        setupMusicianRequestListener((items) => {
            formatMusicianRequests(items);
            setMusicianRequests(items.sort(comparator));
        });
    }, []);
      
    function formatMusicianRequests(items) {
        thing = items.forEach(element => {
            element.name = element.bandName + " - " + getUserBandRoleName(element.bandRole) + " - " + new Date(element.date).toLocaleDateString('en-US')
        });

        print(thing);
    }


    return (
        <View style= {styles.container}>
           <CustomList items= {musicianRequests} customIcon = {true} navigateTo="MusicianRequestSummary"/>
        </View>
    );
};

export default MusicianRequestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        textAlign: 'center',
    },
});
