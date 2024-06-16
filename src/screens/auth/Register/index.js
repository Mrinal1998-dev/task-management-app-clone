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
import {verticalScale} from "../../../theme/metrics";
import colors from "../../../theme/colors";
import PrimaryButton from "../../../components/PrimaryButton";

const validateRegister = values => {
    const errors = {};

    if (!values.fullName) {
        errors.fullName = 'Required';
        // console.log('Please enter your full name')
    }

    if (!values.email) {
        errors.email = 'Required';
        // console.log('Please enter email')
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
        // console.log('Please enter valid email address')
    }

    if (!values.password) {
        errors.password = 'Required';
        // console.log('Please enter password')
    }
    if (!values.confirmpassword) {
        errors.confirmpassword = 'Required';
        // console.log('Please enter the confirmed password')
    }
    return errors;
};

const RegisterScreen = ({ navigation}) => {
    const { register } = React.useContext(AuthContext);

    const { showLoader, hideLoader } = useContext(LoaderContext);

    const [disabled, setDisabled] = useState(false);

    const insets = useSafeAreaInsets();

    useEffect(() => {
        console.log('Register Screen Rendered');
    }, []);

    return (
        <View style={[styles.container, {paddingTop: insets.top}]}>
            <View style={{flex: 1}}>
                <Text style={styles.registerHeader}>REGISTER</Text>
            </View>
            <View style={{flex: 4, width: "75%"}}>
                <Formik initialValues={{ fullName: '', email: '', password: '', confirmpassword: ''}} validate={validateRegister} onSubmit={(values) => {
                    console.log(values);
                    setDisabled(true);
                    showLoader();
                    register( values.fullName, values.email, values.password, values.confirmpassword, navigation, setDisabled );
                }}>
                    {
                        ({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput style={styles.input}
                                           onChangeText={handleChange('fullName')}
                                           onBlur={handleBlur('fullName')}
                                           value={values.fullName}
                                />
                                {touched.fullName && errors.fullName ? (
                                    <Text style={styles.validationmsg}>{errors.fullName}</Text>
                                ) : null}
                                <Text style={styles.label}>Email</Text>
                                <TextInput style={styles.input}
                                           onChangeText={handleChange('email')}
                                           onBlur={handleBlur('email')}
                                           value={values.email}
                                />
                                {touched.email && errors.email ? (
                                    <Text style={styles.validationmsg}>{errors.email}</Text>
                                ) : null}
                                <Text style={styles.label}>Password</Text>
                                <TextInput style={styles.input}
                                           onChangeText={handleChange('password')}
                                           onBlur={handleBlur('password')}
                                           value={values.password} secureTextEntry
                                />
                                {touched.password && errors.password ? (
                                    <Text style={styles.validationmsg}>{errors.password}</Text>
                                ) : null}
                                <Text style={styles.label}>Confirm password</Text>
                                <TextInput style={[styles.input, {marginBottom: verticalScale(30)}]}
                                           onChangeText={handleChange('confirmpassword')}
                                           onBlur={handleBlur('confirmpassword')}
                                           value={values.confirmpassword} secureTextEntry
                                />
                                {touched.confirmpassword && errors.confirmpassword ? (
                                    <Text style={[ styles.validationmsg, {marginBottom: verticalScale(30), marginTop: verticalScale(-30)}]}>{errors.confirmpassword}</Text>
                                ) : null}

                                <PrimaryButton name={"Register"} disabled={disabled} handleSubmit={handleSubmit} />

                            </View>
                        )
                    }
                </Formik>
                <Text style={styles.termsAndConditionsText}>
                    By registering, you automatically accept the
                    <TouchableOpacity style={styles.link1} onPress={()=> {
                        console.log('Link Pressed');
                    }}>
                        <Text style={styles.linkText}>Terms & Policies</Text>
                    </TouchableOpacity>
                    of Candy app
                </Text>
                <TouchableOpacity style={styles.link2} onPress={()=>{
                    navigation.goBack();
                }}>
                    <Text style={styles.linkText}>Have account? Log In</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />
        </View>
    );
};

export default RegisterScreen;