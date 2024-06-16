import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../../theme/metrics";
import colors from "../../../theme/colors";

const styles = StyleSheet.create({
    taskInputContainer: {
        marginLeft: horizontalScale(40),
        marginTop: verticalScale(20),
        marginRight: horizontalScale(20),
        marginBottom: verticalScale(10)
    },
    taskInput:{
        textAlignVertical: 'top',
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.textPrimary
    },
    scrollViewContainer:{
        marginLeft: horizontalScale(40),
        paddingRight: horizontalScale(14),
        marginTop: verticalScale(10),
        paddingBottom: verticalScale(15)
    },
    label:{
        marginBottom: verticalScale(5),
        color: colors.textPrimary
    },
    datepickerInput:{
        height: verticalScale(50),
        paddingTop: verticalScale(12),
        paddingLeft: horizontalScale(12),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border1,
        marginBottom: verticalScale(15)
    },
    prioritySelectControl:{
        height: verticalScale(50),
        paddingVertical: verticalScale(12),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border1,
        marginBottom: verticalScale(15)
    },
    sectionHeader:{
        marginBottom: verticalScale(20),
        fontSize: 16,
        color: colors.sectionHeader,
        marginTop: verticalScale(15)
    },
    newTaskBtn:{
        width: 68,
        height: 68,
        borderRadius: 100,
        position: 'absolute',
        bottom: verticalScale(40),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: colors.backgroundTertiary,
        elevation: 10,
        shadowColor: colors.backgroundTertiary,
        shadowOpacity: 1
    },
    newTaskBtnImage:{
        width: horizontalScale(30),
        height: verticalScale(30),
        tintColor: colors.textSecondary,
        backgroundColor: 'transparent',
        objectFit: "contain",
    },

});

export default styles;