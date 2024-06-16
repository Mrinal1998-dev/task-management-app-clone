import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    optionContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionTitle:{
        fontSize: 16,
        color: colors.textPrimary,
        textAlignVertical: 'center'
    },
    switchButton:{
        height: verticalScale(32),
        width: horizontalScale(52),
        justifyContent: 'center',
        alignItems: 'center'
    },
    switchImage:{
        width: horizontalScale(50),
        height: verticalScale(50),
        objectFit: "contain"
    }
});

export default styles;