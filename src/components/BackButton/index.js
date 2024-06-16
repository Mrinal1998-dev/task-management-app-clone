import {useNavigation} from "@react-navigation/native";
import {Image, TouchableOpacity} from "react-native";
import {horizontalScale} from "../../theme/metrics";
import styles from "./styles";
import React from "react";

function BackButton() {

    const navigation = useNavigation();

    return (
        <TouchableOpacity style={{marginLeft: horizontalScale(15)}} onPress={() => {
            navigation.goBack();
        }}>
            <Image style={styles.goBackBtnImage} source={require('../../../assets/icons8-less-than-90.png')}/>
        </TouchableOpacity>
    );
}

export default BackButton;