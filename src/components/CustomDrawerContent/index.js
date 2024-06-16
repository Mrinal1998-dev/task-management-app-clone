import {  DrawerContentScrollView , DrawerItem } from '@react-navigation/drawer';
import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio} from 'react-native';   
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AuthContext, FocusedDrawerItemContext, LoaderContext, UserContext} from '../../context';
import styles from "./styles";
import {verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

function CustomDrawerContent(props) {
    
    const { signOut } = React.useContext(AuthContext);
    const { navigation } = props;

    const {loggedInFirstNameState} = useContext(UserContext);
    const { todoState, notificationsState, schedulerState, profileState } = useContext(FocusedDrawerItemContext);
    const {showLoader} = useContext(LoaderContext);

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
                      showLoader();
                      signOut();
                    }
                }
            ]
        );

    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerUserInfo}>
                    <Image style={styles.drawerUserAvatar} source={require('../../../assets/icons8-user-circle-96.png')} />
                    <Text style={styles.loggedInFirstName}>{loggedInFirstNameState}</Text>
                </View>
                <DrawerItem labelStyle={styles.drawerItemLabelStyle} style={{marginTop: verticalScale(10)}} activeTintColor={colors.textPrimary} inactiveTintColor={colors.textPrimary} label="To - Do" focused={todoState} onPress={()=>{navigation.navigate('ToDo')}} />
                <DrawerItem labelStyle={styles.drawerItemLabelStyle} activeTintColor={colors.textPrimary} inactiveTintColor={colors.textPrimary} label="Scheduler" focused={schedulerState} onPress={()=>{navigation.navigate('Scheduler')}} />
                <DrawerItem labelStyle={styles.drawerItemLabelStyle} activeTintColor={colors.textPrimary} inactiveTintColor={colors.textPrimary} label="Notifications" focused={notificationsState} onPress={()=>{navigation.navigate('Notifications')}} />
                <DrawerItem labelStyle={styles.drawerItemLabelStyle} activeTintColor={colors.textPrimary} inactiveTintColor={colors.textPrimary} label="Profile" focused={profileState} onPress={()=>{navigation.navigate('Profile')}} />
                <DrawerItem labelStyle={styles.drawerItemLabelStyle} activeTintColor={colors.textPrimary} inactiveTintColor={colors.textPrimary} label="Logout" onPress={createTwoButtonAlert} />
            </DrawerContentScrollView>
            <View style={styles.bottomContainer}>
                <Text style={styles.bottomText}>2024 Candy Clone</Text>
            </View>
        </View>
    );
}

export default CustomDrawerContent;