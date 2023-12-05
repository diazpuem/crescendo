import { FlatList, View } from 'react-native';

import CustomListItem from './CustomListItem';
import { getIconSource } from "../model/MusicianRequestState"

const CustomList = ({ items, iconSource, navigateTo, deleteFunction, customIcon}) => {
  const renderCustomListItem = ({ index, item }) => {
    if (customIcon) {
      iconSource = getIconSource(item.state)
    }
    return <CustomListItem item={item} iconSource={iconSource} navigateTo={navigateTo} deleteFunction={deleteFunction} />;
  };

  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        extraData={items}
        renderItem={renderCustomListItem}
      />
    </View>
  );
};

export default CustomList;
