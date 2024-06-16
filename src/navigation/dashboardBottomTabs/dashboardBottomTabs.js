import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio} from 'react-native';
    import React, { useCallback, useEffect, useState } from 'react';    
import ToDo from '../../screens/dashboard/ToDo';
import Scheduler from '../../screens/dashboard/Scheduler';
import NewTask from '../../screens/dashboard/NewTask';
import Notifications from '../../screens/dashboard/Notifications';
import Profile from '../../screens/dashboard/Profile';
import {horizontalScale, verticalScale} from "../../theme/metrics";
import styles from "./styles";
import colors from "../../theme/colors";

const Tab = createBottomTabNavigator();

function DashboardBottomTabsNavigation({navigation}){

    return (
        <Tab.Navigator id="TabNav" sceneContainerStyle={{
            borderBottomWidth: 0,
        }} screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: colors.textPrimary,
            tabBarInactiveTintColor: 'grey',
            tabBarShowLabel: false
        }}>
            <Tab.Screen name="ToDo" component={ToDo} options={{
                tabBarButton: (props) => {
                    let selected =  props.accessibilityState.selected;
                    return (
                        <TouchableOpacity {...props} style={[styles.tabBarBtn, {borderBottomWidth: selected ? 3 : null , borderColor: selected ? colors.backgroundTertiary : null}]} />
                    )
                },
                tabBarAccessibilityLabel: 'To Do',
                tabBarIcon: (props => {
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: props.color}} source={require('../../../assets/icons8-bulleted-list-90.png')} />
                    );
                })
            }} />
            <Tab.Screen name="Scheduler" component={Scheduler} options={{
                tabBarButton: (props) => {
                    let selected =  props.accessibilityState.selected;
                    return (
                        <TouchableOpacity {...props} style={[styles.tabBarBtn, {borderBottomWidth: selected ? 3 : null , borderColor: selected ? colors.backgroundTertiary : null}]} />
                    )
                },
                tabBarAccessibilityLabel: 'Scheduler',
                tabBarIcon: (props => {
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: props.color}} source={require('../../../assets/icons8-clock-96.png')} />
                    );
                })
            }} />
            <Tab.Screen name="NewTask" component={NewTask} options={{
                tabBarButton: (props) => <View style={[styles.tabBarBtn]}>
                    <TouchableOpacity {...props} onPress={() => {
                    navigation.navigate('NewTask');
                }} style={styles.newTaskTabBarBtn} />
                </View>,
                tabBarAccessibilityLabel: 'New Task',
                tabBarIcon: (props => {
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: colors.textSecondary}} source={require('../../../assets/icons8-plus-96.png')} />
                    );
                })
            }} />
            <Tab.Screen name="Notifications" component={Notifications} options={{
                tabBarButton: (props) => {
                    let selected =  props.accessibilityState.selected;
                    return (<TouchableOpacity {...props} style={[ styles.tabBarBtn , {position: 'absolute', right: "20%", height:"100%", borderBottomWidth: selected ? 3 : null , borderColor: selected ? colors.backgroundTertiary : null  }]} />)
                },
                tabBarAccessibilityLabel: 'Notifications',
                tabBarIcon: (props => {
                    return (
                        <Image style={{ width: props.size, height: props.size, tintColor: props.color}} source={require('../../../assets/icons8-notification-96.png')} />
                    );
                })
            }} />
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarButton: (props) => {
                    let selected =  props.accessibilityState.selected;
                    return (<TouchableOpacity {...props} style={[ styles.tabBarBtn , {position: 'absolute', right: 0, height:"100%", borderBottomWidth: selected ? 3 : null , borderColor: selected ? colors.backgroundTertiary : null  }]} />)
                },
                tabBarAccessibilityLabel: 'Profile',
                tabBarIcon: (props => {
                    return (
                        <Image style={{width: props.size, height: props.size, tintColor: props.color}} source={require('../../../assets/icons8-user-96.png')} />
                    );
                })
            }} />
        </Tab.Navigator>
    );

}


export default DashboardBottomTabsNavigation;