import React, {useContext} from "react";
import {SearchContext} from "../../context";
import {Text, TextInput, TouchableOpacity} from "react-native";
import styles from "./styles";
import colors from "../../theme/colors";

function PrimaryButton({name, handleSubmit, disabled}) {

    return(
        <TouchableOpacity
            style={[styles.button, {pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.5 : 1 }]}
            onPress={handleSubmit}
        >
            <Text style={{color: colors.textSecondary}}>{name}</Text>
        </TouchableOpacity>
    )

}

export default PrimaryButton;