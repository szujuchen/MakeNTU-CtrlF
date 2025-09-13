import { View, Text, StyleSheet, Button, SafeAreaView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../utils/Color';
import GeneralButton from '../component/GeneralButton';
import { Dropdown } from 'react-native-element-dropdown';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import { server } from '../../backend'
import { categories } from '../utils/categories';


const ReminderScreen = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("select category");
  const [pos, setPos] = useState(null);
  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const removeRpi = async(pos, settimer) => {
    var params = pos.toString()
    params = params.concat("_")
    params = params.concat(settimer.getFullYear())
    params = params.concat(":")
    params = params.concat((parseInt(settimer.getMonth()) + 1).toString())
    params = params.concat(":")
    params = params.concat(settimer.getDate())
    params = params.concat(":")
    params = params.concat(settimer.getHours())
    params = params.concat(":")
    params = params.concat(settimer.getMinutes())
    params = params.concat(":")
    params = params.concat(settimer.getSeconds())
    //console.log(params)
    await axios.get(`http://${server}/schedule/${params}`)
    .then(async function(response){
      if(response.status === 200){
        //await removeObj(item);
        // navigation.navigate("Take")
        Alert.alert(
          "Set a Reminder",
          `take ${category} at ${date.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}`,
        )
        navigation.goBack();
      }else{
        Alert.alert("error taking object");
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
      Alert.alert(
        "Set a Reminder",
        `take ${category} at ${date.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}`,
      )
      navigation.goBack();
      // return;
    });
  }

  const scheduleNotification = (settimer, diffseconds) => {
    const schedulingOptions = {
      content: {
        title: 'Taking Object notification',
        body: `It's the time to take some ${category} from shelf`,
        sound: true,
        data: {data: pos.toString()},
        // priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        seconds: diffseconds,
      },
    };
    //console.log(`notification set at ${diffseconds} after`)
    Notifications.scheduleNotificationAsync(schedulingOptions);
    removeRpi(pos, settimer);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor:Colors.background}}>
      <View style={styles.container}>
      <Text style={styles.title}>
        Choose a time
      </Text>
      <View style={styles.row}>
      <Text style={styles.time}>Date: </Text>
      <DateTimePicker
        testID="datePicker"
        value={date}
        mode="date"
        is24Hour={true}
        onChange={onChange}
        display="spinner"
        style={styles.datepicker}
      />
      </View>
      <View style={styles.row}>
      <Text style={styles.time}>Time: </Text>
      <DateTimePicker
        testID="timePicker"
        value={date}
        mode="time"
        is24Hour={true}
        onChange={onChange}
        display="spinner"
        // minuteInterval={10}
        style={styles.timepicker}
      />
      </View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={categories}
        maxHeight={200}
        labelField="label"
        valueField="label"
        placeholder="select category"
        value={category}
        onChange={item => {
            setCategory(item.label);
            setPos(item.pos);
        }}
      />
      <GeneralButton
        buttonTitle="Set Reminder"
        color={Colors.black}
        backgroundColor={Colors.lightgrey}
        aligned='center'
        onPress={() => {
          const cur = new Date();
          //console.log(date.toLocaleString())
          //console.log(cur.toLocaleString())
          if(category === null || category === "select category"){
            Alert.alert(
              "Choose a category"
            )
          }else  if(date < cur){
            Alert.alert(
              "Set the reminder after"
            )
          }else{
            scheduleNotification(date, (date.getTime()-cur.getTime())/1000)
            // navigation.goBack();
          }
        }}
        />
      {/* <Text>selected: {date.toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</Text> */}
      </View>
    </SafeAreaView>      
  )
}

export default ReminderScreen

const styles = StyleSheet.create({
  container:{
      flex: 1,
      // justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      backgroundColor: Colors.background,
  },
  title:{
    fontSize: 30,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 20,
    color: Colors.black,
  },
  datepicker:{
    height: 150,
  },
  timepicker:{
    height: 100,
  },
  dropdown: {
    marginTop: 10,
    marginBottom: 10,
    width: '90%',
    aspectRatio: 15,
    borderColor: Colors.darkgrey,
    borderWidth: 0.5,
    borderRadius: 5,
  },
  placeholderStyle: {
      fontSize: 20,
      marginLeft: 10,
  },
  selectedTextStyle: {
      fontSize: 20,
      marginLeft: 10,
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time:{
    fontSize: 20,
  }
})