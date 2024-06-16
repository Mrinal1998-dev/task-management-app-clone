import styles from "./styles";
import {StatusBar} from 'expo-status-bar';
import {Formik} from 'formik';

import {Alert, ToastAndroid, FlatList, SectionList, Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
    ActivityIndicator, Image, Keyboard, useWindowDimensions, PixelRatio, Linking, Platform} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {AuthContext, LoaderContext} from "../../../context";
import * as SplashScreen from 'expo-splash-screen';
import {showToast} from "../../../services/utils";
import {verticalScale} from "../../../theme/metrics";
import colors from "../../../theme/colors";
import PrimaryButton from "../../../components/PrimaryButton";


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


const LoginScreen = ({ navigation, route}) => {

    const { signIn } = React.useContext(AuthContext);
    const [screenIsReady, setscreenIsReady] = useState(false);
    const { deleteDatabase } = React.useContext(AuthContext);

    const { showLoader, hideLoader } = useContext(LoaderContext);

    const [disabled, setDisabled] = useState(false);

    const insets = useSafeAreaInsets();

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
                      showLoader();
                      deleteDatabase();
                    }
                }
            ]
        );

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // console.log('Route params: ', route.params);
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
        <View style={[styles.container, {paddingTop: insets.top}]} onLayout={onLayoutLoginView}>
            <View style={{flex: 1}}>
                <Text style={styles.loginHeader}>LOGIN</Text>
            </View>
            <View style={{flex: 2, width: "75%"}}>
                <Formik initialValues={{ email: '', password: '' }} validate={validateLogin} onSubmit={(values) => {
                    console.log(values);
                    setDisabled(true);
                    showLoader();
                    signIn( values.email, values.password, setDisabled );
                }}>
                    {
                        ({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View>
                                <Text style={styles.label}>Email</Text>
                                <TextInput style={styles.input}
                                           onChangeText={handleChange('email')}
                                           onBlur={handleBlur('email')}
                                           value={values.email}
                                />
                                {touched.email && errors.email ? (
                                    <Text style={styles.emailInputValidationMsg}>{errors.email}</Text>
                                ) : null}
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Text style={styles.label}>Password</Text>
                                    <Text style={{color:'#c0bec7', marginBottom: verticalScale(5), textDecorationLine: 'underline'}}>Forgot?</Text>
                                </View>
                                <TextInput style={[styles.input, {marginBottom: verticalScale(30)}]}
                                           onChangeText={handleChange('password')}
                                           onBlur={handleBlur('password')}
                                           value={values.password} secureTextEntry
                                />
                                {touched.password && errors.password ? (
                                    <Text style={styles.passwordInputValidationMsg}>{errors.password}</Text>
                                ) : null}

                                <PrimaryButton name={"Login"} disabled={disabled} handleSubmit={handleSubmit} />
                            </View>
                        )
                    }
                </Formik>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Register');
                }} style={styles.link}>
                    <Text style={styles.linkText}>New User? Register Here</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={createTwoButtonAlert} style={styles.link}>
                    <Text style={styles.linkText}>Delete Database</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />
        </View>
    );
};

export default LoginScreen