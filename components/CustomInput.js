import {StyleSheet, Text, View} from 'react-native';

import {Controller} from 'react-hook-form';
import React from 'react';
import { TextInput } from 'react-native-paper';

const CustomInput = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
  keyboardType,
  editable,
  multiline
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View
            style={[
              styles.container,
              {borderColor: error ? '#663399' : '#e8e8e8'},
            ]}>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              style={styles.input}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              editable={editable}
              multiline = {multiline}
              mode = 'outlined'
            />
          </View>
          {error && (
            <Text style={{color: '#663399', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
  },
  input: {},
});

export default CustomInput;