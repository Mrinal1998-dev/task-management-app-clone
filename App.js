import 'react-native-gesture-handler';

import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio, Linking, Platform} from 'react-native';
import React, { useCallback, useEffect, useState, useMemo } from 'react';

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

//Toast Cross Platform
import { RootSiblingParent } from 'react-native-root-siblings';

import authReducer from './src/reducers/authReducer';
import {
    AuthContext,
    SearchContext,
    LoaderContext,
    FocusedDrawerItemContext,
    UserContext, TasksContext
} from './src/context';
import RootNavigation from './src/navigation/root/root';
import bootstrapAsync from './src/services/auth';
import { signIn, signOut } from './src/actions/authActions';
import { persistState } from './src/services/utils';
import { consoleWindowWidth, extractFirstName, fetchLoggedInUserTasks, convertDateStringtoObj, lockScreenOrientationToPotrait } from './src/services/utils';
import {horizontalScale, verticalScale} from "./src/theme/metrics";
import styles from "./styles";
import colors from "./src/theme/colors";

// @refresh reset
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

export default function App() {
    const [isReady, setIsReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState();

    const {height, width} = useWindowDimensions();
    // consoleWindowWidth(width);

    lockScreenOrientationToPotrait();

    const [authstate, dispatch] = React.useReducer(authReducer,
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );


    const [loggedInNameState, setLoggedInName] = useState(null);
    const [loggedInFirstNameState, setLoggedInFirstName] = useState(null);
    const [loggedInEmailState, setLoggedInEmail] = useState(null);

    const [loggedInUserTasksState, setLoggedInUserTasks] = useState(null);
    const [todayTasksListState, setTodayTasksList] = useState([]);
    const [upcomingTasksListState, setUpcomingTasksList] = useState([]);

    const [loader, setLoader] = useState(false);

    const showLoader = useCallback(() => {
        setLoader(true);
    }, []);

    const hideLoader = useCallback(() => {
        setLoader(false);
    }, []);

    const loaderContextValue = useMemo(() => ({
        showLoader,
        hideLoader
    }), [showLoader, hideLoader]);

    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        bootstrapAsync(dispatch, setLoggedInName, setLoggedInEmail, setLoggedInUserTasks,
            setLoggedInFirstName, setTodayTasksList, setUpcomingTasksList );
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async (email, password, setDisabled) => {
                // In a production app, we need to send some data (usually email, password) to server and get a token
                // We will also need to handle errors if sign in failed
                // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
                // In the example, we'll use a dummy token
                let database;
                try {
                    database = await SecureStore.getItemAsync('candy_user_database');
                } catch (e) {
                    console.log(e);
                }
                if (database == null) {
                    console.log('Database does not exist');
                    Alert.alert('Cannot find an account with this email');
                    setDisabled(false);
                    hideLoader();
                } else {
                    database = JSON.parse(database);
                    console.log('Candy User Database: ', database);
                    let k = 0;
                    let user;
                    for (let i = 0; i < database.length; i++) {
                        if (database[i].email === email) {
                            user = database[i];
                            k++;
                        }
                    }
                    if (k === 1) {
                        if (user.password === password) {
                            let loggedInName, loggedInEmail;
                            for (let i = 0; i < database.length; i++) {
                                if (database[i].email === email) {
                                    database[i].usertoken = 'dummy-auth-token';
                                    setLoggedInName(database[i].fullName);
                                    loggedInName = database[i].fullName;
                                    setLoggedInEmail(database[i].email);
                                    loggedInEmail = database[i].email;
                                }
                            }
                            setLoggedInFirstName(extractFirstName(loggedInName));
                            database = JSON.stringify(database);
                            let updateDatabase;
                            try {
                                updateDatabase = await SecureStore.setItemAsync('candy_user_database', database);
                                fetchLoggedInUserTasks(loggedInEmail, setLoggedInUserTasks, setTodayTasksList, setUpcomingTasksList);
                                setDisabled(false);
                                hideLoader();
                                dispatch(signIn());
                            }catch (e) {
                                console.log(e);
                                setDisabled(false);
                                hideLoader();
                            }
                        } else {
                            console.log('Please enter the correct password');
                            Alert.alert('Incorrect Password');
                            setDisabled(false);
                            hideLoader();
                        }
                    } else {
                        console.log('This email does not exist');
                        Alert.alert('Cannot find an account with this email')
                        setDisabled(false);
                        hideLoader();
                    }
                }
            },
            signOut: async () => {
                let database;
                try {
                    database = await SecureStore.getItemAsync('candy_user_database');
                } catch (e) {
                    console.log(e);
                }
                database = JSON.parse(database);
                console.log('Candy User Database: ', database);
                for (let i = 0; i < database.length; i++) {
                    if (database[i].usertoken === 'dummy-auth-token') {
                        database[i].usertoken = '';
                    }
                }
                database = JSON.stringify(database);
                let updateDatabase;
                try {
                    updateDatabase = await SecureStore.setItemAsync('candy_user_database', database);
                    setLoggedInName(null);
                    setLoggedInFirstName(null);
                    setLoggedInEmail(null);
                    setLoggedInUserTasks(null);
                    setTodayTasksList([]);
                    setUpcomingTasksList([]);
                    hideLoader();
                    dispatch(signOut())
                } catch (e) {
                    console.log(e);
                    hideLoader();
                }
            },
            register: async (fullName, email, password, confirmpassword, navigation, setDisabled) => {
                let database;
                let k = 0;
                try {
                    database = await SecureStore.getItemAsync('candy_user_database');
                } catch (e) {
                    console.log(e);
                }

                if (database == null) {
                    database = [];
                } else {
                    database = JSON.parse(database);
                }

                console.log('Candy User Database: ', database);
                if (password === confirmpassword) {
                    for (let i = 0; i < database.length; i++) {
                        if (database[i].email === email) {
                            k++;
                        }
                    }
                    if (k === 0) {
                        database.push({
                            fullName: fullName,
                            email: email,
                            password: password,
                            usertoken: ''
                        });
                        let taskDatabase;
                        try{
                            taskDatabase = await AsyncStorage.getItem('task_database');
                            if (taskDatabase == null) {
                                taskDatabase = [];
                            } else {
                                taskDatabase = JSON.parse(taskDatabase);
                                taskDatabase = convertDateStringtoObj(taskDatabase);
                            }
                            taskDatabase.push({
                                email: email,
                                tasks: []
                            });
                            taskDatabase = JSON.stringify(taskDatabase);
                            let updatetaskDatabase;
                            try {
                                updatetaskDatabase = await AsyncStorage.setItem('task_database', taskDatabase);
                            } catch (e) {
                                console.log(e);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        database = JSON.stringify(database);
                        let updateDatabase;
                        try {
                            updateDatabase = await SecureStore.setItemAsync('candy_user_database', database);
                            setDisabled(false);
                            hideLoader();
                            navigation.navigate('Login', { newAccount: true });
                        } catch (e) {
                            console.log(e);
                            Alert.alert('Account creation failed. Try again.');
                            setDisabled(false);
                            hideLoader();
                        }
                    } else {
                        Alert.alert('Account with this email id already exists');
                        setDisabled(false);
                        hideLoader();
                    }
                } else{
                    Alert.alert('Password and the Confirmed password do not match');
                    setDisabled(false);
                    hideLoader();
                }
            },
            deleteDatabase: async () => {
                let deletedatabase, deletetaskDatabase;
                try {
                    deletedatabase = await SecureStore.deleteItemAsync('candy_user_database');
                    deletetaskDatabase = await AsyncStorage.removeItem('task_database');
                    Alert.alert('Databases deleted successfully');
                    hideLoader();
                } catch (e) {
                    console.log('Error');
                    Alert.alert('Database deletion failed. Try again.');
                    hideLoader();
                }
            },
        }),
        []
    );

    React.useEffect(() => {
        // State Persistence
        // console.log('Is ready: ', isReady);
        if (!isReady) {
            persistState(PERSISTENCE_KEY, setInitialState, setIsReady);
        }
    }, [isReady]);

    if (authstate.isLoading || !isReady) {
        // console.log('Showing Activity Indicator');
        return <ActivityIndicator size={"large"} color={colors.backgroundPrimary} style={styles.activityIndicator} />;
    } else {
        // console.log('Showing the screen accordingly');
        return (
            <RootSiblingParent>
              <SafeAreaProvider>
              <SelectProvider>
                <AuthContext.Provider value={authContext}>
                    <LoaderContext.Provider value={loaderContextValue}>
                        <UserContext.Provider value={{
                            loggedInNameState,
                            loggedInEmailState,
                            loggedInFirstNameState
                        }}>
                            <TasksContext.Provider value={{
                                loggedInUserTasksState,
                                setLoggedInUserTasks,
                                todayTasksListState,
                                setTodayTasksList,
                                upcomingTasksListState,
                                setUpcomingTasksList
                            }}>
                                <RootNavigation initialState={initialState} persistenceKey={PERSISTENCE_KEY} authState={authstate} />
                            </TasksContext.Provider>
                        </UserContext.Provider>
                    </LoaderContext.Provider>
                </AuthContext.Provider>
              </SelectProvider>
              { loader ? <ActivityIndicator size={"large"} color={colors.backgroundPrimary} style={styles.activityIndicator} /> : null }
              </SafeAreaProvider>
            </RootSiblingParent>
        );
    }
}
