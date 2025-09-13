import { View, Text, SafeAreaView, ScrollView, StyleSheet, ActivityIndicator, TextInput, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../utils/Color'
import CategoryCard from '../component/CategoryCard'
import { fireDB } from '../../backend'
import { deleteDoc, collection, getDocs, getDoc, orderBy, query, updateDoc, doc, increment} from "firebase/firestore"; 
import ItemCard from '../component/ItemCard'
import filter from 'lodash.filter';
import axios from 'axios';
import { categories } from '../utils/categories'
import { server } from '../../backend'
import DefaultImage from '../utils/img0.jpg'
import SmallItemCard from '../component/SmallCard'

//const default_img = "https://firebasestorage.googleapis.com/v0/b/makentu-dc9b4.appspot.com/o/photos%2Fdefault.png?alt=media&token=95a4a2f2-9fd9-49af-a23b-6a019015734e";


const CategoryScreen = ({navigation}) => {
  const [searchValue, setSearchValue] = useState('');
  const [allItems, setItems] = useState(null);
  const [recommend, setRecommend] = useState(null);
  const [back, setBack] = useState(true);
  const [option, setOptions] = useState(0);
  const [display, setDisplayItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(false);

  const fetchItems = async() => {
    const list = [];
    try{
      const q = await getDocs(query(collection(fireDB, 'items'), orderBy('time', 'desc')));
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

  const fetchHistory = async() => {
    const curHour = new Date().getHours();
    var docRef;
    if(curHour >= 6 && curHour < 13){
      docRef = doc(fireDB, "history", "morning")
    }else if(curHour >= 13 && curHour < 18){
      docRef = doc(fireDB, "history", "afternoon")
    }else{
      docRef = doc(fireDB, "history", "evening");
    }
    const docSnap = await getDoc(docRef);
    const rank = docSnap.data();
    //console.log(rank);

    var items = Object.keys(rank).map(function(key) {
      return [key, rank[key]];
    });

    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    //exist user pattern
    list = []
    if(items[0][1] > 0 && allItems !== null){
      for(var i = 0; i < allItems.length; i++){
        if(allItems[i].category === items[0][0]){
          list.push(allItems[i])
        }
      }
    }

    if(list.length > 2){
      list = list.sort(() => Math.random() - Math.random()).slice(0, 3)
    }else if(list.length == 0 && allItems.length > 0){
      var copy = allItems
      list = copy.sort(() => Math.random() - Math.random()).slice(0, Math.min(allItems.length, 3))
    }
    setRecommend(list);
  }

  const search = (key) => {
    setSearchValue(key)
    if(key === ''){
      setOptions(0);
    }else if(allItems !== null && allItems.length === 0){
      setOptions(1);
      setDisplayItems([]);
    }else{
      setOptions(1);
      const formattedKey = key.toLowerCase();
      const filtered = filter(allItems, (item) => {
        return contains(item, formattedKey);
      });
      setDisplayItems(filtered);
    }
  }

  const contains = (item, key) => {
    var checked = item.customname.toLowerCase();
    if (checked.includes(key)){
      return true;
    }else{
      return false;
    }
  }

  const classify = (item, cat) => {
    var checked = item.category.toLowerCase();
    var category = cat.toLowerCase();
    if (checked === category){
      return true;
    }else{
      return false;
    }
  }

  const removeObj = async(item) => {
    if(allItems.includes(item)){
      const copy = allItems
      const index = copy.indexOf(item)
      setItems(copy.splice(index, 1))

      const copy2 = display
      const index2 = copy2.indexOf(item)
      setDisplayItems(copy2.slice(index2, 1))

      const copy3 = recommend
      const index3 = copy3.indexOf(item)
      setRecommend(copy3.slice(index3, 1))
    }

    try{
      await deleteDoc(doc(fireDB, "items", item.id));
    }catch(e){
      console.log(e)
    }
  }

  const updatehistory = async(category) => {
    const curHour = new Date().getHours()
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

  const removerpi = async(item) => {
    if(item.pos === null){
      Alert.alert("this object is not in the shelf")
      setLoading(false);
      return
    }

    await updatehistory(item.category);
    await removeObj(item);

    await axios.get(`http://${server}/takeStuff/${item.pos}`)
    .then(async function(response){
      if(response.status === 200){
        //await removeObj(item);
        setLoading(false);
        setRemoving(false);
        navigation.navigate("Take")
      }else{
        Alert.alert("error taking object");
        setLoading(false);
        setRemoving(false);
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
      setRemoving(false);
      navigation.navigate("Take")
      return;
    });

    //setLoading(false);
  }

  useEffect(() => {
    fetchItems();
    console.log(allItems)
    navigation.addListener("focus", () => setBack(!back));
  }, [navigation, back])

  useEffect(() => {
    if(allItems !== null){
      fetchHistory();
    }
  }, [allItems])

  useEffect(() => {
    if(recommend !== null && removing === false){
      setLoading(false);
      console.log(recommend);
      //console.log(recommend.length)
    }
  }, [recommend])


  return (
    <SafeAreaView style={{flex: 1}}>
    {loading? (
      <View style={styles.load}>
        <ActivityIndicator size="large" />
      </View>
    ):(
        <View style={styles.container}>
          <TextInput
            placeholder='Search Item'
            placeholderTextColor={Colors.darkgrey}
            clearButtonMode='always'
            style={styles.search}
            autoCapitalize='none'
            autoCorrect={false}
            value={searchValue}
            onChangeText={(query) => search(query)}
          />
          {recommend === null || recommend.length === 0 || option === 1? (
            <></>
          ): (
            <View style={styles.header}>
              <Text style={styles.rec}>Recommendation for you: </Text>
              <View style={styles.reccontainer}>
              {recommend.map((rec, i) => (
                  <SmallItemCard
                  key={rec.id}
                  img={rec.img}
                  title={rec.customname}
                  onPress={() => {
                    setLoading(true);
                    setRemoving(true);
                    removerpi(rec);
                  }}
                  />
              ))}
              </View>
            </View>
          )}
          {option === 0? (
            <FlatList
              data={categories}
              renderItem={({item}) => (
                <CategoryCard
                  title={item.label}
                  onPress={() => {
                    navigation.navigate(
                      'Item', 
                      {
                        category: item.label,
                        items: filter(allItems, (obj) => { return classify(obj, item.label); })
                      }
                    );
                  }}
                />
              )}
              numColumns={2}
              keyExtractor={category => category.label}
              ListHeaderComponent={null}
              ListFooterComponent={null}
              showsVerticalScrollIndicator={false}
            />
          ): (
            <FlatList
              data={display}
              renderItem={({item}) => (
                <ItemCard
                  img={item.img}
                  title={item.customname}
                  onPress={() => {
                    setLoading(true)
                    setRemoving(true);
                    removerpi(item)
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

export default CategoryScreen

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
    flex:1,
  },
  search:{
    width:'83%',
    aspectRatio: 12,
    borderWidth: 0.8,
    borderColor: Colors.darkgrey,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 18,
    marginBottom: 5,
  },
  rec:{
    fontSize: 18,
    marginVertical: 3,
  },
  reccontainer:{
    alignItems: 'flex-start',
    marginVertical: 3,
    flexDirection: 'row',
    //borderWidth: 0.5,
    //flex: 1,
    // backgroundColor: Colors.black,
  },
  header:{
    width: '80%',
    //backgroundColor: Colors.darkgrey,
    margin: 10,
  }
})