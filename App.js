import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar';
import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {NavigationContainer, getFocusedRouteNameFromRoute, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Formik, Field, Form} from 'formik';
import { Linking, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {ScrollView, GestureHandlerRootView} from "react-native-gesture-handler";

import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectProvider, Select } from '@mobile-reality/react-native-select-pro';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

//Toast Cross Platform
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';

import { useIsFocused } from '@react-navigation/native';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// @refresh reset
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
const Stack = createNativeStackNavigator();
const AuthContext = React.createContext();
const SearchContext = React.createContext();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

// Set the key-value pairs for the different languages you want to support.
const translations = {
    en: { notifset1: 'Get email notifications', notifset2: 'Vibrate on alert', flossset1: 'Share profile with other users', flossset2: 'Show your task completion status', changelang: 'Change Language' },
    fr: { notifset1: 'Recevez des notifications par e-mail', notifset2: 'Vibrer en alerte', flossset1: "Partager le profil avec d'autres utilisateurs", flossset2: "Afficher l'état d'achèvement de votre tâche", changelang: 'Changer de langue'  },
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;
// To see the fallback mechanism uncomment line below to force app to use French language.
// i18n.locale = 'fr';

let todo = false, notifications = false, scheduler = false, profile = false;
let search = false;
let searchText = '';
let loggedInName = null, loggedInEmail = null, loggedInUserTasks = null, loggedInFirstName = null;
let todayTasksList = [];
let UpcomingTasksList = [];
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
const DATA3 = [
    {
        key: '1',
        settings: "Notification Settings",
        data: [{
            key: '1',
            setting: i18n.t('notifset1'),
            switch: 'ON'
        },{
            key: '2',
            setting: i18n.t('notifset2'),
            switch: 'OFF'
        }]
    },
    {
        key: '2',
        settings: "Floss Settings",
        data: [{
            key: '1',
            setting: i18n.t('flossset1'),
            switch: 'ON'
        },{
            key: '2',
            setting: i18n.t('flossset2'),
            switch: 'OFF'
        }]
    }
];
const validateLogin = values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
        console.log('Please enter email')
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
        console.log('Please enter valid email address')
    }

    if (!values.password) {
        errors.password = 'Required';
        console.log('Please enter password')
    }

    return errors;
};
const validateRegister = values => {
    const errors = {};

    if (!values.fullName) {
        errors.fullName = 'Required';
        console.log('Please enter your full name')
    }

    if (!values.email) {
        errors.email = 'Required';
        console.log('Please enter email')
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
        console.log('Please enter valid email address')
    }

    if (!values.password) {
        errors.password = 'Required';
        console.log('Please enter password')
    }
    if (!values.confirmpassword) {
        errors.confirmpassword = 'Required';
        console.log('Please enter the confirmed password')
    }
    return errors;
};
const byteSize = str => new Blob([str]).size;
const showToast = (msg) => {
    let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
    });
};
function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'ToDo';
    console.log('get header title function executed');
    if (search === true) {
        return (() => <SearchHeader /> );
    } else {
        switch (routeName) {
            case 'ToDo':
                todo = true;
                scheduler = false;
                notifications = false;
                profile = false;
                return 'TO-DO';
            case 'Scheduler':
                scheduler = true;
                todo = false;
                notifications = false;
                profile = false;
                return 'SCHEDULER';
            case 'Notifications':
                notifications = true;
                todo = false;
                scheduler = false;
                profile = false;
                return 'NOTIFICATIONS';
            case 'Profile':
                profile = true;
                todo = false;
                scheduler = false;
                notifications = false;
                return 'PROFILE';
            case 'NewTask':
                return  'NEW TASK';
            case 'EditTask':
                return 'EDIT TASK';
        }
    }
}

