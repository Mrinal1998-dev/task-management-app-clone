import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio, Linking, Platform} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {i18n, translate} from '../../../i18n/config';
import { UserContext} from "../../../context";
import EditProfileHeaderRight from "../../../components/EditProfileHeaderRight";
import DashboardHeaderRight from "../../../components/DashboardHeaderRight";
import {horizontalScale, verticalScale} from "../../../theme/metrics";
import * as SplashScreen from 'expo-splash-screen';
import styles from "./styles";
import {StatusBar} from 'expo-status-bar';
import colors from "../../../theme/colors";
import Setting from "../../../components/Setting";

const DATA3 = [
    {
        key: '1',
        settings: "notifsettings",
        data: [{
            key: '1',
            setting: 'notifset1',
            switch: 'ON'
        },{
            key: '2',
            setting: 'notifset2',
            switch: 'OFF'
        }]
    },
    {
        key: '2',
        settings: "flosssettings",
        data: [{
            key: '1',
            setting: 'flossset1',
            switch: 'ON'
        },{
            key: '2',
            setting: 'flossset2',
            switch: 'OFF'
        }]
    }
];


function Profile({ navigation }) {
    const [screenIsReady, setscreenIsReady] = useState(false);

    const [profileData, setProfileData] = useState(DATA3);

    const {loggedInNameState, loggedInEmailState} = useContext(UserContext)
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.locale);

    const setLanguage = (lang) => {
        i18n.locale = lang;
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang); // Call the switch language function
        setSelectedLanguage(lang);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {

            const drawerNavigation = navigation.getParent('DrawerNav');
            drawerNavigation.setOptions({
                headerRight: () => <EditProfileHeaderRight />,
            });
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {

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

        let data = [...profileData];

        for (let i = 0; i < data.length; i++) {
            if (section.key === data[i].key) {
                for (let j = 0; j < data[i].data.length; j++) {
                    if (item.key === data[i].data[j].key) {
                        if (data[i].data[j].switch === 'OFF') {
                            data[i].data[j].switch = 'ON';
                        } else {
                            data[i].data[j].switch = 'OFF';
                        }
                    }
                }
            }
        }

        setProfileData(data);

    }

    if (!screenIsReady) {
        return null;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutDashboardView}>
            <View style={{ backgroundColor: colors.backgroundPrimary}}>
                <View style={styles.loggedInUserContainer}>
                    <Image style={styles.userAvatar} source={require('../../../../assets/icons8-user-circle-96.png')} />
                    <View style={{marginLeft: horizontalScale(15)}}>
                        <Text style={styles.loggedInName}>{loggedInNameState}</Text>
                        <Text style={styles.loggedInEmail}>{loggedInEmailState}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.sectionListContainer}>
                <SectionList overScrollMode={"never"} style={{marginLeft: horizontalScale(40)}}
                             sections={profileData} stickySectionHeadersEnabled={false}
                             renderItem={({ item, section }) => <Setting item={item} section={section} handlecheckbox={handlecheckbox} /> }
                             renderSectionHeader={({ section: { settings, key } }) => {

                                 return (<Text style={[styles.sectionHeader, { marginTop: key === "1" ? verticalScale(30) : verticalScale(10) }]}>{translate(settings)}</Text>);

                             }}
                />
            </View>
            <View style={{ flex:0.8, backgroundColor: colors.backgroundPrimary}}>
                <View style={styles.changeLangContainer}>
                  <Text style={styles.changeLangText}>{translate('changelang')}</Text>
                  <View>
                    <TouchableOpacity onPress={()=>{

                      handleLanguageChange("en");

                  }} style={styles.langBtn}>
                        {selectedLanguage === "en" ?
                            (<Image style={styles.radioImg} source={require('../../../../assets/icons8-radio-button-on-67.png')} />) :
                            (<Image style={styles.radioImg} source={require('../../../../assets/icons8-radio-button-off-67.png')} />)
                        }
                        <Text style={styles.langText}>{translate("english")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{

                      handleLanguageChange("fr");

                  }} style={[ styles.langBtn , {marginTop: verticalScale(15)}]}>
                      {selectedLanguage === "fr" ?
                          (<Image style={styles.radioImg} source={require('../../../../assets/icons8-radio-button-on-67.png')} />) :
                          (<Image style={styles.radioImg} source={require('../../../../assets/icons8-radio-button-off-67.png')} />)
                      }
                      <Text style={styles.langText}>{translate("french")}</Text>
                  </TouchableOpacity>
                  </View>
                </View>
            </View>
            <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />

        </View>
    );
}

export default Profile;