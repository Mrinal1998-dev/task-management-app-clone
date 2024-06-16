import {StyleSheet} from "react-native";
import {horizontalScale, verticalScale} from "../../../theme/metrics";
import colors from "../../../theme/colors";

const styles = StyleSheet.create({
    itemContainer:{
        flex:1,
        flexDirection: 'row',
        marginBottom: verticalScale(10),
        marginTop: verticalScale(10),
        paddingRight: horizontalScale(14)
    },
    itemText: {
        fontSize: 16,
        color: colors.textPrimary,
        marginLeft: horizontalScale(20),
        marginRight: horizontalScale(14),
        paddingRight: horizontalScale(4)
    },
    sectionheader: {
        fontSize: 16,
        color: colors.sectionHeader,
        marginTop: verticalScale(30)
    },
    titleContainer:{
        marginLeft: horizontalScale(40),
        marginTop: verticalScale(20),
        marginBottom: verticalScale(20)
    },
    titleText:{
        fontWeight: 'bold',
        color: colors.textPrimary,
        fontSize: 24
    },
    infoIconContainer:{
        height: verticalScale(30),
        width: horizontalScale(30),
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoIcon:{
        width: horizontalScale(18),
        height: verticalScale(22),
        borderColor: colors.backgroundFour,
        borderWidth:3,
        borderRadius: 6,
        objectFit: "contain"
    }
});

export default styles;