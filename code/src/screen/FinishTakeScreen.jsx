import { View, Text, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import GeneralButton from '../component/GeneralButton'
import axios from 'axios';
import { Colors } from '../utils/Color';
import { server } from '../../backend'

const FinishTakeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const finishRpi = async() => {
    await axios.get(`http://${server}/finish`)
    .then(async function(response){
      if(response.status === 200){
        setLoading(false);
        navigation.goBack()
      }else{
        Alert.alert("error connecting to the shelf");
        return;
      }
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }   
      console.log(error.config)
      // Alert.alert("error connecting to backend server");
      setLoading(false);
      navigation.goBack()
      return;
    });
    //navigation.goBack()
  }

  return (
    <SafeAreaView style={{flex:1}}>
    {loading? (
      <View style={styles.load}>
        <ActivityIndicator size="large" />
      </View>
    ):(
      <View style={styles.container}>
      <Text style={styles.textStyle}>Please press Okay after taking objects</Text>
      <GeneralButton 
          buttonTitle="Okay"
          color={Colors.black}
          backgroundColor={Colors.lightgrey}
          aligned='center'
          onPress={() => {
              setLoading(true);
              finishRpi();
          }}
      />
    </View>
    )
    }
    </SafeAreaView>
  )
}

export default FinishTakeScreen

const styles = StyleSheet.create({
  load:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container:{
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.background,
  },
  textStyle:{
    fontSize: 25,
    color: Colors.darkgrey,
    marginBottom: 8,
  },
})