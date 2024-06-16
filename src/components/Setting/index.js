import {useNavigation} from "@react-navigation/native";
import {Image, Text, TouchableOpacity, View} from "react-native";
import styles from "./styles";
import React from "react";
import {verticalScale} from "../../theme/metrics";
import {translate} from "../../i18n/config";

function Setting({item, section, handlecheckbox}) {

    return (<View style={[styles.itemContainer, {marginBottom: item.key === "2" ? verticalScale(20) : verticalScale(5) }]}>
        <Text style={styles.settingText}>
            {translate(item.setting)}
        </Text>
        <TouchableOpacity style={styles.settingSwitch} onPress={() => {
            handlecheckbox(item, section);
        }}>
            {item.switch === 'ON' ?
                <Image style={styles.switchImage} source={require('../../../assets/icons8-toggle-on-100.png')} /> :
                <Image style={styles.switchImage} source={require('../../../assets/icons8-toggle-off-100.png')} />
            }
        </TouchableOpacity>
    </View>);

}

export default Setting;