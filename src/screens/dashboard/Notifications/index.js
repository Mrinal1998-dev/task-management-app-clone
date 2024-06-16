import styles from './styles';
import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio, Linking, Platform} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AuthContext, SearchContext} from '../../../context';
import * as SplashScreen from 'expo-splash-screen';
import {translate} from "../../../i18n/config";
import {horizontalScale} from "../../../theme/metrics";
import {StatusBar} from 'expo-status-bar';
import colors from "../../../theme/colors";


const DATA2 = [
    {
        key: '1',
        day: "Today",
        data: [{
            key: '1',
            alert: "Hooray! You have completed all the tasks for today."
        },{
            key: '2',
            alert: "A new update is available! Go to Play Store",
        }]
    },
    {
        key: '2',
        day: "Yesterday",
        data: [{
            key: '1',
            alert: "Hooray! You have completed all the tasks for today",
        },{
            key: '2',
            alert: "You missed one task yesterday",
        }]
    },
    {
        key: '3',
        day: "Tue, Aug 1, 2017",
        data: [{
            key: '1',
            alert: "You missed one task yesterday",
        }]
    }
];


function Notifications({ navigation, route }) {

    const [screenIsReady, setscreenIsReady] = useState(false);
    const { searchState, setSearch, searchTextState, setSearchText } = useContext(SearchContext);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            
            setSearch(false);
            setSearchText('');

        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        async function prepare() {
            try {
                console.log('Notifications Screen Null Rendered');
                // Artificially delay for two seconds to simulate a slow loading
                // experience.
                // await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the screen to render
                setscreenIsReady(true);
            }
        }
        prepare();
    }, []);

    const onLayoutDashboardView = useCallback(async () => {
        if (screenIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setscreenIsReady`, then we may see a blank screen while the screen is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            console.log('hidesplash');
            await SplashScreen.hideAsync();
        }
    }, [screenIsReady]);

    if (!screenIsReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={(event) => {
            onLayoutDashboardView();
        }}>
            <View style={{ backgroundColor: colors.backgroundPrimary}}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{translate("alerts")} {translate("&")}</Text>
                    <Text style={styles.titleText}>{translate("updates")} —</Text>
                </View>
            </View>
            <View style={{flex: 1, backgroundColor: colors.backgroundSecondary}}>
                <SectionList style={{marginLeft: horizontalScale(40), paddingRight: horizontalScale(14)}}
                             sections={DATA2}
                             renderItem={({ item }) => {
                                 let disp;
                                 if (searchState === true) {
                                     if (item.alert.toLowerCase().indexOf(searchTextState.toLowerCase().trim()) === -1) {
                                         disp = 'none';
                                     } else {
                                         disp = 'flex';
                                     }
                                 } else {
                                     disp = 'flex';
                                 }
                                 return (
                                     <View style={[ styles.itemContainer , {display:disp}]}>
                                     <View style={styles.infoIconContainer}>
                                         <Image style={styles.infoIcon} source={require('../../../../assets/icons8-information-90.png')} />
                                     </View>
                                     <Text style={styles.itemText}>{item.alert}</Text>
                                 </View>
                                 );
                             }}
                             renderSectionHeader={({ section: { day, data } }) => {

                                 let disp;
                                 let count = 0;

                                 if (searchState === true) {
                                     for (let i = 0; i < data.length; i++) {
                                         if (data[i].alert.toLowerCase().indexOf(searchTextState.toLowerCase().trim()) !== -1) {
                                             count++;
                                         }
                                     }
                                     if (count === 0) {
                                         disp = 'none';
                                     } else {
                                         disp = 'flex';
                                     }
                                 } else {
                                     disp = 'flex';
                                 }

                                 return (<Text style={[styles.sectionheader, {display: disp}]}>{day}</Text>);
                             }}
                />
            </View>
            <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />

        </View>
    );
}

export default Notifications;