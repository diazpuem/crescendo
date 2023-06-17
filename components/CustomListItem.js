import { Avatar, Text } from 'react-native-paper';
import { Pressable, StyleSheet } from 'react-native';

import { ListItem } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';

const CustomListItem = ({ item, navigateTo, iconSource, deleteFunction}) => {
    const navigation = useNavigation();
    let source;
    if (iconSource) {
        source = iconSource
    } else {
        source = require('../assets/vynil.png')
    }
    const onPress = () => {
        if (navigateTo) {
            navigation.navigate(navigateTo, { id: item.id });
        } 
    }

    const onLongPress = () =>{
        if (deleteFunction) {
            deleteFunction(item.id, item.name);
        }
    }
    
    return(
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => pressed && styles.pressed}
        >
            <ListItem key={item.id}>
                <Avatar.Image size={24} source={source} />
                <ListItem.Content>
                <ListItem.Title> {item.name} </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressed: {
      opacity: 0.6,
    },
  });
  


export default CustomListItem;