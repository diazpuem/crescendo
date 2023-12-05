import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";

import { CheckBox } from "react-native-elements";
import { RehearsalContext } from "../context/RehearsalContext";
import { UserContext } from "../context/UserContext";
import { getUserBandRoleName } from "../model/UserBandRoles";
import { setupMembersListener } from "../db/fb-store";

const PickMembers = () => {
    const userContext = useContext(UserContext);
    const rehearsalContext = useContext(RehearsalContext);
    const [members, setMembers] = useState([])
    const isChecked = (item) => {
        return rehearsalContext.rehearsal.members.includes(item);
    };

    const toggleItem = (item) => {
        if (isChecked(item)) {
            rehearsalContext.setRehearsalState({ members: rehearsalContext.rehearsal.members.filter(member => member.id !== item.id) });
        } else {
            rehearsalContext.setRehearsalState({ members: [...rehearsalContext.rehearsal.members, item]});
        }
      };

    const comparator = (item1, item2) => {
        return item1.name.toLowerCase() > item2.name.toLowerCase();
    };

    const renderMembers = ({ index, item }) => {
        return (
        <Pressable onPress={() => toggleItem(item)}>
            <CheckBox
            title={item.name + " - " + getUserBandRoleName(item.userBandRole)} 
            checked={isChecked(item)}
            onPress={() => {
                toggleItem(item);
            }}
          />
        </Pressable>
          
        );
    };

    useEffect(() => {
        setupMembersListener(userContext.user.bandCode, (items) => {
            setMembers(items.sort(comparator));
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

export default PickMembers;

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