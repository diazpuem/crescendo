import { StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import { AlphabeticalComparator } from "../util/Util";
import CustomClickableIcon from "../components/CustomClickableIcon";
import CustomList from "../components/CustomList";
import Toast from "react-native-root-toast";
import { UserContext } from "../context/UserContext";
import { deleteRehearsal } from "../db/fs-store";
import { setupRehearsalsListener } from "../db/fs-store";
import { useIsFocused } from "@react-navigation/native";

const RehearsalsScreen = ({ navigation }) => {
    const [rehearsals, setRehearsals] = useState([])
    
    const isFocused = useIsFocused();
    const userContext = useContext(UserContext);
    
    useEffect(() => {
        navigation.getParent().setOptions({
          headerRight: () => {
            if (userContext.user.userRole == 1) {
                return (
                    <CustomClickableIcon
                        icon="add"
                        onPress={() => navigation.navigate("AddRehearsal")}
                        size={24}
                        style={{ color: "#0041C3" , marginRight: 10 }}
                    />
                );
            }
          },
        });
    },[isFocused]);

    useEffect(() => {
        setupRehearsalsListener(userContext.user.bandCode, (items) => {
            setRehearsals(items.sort(AlphabeticalComparator));
        });
    }, []);

    onDelete = (rehearsalId, rehearsalName) => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to remove this rehearsal?",
            [
              {
                text: "Yes",
                onPress: () => {
                    deleteRehearsal(userContext.user.bandCode, rehearsalId, () =>{
                        Toast.show(`Deleted ${rehearsalName}!`, {
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
           <CustomList items= {rehearsals} iconSource= {require('../assets/drum-set.png')} navigateTo="RehearsalSummary" deleteFunction = {onDelete} />
        </View>
    );
};

export default RehearsalsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        textAlign: 'center',
    },
});