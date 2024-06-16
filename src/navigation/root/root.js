import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../../screens/auth/Login';
import RegisterScreen from '../../screens/auth/Register';
import DashboardScreen from '../../screens/dashboard';
import NewTask from '../../screens/dashboard/NewTask';
import EditTask from '../../screens/dashboard/EditTask';
import EditProfile from '../../screens/dashboard/EditProfile';
import styles from "./styles"
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";
import BackButton from "../../components/BackButton";

const Stack = createStackNavigator();

function RootNavigation(props){

    const insets = useSafeAreaInsets();

    return (
        <NavigationContainer initialState={props.initialState} onStateChange={(state) => {
            // console.log('New state stored: ', state);
            // console.log('Current Initial State: ', props.initialState);
            AsyncStorage.setItem(props.persistenceKey, JSON.stringify(state))
        }
        } >
          <Stack.Navigator screenOptions={{
                                headerShown: false
                            }}>
                                {props.authState.userToken == null ? (
                                    // No token found, user isn't signed in
                                    <Stack.Group>
                                        <Stack.Screen name="Login" component={LoginScreen} options={{
                                            title: 'Login',
                                            // When logging out, a pop animation feels intuitive
                                            animationTypeForReplace: props.authState.isSignout ? 'pop' : 'push', }} />
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
                                            headerStyle: {
                                                backgroundColor:colors.backgroundPrimary,
                                                elevation: 40,
                                                shadowColor: colors.headerShadow,
                                                shadowOpacity: 1
                                            },
                                            headerTitle: ()=>{
                                                return (
                                                    <Text style={styles.headerTitleText}>NEW TASK</Text>
                                                );
                                            },
                                            headerTitleAlign: "center",
                                            headerBackVisible: false,
                                            headerLeft: (props) => {

                                                return ( <BackButton /> );
                                            },
                                            headerShadowVisible: true
                                        }} />
                                        <Stack.Screen name="EditTask" component={EditTask} options={{
                                            headerShown: true,
                                            headerStyle: {
                                                backgroundColor:colors.backgroundPrimary,
                                                elevation: 40,
                                                shadowColor: colors.headerShadow,
                                                shadowOpacity: 1
                                            },
                                            headerTitle: ()=>{
                                                return (
                                                    <Text style={styles.headerTitleText}>EDIT TASK</Text>
                                                );
                                            },
                                            headerTitleAlign: "center",
                                            headerBackVisible: false,
                                            headerLeft: (props) => {

                                                return ( <BackButton /> );
                                            },
                                            headerShadowVisible: true
                                        }} />
                                        <Stack.Screen name="EditProfile" component={EditProfile} options={{
                                            headerShown: true,
                                            headerStyle: {
                                                backgroundColor:colors.backgroundPrimary,
                                                elevation: 40,
                                                shadowColor: colors.headerShadow,
                                                shadowOpacity: 1
                                            },
                                            headerTitle: ()=>{
                                                return (
                                                    <Text style={styles.headerTitleText}>EDIT PROFILE</Text>
                                                );
                                            },
                                            headerTitleAlign: "center",
                                            headerBackVisible: false,
                                            headerLeft: (props) => {

                                                return ( <Image style={{
                                                    width: horizontalScale(35),
                                                    height: verticalScale(35),
                                                    objectFit: "contain",
                                                    marginLeft: horizontalScale(15)
                                                }} source={require('../../../assets/icons8-help-100.png')}/> );
                                            },
                                            headerShadowVisible: true
                                        }} />
                                    </Stack.Group>
                                )}
                            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default RootNavigation;