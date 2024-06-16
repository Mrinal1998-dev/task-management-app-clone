import {useNavigation} from "@react-navigation/native";
import {Image, Text, TouchableOpacity, View} from "react-native";
import styles from "./styles";
import React from "react";
import {verticalScale} from "../../theme/metrics";

function Option({title, value, setValue, marginBottom}) {

    return (
        <View style={[styles.optionContainer, {marginBottom: marginBottom ? verticalScale(marginBottom) : 0}]}>
            <Text style={styles.optionTitle}>{title}</Text>
            <TouchableOpacity
                style={styles.switchButton}
                onPress={() => {
                    if (value === true) {
                        setValue(false);
                    } else {
                        setValue(true);
                    }
                }}>
                {value ? (<Image style={styles.switchImage}
                                 source={require('../../../assets/icons8-toggle-on-100.png')}/>) : (
                    <Image style={styles.switchImage}
                           source={require('../../../assets/icons8-toggle-off-100.png')}/>)}
            </TouchableOpacity>
        </View>
    )

}

export default Option;