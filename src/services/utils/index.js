import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import SearchHeader from '../../components/SearchHeader';
import Toast from 'react-native-root-toast';
import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenOrientation from 'expo-screen-orientation';

const showToast = (msg) => {
    let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
    });
};

function consoleWindowWidth(width) {
    console.log(Platform.OS + ' Window Width: ', width);
}

function changeSecureTextStatus(secureText, setSecureText) {
    if(secureText === true){
        setSecureText(false);
    } else {
        setSecureText(true);
    } 
}

async function lockScreenOrientationToPotrait() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP );
}

async function persistState(PERSISTENCE_KEY, setInitialState, setIsReady){
    try {
        const initialUrl = await Linking.getInitialURL();
        console.log('Initial url: ', initialUrl);
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
}

function getHeaderTitle(route, setToDo, setNotifications, setScheduler, setProfile, searchState) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'ToDo';
    if (searchState === true) {
        return (() => <SearchHeader /> );
    } else {
        switch (routeName) {
            case 'ToDo':
                setTimeout(function (){
                    setToDo(true);
                    setScheduler(false);
                    setNotifications(false);
                    setProfile(false);
                }, 500);

                return 'TO-DO';
            case 'Scheduler':
                setTimeout(function (){
                    setScheduler(true);
                    setToDo(false);
                    setNotifications(false);
                    setProfile(false);
                }, 500);

                return 'SCHEDULER';
            case 'Notifications':
                setTimeout(function (){
                    setNotifications(true);
                    setToDo(false);
                    setScheduler(false);
                    setProfile(false);
                }, 500);

                return 'NOTIFICATIONS';
            case 'Profile':
                setTimeout(function (){
                    setProfile(true);
                    setToDo(false);
                    setScheduler(false);
                    setNotifications(false);
                }, 500);

                return 'PROFILE';
            case 'NewTask':
                return  'NEW TASK';
            case 'EditTask':
                return 'EDIT TASK';
        }
    }
}


const byteSize = str => new Blob([str]).size;


function fetchTodayTaskList(loggedInUserTasks, setTodayTasksList) {
    const todayDate = new Date();
    const todayDay = todayDate.getDate();
    const todayMonth = todayDate.getMonth();
    const todayYear = todayDate.getFullYear();
    let todayTasksList = [];
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
    setTodayTasksList(todayTasksList);
    console.log('today tasks list: ', todayTasksList);
}

function fetchUpcomingTaskList(loggedInUserTasks, setUpcomingTasksList) {
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
    
    //Next step: Sort the datesarray in asc order.

    // How to Sort an Array by Date in JavaScript (Date Objects)

    datesarray.sort(function(a, b){
        return a - b
    });
    
    //Next step: Using the sorted datesarray, push parent objects to the Upcomingtasklist

    let UpcomingTasksList = [];

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
                // this date will not be added to the upcomingtasklist because this date has already been added
            } else {
                UpcomingTasksList.push({
                    day: datesarray[i],
                    data: []
                });
            }
        }
    }
        
    //Next step: Using the upcomingtasklist, push task objects to each parent object in the Upcomingtasklist
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
    console.log('Upcoming task list: ', UpcomingTasksList);
    setUpcomingTasksList(UpcomingTasksList);
}

async function fetchLoggedInUserTasks(loggedInEmailState,
                                      setLoggedInUserTasks,
                                      setTodayTasksList,
                                      setUpcomingTasksList) {
    let taskDatabase;
    try{
        taskDatabase = await AsyncStorage.getItem('task_database');
        taskDatabase = JSON.parse(taskDatabase);
        taskDatabase = convertDateStringtoObj(taskDatabase);
        console.log('Task Database: ', taskDatabase);
        let loggedInUserTasks;
        for (let i = 0; i < taskDatabase.length; i++) {
            if (taskDatabase[i].email === loggedInEmailState) {
                setLoggedInUserTasks(taskDatabase[i].tasks);
                loggedInUserTasks = taskDatabase[i].tasks;
            }
        }
        console.log("Logged in user's tasks: ", loggedInUserTasks);
        fetchTodayTaskList(loggedInUserTasks, setTodayTasksList);
        fetchUpcomingTaskList(loggedInUserTasks, setUpcomingTasksList);
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

export {
    getHeaderTitle,
    fetchLoggedInUserTasks,
    convertDateStringtoObj,
    extractFirstName,
    showToast,
    persistState,
    consoleWindowWidth,
    changeSecureTextStatus,
    byteSize,
    fetchTodayTaskList,
    fetchUpcomingTaskList,
    lockScreenOrientationToPotrait
    };