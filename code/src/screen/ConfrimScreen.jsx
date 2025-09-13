import { View, Text, SafeAreaView, StyleSheet, Alert, ScrollView, ActivityIndicator, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../utils/Color'
import GeneralButton from '../component/GeneralButton'
import { Dropdown } from 'react-native-element-dropdown';
import { windowHeight, windowWidth } from '../utils/Dimension';
import Input from '../component/Input';
import { fireDB } from '../../backend';
import { collection, addDoc } from "firebase/firestore";
import axios from 'axios';
import DefaultImage from '../utils/img0.jpg'
import { categories } from '../utils/categories';
import { server } from '../../backend'



const ConfrimScreen = ({navigation, route}) => {
    const [category, setCategory] = useState(route.params.category);
    const [all_obj, setAllObj] = useState(route.params.obj.map((object, i) => ({ customname: object, yoloname: object, ind: i })))
    const [customs, setCustoms] = useState(route.params.obj)
    const [img, setImg] = useState(route.params.img);
    const [pos, setPos] = useState(null);
    const [loading, setLoading] =useState(false);
    const [update, setUpdate] = useState(false);
    
    const storeObject = async(objects) => {
        for (let i = 0; i < objects.length; i++) {
            //console.log(objects[i]);

            if(objects[i].customname === null || objects[i].customname === ""){
                Alert.alert(
                    `Fill in the object${objects[i].ind} name`,
                    'The object name has to be at least one character.',
                );
                return;
            }
        }

        var poses = categories.filter(item => item.label === category).map(item => item.pos)
        //console.log("decide pos: ", poses);
        setPos(poses[0])

        for (let i = 0; i < objects.length; i++) {
            try{
                await addDoc(collection(fireDB, 'items'), {
                    customname: objects[i].customname,
                    yoloname: objects[i].yoloname,
                    category: category,
                    time: new Date(),
                    pos: poses[0],
                    img: img,
                })
            }catch(e){
                console.log(e);
            }
        }
    }

    const storeRpi = async() => {
        //console.log(pos)
        await axios.get(`http://${server}/putStuff/${pos}`)
        .then(async function(response){
            if(response.status === 200){
                setLoading(false);
                Alert.alert("Your object has been put into the shelf.")
                navigation.goBack();
                return;
            }else{
                setLoading(false);
                Alert.alert("error storing object");
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
            Alert.alert("Your object has been put into the shelf.")
            navigation.goBack();
            return;
        });
    }

    useEffect(() => {
        if(pos !== null){
            storeRpi();
        }
    }, [pos])

    return (
        <SafeAreaView style={{flex: 1}}>
        {loading? (
            <View style={styles.load}>
            <ActivityIndicator size="large" />
        </View>
        ):(
        <ScrollView style={styles.scroll}>
            <View style={styles.container}>
                <Text style={styles.textStyle}>
                    Below is the generated classification:
                </Text>
                <Text style={styles.textStyle}>
                    You can modify from the list below and press confirm.
                </Text>
                <Image 
                    style={styles.imgcontainer}
                    source={{uri: img===''? Image.resolveAssetSource(DefaultImage).uri : img}}
                />
                
                <View style={styles.label}>
                <Text style={styles.textStyle}>Category: </Text>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    data={categories}
                    maxHeight={200}
                    labelField="label"
                    valueField="label"
                    placeholder="select category"
                    value={category}
                    onChange={item => {
                        setCategory(item.label);
                    }}
                />
                </View>
                {
                    all_obj.map((single_obj) => (
                        <View style={styles.label} key={single_obj.ind}>
                        <Text style={styles.textStyle}>Object {single_obj.ind}: </Text>
                        <Input 
                            labelValue={single_obj.customname}
                            onChangeText={(customname) =>{
                                //console.log(customname);
                                //single_obj.customname = customname;
                                // var modified_name = customs
                                // modified_name[single_obj.ind] = customname
                                // setCustoms(modified_name);
                                var modified = all_obj.map((x) => x);
                                modified[single_obj.ind].customname = customname
                                setAllObj(modified);
                                setUpdate(!update);
                            }}
                            placeholderText="name"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        </View>
                    ))
                }
                <GeneralButton 
                    buttonTitle="Confirm"
                    color={Colors.black}
                    backgroundColor={Colors.lightgrey}
                    aligned='center'
                    onPress={() => {
                        setLoading(true);
                        storeObject(all_obj);
                    }}
                />
            </View>
        </ScrollView>
        )}  
        </SafeAreaView>
    )
}

export default ConfrimScreen

const styles = StyleSheet.create({
    load: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scroll:{
        backgroundColor: Colors.background,
    },
    container:{
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    textStyle:{
        fontSize: 22,
        color: Colors.darkgrey,
    },
    dropdown: {
        marginTop: 10,
        marginBottom: 10,
        width: '90%',
        aspectRatio: 12,
        borderRadius: 5,
        borderBottomColor: Colors.darkgrey,
        borderWidth: 0.5,
        fontSize: 18,
    },
    placeholderStyle: {
        fontSize: 18,
        marginLeft: 10,
    },
    selectedTextStyle: {
        fontSize: 20,
        marginLeft: 10,
    },
    imgcontainer:{
        width: windowWidth/3.5,
        aspectRatio: 1,
        marginVertical: 5,
    },
    label:{
        marginTop: 5,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    }
})