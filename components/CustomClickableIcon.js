import { Pressable, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const CustomClickableIcon = ({ icon, color, onPress, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Ionicons name={icon} size={24} color={color} style={style} />
    </Pressable>
  );
};

export default CustomClickableIcon;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
});