function SearchHeader() {
    const [text, onChangeText] = React.useState(null);
    const { searchFunc } = React.useContext(AuthContext);
    return <TextInput onChange={({ nativeEvent: { eventCount, target, text} }) => {
        console.log('New text value: ', text);
        searchText = text;
        searchFunc(text);
    }} onChangeText={onChangeText} placeholder="Search..."
                      value={text} style={{width: 260, height:30, paddingLeft:10, borderRadius: 10, backgroundColor:'white', color: '#243b6b'}} />
}
function DashboardHeaderRight() {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => {
            console.log('Search button pressed');
            // const drawerNavigation = navigation.getParent('DrawerNav');
            search = true;
            tabnavigationprop.setOptions(
                ({ route}) => ({
                    headerTitle: getHeaderTitle(route),
                }));
            navigation.setOptions({
                headerRight: () => <DashboardHeaderRight1 />,
            });
        }}>
            <Image style={{width: 25, height: 25, tintColor: "#243b6b"}} source={require('./assets/icons8-search-30.png')} />
        </TouchableOpacity>
    );
}
function DashboardHeaderRight1() {
    const navigation = useNavigation();
    const { searchFunc } = React.useContext(AuthContext);
    return (
        <TouchableOpacity onPress={() => {
            console.log('Close search');
            // const drawerNavigation = navigation.getParent('DrawerNav');
            search = false;
            searchText = '';
            searchFunc('');
            tabnavigationprop.setOptions(
                ({ route}) => ({
                    headerTitle: getHeaderTitle(route),
                }));
            navigation.setOptions({
                headerRight: () => <DashboardHeaderRight />,
            });
        }}>
            <Image style={{width: 25, height: 25}} source={require('./assets/icons8-cancel-50.png')} />
        </TouchableOpacity>
    );
}
function EditProfileHeaderRight(props) {
    return (
        <TouchableOpacity onPress={() => {
            props.navigation.navigate('EditProfile');
        }}>
            <Image style={{width: 25, height: 25, tintColor: "#243b6b"}} source={require('./assets/icons8-edit-24.png')} />
        </TouchableOpacity>
    );
}
function fetchTodayTaskList() {
    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();
    for (let i = 0 ; i < loggedInUserTasks.length; i++) {
        let taskDate = loggedInUserTasks[i].date;
        const taskDay = taskDate.getDate();
        const taskMonth = taskDate.getMonth();
        const taskYear = taskDate.getFullYear();
        if (taskDay === todayDay && taskMonth === todayMonth && taskYear === todayYear) {
            todayTasksList.push({
                key: loggedInUserTasks[i].key,
                task: loggedInUserTasks[i].task,
                checked: false
            });
        }
    }
    console.log('today tasks list: ', todayTasksList);
}
function fetchUpcomingTaskList() {
    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();
    let datesarray = [];
    let upcomingtasklist = [];
    for (let i = 0 ; i < loggedInUserTasks.length; i++) {
        const taskDate = loggedInUserTasks[i].date;
        const taskDay = taskDate.getDate();
        const taskMonth = taskDate.getMonth();
        const taskYear = taskDate.getFullYear();
        if (taskDay !== todayDay || taskMonth !== todayMonth || taskYear !== todayYear) {
            if (taskYear > todayYear) {
                //this task belongs to upcoming list
                datesarray.push(taskDate);
                upcomingtasklist.push(loggedInUserTasks[i]);
            } else if (taskYear === todayYear) {
                if (taskMonth > todayMonth) {
                    //this task belongs to upcoming list
                    datesarray.push(taskDate);
                    upcomingtasklist.push(loggedInUserTasks[i]);
                } else if (taskMonth === todayMonth) {
                    if (taskDay > todayDay) {
                        //this task belongs to upcoming list
                        datesarray.push(taskDate);
                        upcomingtasklist.push(loggedInUserTasks[i]);
                    } else if (taskDay === todayDay) {
                        //this task belongs to today list
                    } else {
                        //this task belongs to the past list
                    }
                } else {
                    //this task belongs to the past list
                }
            } else {
                //this task belongs to the past list
            }
        } else {
            // this task belongs to today list
        }
    }
    
    console.log('dates array: ', datesarray);
    console.log('list of upcoming tasks: ', upcomingtasklist);
    datesarray.sort(function(a, b){
        return a - b
    });
    //
    console.log('Sorted dates array: ', datesarray);
    
    for (let i = 0; i < datesarray.length; i++) {
        if (i === 0) {
            UpcomingTasksList.push({
                day: datesarray[i],
                data: []
            });
        } else {
            const currentindexday = datesarray[i].getDate();
            const currentindexmonth = datesarray[i].getMonth();
            const currentindexyear = datesarray[i].getFullYear();
            const previousindexday = datesarray[i-1].getDate();
            const previousindexmonth = datesarray[i-1].getMonth();
            const previousindexyear = datesarray[i-1].getFullYear();
            if (currentindexday === previousindexday && currentindexmonth === previousindexmonth && currentindexyear === previousindexyear) {
                
            } else {
                UpcomingTasksList.push({
                    day: datesarray[i],
                    data: []
                });
            }
        }
    }
    
    for (let i = 0; i < UpcomingTasksList.length; i++) {
        const sectionDate = UpcomingTasksList[i].day;
        const sectionDay = sectionDate.getDate();
        const sectionMonth = sectionDate.getMonth();
        const sectionYear = sectionDate.getFullYear();
        for (let j = 0; j < upcomingtasklist.length; j++) {
            const taskDate = upcomingtasklist[j].date;
            const taskDay = taskDate.getDate();
            const taskMonth = taskDate.getMonth();
            const taskYear = taskDate.getFullYear();
            if (sectionDay === taskDay && sectionMonth === taskMonth && sectionYear === taskYear) {
                UpcomingTasksList[i].data.push({
                    key: upcomingtasklist[j].key,
                    task: upcomingtasklist[j].task,
                    checked: false
                });
            }
        }
    }
    // console.log('Final Upcoming task list: ', UpcomingTasksList);
}
async function fetchLoggedInUserTasks() {
    let taskDatabase;
    try{
        taskDatabase = await AsyncStorage.getItem('task_database');
        taskDatabase = JSON.parse(taskDatabase);
        taskDatabase = convertDateStringtoObj(taskDatabase);
        console.log('Task Database: ', taskDatabase);
        for (let i = 0; i < taskDatabase.length; i++) {
            if (taskDatabase[i].email === loggedInEmail) {
                loggedInUserTasks = taskDatabase[i].tasks;
            }
        }
        console.log("Logged in user's tasks: ", loggedInUserTasks);
        fetchTodayTaskList();
        fetchUpcomingTaskList();
    } catch (e) {
        console.log(e);
    }
}
function convertDateStringtoObj(taskDatabase) {
    for (let i = 0; i < taskDatabase.length; i++) {
        let usertasks = taskDatabase[i].tasks;
        for (let j = 0; j < usertasks.length; j++) {
            const taskdatestr = usertasks[j].date;
            usertasks[j].date = new Date(JSON.parse(JSON.stringify(taskdatestr)));
        }
    }
    return taskDatabase;
}
function extractFirstName(name) {
    const index = name.indexOf(" ");
    let firstname = "";
    console.log(index);
    if (index === -1) {
        firstname = name;
    } else {
        for (let i = 0; i < index; i++) {
            let char = name.charAt(i);
            firstname = firstname + char;
        }
    }
    return firstname;
}
export default function App() {
    const [isReady, setIsReady] = React.useState(false);
    const [initialState, setInitialState] = React.useState();
    const [searchstate, setsearchstate] = React.useState(null);
    const [state, dispatch] = React.useReducer(
        (prevState, action) => {
            console.log('Previous state: ', prevState);
            switch (action.type) {
                case 'RESTORE_TOKEN':
                    return {
                        ...prevState,
                        userToken: action.token,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignout: false,
                        userToken: action.token,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignout: true,
                        userToken: null,
                    };
            }
        },
        {
            isLoading: true,
            isSignout: false,
            userToken: null,
        }
    );

    React.useEffect(() => {
        // Fetch the token from storage then navigate to our appropriate place
        const bootstrapAsync = async () => {
            let database, k = 0;
            let userToken;
            try {
                // Restore token stored in `SecureStore` or any other encrypted storage
                database = await SecureStore.getItemAsync('candy_user_database');
            } catch (e) {
                // Restoring token failed
                console.log(e)
            }
            // After restoring token, we may need to validate it in production apps
            // This will switch to the App screen or Auth screen and this loading
            // screen will be unmounted and thrown away.
            if (database == null) {
                console.log('Database does not exist');
                userToken = null;
            } else {
                console.log('Database exists');
                database = JSON.parse(database);
                for (let i = 0; i < database.length; i++) {
                    if (database[i].usertoken === 'dummy-auth-token') {
                        loggedInName = database[i].fullName;
                        loggedInEmail = database[i].email;
                        k++;
                    }
                }
                if (k === 0) {
                    console.log('No one is logged in');
                    userToken = null;
                } else if (k === 1) {
                    console.log(loggedInName + ' is logged in');
                    loggedInFirstName = extractFirstName(loggedInName);
                    userToken = 'dummy-auth-token';
                    fetchLoggedInUserTasks();
                } else {
                    console.log('ERROR: More than one person is logged in');
                    userToken = null;
                }
            }
            dispatch({ type: 'RESTORE_TOKEN', token: userToken });
        };
        bootstrapAsync();
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async (email, password) => {
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
                            for (let i = 0; i < database.length; i++) {
                                if (database[i].email === email) {
                                    database[i].usertoken = 'dummy-auth-token';
                                    loggedInName = database[i].fullName;
                                    loggedInEmail = database[i].email;
                                }
                            }
                            loggedInFirstName = extractFirstName(loggedInName);
                            database = JSON.stringify(database);
                            let updateDatabase;
                            try {
                                updateDatabase = await SecureStore.setItemAsync('candy_user_database', database);
                                fetchLoggedInUserTasks();
                                dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
                            }catch (e) {
                                console.log(e);
                            }
                        } else {
                            console.log('Please enter the correct password');
                            Alert.alert('Incorrect Password');
                        }
                    } else {
                        console.log('This email does not exist');
                        Alert.alert('Cannot find an account with this email')
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
                    loggedInName = null;
                    loggedInFirstName = null;
                    loggedInEmail = null;
                    loggedInUserTasks = null;
                    todayTasksList = [];
                    UpcomingTasksList = [];
                    dispatch({ type: 'SIGN_OUT' })
                } catch (e) {
                    console.log(e);
                }
            },
            register: async (fullName, email, password, confirmpassword, navigation) => {
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
                            navigation.navigate('Login', { newAccount: true });
                        } catch (e) {
                            console.log(e);
                            Alert.alert('Account creation failed. Try again.');
                        }
                    } else {
                        Alert.alert('Account with this email id already exists');
                    }
                } else{
                    Alert.alert('Password and the Confirmed password do not match');
                }
            },
            deleteDatabase: async () => {
                let deletedatabase, deletetaskDatabase;
                try {
                    deletedatabase = await SecureStore.deleteItemAsync('candy_user_database');
                    deletetaskDatabase = await AsyncStorage.removeItem('task_database');
                    Alert.alert('Databases deleted successfully');
                } catch (e) {
                    console.log('Error');
                    Alert.alert('Database deletion failed. Try again.');
                }
            },
            searchFunc: (text) => {
                setsearchstate(text);
            }
        }),
        []
    );
    React.useEffect(() => {
        const restoreState = async () => {
            try {
                const initialUrl = await Linking.getInitialURL();//
                console.log('Initial url: ', initialUrl);
                console.log('Old initial state: ', initialState);
                if (initialUrl !== null) {
                    AsyncStorage.setItem(PERSISTENCE_KEY, '');
                }
                if (Platform.OS !== 'web' && initialUrl == null) {
                    // Only restore state if there's no deep link and we're not on web
                    const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
                    const state = savedStateString ? JSON.parse(savedStateString) : undefined;
                    console.log('State Restored: ', state);
                    if (state !== undefined) {
                        console.log('New initial state: ', state);
                        setInitialState(state);
                    }
                }
            } finally {
                setIsReady(true);
            }
        };
        console.log('Is ready: ', isReady);
        if (!isReady) {
            restoreState();
        }
    }, [isReady]);

    if (state.isLoading || !isReady) {
        console.log('Showing Activity Indicator');
        return <ActivityIndicator/>;
    } else {
        console.log('Showing the screen accordingly');
        return (
            <RootSiblingParent>
              <SelectProvider>
                <AuthContext.Provider value={authContext}>
                    <SearchContext.Provider value={searchstate}>
                        <NavigationContainer initialState={initialState} onStateChange={(state) => {
                            console.log('New state stored: ', state);
                            console.log('Current Initial State: ', initialState);
                            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
                        }
                        }>
                            <Stack.Navigator screenOptions={{
                                headerShown: false
                            }}>
                                {state.userToken == null ? (
                                    // No token found, user isn't signed in
                                    <Stack.Group>
                                        <Stack.Screen name="Login" component={LoginScreen} options={{
                                            title: 'Login',
                                            // When logging out, a pop animation feels intuitive
                                            animationTypeForReplace: state.isSignout ? 'pop' : 'push', }} />
                                        <Stack.Screen name="Register" component={RegisterScreen} options={{
                                            title: 'Register'
                                        }} />
                                    </Stack.Group>
                                ) : (
                                    // User is signed in
                                    <Stack.Group>
                                        <Stack.Screen
                                            name="Dashboard"
                                            component={DashboardScreen}
                                        />
                                        <Stack.Screen name="NewTask" component={NewTask} options={{
                                            headerShown: true,
                                            header: ({ navigation, route, options, back }) => {
                                                return <View style={{height: 82, backgroundColor: '#ffeeee'}}>
                                                    <View style={{height:78, justifyContent: 'flex-end', backgroundColor: '#ffeeee', elevation: 20,
                                                        shadowColor: '#ff8eee',
                                                        shadowOpacity: 1}}>
                                                        <TouchableOpacity onPress={() => {
                                                            navigation.goBack();
                                                        }} style={{alignSelf: 'flex-start', top: 14, left: 16}}>
                                                            <Image style={{width: 25, height: 25}} source={require('./assets/icons8-less-than-60.png')}/>
                                                        </TouchableOpacity>
                                                        <View style={{alignSelf: 'center', bottom: 14, right: 8}}>
                                                            <Text style={{color:'#243b6b', letterSpacing: 3, fontWeight: 'bold', fontSize: 18}}>NEW TASK</Text>
                                                        </View>
                                                    </View>
                                                </View>;
                                            }
                                        }} />
                                        <Stack.Screen name="EditTask" component={EditTask} options={{
                                            headerShown: true,
                                            header: ({ navigation, route, options, back }) => {
                                                return <View style={{height: 82, backgroundColor: '#ffeeee'}}>
                                                    <View style={{height:78, justifyContent: 'flex-end', backgroundColor: '#ffeeee', elevation: 20,
                                                        shadowColor: '#ff8eee',
                                                        shadowOpacity: 1}}>
                                                        <TouchableOpacity onPress={() => {
                                                            navigation.goBack();
                                                        }} style={{alignSelf: 'flex-start', top: 14, left: 16}}>
                                                            <Image style={{width: 25, height: 25}} source={require('./assets/icons8-less-than-60.png')}/>
                                                        </TouchableOpacity>
                                                        <View style={{alignSelf: 'center', bottom: 14, right: 8}}>
                                                            <Text style={{color:'#243b6b', letterSpacing: 3, fontWeight: 'bold', fontSize: 18}}>EDIT TASK</Text>
                                                        </View>
                                                    </View>
                                                </View>;
                                            }
                                        }} />
                                        <Stack.Screen name="EditProfile" component={EditProfile} options={{
                                            headerShown: true,
                                            header: ({ navigation, route, options, back }) => {
                                                return <View style={{height: 90, backgroundColor: '#ffeeee'}}>
                                                    <View style={{height:78, justifyContent: 'flex-end', backgroundColor: '#ffeeee', elevation: 20,
                                                        shadowColor: '#ff8eee',
                                                        shadowOpacity: 1}}>
                                                        <View style={{alignSelf: 'flex-start', top: 16, left: 16}}>
                                                            <Image style={{width: 36, height: 36, tintColor: "#243b6b"}} source={require('./assets/icons8-help-32.png')}/>
                                                        </View>
                                                        <View style={{alignSelf: 'center', bottom: 14, right: 8}}>
                                                            <Text style={{color:'#243b6b', letterSpacing: 3, fontWeight: 'bold', fontSize: 18}}>EDIT PROFILE</Text>
                                                        </View>
                                                    </View>
                                                </View>;
                                            }
                                        }} />
                                    </Stack.Group>
                                )}
                            </Stack.Navigator>
                        </NavigationContainer>
                    </SearchContext.Provider>
                </AuthContext.Provider>
            </SelectProvider>
            </RootSiblingParent>
        );
    }
}

