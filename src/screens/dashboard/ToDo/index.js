
import styles from './styles';
import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio, Linking, Platform} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {AuthContext, SearchContext, TasksContext} from '../../../context';
import {showToast} from "../../../services/utils";
import {translate} from "../../../i18n/config";
import {verticalScale} from "../../../theme/metrics";
import {StatusBar} from 'expo-status-bar';
import colors from "../../../theme/colors";
import Task from "../../../components/Task";

function ToDo({ navigation, route }) {
    const [screenIsReady, setscreenIsReady] = useState(false);
    const {todayTasksListState, setTodayTasksList} = useContext(TasksContext)
    const { searchState, setSearch, searchTextState, setSearchText } = useContext(SearchContext);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

            // console.log('Route params: ', route.params);
            if (route.params !== undefined) {
                if (route.params.newTask === true) {
                    showToast('New Task Added');
                    navigation.setParams({
                        newTask: false,
                    });
                }
                if (route.params.editTask === true) {
                    showToast('Task Updated');
                    navigation.setParams({
                        editTask: false,
                    });
                }
            }
        });
        return unsubscribe;
    }, [navigation, route]);

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
                console.log('TO-DO Screen Null Rendered');
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
            console.log('todo screen hidesplash');
            await SplashScreen.hideAsync();
        }
    }, [screenIsReady]);

    function  handlecheckbox(item) {
        let todayTasksList = [...todayTasksListState];
        for (let i = 0; i < todayTasksList.length; i++) {
            if (item.key === todayTasksList[i].key) {
                if (todayTasksList[i].checked === false) {
                    todayTasksList[i].checked = true;
                } else {
                    todayTasksList[i].checked = false;
                }
            }
        }
        setTodayTasksList(todayTasksList);

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
                    <Text style={styles.headerText}>{translate("today's")}</Text>
                    <Text style={styles.headerText}>{translate("list")} —</Text>
                </View>
            </View>
            <View style={{flex:1, backgroundColor: colors.backgroundSecondary}}>
                <FlatList overScrollMode={"never"} style={styles.flatList}
                          contentContainerStyle={{paddingBottom: verticalScale(30)}}
                          data={todayTasksListState}
                          renderItem={ ({item}) => <Task item={item} searchState={searchState}
                                                         searchTextState={searchTextState}
                                                         handlecheckbox={handlecheckbox} /> }
                />
            </View>
            <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />

        </View>
    );
}

export default ToDo;