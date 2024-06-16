import { useNavigation } from '@react-navigation/native';
import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio} from 'react-native';
    
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {getHeaderTitle} from "../../services/utils";
import {FocusedDrawerItemContext, SearchContext} from "../../context";
import styles from "./styles";
import {horizontalScale} from "../../theme/metrics";

function DashboardHeaderRight(){
    const navigation = useNavigation();

    const { searchState, setSearch, setSearchText } = useContext(SearchContext);
    const {setToDo, setNotifications, setScheduler, setProfile} = useContext(FocusedDrawerItemContext);

    useEffect(() => {

        if (searchState === false){
            setSearchText('');
        }

        navigation.setOptions(
            ({ route}) => ({
                headerTitle: getHeaderTitle(route, setToDo, setNotifications, setScheduler, setProfile, searchState),
            }));

    }, [searchState]);

    return (
        <TouchableOpacity style={{marginRight: horizontalScale(14)}} onPress={() => {
            setSearch(!searchState);
        }}>
            {searchState ?
                <Image style={styles.cancelIcon} source={require('../../../assets/icons8-cancel-100.png')} /> :
                <Image style={styles.searchIcon} source={require('../../../assets/icons8-search-90.png')} />
            }
        </TouchableOpacity>
    );
}

export default DashboardHeaderRight;