import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { windowHeight, windowWidth } from '../utils/Dimension'
import { Colors } from '../utils/Color'
import DefaultImage from '../utils/img0.jpg'

const ItemCard = ({img, title, ...rest}) => {
    return (
        <View style={styles.container}>
            {/* replace with img */}
            <Image 
                style={styles.imgcontainer}
                source={{uri: img===''? Image.resolveAssetSource(DefaultImage).uri : img}}
            />
            <Text style={styles.obj}>
                {title}
            </Text>
            <TouchableOpacity 
                style={styles.triggerButton}
                {...rest}
            >
                <View style={styles.textWrapper}>
                    <Text style={styles.text}>
                        Get
                    </Text>
                </View> 
            </TouchableOpacity>
        </View>
    )
}

export default ItemCard

const styles = StyleSheet.create({
    container:{
        width: windowWidth / 2.8,
        marginHorizontal: 15,
        aspectRatio: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        marginVertical: 15,
    },
    imgcontainer:{
        width: '100%',
        aspectRatio: 1,
    },
    obj:{
        marginTop: 2,
        fontSize: 20,
        fontWeight: '500',
        color: Colors.black
    },
    triggerButton:{
        marginTop: 5,
        width: '100%',
        aspectRatio: 5,
        backgroundColor: Colors.lightlightgrey,
        borderColor: Colors.lightdarkgrey,
        borderWidth: 3,
        borderRadius: 10,
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.lightdarkgrey
    },
})