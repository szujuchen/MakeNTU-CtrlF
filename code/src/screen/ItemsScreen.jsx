import { View, Text, SafeAreaView, ScrollView, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../utils/Color'
import ItemCard from '../component/ItemCard';
import { fireDB } from '../../backend';
import { updateDoc, doc, getDocs, orderBy, query, collection, where, increment, deleteDoc } from 'firebase/firestore';
import axios from 'axios';
import { server } from '../../backend'
import DefaultImage from '../utils/img0.jpg'


//first display objects with experience in threshold
//others display in time series
//const default_img = "https://firebasestorage.googleapis.com/v0/b/makentu-dc9b4.appspot.com/o/photos%2Fdefault.png?alt=media&token=95a4a2f2-9fd9-49af-a23b-6a019015734e";


const ItemsScreen = ({navigation, route}) => {
  const category = route.params.category;
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [back, setBack] = useState(true);
  const [removing, setRemoving] = useState(false);

  const fetchItems = async() => {
    const list = [];
    try{
      const q = await getDocs(query(collection(fireDB, 'items'), orderBy('time', 'desc'), where("category", "==", category)));
      q.forEach((doc) => {
        const {customname, yoloname, category, img, time, pos} = doc.data();
        list.push({
          id: doc.id,
          customname,
          yoloname,
          img: img === ''? Image.resolveAssetSource(DefaultImage).uri : img,
          category,
          time,
          pos
        })
      })
      setItems(list);
    }catch(e){
      console.log(e)
    }
  }

  //delete this
  const removeObj = async(item) => {
    if(items.includes(item)){
      const copy = items
      const index = copy.indexOf(item)
      setItems(copy.splice(index, 1))
    }
    try{
      await deleteDoc(doc(fireDB, "items", item.id));
    }catch(e){
      console.log(e)
    }
  }

  const updatehistory = async(category) => {
    const curHour = new Date().getHours()
    //console.log(curHour);
    var docRef;
    if(curHour >= 6 && curHour < 13){
      docRef = doc(fireDB, "history", "morning")
    }else if(curHour >= 13 && curHour < 18){
      docRef = doc(fireDB, "history", "afternoon")
    }else{
      docRef = doc(fireDB, "history", "evening");
    }

    await updateDoc(docRef, {
      [category]: increment(1)
    })
    .then(() => {
        //console.log("Document successfully updated!");
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
  }

  const removeRpi = async(item) => {
    if(item.pos === null){
      Alert.alert("this object is not in the shelf")
      setLoading(false);
      return
    }
    //console.log(item);
    await updatehistory(item.category);
    await removeObj(item);

    await axios.get(`http://${server}/takeStuff/${item.pos}`)
    .then(async function(response){
      //await removeObj(item);
      if(response.status === 200){
        //await removeObj(item);
        setLoading(false);
        setRemoving(false);
        Alert.alert("delivering to you")
        navigation.navigate("Take")
      }else{
        Alert.alert("error taking object");
        setRemoving(false);
        setLoading(false);
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
      //await removeObj(item);
      setLoading(false);
      setRemoving(false);
      // Alert.alert("error connecting to backend server");
      Alert.alert("delivering to you")
      navigation.navigate("Take")
      return;
    });
    // setLoading(false);
    // navigation.navigate("Take")
  }



  useEffect(() => {
    fetchItems()
    navigation.addListener("focus", () => setBack(!back));
  }, [navigation, back])

  useEffect(() => {
    if(items !== null && removing === false){
      //console.log(items)
      setLoading(false);
    }
  }, [items])

  return (
    <SafeAreaView style={{flex: 1}}>
    {loading? (
      <View style={styles.load}>
        <ActivityIndicator size="large"/>
      </View>
    ):(
      <View style={styles.container}>
        <Text style={styles.info}>
          This is the {category} shelf: 
        </Text>
        {items === null || items.length === 0? (
          <Text style={styles.noObj}>
            No object in this category.
          </Text>
        ):(
          <FlatList
            data={items}
            renderItem={({item}) => (
              <ItemCard
                img={item.img}
                title={item.customname}
                onPress={() => {
                  setLoading(true);
                  setRemoving(true);
                  removeRpi(item);
                }}
              />
            )}
            numColumns={2}
            keyExtractor={item => item.id}
            ListHeaderComponent={null}
            ListFooterComponent={null}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    )}
    </SafeAreaView>
  )
}

export default ItemsScreen

const styles = StyleSheet.create({
  load:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container:{
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  info:{
    fontSize: 25,
    marginBottom: 5,
  }, 
  subcontainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  noObj:{
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})