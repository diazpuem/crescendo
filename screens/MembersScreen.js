import { Divider, Text } from "react-native-paper";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { getUserBandRoleIcon, getUserBandRoleName } from "../model/UserBandRoles";
import { useContext, useEffect, useState } from "react";

import { AlphabeticalComparator } from "../util/Util";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import { setupMembersListener } from "../db/fb-store";

const MembersScreen = ({ navigation }) => {
    const [members, setMembers] = useState([])
    const userContext = useContext(UserContext);
    
    const renderMembers = ({ index, item }) => {
        return (
        <Pressable >
            <View style={{ flexDirection: "row", margin: 10 , alignItems: 'center'}}>
            <Ionicons 
              name={getUserBandRoleIcon(item.userBandRole)}
              size={24}
              color="#DC2B6B"
              style={{
                  padding: 10,
              }}
            />
            <Text variant="titleMedium" style= {styles.text} > {item.name + " - " + getUserBandRoleName(item.userBandRole)}</Text>
            </View>
            <Divider/>
        </Pressable>
          
        );
    };
    
    useEffect(() => {
        setupMembersListener(userContext.user.bandCode, (items) => {
          setMembers(items.sort(AlphabeticalComparator));
        });
    }, []);

    
    return(
        <View style= {styles.container}>
           <FlatList
                keyExtractor={(item) => item.id}
                data={members}
                renderItem={renderMembers}
                extraData={members}
            />
        </View>
    );
};

export default MembersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    text: {
        textAlign: 'center',
    },
});