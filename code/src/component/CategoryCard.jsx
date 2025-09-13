import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { windowHeight, windowWidth } from '../utils/Dimension'
import { Colors } from '../utils/Color'

const CategoryCard = ({title, ...rest}) => {
    return (
        <TouchableOpacity 
            style={styles.container}
            {...rest}
        >
            <View style={styles.textWrapper}>
                <Text style={styles.text}>
                    {title}
                </Text>
            </View> 
        </TouchableOpacity>
    )
}

export default CategoryCard

const styles = StyleSheet.create({
    container:{
        marginHorizontal: 15,
        marginBottom: 10,
        width: windowWidth / 2.8,
        aspectRatio: 1,
        backgroundColor: Colors.lightgrey,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.black
    },
})