const DashboardScreen = ({ navigation, route }) => {
    return (
        <Drawer.Navigator id="DrawerNav" drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#ffeeee',
                elevation: 20,
                shadowColor: '#ff8eee',
                shadowOpacity: 1,
            },
            headerTintColor: '#243b6b',
            headerRight: () => <DashboardHeaderRight />,
            headerRightContainerStyle: {
                paddingRight: 14,
            },
            headerTitleStyle: {
                fontWeight: 'bold',
                letterSpacing: 3,
                fontSize: 18
            },
            drawerStyle: {
                width: '80%',
            },
        }}>
            <Drawer.Screen name="TabNav" options={
                ({ route}) => ({
                    headerTitle: getHeaderTitle(route),
                })} component={TabNav} />
        </Drawer.Navigator>
    );
};
function CustomDrawerContent(props) {
    const { signOut } = React.useContext(AuthContext);
    const createTwoButtonAlert = () =>
        Alert.alert(
            "Confirm",
            "Are you sure you want to log out ?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Dont Log out"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => {
                        signOut();
                    }
                }
            ]
        );
    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                {/*<DrawerItemList {...props} />*/}
                <View style={{flexDirection:'row', borderBottomWidth: 0.5, borderColor: '#243b6b', paddingLeft: 25, paddingTop: 16, paddingBottom: 20}}>
                    <Image style={{width: 50, height: 50, tintColor: '#243b6b', bottom: 5}} source={require('./assets/icons8-user-circle-48.png')} />
                    <Text style={{color: '#243b6b', fontSize: 26, fontWeight: 'bold', marginLeft: 5}}>{loggedInFirstName}</Text>
                </View>
                <DrawerItem labelStyle={{marginLeft: 10}} style={{marginTop: 10}} activeTintColor='#243b6b' inactiveTintColor='#243b6b' label="To - Do" focused={todo} onPress={()=>{props.navigation.navigate('ToDo')}} />
                <DrawerItem labelStyle={{marginLeft: 10}} activeTintColor='#243b6b' inactiveTintColor='#243b6b' label="Scheduler" focused={scheduler} onPress={()=>{props.navigation.navigate('Scheduler')}} />
                <DrawerItem labelStyle={{marginLeft: 10}} activeTintColor='#243b6b' inactiveTintColor='#243b6b' label="Notifications" focused={notifications} onPress={()=>{props.navigation.navigate('Notifications')}} />
                <DrawerItem labelStyle={{marginLeft: 10}} activeTintColor='#243b6b' inactiveTintColor='#243b6b' label="Profile" focused={profile} onPress={()=>{props.navigation.navigate('Profile')}} />
                <DrawerItem labelStyle={{marginLeft: 10}} activeTintColor='#243b6b' inactiveTintColor='#243b6b' label="Logout" onPress={createTwoButtonAlert} />
            </DrawerContentScrollView>
            <View style={{paddingLeft: 25, paddingBottom: 20}}>
                <Text style={{color: '#cbd1dc', fontSize: 14}}>&copy; 2017 Candy</Text>
            </View>
        </View>
    );
}
let tabnavigationprop;
function TabNav({ navigation }) {
    tabnavigationprop = navigation;
    const {height, width} = useWindowDimensions();
    function consoleWindowWidth() {
        console.log(Platform.OS + ' Window Width: ', width);
    }
    consoleWindowWidth();
    const guidelineBaseWidth = 375;
    const guidelineBaseHeight = 812;
    const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
    const verticalScale = (size) => (height / guidelineBaseHeight) * size;
    // const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;
    const scaleFont = size => size * PixelRatio.getFontScale();
    return (
        <Tab.Navigator id="TabNav" sceneContainerStyle={{
            borderBottomWidth: 0,
        }} screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#ffeeee',
                width: '100%',
                position: 'relative',
                borderTopWidth: 0,
            },
            tabBarActiveTintColor: '#243b6b',
            tabBarInactiveTintColor: 'grey',
            tabBarShowLabel: false
        }}>
            <Tab.Screen name="ToDo" component={ToDo} options={{
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center'}} />,
                tabBarAccessibilityLabel: 'To Do',
                tabBarIcon: (props => {
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: props.color}} source={require('./assets/icons8-bulleted-list-30.png')} />
                    );
                })
            }} />
            <Tab.Screen name="Scheduler" component={Scheduler} options={{
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center'}} />,
                tabBarAccessibilityLabel: 'Scheduler',
                tabBarIcon: (props => {
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: props.color}} source={require('./assets/icons8-clock-24.png')} />
                    );
                })
            }} />
            <Tab.Screen name="NewTask" component={NewTask} options={{
                tabBarButton: (props) => <TouchableOpacity {...props} onPress={() => {
                    navigation.navigate('NewTask');
                }} style={{paddingHorizontal:horizontalScale(32), paddingVertical:verticalScale(37), alignItems: 'center', justifyContent: 'center', backgroundColor: '#243b6b', borderRadius: scaleFont(100), position: 'relative', bottom: verticalScale(40), left: horizontalScale(5.5), elevation: 10,
                    shadowColor: '#243b6b', shadowOpacity: 0.4, shadowOffset:{width:0, height:5}
                        }} />,
                tabBarAccessibilityLabel: 'New Task',
                tabBarIcon: (props => {
                    console.log('Image size: ', props.size);
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: 'white'}} source={require('./assets/icons8-plus-math-24.png')} />
                    );
                })
            }} />
            <Tab.Screen name="Notifications" component={Notifications} options={{
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center', position: 'absolute', right: "20%", height:"100%" }} />,
                tabBarAccessibilityLabel: 'Notifications',
                tabBarIcon: (props => {
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: props.color}} source={require('./assets/icons8-notification-48.png')} />
                    );
                })
            }} />
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center', position: 'absolute', right: 0, height:"100%" }} />,
                tabBarAccessibilityLabel: 'Profile',
                tabBarIcon: (props => {
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: props.color}} source={require('./assets/icons8-user-24.png')} />
                    );
                })
            }} />
        </Tab.Navigator>
    );
}

