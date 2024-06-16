import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio, Linking, Platform} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from "./styles";
import {horizontalScale} from "../../theme/metrics";
function EditProfileHeaderRight() {
    
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={{marginRight: horizontalScale(14)}} onPress={() => {
            navigation.navigate('EditProfile');
        }}>
            <Image style={styles.editIcon} source={require('../../../assets/icons8-edit-100.png')} />
        </TouchableOpacity>
    );
}

export default EditProfileHeaderRight;