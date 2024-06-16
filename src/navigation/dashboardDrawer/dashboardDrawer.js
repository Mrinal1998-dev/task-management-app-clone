import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../../components/CustomDrawerContent';
import DashboardHeaderRight from '../../components/DashboardHeaderRight';
import {getHeaderTitle} from '../../services/utils';
import DashboardBottomTabsNavigation from '../dashboardBottomTabs/dashboardBottomTabs';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FocusedDrawerItemContext, SearchContext} from "../../context";
import {
    SafeAreaProvider,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import styles from "./styles";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const Drawer = createDrawerNavigator();

function DashboardDrawerNavigation(){

    const [searchState, setSearch] = useState(false);
    const [searchTextState, setSearchText] = useState("");

    const [todoState, setToDo] = useState(false);
    const [notificationsState, setNotifications] = useState(false);
    const [schedulerState, setScheduler] = useState(false);
    const [profileState, setProfile] = useState(false);

    const insets = useSafeAreaInsets();

    return (
        <FocusedDrawerItemContext.Provider value={{
            todoState,
            setToDo,
            notificationsState,
            setNotifications,
            schedulerState,
            setScheduler,
            profileState,
            setProfile
        }}>
            <SearchContext.Provider value={{
                searchState,
                setSearch,
                searchTextState,
                setSearchText
            }}>
        <Drawer.Navigator id="DrawerNav" drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
                ...styles.header,
                height: insets.top + verticalScale(70)
            },
            headerTintColor: colors.textPrimary,
            headerRight: () => <DashboardHeaderRight />,
            headerTitleStyle: styles.headerTitle,
            drawerStyle: {
                width: '80%',
            },
            headerTitleContainerStyle: {
                width: "100%",
            }
        }}>
            <Drawer.Screen name="DashboardBottomTabsNavigation" options={
                ({ route}) => ({
                    headerTitle: getHeaderTitle(route, setToDo, setNotifications, setScheduler, setProfile, searchState),
                })} component={DashboardBottomTabsNavigation} />
        </Drawer.Navigator>
            </SearchContext.Provider>
        </FocusedDrawerItemContext.Provider>
    );
}

export default DashboardDrawerNavigation;