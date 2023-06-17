import { FlatList, View } from 'react-native';

import CustomListItem from './CustomListItem';

const CustomList = ({ items, iconSource, navigateTo, deleteFunction}) => {
  const renderCustomListItem = ({ index, item }) => {
    return <CustomListItem item={item} iconSource={iconSource} navigateTo={navigateTo} deleteFunction={deleteFunction}/>;
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
