import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../theme/metrics";
import colors from "../../theme/colors";

const styles = StyleSheet.create({
    task:{
        flex:1,
        flexDirection: 'row',
        marginBottom: verticalScale(10),
        marginTop: verticalScale(10),
        paddingRight: horizontalScale(14),
        alignItems: "center"
    },
    checkBoxBtn:{
        height: verticalScale(30),
        width: horizontalScale(30),
        justifyContent: 'center',
        alignItems: 'center'
    },
    taskText: {
        fontSize: 16,
        color: colors.textPrimary,
        marginLeft: horizontalScale(20),
        marginRight: horizontalScale(14),
        paddingRight: horizontalScale(4)
    },
    checkedCheckboxImg:{
        width: horizontalScale(22),
        height: verticalScale(25),
        tintColor: colors.backgroundFour,
        backgroundColor: colors.backgroundTertiary,
        borderColor: colors.backgroundFour,
        borderWidth: 3,
        borderRadius: 6,
        objectFit: "contain"
    },
    uncheckedCheckboxImg:{
        width: horizontalScale(24),
        height: verticalScale(27),
        tintColor: colors.backgroundFour,
        objectFit: "contain"
    }
});

export default styles;