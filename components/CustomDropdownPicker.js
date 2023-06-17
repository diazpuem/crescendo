import {StyleSheet, Text, View} from 'react-native';

import {Controller} from 'react-hook-form';
import DropDownPicker from "react-native-dropdown-picker";
import React from 'react';

const CustomDropdownPicker = ({
    control,
    name,
    rules = {},
    placeholder,
    open,
    setOpen,
    items
}) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field: { onChange, value }, fieldState: {error} }) => ( 
                <>
                    <View
                        style={[
                        styles.container,
                        {borderColor: error ? 'red' : '#e8e8e8'},
                        ]}>
                        <DropDownPicker
                            placeholder={placeholder}
                            open = {open}
                            setOpen={setOpen}
                            items = {items}
                            value = {value}
                            setValue={(item) => onChange(item())}
                            zIndex={3000}
                        />
                    </View>
                    {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                    </>
                )}
          />
    );
};

const styles = StyleSheet.create({
    container: {
      width: '100%',
  
      borderColor: '#e8e8e8',
      borderWidth: 1,
      borderRadius: 5,
  
      paddingHorizontal: 10,
      marginVertical: 5,
    },
  });

export default CustomDropdownPicker;