function ToDo({ navigation, route }) {
    const [screenIsReady, setscreenIsReady] = useState(false);
    const [liststate, setliststate] = useState(false);
    const [flag, setFlag] = useState(true);
    let searchcontextvalue = React.useContext(SearchContext);
    const { searchFunc } = React.useContext(AuthContext);
    let Viewheight;
    //this hook rerenders the screen when it is focused and unfocused
    const isFocused = useIsFocused();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // todo = true;
            navigation.setOptions({
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center', borderBottomWidth: 3, borderColor: '#243b6b'}} />,
            });

            //setTimeout is here so that flatlist data can be seen when the user is signed in
            setTimeout(function () {
                if (liststate === false) {
                    setliststate(true);
                } else {
                    setliststate(false);
                }
            }, 0);
            console.log('Route params: ', route.params);
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
            // todo = false;
            search = false;
            searchText = '';
            searchFunc('');
            tabnavigationprop.setOptions(
                ({ route}) => ({
                    headerTitle: getHeaderTitle(route),
                }));
            const drawerNavigation = navigation.getParent('DrawerNav');

            drawerNavigation.setOptions({
                headerRight: () => <DashboardHeaderRight />,
            });
            navigation.setOptions({
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center', borderBottomWidth: 0}} />,
            });
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
        for (let i = 0; i < todayTasksList.length; i++) {
            if (item.key === todayTasksList[i].key) {
                if (todayTasksList[i].checked === false) {
                    todayTasksList[i].checked = true;
                } else {
                    todayTasksList[i].checked = false;
                }
            }
        }
        if (liststate === false) {
            setliststate(true);
        } else {
            setliststate(false);
        }
    }
    if (!screenIsReady) {
        return null;
    }
    return (
        <View style={{ flex: 1 }} onLayout={(event) => {
            onLayoutDashboardView();
            var {x, y, width, height} = event.nativeEvent.layout;
            console.log('Parent view height: ', height);
            
            console.log('Height set');
           
            console.log('OnLayout function executed');
            
        }}>
            <View style={{ backgroundColor: '#ffeeee'}}>
                <View style={{marginLeft: 40, marginTop: 20, marginBottom: 20}}>
                    <Text style={{fontWeight: 'bold', color: '#243b6b', fontSize: 24}}>Today's</Text>
                    <Text style={{fontWeight: 'bold', color: '#243b6b', fontSize: 24}}>List —</Text>
                </View>
            </View>
            <View style={{flex:1, backgroundColor: 'white'}}>
                <FlatList style={{marginLeft: 40, paddingRight: 14}}
                          data={todayTasksList}
                          renderItem={({item}) => {
                              let disp;
                              if (search === true) {
                                  if (item.task.toLowerCase().indexOf(searchText.toLowerCase().trim()) === -1) {
                                      disp = 'none';
                                  } else {
                                      disp = 'flex';
                                  }
                              } else {
                                  disp = 'flex';
                              }
                              return (
                                  <TouchableOpacity onPress={() => {
                                      navigation.navigate('EditTask', {
                                          key: item.key
                                      });
                                  }} style={{display: disp, flex:1, flexDirection: 'row', marginBottom: 10, marginTop: 10, paddingRight: 14}}>
                                      <TouchableOpacity style={{height: 30, width: 30, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                                          handlecheckbox(item);
                                      }}>
                                          {item.checked ? (<Image style={{width: 22, height: 22, tintColor: '#93ffdf', backgroundColor: '#243b6b', borderColor: '#93ffdf', borderWidth:3, borderRadius: 6}} source={require('./assets/icons8-checked-checkbox-50.png')} />) : (<Image style={{width: 25, height: 25, tintColor: '#93ffdf'}} source={require('./assets/icons8-unchecked-checkbox-50.png')} />)}
                                      </TouchableOpacity>
                                      <Text style={styles.item}>{item.task}</Text>
                                  </TouchableOpacity>
                              );}
                          }
                />
            </View>
        </View>
    );
}

