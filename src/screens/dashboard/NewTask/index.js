import { Select } from '@mobile-reality/react-native-select-pro';
import DateTimePicker from '@react-native-community/datetimepicker';
import {ScrollView, GestureHandlerRootView} from "react-native-gesture-handler";
import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio, Linking, Platform} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertDateStringtoObj, fetchTodayTaskList, fetchUpcomingTaskList } from '../../../services/utils';
import {LoaderContext, TasksContext, UserContext} from "../../../context";
import styles from "./styles";
import {verticalScale} from "../../../theme/metrics";
import {StatusBar} from 'expo-status-bar';
import colors from "../../../theme/colors";
import Option from "../../../components/Option";
import BackButton from "../../../components/BackButton";


function NewTask({ navigation, route}) {
    const [task, onChangeTask] = React.useState(null);
    const [priority, setPriority] = React.useState(null);
    const [date, setDate] = useState(null);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [alarm, setAlarm] = useState(false);
    const [notification, setNotification] = useState(true);

    const {setLoggedInUserTasks, setTodayTasksList, setUpcomingTasksList} = useContext(TasksContext)

    const {loggedInEmailState} = useContext(UserContext);

    const { showLoader, hideLoader } = useContext(LoaderContext);

    const [disabled, setDisabled] = useState(false);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            navigation.setOptions({
                headerLeft: (props) => {
                    return ( <BackButton /> );
                }
            });
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    const onChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate;
            // console.log('Selected Date: ', currentDate);
            setShow(false);
            setDate(currentDate);
        } else {
            // console.log('Date picker dismissed');
            setShow(false);
        }
    };

    const showDatepicker = () => {
        setShow(true);
    };


    async function addNewTask() {
        setDisabled(true);
        showLoader();
        if (task == null || task.trim() == '') {
            Alert.alert('Enter the new task');
            setDisabled(false);
            hideLoader();
        } else {
            if (date == null) {
                Alert.alert('Enter the date by which the task should be completed');
                setDisabled(false);
                hideLoader();
            } else {
                if (priority == null) {
                    Alert.alert('Choose a priority for the task');
                    setDisabled(false);
                    hideLoader();
                } else {
                    //new task can be added
                    let taskDatabase;
                    try {
                        taskDatabase = await AsyncStorage.getItem('task_database');
                        taskDatabase = JSON.parse(taskDatabase);
                        taskDatabase = convertDateStringtoObj(taskDatabase);
                        let loggedInUserTasks;
                        for (let i = 0; i < taskDatabase.length; i++) {
                            if (taskDatabase[i].email === loggedInEmailState) {
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
                                setLoggedInUserTasks(taskDatabase[i].tasks);
                                loggedInUserTasks = taskDatabase[i].tasks;
                            }
                        }
                        console.log("Logged in user's tasks: ", loggedInUserTasks);
                        console.log('New task added');
                        fetchTodayTaskList(loggedInUserTasks, setTodayTasksList);
                        fetchUpcomingTaskList(loggedInUserTasks, setUpcomingTasksList);

                        taskDatabase = JSON.stringify(taskDatabase);
                        let updatetaskDatabase;
                        try {
                            updatetaskDatabase = await AsyncStorage.setItem('task_database', taskDatabase);
                            setDisabled(false);
                            hideLoader();
                            navigation.navigate('ToDo', { newTask: true });
                        } catch (e) {
                            console.log(e);
                            setDisabled(false);
                            hideLoader();
                        }
                    } catch (e) {
                        console.log(e);
                        setDisabled(false);
                        hideLoader();
                    }
                }
            }
        }
    }

    return (
        <View style={{flex: 1}}>
            <View style={{ backgroundColor: colors.backgroundPrimary}}>
                <View style={styles.taskInputContainer}>
                    <TextInput
                        multiline
                        placeholder='Write here...'
                        numberOfLines={3}
                        onChangeText={text => onChangeTask(text)}
                        value={task}
                        style={styles.taskInput}
                    />
                </View>
            </View>
            <View style={{flex: 1, backgroundColor: colors.backgroundSecondary}}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                <ScrollView overScrollMode={"never"} contentContainerStyle={styles.scrollViewContainer}>
                    <Text style={styles.label}>Complete By</Text>
                    <TouchableOpacity activeOpacity={1} style={styles.datepickerInput} onPress={showDatepicker}>
                        <Text>
                            {date ?
                            (<Text style={{color: colors.textPrimary}}>
                                {date.getDate()} - {date.getMonth() + 1} - {date.getFullYear()}
                            </Text>) :
                            (<Text style={{color: colors.placeholder1}}>
                                Select a date
                            </Text>)
                            }
                        </Text>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date ? date : ( new Date() ) }
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                            minimumDate={new Date()}
                            style={{height: verticalScale(50)}}
                        />
                    )}
                    <Text style={styles.label}>Priority</Text>
                    <Select onSelect={(option, optionIndex) => {
                        // console.log(option);
                        if (option === null) {
                            setPriority(null);
                        } else {
                            setPriority(option.value);
                        }
                    }} searchable={false} placeholderText="Choose priority"
                            selectControlTextStyle={{fontSize: 14, color: colors.textPrimary}}
                            selectControlArrowImageStyle={{top: verticalScale(14), tintColor: colors.textPrimary}}
                            selectControlClearOptionImageStyle={{top: verticalScale(14), tintColor: colors.textPrimary}}
                            optionsListStyle={{borderColor: colors.border1}} optionTextStyle={{color: colors.textPrimary}}
                            placeholderTextColor={colors.placeholder1} selectControlStyle={styles.prioritySelectControl}
                            options={[
                                {value: 'Low', label: 'Low Priority'},
                                {value: 'Medium', label: 'Medium Priority'},
                                {value: 'High', label: 'High Priority'}
                            ]}/>
                    <Text style={styles.sectionHeader}>More Options</Text>

                    <Option title={"Save as alarm"} value={alarm} setValue={setAlarm} marginBottom={20} />
                    <Option title={"Save as notification"} value={notification} setValue={setNotification} />

                </ScrollView>
                </GestureHandlerRootView>
                <TouchableOpacity onPress={addNewTask} style={[styles.newTaskBtn, {pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.5 : 1 }]}>
                    <Image style={styles.newTaskBtnImage} source={require('../../../../assets/icons8-done-90.png')}/>
                </TouchableOpacity>
            </View>
            <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />
        </View>
    );
}

export default NewTask;