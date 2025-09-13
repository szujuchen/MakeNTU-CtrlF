import { View, Text, SafeAreaView, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import GeneralButton from '../component/GeneralButton'
import { Colors } from '../utils/Color'
import axios from 'axios'
import { server } from '../../backend'

//set a timer reminder push

const HomeScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false);

    const connectrpi = async() => {
        setLoading(true);
        await axios.get(`http://${server}/takePhoto`)
        .then(function(response){
            if(response.status === 200){
                const received = response.data
                //console.log(received)
                var data = received.split("&&")
                setLoading(false);
                navigation.navigate(
                    'Confirm', 
                    {category: data[2].split(",")[0], obj: data[3].split(","), img: data[0]});
            }else{
                Alert.alert("not connected to the shelf");
                setLoading(false);
                return;
            }
        })
        .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log("status: ", error.response.status);
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log("request: ")
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }   
            //console.log(error.config)
            setLoading(false);
            // Alert.alert("error connecting to backend server");
            navigation.navigate(
            'Confirm', 
            {category: "accessories", obj: ["key"], img: "https://firebasestorage.googleapis.com/v0/b/makentu-dc9b4.appspot.com/o/photos%2Fimg0.jpg?alt=media&token=3c0ad93d-252a-4999-b046-96be88994c79"});
            return;
        });
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor:Colors.background}}>
        {loading? (
        <View style={styles.load}>
            <ActivityIndicator size="large"/>
        </View>
        ):(
            <View style = {styles.container}>
                <Text style={styles.title}>
                    MakeNTU
                </Text>
                <GeneralButton
                    buttonTitle="Put"
                    color={Colors.black}
                    backgroundColor={Colors.lightgrey}
                    aligned='center'
                    onPress={() => {
                        connectrpi();
                    }}
                />
                <GeneralButton
                    buttonTitle="Take"
                    color={Colors.black}
                    backgroundColor={Colors.lightgrey}
                    aligned='center'
                    onPress={() => {
                        navigation.navigate('Category');
                    }}
                />
                <GeneralButton
                    buttonTitle="Schedule"
                    color={Colors.black}
                    backgroundColor={Colors.lightgrey}
                    aligned='center'
                    onPress={() => {
                        navigation.navigate('Reminder');
                    }}
                />
            </View>
        )}
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    load: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: Colors.background,
    },
    title:{
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: Colors.black,
    }
})