function NewTask({ navigation, route}) {
    const [task, onChangeTask] = React.useState(null);
    const [flag, setFlag] = useState(true);
    let Viewheight;
    const [priority, setPriority] = React.useState(null);
    const [date, setDate] = useState(null);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [alarm, setAlarm] = useState(false);
    const [notification, setNotification] = useState(true);
    const onChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate;
            console.log('Selected Date: ', currentDate);
            const t = new Date();
            console.log('today date: ', t);
            setDate(currentDate);
        } else {
            console.log('Date picker dismissed');
        }
        setShow(false);
    };

    const showMode = (currentMode) => {
        setShow(true);
        // if (Platform.OS === 'android') {
        //     setShow(false);
            // for iOS, add a button that closes the picker
        // }
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    // const showMode = (currentMode) => {
    //     if (date === null) {
    //         DateTimePickerAndroid.open({
    //             value: new Date(),
    //             onChange,
    //             mode: currentMode,
    //             is24Hour: true,
    //             minimumDate: new Date()
    //         });
    //     } else {
    //         DateTimePickerAndroid.open({
    //             value: date,
    //             onChange,
    //             mode: currentMode,
    //             is24Hour: true,
    //             minimumDate: new Date()
    //         });
    //     }
    // };

    // const showDatepicker = () => {
    //     showMode('date');
    // };

    async function addNewTask() {
        if (task == null || task.trim() == '') {
            Alert.alert('Enter the new task');
        } else {
            if (date == null) {
                Alert.alert('Enter the date by which the task should be completed');
            } else {
                if (priority == null) {
                    Alert.alert('Choose a priority for the task');
                } else {
                    //new task can be added
                    let taskDatabase;
                    try {
                        taskDatabase = await AsyncStorage.getItem('task_database');
                        taskDatabase = JSON.parse(taskDatabase);
                        taskDatabase = convertDateStringtoObj(taskDatabase);
                        for (let i = 0; i < taskDatabase.length; i++) {
                            if (taskDatabase[i].email === loggedInEmail) {
                                const tasksarraylength = taskDatabase[i].tasks.length;
                                const key = tasksarraylength + 1;
                                taskDatabase[i].tasks.push({
                                    key: key,
                                    task: task,
                                    date: date,
                                    priority: priority,
                                    alarm: alarm,
                                    notification: notification
                                });
                                loggedInUserTasks = taskDatabase[i].tasks;
                            }
                        }
                        console.log("Logged in user's tasks: ", loggedInUserTasks);
                        console.log('New task added');
                        UpcomingTasksList = [];
                        todayTasksList = [];
                        fetchTodayTaskList();
                        fetchUpcomingTaskList();
                        taskDatabase = JSON.stringify(taskDatabase);
                        let updatetaskDatabase;
                        try {
                            updatetaskDatabase = await AsyncStorage.setItem('task_database', taskDatabase);
                            navigation.navigate('ToDo', { newTask: true });
                        } catch (e) {
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={{ backgroundColor: '#ffeeee'}}>
                <View style={{marginLeft: 40, marginTop: 20, marginRight: 20, marginBottom: 10}}>
                    <TextInput
                        multiline
                        placeholder='Write here...'
                        numberOfLines={3}
                        onChangeText={text => onChangeTask(text)}
                        value={task}
                        style={{textAlignVertical: 'top', fontSize: 22, fontWeight: 'bold', color: '#243b6b'}}
                    />
                </View>
            </View>
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{
                    marginLeft: 40, paddingRight: 14, marginTop: 10, paddingBottom: 15
                }}>
                    <Text style={{marginBottom: 5, color: '#243b6b'}}>Complete By</Text>
                    <TouchableOpacity style={{
                        height: 50,
                        paddingTop: 12,
                        paddingLeft: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#bec5d3',
                        marginBottom: 15
                    }} onPress={showDatepicker}>
                        <Text>{date ? (<Text
                            style={{color: '#243b6b'}}>{date.getDate()} - {date.getMonth() + 1} - {date.getFullYear()}</Text>) : (
                            <Text style={{color: '#bec5d3'}}>Select a date</Text>)}</Text>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date === null ? (new Date()):(date)}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                            minimumDate={new Date()}
                            style={{height: 50}}
                        />
                    )}
                    <Text style={{marginBottom: 5, color: '#243b6b'}}>Priority</Text>
                    <Select onSelect={(option, optionIndex) => {
                        console.log(option);
                        if (option === null) {
                            setPriority(null);
                        } else {
                            setPriority(option.value);
                        }
                    }} searchable={false} placeholderText="Choose priority"
                            selectControlTextStyle={{fontSize: 14, color: '#243b6b'}}
                            selectControlArrowImageStyle={{top: 12, tintColor: '#243b6b'}}
                            selectControlClearOptionImageStyle={{top: 12, tintColor: '#243b6b'}}
                            optionsListStyle={{borderColor: '#bec5d3'}} optionTextStyle={{color: '#243b6b'}}
                            placeholderTextColor="#bec5d3" selectControlStyle={{
                        height: 50, paddingVertical: 12, borderRadius: 10,
                        borderWidth: 1, borderColor: '#bec5d3', marginBottom: 15
                    }}
                            options={[
                                {value: 'Low', label: 'Low Priority'},
                                {value: 'Medium', label: 'Medium Priority'},
                                {value: 'High', label: 'High Priority'}
                            ]}/>
                    <Text style={{
                        marginBottom: 20, fontSize: 16,
                        color: '#adb6c8',
                        marginTop: 15
                    }}>More Options</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                        paddingRight: 14
                    }}>
                        <Text style={{fontSize: 16, color: '#243b6b', textAlignVertical: 'center'}}>Save as
                            alarm</Text>
                        <TouchableOpacity
                            style={{height: 32, width: 52, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {
                                if (alarm === true) {
                                    setAlarm(false);
                                } else {
                                    setAlarm(true);
                                }
                            }}>
                            {alarm ? (<Image style={{width: 50, height: 30,}}
                                             source={require('./assets/icons8-toggle-on-50.png')}/>) : (
                                <Image style={{width: 50, height: 30}}
                                       source={require('./assets/icons8-toggle-off-50.png')}/>)}
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 14}}>
                        <Text style={{fontSize: 16, color: '#243b6b', textAlignVertical: 'center'}}>Save as
                            notification</Text>
                        <TouchableOpacity
                            style={{height: 32, width: 52, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {
                                if (notification === true) {
                                    setNotification(false);
                                } else {
                                    setNotification(true);
                                }
                            }}>
                            {notification ? (<Image style={{width: 50, height: 30,}}
                                                    source={require('./assets/icons8-toggle-on-50.png')}/>) : (
                                <Image style={{width: 50, height: 30}}
                                       source={require('./assets/icons8-toggle-off-50.png')}/>)}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                </GestureHandlerRootView>
                <TouchableOpacity onPress={addNewTask} style={{
                    width: 70,
                    height: 70,
                    borderRadius: 100,
                    position: 'absolute',
                    bottom: 40,
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#243b6b',
                    elevation: 10,
                    shadowColor: '#243b6b',
                    shadowOpacity: 1
                }}>
                    <Image style={{width: 30, height: 30, tintColor: 'white', backgroundColor: '#243b6b'}}
                           source={require('./assets/icons8-done-30.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
function EditTask({ navigation, route}) {
    const [task, onChangeTask] = React.useState(null);
    const [flag, setFlag] = useState(true);
    let Viewheight;
    const [priority, setPriority] = React.useState(null);
    const [defaultOption, setDefaultOption] = React.useState(null);
    const [date, setDate] = useState(null);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [alarm, setAlarm] = useState(false);
    const [notification, setNotification] = useState(true);

    useEffect(() => {
        console.log('Task key: ', route.params.key);
        let defaulttask, defaultdate, defaultpriority, defaultalarm, defaultnotif;
        for (let i = 0; i < loggedInUserTasks.length; i++) {
            if (loggedInUserTasks[i].key === route.params.key) {
                defaulttask = loggedInUserTasks[i].task;
                defaultdate = loggedInUserTasks[i].date;
                defaultpriority = loggedInUserTasks[i].priority;
                defaultalarm = loggedInUserTasks[i].alarm;
                defaultnotif = loggedInUserTasks[i].notification;
            }
        }
        if (defaultpriority === 'Low') {
            console.log('low priority');
            setDefaultOption({value: 'Low', label: 'Low Priority'});
        } else if (defaultpriority === 'Medium') {
            console.log('medium priority');
            setDefaultOption({value: 'Medium', label: 'Medium Priority'});
        } else if (defaultpriority === 'High') {
            console.log('high priority');
            setDefaultOption({value: 'High', label: 'High Priority'});
        }

        onChangeTask(defaulttask);
        setDate(defaultdate);
        setPriority(defaultpriority);
        setAlarm(defaultalarm);
        setNotification(defaultnotif);
    }, [route]);

    const onChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate;
            console.log('Selected Date: ', currentDate);
            const t = new Date();
            console.log('today date: ', t);
            setDate(currentDate);
        } else {
            console.log('Date picker dismissed');
        }
        setShow(false);
    };

    const showMode = (currentMode) => {
        setShow(true);
        // if (Platform.OS === 'android') {
        //     setShow(false);
        // for iOS, add a button that closes the picker
        // }
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    // const showMode = (currentMode) => {
    //     if (date === null) {
    //         DateTimePickerAndroid.open({
    //             value: new Date(),
    //             onChange,
    //             mode: currentMode,
    //             is24Hour: true,
    //             minimumDate: new Date()
    //         });
    //     } else {
    //         DateTimePickerAndroid.open({
    //             value: date,
    //             onChange,
    //             mode: currentMode,
    //             is24Hour: true,
    //             minimumDate: new Date()
    //         });
    //     }
    // };

    // const showDatepicker = () => {
    //     showMode('date');
    // };

    async function editTask() {
        if (task == null || task.trim() == '') {
            Alert.alert('Enter the edited task');
        } else {
            if (date == null) {
                Alert.alert('Enter the date by which the task should be completed');
            } else {
                if (priority == null) {
                    Alert.alert('Choose a priority for the task');
                } else {
                    //task can be edited
                    let taskDatabase;
                    console.log('Task edited');
                    try {
                        taskDatabase = await AsyncStorage.getItem('task_database');
                        taskDatabase = JSON.parse(taskDatabase);
                        taskDatabase = convertDateStringtoObj(taskDatabase);
                        for (let i = 0; i < taskDatabase.length; i++) {
                            if (taskDatabase[i].email === loggedInEmail) {
                                for (let j = 0; j < taskDatabase[i].tasks.length; j++) {
                                    if (taskDatabase[i].tasks[j].key === route.params.key) {
                                        taskDatabase[i].tasks[j].task = task;
                                        taskDatabase[i].tasks[j].date = date;
                                        taskDatabase[i].tasks[j].priority = priority;
                                        taskDatabase[i].tasks[j].alarm = alarm;
                                        taskDatabase[i].tasks[j].notification = notification;
                                    }
                                }
                                loggedInUserTasks = taskDatabase[i].tasks;
                            }
                        }
                        console.log("Logged in user's tasks: ", loggedInUserTasks);
                        console.log('Task edited');
                        UpcomingTasksList = [];
                        todayTasksList = [];
                        fetchTodayTaskList();
                        fetchUpcomingTaskList();
                        taskDatabase = JSON.stringify(taskDatabase);
                        let updatetaskDatabase;
                        try {
                            updatetaskDatabase = await AsyncStorage.setItem('task_database', taskDatabase);
                            navigation.navigate('ToDo', { editTask: true });
                        } catch (e) {
                            console.log(e);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={{ backgroundColor: '#ffeeee'}}>
                <View style={{marginLeft: 40, marginTop: 20, marginRight: 20, marginBottom: 10}}>
                    <TextInput
                        multiline
                        placeholder='Write here...'
                        numberOfLines={3}
                        onChangeText={text => onChangeTask(text)}
                        value={task}
                        style={{textAlignVertical: 'top', fontSize: 22, fontWeight: 'bold', color: '#243b6b'}}
                    />
                </View>
            </View>
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{
                    marginLeft: 40, paddingRight: 14, marginTop: 10, paddingBottom: 15
                }}>
                    <Text style={{marginBottom: 5, color: '#243b6b'}}>Complete By</Text>
                    <TouchableOpacity style={{
                        height: 50,
                        paddingTop: 12,
                        paddingLeft: 12,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#bec5d3',
                        marginBottom: 15
                    }} onPress={showDatepicker}>
                        <Text>{date ? (<Text
                            style={{color: '#243b6b'}}>{date.getDate()} - {date.getMonth() + 1} - {date.getFullYear()}</Text>) : (
                            <Text style={{color: '#bec5d3'}}>Select a date</Text>)}</Text>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date === null ? (new Date()):(date)}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                            minimumDate={new Date()}
                            style={{height: 50}}
                        />
                    )}
                    <Text style={{marginBottom: 5, color: '#243b6b'}}>Priority</Text>
                    <Select defaultOption={defaultOption} onSelect={(option, optionIndex) => {
                        console.log(option);//
                        setDefaultOption(null);
                        if (option === null) {
                            setPriority(null);
                        } else {
                            setPriority(option.value);//
                        }
                    }} searchable={false} placeholderText="Choose priority"
                            selectControlTextStyle={{fontSize: 14, color: '#243b6b'}}
                            selectControlArrowImageStyle={{top: 12, tintColor: '#243b6b'}}
                            selectControlClearOptionImageStyle={{top: 12, tintColor: '#243b6b'}}
                            optionsListStyle={{borderColor: '#bec5d3'}} optionTextStyle={{color: '#243b6b'}}
                            placeholderTextColor="#bec5d3" selectControlStyle={{
                        height: 50, paddingVertical: 12, borderRadius: 10,
                        borderWidth: 1, borderColor: '#bec5d3', marginBottom: 15
                    }}
                            options={[
                                {value: 'Low', label: 'Low Priority'},
                                {value: 'Medium', label: 'Medium Priority'},
                                {value: 'High', label: 'High Priority'}
                            ]}/>
                    <Text style={{
                        marginBottom: 20, fontSize: 16,
                        color: '#adb6c8',
                        marginTop: 15
                    }}>More Options</Text>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 20,
                        paddingRight: 14
                    }}>
                        <Text style={{fontSize: 16, color: '#243b6b', textAlignVertical: 'center'}}>Save as
                            alarm</Text>
                        <TouchableOpacity
                            style={{height: 32, width: 52, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {
                                if (alarm === true) {
                                    setAlarm(false);
                                } else {
                                    setAlarm(true);
                                }
                            }}>
                            {alarm ? (<Image style={{width: 50, height: 30,}}
                                             source={require('./assets/icons8-toggle-on-50.png')}/>) : (
                                <Image style={{width: 50, height: 30}}
                                       source={require('./assets/icons8-toggle-off-50.png')}/>)}
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 14}}>
                        <Text style={{fontSize: 16, color: '#243b6b', textAlignVertical: 'center'}}>Save as
                            notification</Text>
                        <TouchableOpacity
                            style={{height: 32, width: 52, justifyContent: 'center', alignItems: 'center'}}
                            onPress={() => {
                                if (notification === true) {
                                    setNotification(false);
                                } else {
                                    setNotification(true);
                                }
                            }}>
                            {notification ? (<Image style={{width: 50, height: 30,}}
                                                    source={require('./assets/icons8-toggle-on-50.png')}/>) : (
                                <Image style={{width: 50, height: 30}}
                                       source={require('./assets/icons8-toggle-off-50.png')}/>)}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                </GestureHandlerRootView>
                <TouchableOpacity onPress={editTask} style={{
                    width: 70,
                    height: 70,
                    borderRadius: 100,
                    position: 'absolute',
                    bottom: 40,
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#243b6b',
                    elevation: 10,
                    shadowColor: '#243b6b',
                    shadowOpacity: 1
                }}>
                    <Image style={{width: 30, height: 30, tintColor: 'white', backgroundColor: '#243b6b'}}
                           source={require('./assets/icons8-done-30.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}
function EditProfile({ navigation, route }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffeeee' }}>
            <Text>Edit Profile page</Text>
        </View>
    );
}

function Scheduler({ navigation, route }) {
    const [screenIsReady, setscreenIsReady] = useState(false);
    const [liststate, setliststate] = useState(false);
    let searchcontextvalue = React.useContext(SearchContext);
    const { searchFunc } = React.useContext(AuthContext);
    const [flag, setFlag] = useState(true);
    let Viewheight;
    //this hook rerenders the screen when it is focused and unfocused
    const isFocused = useIsFocused();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            
            navigation.setOptions({
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center', borderBottomWidth: 3, borderColor: '#243b6b'}} />,
            });
        });
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
           
            search = false;
            searchText = '';
            searchFunc('');
            tabnavigationprop.setOptions(
                ({ route}) => ({
                    headerTitle: getHeaderTitle(route),
                }));
            const drawerNavigation = navigation.getParent('DrawerNav');

            drawerNavigation.setOptions({
                headerRight: () => <DashboardHeaderRight />,
            });
            navigation.setOptions({
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center', borderBottomWidth: 0}} />,
            })
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
        if (liststate === false) {
            setliststate(true);
        } else {
            setliststate(false);
        }
    }

    if (!screenIsReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={(event) => {
            onLayoutDashboardView();
        }}>
            <View style={{ backgroundColor: '#ffeeee'}}>
                <View style={{marginLeft: 40, marginTop: 20, marginBottom: 20}}>
                    <Text style={{fontWeight: 'bold', color: '#243b6b', fontSize: 24}}>Upcoming</Text>
                    <Text style={{fontWeight: 'bold', color: '#243b6b', fontSize: 24}}>tasks —</Text>
                </View>
            </View>
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <SectionList style={{marginLeft: 40, paddingRight: 14}}
                             sections={UpcomingTasksList}
                             renderItem={({ item }) => {
                                 let disp;
                                 if (search === true) {
                                     if (item.task.toLowerCase().indexOf(searchText.toLowerCase().trim()) === -1) {
                                         disp = 'none';
                                     } else {
                                         disp = 'flex';
                                     }
                                 } else {
                                     disp = 'flex';
                                 }
                                 return (<TouchableOpacity onPress={() => {
                                     navigation.navigate('EditTask', {
                                         key: item.key
                                     });
                                 }} style={{display:disp, flex:1, flexDirection: 'row', marginBottom: 10, marginTop: 10, paddingRight: 14}}>
                                     <TouchableOpacity style={{height: 30, width: 30, justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                                         handlecheckbox(item);
                                     }}>
                                         {item.checked ? (<Image style={{width: 22, height: 22, tintColor: '#93ffdf', backgroundColor: '#243b6b', borderColor: '#93ffdf', borderWidth:3, borderRadius: 6}} source={require('./assets/icons8-checked-checkbox-50.png')} />) : (<Image style={{width: 25, height: 25, tintColor: '#93ffdf'}} source={require('./assets/icons8-unchecked-checkbox-50.png')} />)}
                                     </TouchableOpacity>
                                     <Text style={styles.item}>{item.task}</Text>
                                 </TouchableOpacity>);
                             }}
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

                                 if (search === true) {
                                     for (let i = 0; i < data.length; i++) {
                                         if (data[i].task.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1) {
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

                                 return (<Text style={[styles.header, {display: disp}]}>{weekday}, {month} {day.getDate()}, {day.getFullYear()}</Text>);
                             }}
                />
            </View>
        </View>
    );
}

function Notifications({ navigation, route }) {
    const [screenIsReady, setscreenIsReady] = useState(false);
    let searchcontextvalue = React.useContext(SearchContext);
    const { searchFunc } = React.useContext(AuthContext);
    const [flag, setFlag] = useState(true);
    let Viewheight;
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            
            navigation.setOptions({
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center', position: 'absolute', right: "20%", height:"100%", borderBottomWidth: 3, borderColor: '#243b6b'}} />,
            })
        });
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            
            search = false;
            searchText = '';
            searchFunc('');
            tabnavigationprop.setOptions(
                ({ route}) => ({
                    headerTitle: getHeaderTitle(route),
                }));
            const drawerNavigation = navigation.getParent('DrawerNav');

            drawerNavigation.setOptions({
                headerRight: () => <DashboardHeaderRight />,
            });
            navigation.setOptions({
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center',  position: 'absolute', right: "20%", height:"100%", borderBottomWidth: 0}} />,
            })
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
            <View style={{ backgroundColor: '#ffeeee'}}>
                <View style={{marginLeft: 40, marginTop: 20, marginBottom: 20}}>
                    <Text style={{fontWeight: 'bold', color: '#243b6b', fontSize: 24}}>Alerts &</Text>
                    <Text style={{fontWeight: 'bold', color: '#243b6b', fontSize: 24}}>updates —</Text>
                </View>
            </View>
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <SectionList style={{marginLeft: 40, paddingRight: 14}}
                             sections={DATA2}
                             renderItem={({ item }) => {
                                 let disp;
                                 if (search === true) {
                                     if (item.alert.toLowerCase().indexOf(searchText.toLowerCase().trim()) === -1) {
                                         disp = 'none';
                                     } else {
                                         disp = 'flex';
                                     }
                                 } else {
                                     disp = 'flex';
                                 }
                                 return (<View style={{display:disp, flex:1, flexDirection: 'row', marginBottom: 10, marginTop: 10, paddingRight: 14}}>
                                     <View style={{height: 30, width: 30, justifyContent: 'center', alignItems: 'center'}}>
                                         <Image style={{width: 22, height: 22, borderColor: '#93ffdf', borderWidth:3, borderRadius: 6}} source={require('./assets/icons8-information-30.png')} />
                                     </View>
                                     <Text style={styles.item}>{item.alert}</Text>
                                 </View>);
                             }}
                             renderSectionHeader={({ section: { day, data } }) => {

                                 let disp;
                                 let count = 0;

                                 if (search === true) {
                                     for (let i = 0; i < data.length; i++) {
                                         if (data[i].alert.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1) {
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

                                 return (<Text style={[styles.header, {display: disp}]}>{day}</Text>);
                             }}
                />
            </View>
        </View>
    );
}
let english = true;
let french = false;

function Profile({ navigation }) {
    const [screenIsReady, setscreenIsReady] = useState(false);
    const [liststate, setliststate] = useState(false);
    const {height, width} = useWindowDimensions();
    function consoleWindowWidth() {
        console.log(Platform.OS + ' Window Width: ', width);
    }
    consoleWindowWidth();
    const guidelineBaseWidth = 375;
    const guidelineBaseHeight = 812;
    const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
    const verticalScale = (size) => (height / guidelineBaseHeight) * size;
    // const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;
    const scaleFont = size => size * PixelRatio.getFontScale();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            
            navigation.setOptions({
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", alignItems: 'center', position: 'absolute', right: 0, height:"100%", borderBottomWidth: 3, borderColor: '#243b6b'}} />,
            });
            const drawerNavigation = navigation.getParent('DrawerNav');
            drawerNavigation.setOptions({
                headerRight: () => <EditProfileHeaderRight navigation = {navigation} />,
            });
        });
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
           
            navigation.setOptions({
                tabBarButton: (props) => <TouchableOpacity {...props} style={{width: "20%", position: 'absolute', right: 0, height:"100%", alignItems: 'center', borderBottomWidth: 0}} />,
            });
            const drawerNavigation = navigation.getParent('DrawerNav');

            drawerNavigation.setOptions({
                headerRight: () => <DashboardHeaderRight />,
            });
        });
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        async function prepare() {
            try {
                console.log('Profile Screen Null Rendered');
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

    function handlecheckbox(item, section) {
        for (let i = 0; i < DATA3.length; i++) {
            if (section.key === DATA3[i].key) {
                for (let j = 0; j < DATA3[i].data.length; j++) {
                    if (item.key === DATA3[i].data[j].key) {
                        if (DATA3[i].data[j].switch === 'OFF') {
                            DATA3[i].data[j].switch = 'ON';
                        } else {
                            DATA3[i].data[j].switch = 'OFF';
                        }
                    }
                }
            }
        }
        if (liststate === false) {
            setliststate(true);
        } else {
            setliststate(false);
        }
    }

    if (!screenIsReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutDashboardView}>
            <View style={{ backgroundColor: '#ffeeee'}}>
                <View style={{marginLeft: horizontalScale(40), marginTop: verticalScale(20), marginBottom: verticalScale(10), flexDirection:'row'}}>
                    <Image style={{width: 70, height: 70, tintColor: '#243b6b'}} source={require('./assets/icons8-user-circle-96.png')} />
                    <View style={{marginLeft: horizontalScale(15)}}>
                        <Text style={{fontWeight: 'bold', color: '#243b6b', fontSize: scaleFont(24)}}>{loggedInName}</Text>
                        <Text style={{color: '#243b6b', fontSize: scaleFont(14), marginTop: verticalScale(5)}}>{loggedInEmail}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex:1.2 , backgroundColor: 'white', paddingBottom: verticalScale(15)}}>
                <SectionList style={{marginLeft: horizontalScale(40)}}
                             sections={DATA3} stickySectionHeadersEnabled={false}
                             renderItem={({ item, section }) => {
                                 return (<View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', marginTop: verticalScale(20), paddingRight: horizontalScale(14)}}>
                                     <Text style={{fontSize: scaleFont(16),
                                         color: '#243b6b',
                                         width: horizontalScale(246)}}>{item.setting}</Text>
                                     <TouchableOpacity style={{ paddingHorizontal:horizontalScale(10), paddingVertical:verticalScale(10), justifyContent: 'center', alignItems: 'center'}} onPress={() => {
                                         handlecheckbox(item, section);
                                     }}>
                                         {item.switch === 'ON' ? (width > 500 ? (<Image style={{aspectRatio:1}} source={require('./assets/icons8-toggle-on-60.png')} />):(<Image style={{aspectRatio:1}} source={require('./assets/icons8-toggle-on-40.png')} />)) : (width > 500 ? (<Image style={{aspectRatio:1}} source={require('./assets/icons8-toggle-off-60.png')} />):(<Image style={{aspectRatio:1}} source={require('./assets/icons8-toggle-off-40.png')} />))}
                                     </TouchableOpacity>
                                 </View>);
                             }}
                             renderSectionHeader={({ section: { settings } }) => {
                                 return (<Text style={{fontSize: scaleFont(16),
                                     color: '#adb6c8',
                                     marginTop: verticalScale(30)}}>{settings}</Text>);
                             }}
                />
            </View>
            <View style={{ flex:0.8, backgroundColor: '#ffeeee'}}>
                <View style={{marginLeft:horizontalScale(40), paddingRight:horizontalScale(14), flexDirection:'row', justifyContent:'space-between'}}>
                  <Text style={{color: '#243b6b', fontSize:scaleFont(16), top:verticalScale(10)}}>{i18n.t('changelang')}</Text>
                  <View>
                    <TouchableOpacity onPress={()=>{
                      i18n.locale = 'en';
                      english = true;
                      french = false;
                      DATA3[0].data[0].setting = i18n.t('notifset1');
                      DATA3[0].data[1].setting = i18n.t('notifset2');
                      DATA3[1].data[0].setting = i18n.t('flossset1');
                      DATA3[1].data[1].setting = i18n.t('flossset2');
                      if (liststate === false) {
                          setliststate(true);
                      } else {
                          setliststate(false);
                      }
                  }} style={{paddingHorizontal:horizontalScale(10), paddingVertical:verticalScale(10), borderRadius: scaleFont(10), flexDirection: 'row'}}>
                        {english ? (<Image style={{width: 25, height: 25,}} source={require('./assets/icons8-radio-button-on-67.png')} />) : (<Image style={{width: 25, height: 25,}} source={require('./assets/icons8-radio-button-off-67.png')} />)}<Text style={{ fontSize: scaleFont(14), color: '#243b6b',textAlignVertical: 'center', marginLeft: horizontalScale(10)}}>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{
                      i18n.locale = 'fr';
                      french = true;
                      english = false;
                      DATA3[0].data[0].setting = i18n.t('notifset1');
                      DATA3[0].data[1].setting = i18n.t('notifset2');
                      DATA3[1].data[0].setting = i18n.t('flossset1');
                      DATA3[1].data[1].setting = i18n.t('flossset2');
                      if (liststate === false) {
                          setliststate(true);
                      } else {
                          setliststate(false);
                      }
                  }} style={{paddingHorizontal:horizontalScale(10), paddingVertical: verticalScale(10), borderRadius: scaleFont(10), flexDirection: 'row', marginTop: verticalScale(10)}}>
                      {french ? (<Image style={{width: 25, height: 25,}} source={require('./assets/icons8-radio-button-on-67.png')} />) : (<Image style={{width: 25, height: 25,}} source={require('./assets/icons8-radio-button-off-67.png')} />)}<Text style={{ fontSize: scaleFont(14), color: '#243b6b',textAlignVertical: 'center', marginLeft: horizontalScale(10)}}>French</Text>
                  </TouchableOpacity>
                  </View>
                </View>
            </View>
        </View>
    );
}
const LoginScreen = ({ navigation, route}) => {
    const { signIn } = React.useContext(AuthContext);
    const [screenIsReady, setscreenIsReady] = useState(false);
    const { deleteDatabase } = React.useContext(AuthContext);
    const createTwoButtonAlert = () =>
        Alert.alert(
            "Confirm",
            "Are you sure you want to delete the user database & task database ?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Dont delete databases"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => {
                        deleteDatabase();
                    }
                }
            ]
        );
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log('Route params: ', route.params);
            if (route.params !== undefined) {
                if (route.params.newAccount === true) {
                    showToast('Account successfully created');
                    navigation.setParams({
                        newAccount: false,
                    });
                }
            }
        });
        return unsubscribe;
    }, [navigation, route]);
    useEffect(() => {
        async function prepare() {
            try {
                console.log('Login Screen Null Rendered');
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

    const onLayoutLoginView = useCallback(async () => {
        if (screenIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setscreenIsReady`, then we may see a blank screen while the screen is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            console.log('Hide splash screen');
            await SplashScreen.hideAsync();
        }
    }, [screenIsReady]);

    if (!screenIsReady) {
        return null;
    }
    return (
        <View style={styles.container} onLayout={onLayoutLoginView}>
            <View style={{flex: 1}}>
                <Text style={{color: '#243b6b', fontSize: 18, marginTop: 40, fontWeight: 'bold', letterSpacing: 3}}>LOGIN</Text>
            </View>
            <View style={{flex: 2}}>
                <Formik initialValues={{ email: '', password: '' }} validate={validateLogin} onSubmit={(values) => {
                    console.log(values);
                    let k = 0;
                    if (k === 0) {
                        signIn( values.email, values.password );
                        // navigation.navigate('Dashboard', { name: 'Admin' })
                    }
                }}>
                    {
                        ({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View>
                                <Text style={{color:'#243b6b', marginBottom: 5}}>Email</Text>
                                <TextInput style={{height: 40, marginBottom: 15, padding: 10,
                                    borderRadius: 10, backgroundColor: 'white',
                                    width: 310}}
                                           onChangeText={handleChange('email')}
                                           onBlur={handleBlur('email')}
                                           value={values.email}
                                />
                                {touched.email && errors.email ? (
                                    <Text style={{color: '#243b6b', marginBottom: 15, marginTop: -15}}>{errors.email}</Text>
                                ) : null}
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={{color:'#243b6b', marginBottom: 5}}>Password</Text>
                                    <Text style={{color:'#c0bec7', marginBottom: 5, textDecorationLine: 'underline'}}>Forgot?</Text>
                                </View>
                                <TextInput style={{height: 40, marginBottom: 30, padding: 10,
                                    borderRadius: 10, backgroundColor: 'white',
                                    width: 310}}
                                           onChangeText={handleChange('password')}
                                           onBlur={handleBlur('password')}
                                           value={values.password} secureTextEntry
                                />
                                {touched.password && errors.password ? (
                                    <Text style={{color: '#243b6b', marginBottom: 30, marginTop: -30}}>{errors.password}</Text>
                                ) : null}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleSubmit}
                                >
                                    <Text style={{color: 'white'}}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </Formik>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Register');
                }} style={{alignSelf:'center', alignItems:'center', marginTop: 20, width: 200, paddingBottom:10}}>
                    <Text style={{color: '#243b6b', textDecorationLine:'underline', fontWeight: '700'}}>New User? Register Here</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={createTwoButtonAlert} style={{alignSelf:'center', alignItems:'center', marginTop: 20, width: 200, paddingBottom:10}}>
                    <Text style={{color: '#243b6b', textDecorationLine:'underline', fontWeight: '700'}}>Delete Database</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
};
const RegisterScreen = ({ navigation}) => {
    const { register } = React.useContext(AuthContext);
    useEffect(() => {
        console.log('Register Screen Rendered');
    }, []);
    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <Text style={{color: '#243b6b', fontSize: 18, marginTop: 40, fontWeight: 'bold', letterSpacing: 3}}>REGISTER</Text>
            </View>
            <View style={{flex: 4}}>
                <Formik initialValues={{ fullName: '', email: '', password: '', confirmpassword: ''}} validate={validateRegister} onSubmit={(values) => {
                    console.log(values);
                    let k = 0;
                    if (k === 0) {
                        register( values.fullName, values.email, values.password, values.confirmpassword, navigation );
                        // navigation.navigate('Dashboard', { name: 'Admin' })
                    }
                }}>
                    {
                        ({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View>
                                <Text style={{color:'#243b6b', marginBottom: 5}}>Full Name</Text>
                                <TextInput style={{height: 40, marginBottom: 15, padding: 10,
                                    borderRadius: 10, backgroundColor: 'white',
                                    width: 310}}
                                           onChangeText={handleChange('fullName')}
                                           onBlur={handleBlur('fullName')}
                                           value={values.fullName}
                                />
                                {touched.fullName && errors.fullName ? (
                                    <Text style={{color: '#243b6b', marginBottom: 15, marginTop: -15}}>{errors.fullName}</Text>
                                ) : null}
                                <Text style={{color:'#243b6b', marginBottom: 5}}>Email</Text>
                                <TextInput style={{height: 40, marginBottom: 15, padding: 10,
                                    borderRadius: 10, backgroundColor: 'white',
                                    width: 310}}
                                           onChangeText={handleChange('email')}
                                           onBlur={handleBlur('email')}
                                           value={values.email}
                                />
                                {touched.email && errors.email ? (
                                    <Text style={{color: '#243b6b', marginBottom: 15, marginTop: -15}}>{errors.email}</Text>
                                ) : null}
                                <Text style={{color:'#243b6b', marginBottom: 5}}>Password</Text>
                                <TextInput style={{height: 40, marginBottom: 15, padding: 10,
                                    borderRadius: 10, backgroundColor: 'white',
                                    width: 310}}
                                           onChangeText={handleChange('password')}
                                           onBlur={handleBlur('password')}
                                           value={values.password} secureTextEntry
                                />
                                {touched.password && errors.password ? (
                                    <Text style={{color: '#243b6b', marginBottom: 15, marginTop: -15}}>{errors.password}</Text>
                                ) : null}
                                <Text style={{color:'#243b6b', marginBottom: 5}}>Confirm password</Text>
                                <TextInput style={{height: 40, marginBottom: 30, padding: 10,
                                    borderRadius: 10, backgroundColor: 'white',
                                    width: 310}}
                                           onChangeText={handleChange('confirmpassword')}
                                           onBlur={handleBlur('confirmpassword')}
                                           value={values.confirmpassword} secureTextEntry
                                />
                                {touched.confirmpassword && errors.confirmpassword ? (
                                    <Text style={{color: '#243b6b', marginBottom: 30, marginTop: -30}}>{errors.confirmpassword}</Text>
                                ) : null}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleSubmit}
                                >
                                    <Text style={{color: 'white'}}>Register</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </Formik>
                <Text style={{textAlign: 'center', width: 240, color: '#243b6b', alignSelf: 'center', marginTop: 25}}>
                    By registering, you automatically accept the
                    <TouchableOpacity style={{paddingHorizontal: 5, height: 20}} onPress={()=> {
                        console.log('Link Pressed');
                    }}>
                        <Text style={{color: '#243b6b', textDecorationLine:'underline', fontWeight: '600'}}>Terms & Policies</Text>
                    </TouchableOpacity>
                    of Candy app
                </Text>
                <TouchableOpacity style={{alignSelf:'center', alignItems:'center', marginTop: 25, width: 200, paddingBottom:10}} onPress={()=>{
                    navigation.goBack();
                }}>
                    <Text style={{color: '#243b6b', textDecorationLine:'underline', fontWeight: '700'}}>Have account? Log In</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffeeee',
        alignItems: 'center',
    },
    item: {
        fontSize: 16,
        color: '#243b6b',
        marginLeft: 20,
        marginRight: 14,
        paddingRight: 4
    },
    settingLabel: {
        fontSize: 16,
        color: '#243b6b',
        textAlignVertical: 'center',
        width: 280,
    },
    button: {
        alignItems: "center",
        backgroundColor: '#243b6b',
        padding: 10,
        borderRadius: 10
    },
    header: {
        fontSize: 16,
        color: '#adb6c8',
        marginTop: 30
    },
});
