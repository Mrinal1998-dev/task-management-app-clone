import { Text,  View } from 'react-native';
import React from 'react';
import styles from "./styles";
import {StatusBar} from "expo-status-bar";
import colors from "../../../theme/colors";

function EditProfile({ navigation, route }) {
    return (
        <View style={styles.container}>
            <Text>Edit Profile page</Text>
            <StatusBar style="dark" backgroundColor={colors.backgroundPrimary} />
        </View>
    );
}

export default EditProfile;