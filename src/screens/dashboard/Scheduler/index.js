
import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio, Linking, Platform} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {AuthContext, SearchContext, TasksContext} from '../../../context';
import styles from "./styles";
import {translate} from "../../../i18n/config";
import {verticalScale} from "../../../theme/metrics";
import {StatusBar} from 'expo-status-bar';
import colors from "../../../theme/colors";
import Task from "../../../components/Task";

function Scheduler({ navigation, route }) {
    const [screenIsReady, setscreenIsReady] = useState(false);
    const {upcomingTasksListState, setUpcomingTasksList} = useContext(TasksContext)
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
                console.log('Scheduler Screen Null Rendered');
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

    function handlecheckbox(item) {
        let UpcomingTasksList = [...upcomingTasksListState];
        for (let i = 0; i < UpcomingTasksList.length; i++) {
            for (let j = 0; j < UpcomingTasksList[i].data.length; j++) {
                if (item.key === UpcomingTasksList[i].data[j].key) {
                    if (UpcomingTasksList[i].data[j].checked === false) {
                        UpcomingTasksList[i].data[j].checked = true;
                    } else {
                        UpcomingTasksList[i].data[j].checked = false;
                    }
                }
            }
        }

        setUpcomingTasksList(UpcomingTasksList);
    }

    if (!screenIsReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={(event) => {
            onLayoutDashboardView();
        }}>
            <View style={{ backgroundColor: colors.backgroundPrimary}}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{translate("upcoming")}</Text>
                    <Text style={styles.headerText}>{translate("tasks")} —</Text>
                </View>
            </View>
            <View style={{flex: 1, backgroundColor: colors.backgroundSecondary}}>
                <SectionList overScrollMode={"never"} style={styles.sectionList}
                             sections={upcomingTasksListState} contentContainerStyle={{paddingBottom: verticalScale(30)}}
                             renderItem={ ({item}) => <Task item={item} searchState={searchState}
                                                            searchTextState={searchTextState}
                                                            handlecheckbox={handlecheckbox} /> }
                             renderSectionHeader={({ section: { day, data } }) => {
                                 let month, weekday;
                                 if (day.getMonth() === 0) {
                                     month = 'Jan'
                                 } else if (day.getMonth() === 1) {
                                     month = 'Feb'
                                 } else if (day.getMonth() === 2) {
                                     month = 'Mar'
                                 } else if (day.getMonth() === 3) {
                                     month = 'Apr'
                                 } else if (day.getMonth() === 4) {
                                     month = 'May'
                                 } else if (day.getMonth() === 5) {
                                     month = 'Jun'
                                 } else if (day.getMonth() === 6) {
                                     month = 'Jul'
                                 } else if (day.getMonth() === 7) {
                                     month = 'Aug'
                                 } else if (day.getMonth() === 8) {
                                     month = 'Sep'
                                 } else if (day.getMonth() === 9) {
                                     month = 'Oct'
                                 } else if (day.getMonth() === 10) {
                                     month = 'Nov'
                                 } else if (day.getMonth() === 11) {
                                     month = 'Dec'
                                 }

                                 if (day.getDay() === 0) {
                                     weekday = 'Sun'
                                 } else if (day.getDay() === 1) {
                                     weekday = 'Mon'
                                 } else if (day.getDay() === 2) {
                                     weekday = 'Tue'
                                 } else if (day.getDay() === 3) {
                                     weekday = 'Wed'
                                 } else if (day.getDay() === 4) {
                                     weekday = 'Thu'
                                 } else if (day.getDay() === 5) {
                                     weekday = 'Fri'
                                 } else if (day.getDay() === 6) {
                                     weekday = 'Sat'
                                 }

                                 let disp;
                                 let count = 0;

                                 if (searchState === true) {
                                     for (let i = 0; i < data.length; i++) {
                                         if (data[i].task.toLowerCase().indexOf(searchTextState.toLowerCase().trim()) !== -1) {
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

                                 return (<Text style={[styles.date, {display: disp}]}>{weekday}, {month} {day.getDate()}, {day.getFullYear()}</Text>);
                             }}
                />
            </View>
            <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />

        </View>
    );
}

export default Scheduler;