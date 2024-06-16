import React, {useContext} from "react";
import {SearchContext} from "../../context";
import {Image, Text, TextInput, TouchableOpacity} from "react-native";
import styles from "./styles";
import {useNavigation} from "@react-navigation/native";

function Task({item, searchTextState, searchState, handlecheckbox}) {

    const navigation = useNavigation();

    let disp;
    if (searchState === true) {
        if (item.task.toLowerCase().indexOf(searchTextState.toLowerCase().trim()) === -1) {
            disp = 'none';
        } else {
            disp = 'flex';
        }
    } else {
        disp = 'flex';
    }

    return (
        <TouchableOpacity onPress={() => {
            navigation.navigate('EditTask', {
                key: item.key
            });
        }} style={[{ display:disp }, styles.task]} >
            <TouchableOpacity activeOpacity={1} style={styles.checkBoxBtn} onPress={() => {
                handlecheckbox(item);
            }}>
                {item.checked ?
                    (<Image style={styles.checkedCheckboxImg} source={require('../../../assets/icons8-checked-checkbox-100.png')} />) :
                    (<Image style={styles.uncheckedCheckboxImg} source={require('../../../assets/icons8-unchecked-checkbox-100.png')} />)
                }
            </TouchableOpacity>
            <Text style={styles.taskText}>{item.task}</Text>
        </TouchableOpacity>
    );

}

export default Task;