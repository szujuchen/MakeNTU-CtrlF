import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimension';
import { Colors } from '../utils/Color';

const Input = ({labelValue, placeholderText, ...rest}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor={Colors.lightgrey}
        {...rest}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    inputContainer: {
      marginTop: 10,
      marginBottom: 10,
      width: '90%',
      aspectRatio: 12,
      borderColor: Colors.darkgrey,
      borderWidth: 0.5,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      fontSize: 20,
      color: Colors.black,
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10,
    },
  });